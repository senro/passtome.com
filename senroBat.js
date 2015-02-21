var fs = require("fs"),
    emmetDictionary=require("./emmetDictionary");
var argv = require('optimist').argv;
var child_process = require('child_process');

if(argv.p){
    var normalizedPath=normalizePath(argv.p);
    console.log('开始编译：'+normalizedPath);
    var pathObj=parsePath(normalizedPath);

    if(pathObj.extName=='html'){
        html2css(normalizedPath);
    }else{
        console.log('请传入带有data-css属性的html文件！');
    }

}
function normalizePath(path){
    return path.replace(/\\/g,'/');
}
function parsePath(path){
    var pathArr=path.split('/'),
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
function senroBat(dir,dirName,callback){

    var exportLog='';
    function log(str){
        exportLog+=str;
        console.log(str);
    }
    //console.log('获取参数：dir'+dir+',dirName:'+dirName);
    child_process.execFile('senroBat.bat', [dir, dirName], {cwd:'bat/'}, function(error, stdout, stderr) {

        console.log(stdout);
        if(error==null){
            log('从：'+dir+'，拷贝文件到'+dirName+'成功！');
        }else{
            console.log(error);
            switch(error.code){
                case 'ENOENT':
                    log('找不到bat文件！');
                    break;
            }

        }
        callback&&callback(exportLog);
    });
}

exports.senroBat = senroBat;