var fs = require("fs"),
    lang=require("./docLang").lang;

function exportDoc(inputUrl,exportUrl,callback){
    fs.readFile(inputUrl,'utf8', function (err, data) {
        if (err) throw err;

        function parseData(data,str){
            var reg=new RegExp('@' + str + '[：:][^\n]*','g');
            return data.match(reg);
        }
        function parseMethodData(data,str){
            var reg=new RegExp('@' + str + '[：:][^;；]*','g');
            return data.match(reg);
        }
        function parseStrToObj(str){
            //先判断字符串中是否有“、”如果有顿号则说明该字段是多个，应该返回其有效对象{name:'',url:''}数组。否则只返回有效对象
            var isMulti=new RegExp('[、]','g'),
                objArr=[];

            if(str.match(isMulti)!=null){
                var tmpNamesArr=str.split('、'),
                    regNamesFirst=new RegExp('[：:][^(\n\r]*','g'),
                    regNamesElse=new RegExp('^[^(\n\r]*','g'),
                    regUrls=new RegExp('[(][^)]*','g');//目前是只选择英文括号

                for(var i= 0,L=tmpNamesArr.length;i<L;i++){
                    var obj={};
                    //parse names
                    if(i==0){
                        obj[lang['名字']]=trimString(tmpNamesArr[i].match(regNamesFirst)[0]);
                    }else{
                        obj[lang['名字']]=tmpNamesArr[i].match(regNamesElse)[0];
                    }
                    //parse urls
                    obj[lang['链接']]=trimString(tmpNamesArr[i].match(regUrls)[0]);
                    objArr.push(obj);
                }

                return objArr;
            }else{
                var obj={},
                    regName=new RegExp('[：:|、][^(\n\r]*','g'),
                    regUrl=new RegExp('[(][^)]*','g');//目前是只选择英文括号

                obj[lang['名字']]= trimString(str.match(regName)[0]);
                obj[lang['链接']]= trimString(str.match(regUrl)[0]);

                return obj;
            }

        }
        function parseStr(str){
            var reg=new RegExp('[：:][^(\n\r]*','g');
            return trimString(str.match(reg)[0]);
        }
        function parseMethodStr(str){
            var reg=new RegExp('[：:][^;；]*','g'),
                regStar=new RegExp('[*]','g'),
                trimedStr=trimString(str.match(reg)[0]);

            if(trimedStr.match(regStar)!=null){
                var tmpValuesArr=trimedStr.split('*'),
                    valuesArr=[];
                for(var i= 0,L=tmpValuesArr.length;i<L;i++){
                    valuesArr.push(tmpValuesArr[i]);
                }
                return valuesArr;
            }else{
                return trimedStr;
            }
        }
        function parseMethodNeedStr(str){
            var reg=new RegExp('[：:][^;；]*','g'),
                regStar=new RegExp('[、]','g'),
                trimedStr=trimString(str.match(reg)[0]);

            if(trimedStr.match(regStar)!=null){
                var tmpValuesArr=trimedStr.split('、'),
                    valuesArr=[];
                for(var i= 0,L=tmpValuesArr.length;i<L;i++){
                    valuesArr.push(tmpValuesArr[i]);
                }
                return valuesArr;
            }else{
                return trimedStr;
            }
        }
        function trimString(str){
            var subStr=str.substr(1);
            subStr=subStr.trim();
            return subStr;
        }
        var methodLoaction=parseMethodData(data,'位置'),
            methodNames=parseMethodData(data,'名字'),
            methodTranslate=parseMethodData(data,'翻译'),
            methodParameters=parseMethodData(data,'参数'),
            methodFunction=parseMethodData(data,'功能'),
            methodReturn=parseMethodData(data,'返回'),
            methodExample=parseMethodData(data,'实例'),
            methodNeed=parseMethodData(data,'需要'),
            methodDescription=parseMethodData(data,'备注'),
            version=parseData(data,'版本'),
            require=parseData(data,'依赖'),
            author=parseData(data,'作者'),
            copyRight=parseData(data,'版权'),
            thanks=parseData(data,'感谢'),
            introduction=parseMethodData(data,'简介'),
            contains=parseData(data,'包含');

        var senroDoc={};
        senroDoc[lang['版本']]={};
        senroDoc[lang['依赖']]={};
        senroDoc[lang['作者']]={};
        senroDoc[lang['版权']]={};
        senroDoc[lang['感谢']]=[];
        senroDoc[lang['简介']]='';
        senroDoc[lang['包含']]={};

        senroDoc[lang['版本']][lang['名字']]=parseStrToObj(version[0])[lang['名字']];
        senroDoc[lang['版本']][lang['链接']]=parseStrToObj(version[0])[lang['链接']];
        senroDoc[lang['依赖']][lang['名字']]=parseStrToObj(require[0])[lang['名字']];
        senroDoc[lang['依赖']][lang['链接']]=parseStrToObj(require[0])[lang['链接']];
        senroDoc[lang['作者']][lang['名字']]=parseStrToObj(author[0])[lang['名字']];
        senroDoc[lang['作者']][lang['链接']]=parseStrToObj(author[0])[lang['链接']];
        senroDoc[lang['版权']][lang['名字']]=parseStrToObj(copyRight[0])[lang['名字']];
        senroDoc[lang['版权']][lang['链接']]=parseStrToObj(copyRight[0])[lang['链接']];
        senroDoc[lang['简介']]=parseMethodStr(introduction[0]);
        senroDoc[lang['感谢']]=parseStrToObj(thanks[0]);

        var containsObjs=parseStrToObj(contains[0]);

        for(var i= 0,L=containsObjs.length;i<L;i++){
            var containesObj=containsObjs[i],
                classKey=containesObj[lang['链接']];
            senroDoc[lang['包含']][classKey]={};
            senroDoc[lang['包含']][classKey][lang['包含']]={};
            senroDoc[lang['包含']][classKey][lang['翻译']]=containesObj[lang['名字']];
        }
        //push method

        for(var i= 0,L=methodNames.length;i<L;i++){
            var classKey=lang[parseMethodStr(methodLoaction[i])],
                method=parseMethodStr(methodNames[i]);
            senroDoc[lang['包含']][classKey][lang['包含']][method]={};
            senroDoc[lang['包含']][classKey][lang['包含']][method][lang['位置']]=parseMethodStr(methodLoaction[i]);
            senroDoc[lang['包含']][classKey][lang['包含']][method][lang['翻译']]=parseMethodStr(methodTranslate[i]);
            senroDoc[lang['包含']][classKey][lang['包含']][method][lang['参数']]=parseMethodStr(methodParameters[i]);
            senroDoc[lang['包含']][classKey][lang['包含']][method][lang['功能']]=parseMethodStr(methodFunction[i]);
            senroDoc[lang['包含']][classKey][lang['包含']][method][lang['返回']]=parseMethodStr(methodReturn[i]);
            senroDoc[lang['包含']][classKey][lang['包含']][method][lang['实例']]=parseMethodStr(methodExample[i]);
            senroDoc[lang['包含']][classKey][lang['包含']][method][lang['需要']]=parseMethodNeedStr(methodNeed[i]);
            senroDoc[lang['包含']][classKey][lang['包含']][method][lang['备注']]=parseMethodStr(methodDescription[i]);
        }

        fs.writeFile(exportUrl, JSON.stringify(senroDoc), function (err) {
            callback&&callback(senroDoc,err);
        });
    });
}

exports.exportDoc = exportDoc;