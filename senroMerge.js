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
//if(argv.p){
//    console.log('开始合并：'+normalizePath(argv.p));
//    senroMerge(normalizePath(argv.p));
//}
function normalizePath(path){
    var realPath;
    realPath=path.replace(/\"/g,'').replace(/\\/g,'/');
    return realPath;
}
//senroMerge('E:/v3-mj-woniu-com/mj-office/js/');
function senroMerge(path,callback){
    /*
    * 1.根据传入目录，或者文件名，如果是传入目录，就寻找该目录里除了带有Senro的文件名的其他js文件，然后把他们的代码合并到一个字符串；如果是一个文件就分析该该文件就行
    * 2.收集所有方法，除去重复的，并加入依赖的方法，并将方法对象化
    * 3.根据版本号获取senro.js源文件，然后压缩合并需要的方法，并导出压缩合并后的文件Senro.version.min.js到该目录，所在文件所在目录。
    * */
    var exportLog='';
    //正则的集合
    var regs={
        method: /(s|S)enro\.(.)*?(?=\()/g
    };
    //解析html文件路径
    var htmlObj=parsePath(path);
    //console.log(htmlObj);
    //1.根据传参读取js
    if(htmlObj.fileName!=''){
        //如果是个文件，就直接读取
        fs.readFile(path,'utf8', function (err, data) {
            mergeAction(data);
        });
    }else{
        //如果是个文件夹，就读取所有文件，但除了带有Senro的文件
        var allJs='';
        fs.readdir(path, function(err,files){
            //console.log(files);
            for(var i= 0,L=files.length;i<L;i++){
                var file=files[i];
                if(isNeedMerge(file)){
                    //console.log(file);
                    allJs+=fs.readFileSync(path+'/'+file,'utf8');
                }
            }
            //console.log(allJs);
            mergeAction(allJs);
        });
    }
    function mergeAction(data){
        //2.收集所有标签，将标签对象化[{ name:'bigEye'}]
        var allMethods=collectMethods(data);
        //console.log(allMethods);
        if(allMethods!=''){
            merge(allMethods);
        }else{
            exportLog+='没有找到任何senro.js方法！\<br/\>';
            console.log('没有找到任何senro.js方法！');
            callback&&callback(exportLog);
        }
    }
    function isNeedMerge(file){
        if(file.match(/Senro/g)!=null){
            return false;
        }else{
            return true;
        }
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
    function parseMethod(str){
        if(str.match(regs.method)!=null){
            return str.match(regs.method);
        }else{
            return '';
        }
    }
    function collectMethods(data){
        var tmpLabelsArr=parseMethod(data);
        if(tmpLabelsArr!=''){
            var labels=[]
//                [{
//                    name:'bigEye',
//                },{
//                    name:'bigEye',
//                }]
                ;
            for(var i= 0,L=tmpLabelsArr.length;i<L;i++){
                labels[i]={};
                labels[i].name=tmpLabelsArr[i].split('.')[1];//carouselSlider
            }
            return labels;
        }else{
            return '';
        }
    }
    function merge(allLabels){

        //2.找到所有用到组件的结构，替换标签为组件结构
        var exportList={"methods":[],"compress":senroConfig['senroMerge']['compress'],"version":senroConfig['senroMerge']['version']},
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
                        var need=method[name]['need'];
                        exportList.methods.push(name);
                        if(typeof(need)=='object'){
                            needs=needs.concat(need);//todo
                        }else{
                            needs.push(need);
                        }
                    }else{
                        exportLog+='方法名'+name+'不存在，请重新检查！\<br/\>';
                        console.log('方法名'+name+'不存在，请重新检查！');
                    }

                }

                //获取组件的压缩代码
                realNeeds=delUseless(needs.distinct());
                exportList.methods=exportList.methods.concat(realNeeds).distinct();
                exportLog+='已找到方法：';
                for(var i= 0,L=exportList.methods.length;i<L;i++){
                    if(i==L-1){
                        exportLog+=exportList.methods[i]+'\<br/\>';
                    }else{
                        exportLog+=exportList.methods[i]+'、';
                    }
                }
                //console.log(exportList.methods);

                if(exportList.version){
                    var inputUrl='./static/js/Senro.'+exportList.version+'.js',
                        exportUrl='./static/custom/merge/Senro.'+exportList.version+'.custom.js';

                    exportCustom(exportList,inputUrl,exportUrl,function(){
                        fs.readFile(addMin(exportUrl), "utf8", function (err, file) {
                            if (err) {
                                console.log(err);
                            } else {
                                //成功获取压缩代码
                                //console.log(file);
                                var fileName='Senro.'+exportList.version+'.custom.min.js';

                                fs.writeFile(htmlObj.dir+fileName, file, function (err) {
                                    exportLog+=htmlObj.dir+fileName+'导出成功！\<br/\>';
                                    console.log(htmlObj.dir+fileName+'导出成功！');
                                    callback&&callback(exportLog);
                                });
                            }
                        });
                    });
                }else{
                    exportLog+='请输入正确的版本号!\<br/\>';
                    console.log('请输入正确的版本号!');
                    callback&&callback(exportLog);
                }
            });
        }else{
            exportLog+='请输入正确的版本号!\<br/\>';
            console.log('请输入正确的版本号!');
            callback&&callback(exportLog);
        }
        //方法区
        function addMin(str){
            str=str.replace('custom.js','custom.min.js');
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

 }
exports.senroMerge = senroMerge;
