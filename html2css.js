var fs = require("fs"),
    emmetDictionary=require("./emmetDictionary");
//var argv = require('optimist').argv;
//if(argv.p){
//    var normalizedPath=normalizePath(argv.p);
//    console.log('开始编译：'+normalizedPath);
//    var pathObj=parsePath(normalizedPath);
//
//    if(pathObj.extName=='html'){
//        html2css(normalizedPath);
//    }else{
//        console.log('请传入带有data-css属性的html文件！');
//    }
//
//}
function normalizePath(path){
    return path.replace(/\\/g,'/');
}
function parsePath(path){
    var path=normalizePath(path),
        pathArr=path.split('/'),
        pathObj={dir:'',fileName:'',extName:''};

    for(var i= 0,L=pathArr.length;i<L;i++){
        if(i<L-1){
            pathObj.dir+=pathArr[i]+'/';
        }else{
            pathObj.fileName=pathArr[i].split('.')[0];
            pathObj.extName=pathArr[i].split('.')[1];
        }
    }
    return pathObj;
}
function html2css(htmlInputUrl,cssExportUrl,callback){

    var htmlPathObj=parsePath(htmlInputUrl),
        cssExportUrl=cssExportUrl||htmlPathObj.dir+'css/html2css.css';

    fs.readFile(htmlInputUrl,'utf8', function (err, data) {
        //去掉数组中重复的元素
        Array.prototype.distinct = function(){
            var newArr=[],obj={};
            for(var i=0,len=this.length;i<len;i++){
                if(!obj[typeof(this[i]) + this[i]]){
                    newArr.push(this[i]);
                    obj[typeof(this[i])+this[i]]='new';
                }
            }
            return newArr;
        };

        var exportLog='';
        if (err){
            exportLog+='找不到'+htmlInputUrl+'! <br/>';
            callback&&callback(exportLog);
            console.log('找不到'+htmlInputUrl+'!');
        }else{

            var classWithCss=parseClassWithCssData(data),
                domWidthCss=parseNoClassWithCssData(data);
            if(classWithCss.length>0||domWidthCss.length>0){
                main();
            }else{
                exportLog+='没有可编译的data-css！<br/>';
                callback&&callback(exportLog);
                console.log('没有可编译的data-css！');
            }
        }

        function main(){
            var classArray=parseDataToArr(parseAttrData(data,'class')).distinct(),
            //idArray=parseDataToArr(parseAttrData(data,'id')).distinct(),
                htmlPathObj=parsePath(htmlInputUrl),
                htmlExportPath=htmlPathObj.dir+htmlPathObj.fileName+'-beforeHtml2css.'+htmlPathObj.extName,
                realHtml=delHtmlCssDate(data);
            var classWithCss=parseClassWithCssData(data),
                domWidthCss=parseNoClassWithCssData(data),
                notNamedDom={
//                '.mod-cont p':{ note:'',hover:'ml5',css:'mt1000' }
                },
                dom={
//                'bg':'mw984+bg',
//                'mod': { note:'section模块' ,prefix:'.section',css: 'mt25',hover:'bg:mod-hover.jpg+ol:n' }
//                'knife': { note:'knife模块' ,prefix:'',css: 'mt25' }
//                'mod-tit':{ note:'' ,prefix:'.knife',css: 'w483+h57+bg:allbgs.png' }
                };
            for(var i= 0,L=domWidthCss.length;i<L;i++){
                var notNamedDomNode=domWidthCss[i],
                    domCss=trimString(String(parseAttrData(notNamedDomNode,'data-css'))),
                    name = parsePrefixBracket(domCss);
                if(name){
                    notNamedDom[name]={};
                    notNamedDom[name].note=parseBrace(domCss);
                    notNamedDom[name].hover=parseHoverBracket(domCss);
                    notNamedDom[name].css=parseCssParentheses(domCss);
                }
            }
            //console.log(notNamedDom);
            for(var i= 0,L=classWithCss.length;i<L;i++){
                var domNode=classWithCss[i],
                    spaceReg=new RegExp(' ','g'),
                    bracketsReg=new RegExp('[\(\)]','g'),
                    tmpClassNameArr,
                    tmpClassUnitArr,

                //bracketsReg=new RegExp('(?!\()([^\(\)]*?)(?=\)),'g'),
                    className=trimString(String(parseAttrData(domNode,'class'))),
                    classCss=trimString(String(parseAttrData(domNode,'data-css')));
                //console.log('classCss:'+classCss);
                if(className.match(spaceReg)!=null && classCss.match(bracketsReg)!=null){
                    //有两个以上的class，且后面的css有多个以()为单位的css命令
                    tmpClassNameArr=className.split(' ');
                    //匹配出前面不是加号后面可以是+加任意括号的或者是字符串结尾的字符，分开多类的的css单位
                    tmpClassUnitArr=classCss.match(/[^+].*?(?=\+[([{]|$)/g);

                    for(var j= 0,L2=tmpClassNameArr.length;j<L2;j++){
                        if(dom[tmpClassNameArr[j]]==''||dom[tmpClassNameArr[j]]==undefined&&tmpClassUnitArr[j]!=undefined){
                            //防止后面没有定义css的类覆盖前面已经定义css的同名类的css
                            dom[tmpClassNameArr[j]]={};
                            dom[tmpClassNameArr[j]].note=parseBrace(tmpClassUnitArr[j]);
                            dom[tmpClassNameArr[j]].prefix=parsePrefixBracket(tmpClassUnitArr[j]);
                            dom[tmpClassNameArr[j]].hover=parseHoverBracket(tmpClassUnitArr[j]);
                            dom[tmpClassNameArr[j]].css=parseCssParentheses(tmpClassUnitArr[j]);
                        }
                    }

                }else if(className.match(spaceReg)!=null && classCss.match(bracketsReg)==null){
                    //有两个以上的class，但后面没有多个css命令组，就默认为css命令为第一个class的css
                    tmpClassNameArr=className.split(' ');
                    dom[tmpClassNameArr[0]]={};
                    dom[tmpClassNameArr[0]].note=parseBrace(classCss);
                    dom[tmpClassNameArr[0]].prefix=parsePrefixBracket(classCss);
                    dom[tmpClassNameArr[0]].hover=parseHoverBracket(classCss);
                    dom[tmpClassNameArr[0]].css=parseCssParentheses(classCss);
                    //dom[tmpClassNameArr[0]]=classCss;
                }else{
                    //单个class，单组css命令的情况
                    dom[className]={};
                    dom[className].note=parseBrace(classCss);
                    dom[className].prefix=parsePrefixBracket(classCss);
                    dom[className].hover=parseHoverBracket(classCss);
                    dom[className].css=parseCssParentheses(classCss);
                    //dom[className]=classCss;
                }

            }
            //console.log(dom);
            //console.log(idCont);
            //根据模版生成相应类的css
            var wirteStr=emmetDictionary['defaultConfig'].template;
            for(var i= 0,L=classArray.length;i<L;i++){
                if(dom[classArray[i]]){
                    if(dom[classArray[i]].note){
                        //有注释
                        wirteStr+='/*'+dom[classArray[i]].note+'*/\r'+(dom[classArray[i]].prefix!=''?dom[classArray[i]].prefix+' ':'')+'.'+classArray[i]+'{\r'+translateCss(dom[classArray[i]].css)+'\r}\r';
                        if(dom[classArray[i]].hover){
                            wirteStr+=(dom[classArray[i]].prefix!=''?dom[classArray[i]].prefix+' ':'')+'.'+classArray[i]+':hover'+'{\r'+translateCss(dom[classArray[i]].hover)+'\r}\r';
                        }
                    }else{
                        wirteStr+=(dom[classArray[i]].prefix!=''?dom[classArray[i]].prefix+' ':'')+'.'+classArray[i]+'{\r'+translateCss(dom[classArray[i]].css)+'\r}\r';
                        if(dom[classArray[i]].hover){
                            wirteStr+=(dom[classArray[i]].prefix!=''?dom[classArray[i]].prefix+' ':'')+'.'+classArray[i]+':hover'+'{\r'+translateCss(dom[classArray[i]].hover)+'\r}\r';
                        }
                    }
                }else{
                    //如果没有data-css属性的暂时不输出类名
                    //wirteStr+='.'+classArray[i]+'{\r\r}\r';
                }
            }
            //输出没有类名的css
            for (var i in notNamedDom){
                if(notNamedDom[i].note){
                    //有注释
                    wirteStr+='/*'+notNamedDom[i].note+'*/\r'+i+'{\r'+translateCss(notNamedDom[i].css)+'\r}\r';
                    if(notNamedDom[i].hover){
                        wirteStr+=i+':hover'+'{\r'+translateCss(notNamedDom[i].hover)+'\r}\r';
                    }
                }else{
                    wirteStr+=i+'{\r'+translateCss(notNamedDom[i].css)+'\r}\r';
                    if(notNamedDom[i].hover){
                        wirteStr+=i+':hover'+'{\r'+translateCss(notNamedDom[i].hover)+'\r}\r';
                    }
                }
            }
            //导出
            var cssPathObj=parsePath(cssExportUrl),
                hasAlready=fs.existsSync(cssPathObj.dir+htmlPathObj.fileName+'.'+cssPathObj.extName),
                exportCssName=hasAlready?htmlPathObj.fileName+'-'+cssPathObj.fileName+'.'+cssPathObj.extName : htmlPathObj.fileName+'.'+cssPathObj.extName;
            if (fs.existsSync(cssPathObj.dir)) {
                //如果结构根目录里有css目录，直接导出
                fs.writeFile(cssPathObj.dir+exportCssName, wirteStr, function (err) {
                    exportLog+=cssPathObj.dir+exportCssName+'导出成功！\<br/\>';
                    console.log(cssPathObj.dir+exportCssName+'导出成功！');
                });
            }else{
                //如果结构根目录里没有css目录，先创建css目录再导出
                fs.mkdirSync(cssPathObj.dir);
                fs.writeFile(cssPathObj.dir+exportCssName, wirteStr, function (err) {
                    exportLog+=cssPathObj.dir+exportCssName+'导出成功！\<br/\>';
                    console.log(cssPathObj.dir+exportCssName+'导出成功！');
                });
            }
            //备份导出前的结构
            //fs.writeFile(cssExportUrl, wirteStr, function (err) {
                fs.writeFile(htmlInputUrl, realHtml, function (err) {
                    fs.writeFile(htmlExportPath, data, function (err) {//htmlExportPath
                        exportLog+='全部文件导出成功！<br/>';
                        callback&&callback(exportLog);
                    });
                });

            //});
        }
        function parseAttrData(data,type){
            var reg=new RegExp(type+ '=[\'\"][^\'\"]*','g');
            return data.match(reg);
        }
        function parseClassWithCssData(data){
            //匹配出所有class和它对应的data-css的值
            var reg=new RegExp('<(.)*class=[\'\"](.)*[\'\"](.)*data-css=[\'\"](.)*[\'\"](.)*>','g');
            if(data.match(reg)!=null){
                return data.match(reg);
            }else{
                return [];
            }

        }
        function parseNoClassWithCssData(data){
            //匹配出所有没有class的和它对应的data-css的值
            var reg=new RegExp('<[^class]*data-css=[\'\"](.)*[\'\"](.)*>','g');
            if(data.match(reg)!=null){
                return data.match(reg);
            }else{
                return [];
            }

        }
        function parseDataToArr(data){

            var spaceReg=new RegExp(' ','g'),
                arr=[];
            for(var i= 0,L=data.length;i<L;i++){
                var tmpStr=data[i].split('"')[1];
                if(tmpStr.match(spaceReg)!=null){
                    var tmpArr=tmpStr.split(' ');
                    arr=arr.concat(tmpArr);
                }else{
                    arr.push(tmpStr);
                }

            }
            return arr;
        }
        function delHtmlCssDate(html){
            return html.replace(/ data\-css=\"[^\"]*\"/g,'');
        }

        function translateCss(str){
            //默认配置indent四个空格，和默认图片路径../images/
            var arr=str.split('+'),
                css='',
                unit=emmetDictionary['defaultConfig'].unit,
                indent=emmetDictionary['defaultConfig'].indent,
                defaultImgUrl=emmetDictionary['defaultConfig'].imgUrl;
            for(var i= 0,L=arr.length;i<L;i++){
                var commandStr=arr[i],
                    prop,
                    propValue,
                    tmpPropValueArr,
                    tmpPropValueStr='',
                    rptReg=new RegExp('rpt','g'),
                    colonReg=new RegExp(':','g');
                //首先判断有没有冒号
                if(commandStr.match(colonReg)!=null){
                    //有冒号
                    prop=commandStr.split(':')[0];
                    propValue=commandStr.split(':')[1];
                    tmpPropValueArr=propValue.split(' ');
                    if(prop=='bg'&&propValue.match(rptReg)==null){
                        //css命令里没有rpt，默认加一个no-repeat
                        tmpPropValueArr.push('norpt');
                    }
                    for(var j= 0,L2=tmpPropValueArr.length;j<L2;j++){
                        tmpPropValueStr+=typeExport(tmpPropValueArr[j]);
                    }

                    if(emmetDictionary.propKey[prop]){
                        if(i!=L-1){
                            css+=indent+emmetDictionary.propKey[prop].name+': '+tmpPropValueStr+';\r';
                        }else{
                            css+=indent+emmetDictionary.propKey[prop].name+': '+tmpPropValueStr+';';
                        }
                    }else{
                        exportLog+='emmetDictionary.propKey字典没有：<span class=\'error\'>'+prop+'</span>!<br/>';
                        console.log('emmetDictionary.propKey字典没有：'+prop);
                    }

                }else{

                    //没有冒号,先查找默认值字典，判断是不是默认值情况
                    if(emmetDictionary.defaultKey[commandStr]){
                        //是默认值情况
                        if(i!=L-1){
                            css+=indent+emmetDictionary.defaultKey[commandStr]+';\r';
                        }else{
                            css+=indent+emmetDictionary.defaultKey[commandStr]+';';
                        }
                    }else{
                        //没有默认情况,分开属性和值

                        if(commandStr.match(/^[a-z][^#(0-9)\-]*/g)!=null&&commandStr.match(/[^a-z][#(0-9)(a-z)]*/ig)!=null){
                            prop=commandStr.match(/^[a-z][^#(0-9)\-]*/g)[0];//规则是从字符串开始选出是英文，但后面不是#或者数字的字符串
                            propValue=commandStr.match(/[^a-z][#(0-9)(a-z)%]*/ig)[0];
                        }else{
                            //exportLog+=commandStr+' 不能被解析!'+'<br/>';
                            //console.log(commandStr+' 不能被解析!');
                            prop=commandStr;
                            propValue=commandStr;
                        }

                        tmpPropValueArr=propValue.split(' ');
                        for(var j= 0,L2=tmpPropValueArr.length;j<L2;j++){
                            tmpPropValueStr+=typeExport(tmpPropValueArr[j]);
                        }
                        if(emmetDictionary.propKey[prop]){
                            if(i!=L-1){
                                css+=indent+emmetDictionary.propKey[prop].name+': '+tmpPropValueStr+';\r';
                            }else{
                                css+=indent+emmetDictionary.propKey[prop].name+': '+tmpPropValueStr+';';
                            }

                        }else{
                            exportLog+='emmetDictionary.propKey字典没有：<span class=\'error\'>'+prop+'</span>!<br/>';
                            console.log('emmetDictionary.propKey字典没有：'+prop);
                        }

                    }

                }
            }
            function typeExport(str){
                var tmpStr='';

                if(str.match(/#/g)!=null){
                    //console.log('这是一个颜色!');
                    tmpStr+=str+' ';
                }else if(str.match(/\%/g)!=null){
                    // todo 正则匹配可能有问题
                    //console.log('这是一个%:'+str);
                    tmpStr+=str+' ';
                }else if(str.match(/(0-9)*\/(0-9)*/g)!=null){
                    // todo 正则匹配可能有问题
                    //console.log('这是一个字体大小和行距缩写!');
                    tmpStr+=str.split('/')[0]+unit+'/'+str.split('/')[1]+unit+' ';
                }else if(str.match(/\.(a-z)*?/gi)!=null){
                    // todo 正则匹配可能有问题
                    //console.log('这是一个图片路径!');
                    tmpStr+='url('+defaultImgUrl+str+') ';
                }else if(str.match(/^[0-9]+[a-z]+$/g)!=null){
                    //console.log('这是带单位的数字:'+str);
                    tmpStr+=str+' ';
                }else if(str.match(/[a-z]/g)!=null){
                    //console.log('这是'+prop+'关键词的:'+str);
                    if(emmetDictionary.propKey[prop]){
                        tmpStr+=emmetDictionary.propKey[prop]['keywords'][str]+' ';
                    }else{
                        tmpStr+=str+' ';
                    }

                }else{
                    //console.log('这是一个数字:'+str);
                    if(str!=0){
                        tmpStr+=str+unit+' ';
                    }else{
                        tmpStr+=str+' ';
                    }
                }
                return tmpStr;
            }
            return css;
        }

        function trimString(str){
            var subStr=str.split('"')[1];
            return subStr;
        }
        function parseBrace(str){
//            匹配大括号的内容
            var BraceReg=/[^{}]*(?=\})/g;
            if(str.match(BraceReg)!=null){
                return str.match(BraceReg)[0];
            }else{
                return '';
            }
        }
        function parsePrefixBracket(str){
//            匹配中括号但没有hover标志的内容
            var BracketReg=/[^\[\]]*(?=\])/g,
                result=str.match(BracketReg);
            if(result!=null){

                for(var i=0,L=result.length;i<L;i++){
                    if(result[i]!=''&&result[i].match(/hover\:/g)==null){
                        return result[i];
                    }else{
                        return '';
                    }
                }

            }else{
                return '';
            }
        }
        function parseHoverBracket(str){
//            匹配中括号带hover的内容
            var ParenthesesReg=/(?=\[hover\:)[^\]]*/g;
            if(str.match(ParenthesesReg)!=null){
                return str.match(ParenthesesReg)[0].split('hover:')[1];
            }else{
                return '';
            }
        }
        function parseCssParentheses(str){
//            匹配css小括号的内容
            var ParenthesesReg=/[^()\[\]\{\}]*(?=\)|$)/g;
            if(str.match(ParenthesesReg)!=null){
                return str.match(ParenthesesReg)[0];
            }else{
                return '';
            }
        }


    });
}

exports.html2css = html2css;