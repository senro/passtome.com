var fs = require("fs"),
    dictionary=require("./dictionary/nosec").dictionary,
    config={
        from:'CH',
        to:'RU'
    };
var argv = require('optimist').argv;
if(argv.p){
    var normalizedPath=normalizePath(argv.p);
    console.log('开始编译：'+normalizedPath);
    var pathObj=parsePath(normalizedPath);

    if(pathObj.extName=='html'){
        senroTranlate(normalizedPath);
    }else{
        console.log('请传入带有data-css属性的html文件！');
    }

}
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
function senroTranlate(htmlInputUrl,htmlExportUrl,callback){

    var htmlPathObj=parsePath(htmlInputUrl),
        htmlExportUrl=htmlExportUrl||htmlPathObj.dir+htmlPathObj.fileName+'-tranlated.html';

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

//            var classWithCss=parseClassWithCssData(data),
//                domWidthCss=parseNoClassWithCssData(data);
//            if(classWithCss.length>0||domWidthCss.length>0){
//
//            }else{
//                exportLog+='没有可编译的data-css！<br/>';
//                callback&&callback(exportLog);
//                console.log('没有可编译的data-css！');
//            }
            main();
        }

        function main(){
            var translateHtml=data;

            for(var i in dictionary){
                var oringeText=normalizeOringeText(dictionary[i][config['from']]);
                var replaceText=normalizeReplaceText(dictionary[i][config['to']]);
                var reg=new RegExp('[^\u4e00-\u9fa5|,|、]'+oringeText+'[^\u4e00-\u9fa5|,|、]','g');
                var reg2=new RegExp(oringeText,'g');
                if(reg.test(translateHtml)){
                    console.log('准备替换：'+oringeText+'为：'+replaceText+'\n');
                    translateHtml=translateHtml.replace(reg2,replaceText);
                }

            }
            //导出
            function normalizeOringeText(str){
                if(str){
                    var str=str.replace(/ /g,'');
                    if(/[0-9]\./g.test(str)){
                        var splitTemp=str.match(/[0-9]\./g)[0];
                        str=str.split(splitTemp)[1].replace(/\./g,'');
                        return str;
                    }else{
                        return str;
                    }
                }else{
                    return 'null';
                }

            }
            function normalizeReplaceText(str){
                if(str){

//                    if(/\./g.test(str)){
//                        var str=str.split('.')[1];
//                        return str;
//                    }else{
//                        return str;
//                    }
                    if(str=='删除'){
                        return '';
                    }else{
                        return str;
                    }

                }else{
                    return str;
                }
            }
            fs.writeFile(htmlExportUrl, translateHtml, function (err) {//htmlExportPath
                exportLog+='全部文件导出成功！<br/>';
                callback&&callback(exportLog);
            });

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

    });
}

exports.senroTranlate = senroTranlate;