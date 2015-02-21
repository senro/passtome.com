/**
 * Created with WebStorm.
 * User: qiuyun
 * Date: 14-1-3
 * Time: 下午5:08
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function () {
    var senro=new Senro(),
        $form=$('#exportForm'),
        $fileInput=$('.fileInput'),
        $write_inputUrl=$('#write_inputUrl'),
        $exportUrl=$('#exportUrl'),
        $submit=$('.submit'),
        portUrl='http://localhost:3000/senroLabel',
        defaultFileName='senroExportCss',
        $logCont=$('.logCont');

    $form[0].reset();

    $fileInput.add($write_inputUrl).change(function(){
        var $this=$(this),
            thisValue=$this.val(),
            thisId=$this.attr('id');

        //$this.val(normalizePath(thisValue));

        if(thisId=='write_inputUrl'&&thisValue!=''){
            if(ishtmlUrl(thisValue)){
                autoFillExportUrl(thisValue);
            }else{
                $this.val(thisValue+'\\index.html');
                autoFillExportUrl(thisValue);
            }

        }else if(thisId=='inputUrl'&&$write_inputUrl.val()==''){
            autoFillExportUrl(thisValue);
        }else{
            senro.console('not filled!');
        }
    });
    $submit.click(function(){
        var params=check();
        if(params){
            $.getJSON(portUrl+'?'+JSON_stringify(params),function(log){
                $logCont.html(log.msg);
            });
        }
        return false;
    });
    function check(){
        var writeInputUrl=$write_inputUrl.val(),
            params={
                htmlUrl: ''
                //exportUrl:$exportUrl.val()
            };
            //exportUrl=$exportUrl.val();
        if(ishtmlUrl(writeInputUrl)){
            if(writeInputUrl){
                //提交writeInputUrl
                params.htmlUrl=normalizePath(writeInputUrl);

                return params;
            }
        }else{
            alert('html文件路径不对，请确定路径最后文件后缀名是html/html！');
            return false;
        }

        //return false;
    }
    function ishtmlUrl(url){
        var htmlReg=/\.htm/g;
        return htmlReg.test(url);
    }
    function autoFillExportUrl(inputUrl){
        var pathObj=parsePath(normalizePath(inputUrl)),
        dir=pathObj.dir,
        fileName=pathObj.fileName;
        //自动填入默认的css路径

        if(fileName){
            $exportUrl.val(dir+'css/'+fileName+'.css');
        }else{
            $exportUrl.val(dir+'css/'+defaultFileName+'.css');
        }

    }
    function normalizePath(path){
        return path.replace(/\\/g,'/');
    }
    function JSON_stringify (obj) {
        //如果是IE8+ 浏览器(ff,chrome,safari都支持JSON对象)，使用JSON.stringify()来序列化
        if (window.JSON) {
            return JSON.stringify(obj);
        }
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        } else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);

            // fix.
            var self = arguments.callee;

            for (n in obj) {
                v = obj[n];
                t = typeof(v);
                if (obj.hasOwnProperty(n)) {
                    if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null)
                    // v = jQuery.stringify(v);
                        v = self(v);
                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    }
    function parsePath(path){
        var pathArr=path.split('/'),
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
});
