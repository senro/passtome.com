var fs = require("fs");
var http= require("http");
var url= require("url");
//var utils=require("./senroUtil");
var path= require("path");
var mime = require("./mime").types;
var senroConfig = require("./senroConfig").senroConfig;
var exportCustom= require("./exportCustom").exportCustom;
var exportDoc= require("./exportDoc").exportDoc;
var exportCss= require("./html2css").html2css;
var senroMerge = require("./senroMerge").senroMerge;
var senroLabel = require("./senroLabel."+senroConfig['senroLabel']['version']).senroLabel;
var senroBat= require("./senroBat").senroBat;
var PORT= 3306;

var server = http.createServer(function (request, response) {
    var urlObj=url.parse(request.url ),
        pathname = urlObj.pathname,
        paramsStr=request.url.split('?')[1],
        params,
        realPath,
        inputCodeUrl,
        exporJsontUrl;

    if(pathname=='/exportCustom'){

            var exportList=paramsStr?JSON.parse(decodeURIComponent(paramsStr)):{};
        //console.log(exportList);

        if(exportList.version){
            var inputUrl='./static/js/Senro.'+exportList.version+'.js',
                exportUrl='./static/custom/Senro.'+exportList.version+'.custom.js';

            exportCustom(exportList,inputUrl,exportUrl,function(log){
                var json='';

                response.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                json+='{"msgcode": 1 ,"msg":"'+log.log+'","url":"'+log.url+'"}';
                response.write(json);
                response.end();

//                fs.readFile(exportUrl, "binary", function (err, file) {
//                    var ext = path.extname(realPath);
//                    ext = ext ? ext.slice(1) : 'unknown';
//
//                    var contentType = mime[ext] || "text/plain";
//                    if (err) {
//                        response.writeHead(500, {
//                            'Content-Type': 'text/plain'
//                        });
//
//                        response.end(err);
//                    } else {
//
//                        response.writeHead(200, {
//                            'Content-Type': contentType+'; charset=utf-8'
//
//                        });
//
//                        response.write(file, "binary");
//
//                        response.end();
//                    }
//                });
            });
        }else{
            response.writeHead(200, {
                'Content-Type': "text/html"+'; charset=utf-8'
            });
            response.write('<head><meta charset="utf-8"/></head>');
            response.write('<h1>senro Export doc</h1>');
            response.write('请输入正确的版本号!', "binary");
            response.end();
        }


    }else if(pathname=='/exportDoc'){
            params=paramsStr?JSON.parse(decodeURIComponent(paramsStr)):{};

            if(params.version){
                inputCodeUrl='./static/js/Senro.'+params.version+'.js';
                exporJsontUrl='./static/doc/'+params.version+'/js/docData.json';

                exportDoc(inputCodeUrl,exporJsontUrl,function(senroDoc,err){
                    if (err) throw err;
                    response.writeHead(200, {
                        'Content-Type': "text/html"+'; charset=utf-8'
                    });
                    response.write('<head><meta charset="utf-8"/></head>');
                    response.write('<h1>senro Export doc</h1>');
                    response.write(inputCodeUrl, "binary");
                    response.write('\'s docData.json have already export to', "binary");
                    response.write(exporJsontUrl, "binary");
                    response.end();
                });
            }else{
                response.writeHead(200, {
                    'Content-Type': "text/html"+'; charset=utf-8'
                });
                response.write('<head><meta charset="utf-8"/></head>');
                response.write('<h1>senro Export doc</h1>');
                response.write('请输入正确的版本号!', "binary");
                response.end();
            }

    }else if(pathname=='/exportCss'){

            params=paramsStr?JSON.parse(decodeURIComponent(paramsStr)):{};

            inputCodeUrl=params.htmlUrl;
            exporJsontUrl=params.exportUrl;

        exportCss(inputCodeUrl,exporJsontUrl,function(log){
            //if (err) throw err;
            var json='';
            response.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            //response.write('<head><meta charset="utf-8"/></head>');
            //response.write('<h1>senro Export css</h1>');
            json+='{"msgcode": 1 ,"msg":"'+log+'"}';
            response.write(json);
            response.end();
        });

    }else if(pathname=='/senroLabel'){

        params=paramsStr?JSON.parse(decodeURIComponent(paramsStr)):{};

        inputCodeUrl=params.htmlUrl;
        //exporJsontUrl=params.exportUrl;

        senroLabel(inputCodeUrl,function(log){
            //if (err) throw err;
            var json='';
            response.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            json+='{"msgcode": 1 ,"msg":"'+log+'"}';
            response.write(json);
            response.end();
        });

    }else if(pathname=='/senroMerge'){

        params=paramsStr?JSON.parse(decodeURIComponent(paramsStr)):{};

        inputCodeUrl=params.htmlUrl;
        //exporJsontUrl=params.exportUrl;

        senroMerge(inputCodeUrl,function(log){
            //if (err) throw err;
            var json='';
            response.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            json+='{"msgcode": 1 ,"msg":"'+log+'"}';
            response.write(json);
            response.end();
        });

    }else if(pathname=='/senroBat'){

        params=paramsStr?JSON.parse(decodeURIComponent(paramsStr)):{};

        var dir=params.dir,
            dirName=params.dirName;
        senroBat(dir,dirName,function(log){
            //if (err) throw err;
            var json;
            response.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            json='{"msgcode": "1" ,"msg":"'+log+'"}';
            response.write(log);
            response.end();
        });

    }else if(pathname=='/'){

        realPath = "static/index.html";

        fs.readFile(realPath, "binary", function (err, file) {

            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.write('未找到该路径！', "binary");

                response.end();
            } else {
                var ext = path.extname(realPath);
                ext = ext ? ext.slice(1) : 'unknown';
                var contentType = mime[ext] || "text/plain";
                response.writeHead(200, {
                    'Content-Type': contentType +'; charset=utf-8'
                });

                response.write(file, "binary");

                response.end();
            }
        });

    }else{
        realPath = "static" + pathname;

        fs.readFile(realPath, "binary", function (err, file) {

            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.write('未找到该路径！', "binary");

                response.end();
            } else {
                var ext = path.extname(realPath);
                ext = ext ? ext.slice(1) : 'unknown';
                var contentType = mime[ext] || "text/plain";
                response.writeHead(200, {
                    'Content-Type': contentType +'; charset=utf-8'
                });

                response.write(file, "binary");

                response.end();
            }
        });
    }

});
server.listen(PORT);
