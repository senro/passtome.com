/**
 * Created with WebStorm.
 * User: qiuyun
 * Date: 14-2-24
 * Time: 下午3:33
 * To change this template use File | Settings | File Templates.
 */
var fs = require("fs");
var exportCustom= require("./exportCustom").exportCustom;
var exportDoc= require("./exportDoc").exportDoc;
var senroConfig= require("./senroConfig").senroConfig;
//var argv = require('optimist').argv;
var CleanCSS = require('clean-css');

//if(argv.p){
//    var normalizedPath=normalizePath(argv.p);
//    console.log('开始编译：'+normalizedPath);
//    var pathObj=parsePath(normalizedPath);
//
//    if(pathObj.fileName){
//        senroLabel(normalizedPath);
//    }else{
//        console.log('请传入带有senroLabel标签的html文件，而不是目录！');
//    }
//
//}
function normalizePath(path){
    return path.replace(/\\/g,'/');
}
//解析文件路径

function parsePath(path){
    var path=normalizePath(path),
        pathArr=path.split('/'),
        pathObj={dir:'',fileName:'',extName:''};

    for(var i= 0,L=pathArr.length;i<L;i++){
        if(i<L-1){
            pathObj.dir+=pathArr[i]+'/';
        }else{
            if(pathArr[i].match(/\./g)!=null){
                pathObj.fileName=pathArr[i].split('.')[0];
                pathObj.extName=pathArr[i].split('.')[1];
            }else{
                pathObj.dir+=pathArr[i]+'/';
            }
        }
    }
    return pathObj;
}

