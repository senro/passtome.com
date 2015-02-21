var fs = require("fs"),
    lang=require("./docLang").lang;

var UglifyJS = require("uglify-js");

function exportCustom(exportList,inputUrl,exportUrl,callback){

    fs.readFile(inputUrl,'utf8', function (err, data) {

        if (err) throw err;
        var exportLog={log:'',url:''};

        function parseMainData(data,objName){
            var reg=new RegExp('var '+objName+'=function(.|\n|\r)*constructor: '+objName+',','g');
            return data.match(reg);
        }
        function parseNoteData(data,objName){
//            var reg=new RegExp('(.|\n|\r)*(?=var '+objName+')','g');
//            return data.match(reg)[0];
            return data.split('var '+objName)[0];
        }
        function parseCatData(data,catName){
            var reg=new RegExp('//'+catName+'(.|\n|\r)*//'+catName+'结束','g');
            return data.match(reg);
        }
        function parseMethodData(data,methodName){
            var reg=new RegExp(methodName+':(\s)*function(.|\n|\r)*'+'//'+methodName+' end','g');
            return data.match(reg);
        }
        function addMin(str){
            str=str.replace('custom.js','custom.min.js');
            return str;
        }
        function normalizeExportUrl(str){
            str=str.replace('./static/','');
            return str;
        }
        function getObjKey(obj,value){
            for(var i in obj){
                if(obj[i]==value){
                    return i;
                }
            }
            return false;
        }
        var mainCode=parseMainData(data,'Senro'),
            noteCode=parseNoteData(data,'Senro'),
            //catCode=parseCatData(data,'核心公用方法'),
            endCode='};',
            finalCode=mainCode+'\r\n';
        //console.log('noteCode:'+noteCode);

        for(var j=0;j<exportList['methods'].length;j++){
            if(j==exportList['methods'].length-1){
                //最后一个方法
                finalCode+=parseMethodData(data,exportList['methods'][j])+'\r\n';
            }else{
                finalCode+=parseMethodData(data,exportList['methods'][j])+'\r\n,\r\n';
            }

        }

        finalCode+=endCode;
//        var result = UglifyJS.minify("/path/to/file.js");
//        console.log(result.code); // minified output
        if(exportList.compress){
            var compressResult = UglifyJS.minify(finalCode, {fromString: true}),
                minedExportUrl=addMin(exportUrl);

            fs.writeFile(minedExportUrl, noteCode+compressResult.code, 'utf8' ,function (err) {
                if (err) throw err;
                exportLog.url=normalizeExportUrl(minedExportUrl);
                exportLog.log+=inputUrl+'的压缩文件已成功导出到'+minedExportUrl+'!';
                console.log(inputUrl+'的压缩文件已成功导出到'+minedExportUrl+'!'); //文件被保存

                callback&&callback(exportLog);
            });
        }else{
            fs.writeFile(exportUrl, noteCode+finalCode,'utf8' ,function (err) {
                if (err) throw err;
                exportLog.url=normalizeExportUrl(exportUrl);
                exportLog.log+=inputUrl+'的文件已成功导出到'+exportUrl+'!';
                console.log(inputUrl+'的文件已成功导出到'+exportUrl+'!'); //文件被保存

                callback&&callback(exportLog);
            });
        }

    });
    return false;
}

exports.exportCustom = exportCustom;