/**
 * Created with WebStorm.
 * User: qiuyun
 * Date: 14-2-24
 * Time: 下午3:33
 * To change this template use File | Settings | File Templates.
 */
/*根据路径类型，自动分析该用哪个导出，如果是一个文件，则读出数据，然后匹配相应的标签，来选用哪个导出，如果是目录则直接用senroMerge*/
var fs = require("fs");
var argv = require('optimist').argv;
var senroConfig = require("./senroConfig").senroConfig;
var senroMerge = require("./senroMerge").senroMerge;
var senroLabel = require("./senroLabel."+senroConfig['senroLabel']['version']).senroLabel;
var html2css = require("./html2css").html2css;
var regs={
    method: /(s|S)enro\.(.)*?(?=\()/g,
    label: /<!--senroLabel\.(.)*?(?=-->)/g
};
if(argv.p){
    var path=argv.p;
    senroExport(path);
}
function senroExport(path,callback){
    var pathObj=parsePath(path),
        exportLog='';
    if(pathObj.fileName!=''){
        //这是一个文件
        log('这是一个文件');
        fs.readFile(path,'utf8', function (err, data) {
            if(err){
                console.log(err);
            }
            if(isNeedLabel(data)){
                //这是一个带senro标签文件
                log('这是一个带senro标签文件');
                senroLabel(path,callback);
            }else if(isNeedMerge(data)){
                //这是一个需要合并方法的文件
                log('这是一个需要合并方法的文件');
                senroMerge(path,callback);
            }else{
                //这是一个需要编译data-css的文件
                log('这是一个需要编译data-css的文件');
                html2css(path,null,callback);
            }
        });
    }else{
        //这是一个文件夹,直接调用文件合并
        log('这是一个文件夹,直接调用文件合并');
        senroMerge(path,callback);
    }
    function log(str){
        exportLog+=str+'\<br/\>';
        console.log(str);
    }
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
function isNeedLabel(data){
    if(data.match(regs.label)!=null){
        return true;
    }else{
        return false;
    }
}
function isNeedMerge(data){
    if(data.match(regs.method)!=null){
        return true;
    }else{
        return false;
    }
}
function normalizePath(path){
    var realPath;
    realPath=path.replace(/\"/g,'').replace(/\\/g,'/');
    return realPath;
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
exports.senroExport = senroExport;