function senroLabel(html,callback){
    /*
    * 1.收集所有标签，将标签对象化
    * 2.找到所有用到组件的结构，替换标签为组件结构
    * 3.读取所有组件的css，合并到一个css文件，并按组件的名字写好注释，命名为senro.css,
    *   调入标签加入到该结构的</head>前
    * 4.读取最新版本的senro.js，保存Senro.version.js在该html的目录的js文件夹下，
    *   如果没有就创建一个js目录，把调用标签和初始化组件的index.js标签加入到</body>前
    * 5.读取所有的组件图片到images/
    * */
    var exportLog='';
    function log(str){
        exportLog+=str+'\<br/\>';
        console.log(str);
    }
    fs.readFile(html,'utf8', function (err, data) {
        if (err) throw err;
        //正则的集合
        var regs={
            label: /<!--senroLabel\.(.)*?(?=-->)/g,
            labelAttr: /[\[][^\]]*/g,
            labelName: /[^\[\]]*(?=\[)/g,
            css:/\/\*(.|\n)*方法样式开始\*\/(.|\n|\r)*\/\*(.|\n)*方法样式结束\*\//g,
            html:/<!--(.|\n)*方法结构开始(.|\n|\r)*(.|\n)*方法结构结束-->/g,
            js:/\/\/(.|\n)*方法js开始(.|\n|\r)*\/\/( )*(.|\n)*方法js结束/g,
            cssUrl:/url\((.|\n)*(?=\))/g,
            imgSrc:/\<img(.)*src=\"[^\"]*/g,
            quotation:/\"/g
            //labelAttrName: / /g,
            //labelAttrValue: / /g
        };
        //1.收集所有标签，将标签对象化{ name:'bigEye',attr:{width:900,height:500},example:'',html:'',css:'',js:'',images:['1.jpg','2.jpg'] }
        var allLabels=collectLabel(data);

        if(allLabels!=''){
            main();
        }else{
            log('没有可编译的senro标签！');
            callback&&callback(exportLog);
        }
        function main(){
            //解析html文件路径
            var htmlObj=parsePath(html);
            //console.log(htmlObj);

            //2.找到所有用到组件的结构，替换标签为组件结构
            var exportList={"methods":[],"compress":senroConfig['senroLabel']['compress'],"version":senroConfig['senroLabel']['version']},
                inputCodeUrl,exporJsontUrl;
            //先找到组件的依赖方法
            if(exportList.version){

                inputCodeUrl='./static/js/Senro.'+exportList.version+'.js';
                exporJsontUrl='./static/doc/'+exportList.version+'/js/docData.json';

                //获取senro.js文档结构对象
                exportDoc(inputCodeUrl,exporJsontUrl,function(senroDoc,err){
                    if (err) throw err;
                    //console.log(senroDoc);
                    var needs=[],
                        realNeeds,
                        method=parseMethods(senroDoc);
                    //console.log(method);
                    for(var i= 0,L=allLabels.length;i<L;i++){
                        var name=allLabels[i].name;
                        if(method[name]){
                            var need=method[name]['need'],
                                example=method[name]['example'];
                            exportList.methods.push(name);
                            allLabels[i].example=example;
                            if(typeof(need)=='object'){
                                needs=needs.concat(need);//todo
                            }else{
                                needs.push(need);
                            }
                        }else{
                            log('方法名'+name+'不存在，请重新检查！');
                        }

                    }
                    //通过example找到示例文件，然后根据里面标签获取其结构、样式、行为
                    var allJsRequire=[],allJsRequireStr;

                    for(var i= 0,L=allLabels.length;i<L;i++){
                        if(allLabels[i].example){
                            var exampleData=fs.readFileSync('./static/'+allLabels[i].example,'utf8');
                            if(allLabels[i].attr){
                                //如果有属性，通过css的注释去正则替换相应的属性
                                allLabels[i].css=parseCss(exampleData);
                                for(var j in allLabels[i].attr){
                                    allLabels[i].css=setCssAttr(j,allLabels[i].attr[j],allLabels[i].css);
                                }
                            }else{
                                //没有设置属性的情况
                                allLabels[i].css=parseCss(exampleData);
                            }
                            allLabels[i].html=parseHtml(exampleData);
                            allLabels[i].js=parseJs(exampleData);
                            allLabels[i].jsRequire=parseJsRequire(exampleData);
                            allLabels[i].images=parseImages(exampleData);

                            allJsRequire=allJsRequire.concat(allLabels[i].jsRequire.split(','));
                        }
                    }
                    allJsRequireStr=arrayToStr(delUseless(allJsRequire.distinct()));
                    //console.log();
                    //标签所需信息获取完毕，开始写进结构里，其中把样式放到senro.css，结构直接替换标签所在位置，js放在index.js，
                    // 并且在文档的结构相应位置引入senro.css和index.js
                    var allCss=senroConfig['senroLabel']['cssNote']+'\n\r',
                        allHtml='',
                        allJs=senroConfig['senroLabel']['jsNote']+'\n\rvar senro=new Senro(['+allJsRequireStr+']);\n\r',
                        allImages=[];

                    for(var i= 0,L=allLabels.length;i<L;i++){
                        var name=allLabels[i].name;

                        if( allLabels[i].example&&allLabels[i]['attr'] ){
                            var attrClass=allLabels[i]['attr'].class,
                                attrId=allLabels[i]['attr'].id;

                            if( attrClass&&attrId ){
                                //class属性和id属性都有的情况，改变css为新class，改变html的id和js的选择符
                                allCss+=changeCssClass(allLabels[i].css,name,attrClass)+'\n\r';
                                allJs+=changeJsId(allLabels[i].js,name,attrId)+'\n\r';
                                var classChangedHtml=changeHtmlId(allLabels[i].html,name,attrId),
                                    idChangedHtml=changeHtmlClass(classChangedHtml,name,attrClass);
                                if(allHtml==''){
                                    allHtml=replaceIdLabelHtml(name,attrId,idChangedHtml,data);
                                }else{
                                    allHtml=replaceIdLabelHtml(name,attrId,idChangedHtml,allHtml);
                                }
                            }else if( attrClass ){
                                //只有class属性，改变css、js、html的方法名
                                allCss+=changeCssClass(allLabels[i].css,name,attrClass)+'\n\r';
                                allJs+=changeJsClass(allLabels[i].js,name,attrClass)+'\n\r';
                                var classChangedHtml=changeHtmlClass(allLabels[i].html,name,attrClass);
                                if(allHtml==''){
                                    allHtml=replaceClassLabelHtml(name,attrClass,classChangedHtml,data);
                                }else{
                                    allHtml=replaceClassLabelHtml(name,attrClass,classChangedHtml,allHtml);
                                }
                            }else if( attrId ){
                                //只有id属性，不改变css，改变html和js
                                var haveBefore=false;
                                for( var j=i;j>0;j--){
                                    if(name==allLabels[j-1].name){
                                        //检测没有id的标签有没有重复
                                        haveBefore=true;
                                    }
                                }
                                if(!haveBefore){
                                    //如果没有重复，才加入其css
                                    allCss+=allLabels[i].css+'\n\r';
                                }

                                allJs+=changeJsId(allLabels[i].js,name,attrId)+'\n\r';
                                var idChangedHtml=changeHtmlId(allLabels[i].html,name,attrId);
                                if(allHtml==''){
                                    allHtml=replaceIdLabelHtml(name,attrId,idChangedHtml,data);
                                }else{
                                    allHtml=replaceIdLabelHtml(name,attrId,idChangedHtml,allHtml);
                                }
                            }else{
                                //没有id,class属性,要去掉重复
                                var haveBefore=false;
                                for( var j=i;j>0;j--){
                                    if(name==allLabels[j-1].name&&!allLabels[j-1]['attr'].class&&!allLabels[j-1]['attr'].id){
                                        //检测没有class的标签有没有重复
                                        haveBefore=true;
                                    }
                                }
                                if(!haveBefore){
                                    allCss+=allLabels[i].css+'\n\r';
                                    allJs+=allLabels[i].js+'\n\r';
                                    if(allHtml==''){
                                        allHtml=replaceNoClassLabelHtml(name,allLabels[i].html,data);
                                    }else{
                                        allHtml=replaceNoClassLabelHtml(name,allLabels[i].html,allHtml);
                                    }
                                }
                            }

                        }else if(allLabels[i].example&&!allLabels[i]['attr']){
                            allCss+=allLabels[i].css+'\n\r';
                            allJs+=allLabels[i].js+'\n\r';
                            if(allHtml==''){
                                allHtml=replaceNoAttrLabelHtml(name,allLabels[i].html,data);
                            }else{
                                allHtml=replaceNoAttrLabelHtml(name,allLabels[i].html,allHtml);
                            }
                        }
                        allImages=allImages.concat(allLabels[i].images);
                    }
                    //给allHtml引入senro.css和index.js
                    allHtml=addAllHtmlInclude(allHtml);
                    allHtml=changeImgsUrl(allHtml);
//                    allCss=new CleanCSS({
//                        keepSpecialComments: 1,
//                        keepBreaks:true,
//                        noAdvanced:true
//                    }).minify(changeImgsUrl(allCss));
                    allCss=changeImgsUrl(allCss);
                    //console.log(allImages);
                    //根据版本号读取完整的senro.js,然后输出senro.css、index.js还有最终的html，并把源文件备份为“文件名”+“-beforesenroLabel”后缀的文件
                    fs.readFile(inputCodeUrl,'utf8',function(err,senroJs){
                        if(err){
                            console.log(err);
                        }else{

                            if (fs.existsSync(htmlObj.dir+'css/')) {
                                fs.writeFile(htmlObj.dir+'css/senro.css', allCss, function (err) {
                                    log(htmlObj.dir+'css/senro.css'+'创建成功！');
                                });
                            }else{
                                fs.mkdirSync(htmlObj.dir+'css/');
                                fs.writeFile(htmlObj.dir+'css/senro.css', allCss, function (err) {
                                    log(htmlObj.dir+'css/senro.css'+'创建成功！');
                                });
                            }
                            if (fs.existsSync(htmlObj.dir+'js/')) {
                                fs.writeFile(htmlObj.dir+'js/senroInit.js', allJs, function (err) {
                                    log(htmlObj.dir+'js/senroInit.js'+'创建成功！');
                                });
                            }else{
                                fs.mkdirSync(htmlObj.dir+'js/');
                                fs.writeFile(htmlObj.dir+'js/senroInit.js', allJs, function (err) {
                                    log(htmlObj.dir+'js/senroInit.js'+'创建成功！');
                                });
                            }

                            fs.writeFile(htmlObj.dir+htmlObj.fileName+'-beforeSenroLabel.html', data, function (err) {
                                log(htmlObj.dir+htmlObj.fileName+'-beforeSenroLabel.html'+'创建成功！');
                                fs.writeFile(htmlObj.dir+htmlObj.fileName+'.html', allHtml, function (err) {
                                    log(htmlObj.dir+htmlObj.fileName+'.html'+'创建成功！');
                                    fs.writeFile(htmlObj.dir+'js/Senro.'+exportList.version+'.js', senroJs, function (err) {
                                        log(htmlObj.dir+'js/Senro.'+exportList.version+'.js'+'创建成功！');
                                        if(allImages.length>0){
                                            for(var i= 0,L=allImages.length; i<L; i++){

                                                if (fs.existsSync('./static/'+allImages[i])) {
                                                    var pathObj=parsePath('./static/'+allImages[i]),
                                                        file=fs.readFileSync('./static/'+allImages[i]);
                                                    if (fs.existsSync(htmlObj.dir+'images/')) {
                                                        fs.writeFileSync(htmlObj.dir+'images/'+pathObj.fileName+'.'+pathObj.extName, file);
                                                        log(htmlObj.dir+'images/'+pathObj.fileName+'.'+pathObj.extName+'创建成功！');
                                                    }else{
                                                        fs.mkdirSync(htmlObj.dir+'images/');
                                                        fs.writeFileSync(htmlObj.dir+'images/'+pathObj.fileName+'.'+pathObj.extName, file);
                                                        log(htmlObj.dir+'images/'+pathObj.fileName+'.'+pathObj.extName+'创建成功!');
                                                    }
                                                }
                                            }
                                            log('senro编译完成');
                                            callback&&callback(exportLog);
                                        }else{
                                            log('senro编译完成');
                                            callback&&callback(exportLog);
                                        }

                                    });
                                });
                            });

                        }
                    });

                    //获取组件的压缩代码
                    realNeeds=delUseless(needs.distinct());
                    exportList.methods=exportList.methods.concat(realNeeds);
                    //console.log(exportList.methods);

                    if(exportList.version){
                        var inputUrl='./static/js/Senro.'+exportList.version+'.js',
                            exportUrl='./static/custom/Senro.'+exportList.version+'.custom.js';

                        exportCustom(exportList,inputUrl,exportUrl,function(){
                            fs.readFile(exportUrl, "binary", function (err, file) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //成功获取压缩代码
                                    //console.log(file);

                                }
                            });
                        });
                    }else{
                        log('请输入正确的版本号!');
                    }
                });
            }else{
                log('请输入正确的版本号!');
            }
            //方法区

            function parseHtml(str){
                if(str.match(regs.html)!=null){
                    return str.match(regs.html)[0];
                }else{
                    return '';
                }
            }
            function parseCss(str){
                if(str.match(regs.css)!=null){
                    return str.match(regs.css)[0];
                }else{
                    return '';
                }
            }
            function setCssAttr(attr,attrValue,str){
                var attrReg=new RegExp('/\\*'+attr+'\\*/(.)*/\\*'+attr+'\\*/','g');
                if(/[a-z]/g.test(attrValue)){
                    return str.replace(attrReg,attrValue);
                }else{
                    return str.replace(attrReg,attrValue+'px');
                }

            }
            function parseJs(str){
                if(str.match(regs.js)!=null){
                    return str.match(regs.js)[0];
                }else{
                    return '';
                }
            }
            function parseJsRequire(str){
                var senroReg=/Senro\((.)*(?=\))/g;
                var require=str.match(senroReg)[0].split('(')[1].replace(/[\[\]]/g,'');
                return require;
            }
            function parseImages(str){
                var arr=[],
                    cssUrl=str.match(regs.cssUrl),
                    imgSrc=str.match(regs.imgSrc);
                if(cssUrl!=null){
                    for(var i= 0,L=cssUrl.length;i<L;i++){
                        var tmpCssUrl=cssUrl[i].split('(')[1].replace(regs.quotation,'');
                        arr.push(tmpCssUrl);
                    }
                }
                if(imgSrc!=null){
                    for(var i= 0,L=imgSrc.length;i<L;i++){
                        var tmpImgSrc=imgSrc[i].split('src=')[1].replace(regs.quotation,'');
                        arr.push(tmpImgSrc);
                    }
                }
                return arr.distinct();
            }
            //替换标签结构
            function replaceNoAttrLabelHtml(name,html,data){
                var reg=new RegExp('\<\!\-\-senroLabel\.'+name+'(.)*-->','g');
                return data.replace(reg,html);
            }
            function replaceNoClassLabelHtml(name,html,data){
                var reg=new RegExp('\<\!\-\-senroLabel\.'+name+'([^class])*-->','g');
                return data.replace(reg,html);
            }
            function replaceClassLabelHtml(name,newName,html,data){
                var reg=new RegExp('\<\!\-\-senroLabel\.'+name+'(.)*class:'+newName+'(.)*-->','g');
                return data.replace(reg,html);
            }
            function replaceIdLabelHtml(name,id,html,data){
                var reg=new RegExp('\<\!\-\-senroLabel\.'+name+'(.)*id:'+id+'(.)*-->','g');
                return data.replace(reg,html);
            }
            function addAllHtmlInclude(html){
                html=html.replace(/\<\/head\>/g,'    \<link rel=\"stylesheet\" type=\"text/css\" href=\"css/senro.css\"\>\n\r\<\/head\>');
                html=html.replace(/\<\/body\>/g,'\<script type=\"text/javascript\" src=\"js/Senro.'+exportList.version+'.js\"\>\</script\>\n\r\<script type=\"text/javascript\" src=\"js/senroInit.js\"\>\</script\>\n\r\<\/body\>');
                return html;
            }
            function changeImgsUrl(str){
                str=str.replace(/src=\"\//g,'src=\"');
                str=str.replace(/images\/(.)*\/(?!\>|\n|\r)/g,'images/');
                str=str.replace(/url\(\//g,'url\(\.\.\/');
                str=str.replace(/url\(\"\//g,'url\(\"\.\.\/');
                return str;
            }
            function changeCssClass(str,name,newName){
                var regCss=new RegExp('\\.'+name,'g');
                str=str.replace(regCss,'.'+newName);
                return str;
            }
            function changeHtmlClass(str,name,newName){
                var regHtml=new RegExp('class=\"'+name+"\"",'g');
                str=str.replace(regHtml, 'class=\"'+newName+'\"');
                return str;
            }
            function changeJsClass(str,name,newName){
                var regJs=new RegExp('\\.'+name,'g'),
                    regSenroJs=new RegExp('senro\.'+newName,'g');
                str=str.replace(regJs, '.'+newName);
                str=str.replace(regSenroJs, 'senro.'+name);
                return str;
            }

            function changeHtmlId(str,name,id){
                var regHtml=new RegExp('class=\"'+name+"\"",'g'),
                    regHtmlId=new RegExp('id=\"'+name+"\"",'g');
                if(regHtmlId.test(str)){
                    str=str.replace(regHtmlId, 'id=\"'+id+'\"');
                }else{
                    str=str.replace(regHtml, 'id=\"'+id+'\"'+' class=\"'+name+'\"');
                }

                return str;
            }
            function changeJsId(str,name,id){
                var regClassJs=new RegExp('\\.'+name,'g'),
                    regIdJs=new RegExp('[^\\.]'+name+'(\'|\")','g'),//todo
                    regSenroJs=new RegExp('senro#'+id,'g');
                str=str.replace(regClassJs, '#'+id);
                str=str.replace(regIdJs, '\''+id+'\'' );
                str=str.replace(regSenroJs, 'senro.'+name);
                return str;
            }
            //保留数组中有效的方法名
            function delUseless(arr){
                var newArr=[];
                for(var i= 0,L=arr.length;i<L;i++){
                    if(arr[i]!='无'&&arr[i]!=''&&arr[i]!=null){//判断可能有缺陷
                        newArr.push(arr[i]);
                    }
                }
                return newArr;
            }//去掉数组中重复的元素
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
            function arrayToStr(array){
                var str='';
                for(var i= 0,L=array.length;i<L;i++){
                    if(i==L-1){
                        str+=array[i];
                    }else{
                        str+=array[i]+',';
                    }
                }
                return str;
            }
            function parseMethods(doc){
                var method={};
                for(var i in doc['contains']){
                    for(var j in doc['contains'][i]['contains']){
                        method[j]=doc['contains'][i]['contains'][j];

                    }
                }
                return method;
            }
        }

        function parseLabelName(str){
            if(str.match(regs.labelName)!=null){
                return str.match(regs.labelName)[0];
            }else{
                return str;
            }
        }
        function parseLabelAttr(str){
            if(str.match(regs.labelAttr)!=null){
                return str.match(regs.labelAttr);
            }else{
                return '';
            }
        }
        function parseLabel(str){
            if(str.match(regs.label)!=null){
                return str.match(regs.label);
            }else{
                return '';
            }
        }
        function collectLabel(data){
            var tmpLabelsArr=parseLabel(data);
            if(tmpLabelsArr!=''){
                var labelStrArr=[],
                    labelAttrArr=[],
                    labels=[]
//                [{
//                    name:'bigEye',
//                    attr:{
//                        width:900,
//                        height:200
//                    }
//                },{
//                    name:'bigEye',
//                    attr:{
//                        width:900,
//                        height:200
//                    }
//                }]
                    ;
                for(var i= 0,L=tmpLabelsArr.length;i<L;i++){
                    labels[i]={};
                    labelStrArr[i]=tmpLabelsArr[i].split('.')[1];//carouselSlider[width:960][height:200]
                    labels[i].name=parseLabelName(labelStrArr[i]);//carouselSlider
                    labelAttrArr[i]=parseLabelAttr(labelStrArr[i]);//["[width:960", "[height:200"]

                    if(labelAttrArr[i]!=''){
                        labels[i].attr={};
                        for(var j= 0,L2=labelAttrArr[i].length;j<L2;j++){

                            var tmpAttr=labelAttrArr[i][j].substring(1),//width:960
                                tmpAttrName=tmpAttr.split(':')[0],//width
                                tmpAttrValue=tmpAttr.split(':')[1];//960
                            labels[i].attr[tmpAttrName]=tmpAttrValue;
                        }
                    }

                }
                return labels;
            }else{
                return '';
            }
        }
    });
 }
exports.senroLabel = senroLabel;
