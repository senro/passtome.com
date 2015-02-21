/**
 * @版本: Senro.3.2.js(http://www.passtome.com/js/Senro.3.2.js)
 * @依赖: jquery 1.9.1(http://static.woniu.com/script/jquery/jquery-1.9.1.min.js)
 * @作者: senro(http://senro.cn)
 * @版权: senro.cn(http://www.passtome.com/)
 * @感谢: NightKnight(#)、蒹葭从风(#)、woniu.com(http://www.woniu.com)
 * @简介: Senro.js 是senro根据日常工作的需求开发的经验总结，目的是快速应对各种蜗牛前端开发中需要用到的常用js方法和组件，
 *       可以把这个对象想象成senro本人，它有自己的属性、方法。开发原则是尽量用一句话解决一个问题当然，尽量减少传参，参数按重要
 *       级别从左往右。由于水平有限，难免会有bug，和不完善，还请需要使用的各位，多多包涵，并指出不足，以便完善；
 * @包含: 核心公用方法(core)、常用组件(widget)、常用界面交互方法(UIInteractive)、常用后端交互方法(dataInteractive)、常用检测方法(check)、常用修复方法(fix)、资源加载(load)、常用js模拟html5效果方法(html5)、常用动画方法(animate)
 */
var Senro=function(requireJs){

    arr_requireJs=requireJs||[];
    senro=this;
    senro.version=3.2;
    senro.video=     { url:'http://static.woniu.com/script/jwplayer/jwplayer.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.swf=       { url:'http://static.woniu.com/js/swfobject.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.login=     { url:'http://static.woniu.com/script/widget/passport/login.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.register=  { url:'http://static.woniu.com/script/widget/passport/passport.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.iePng=     { url:'http://static.woniu.com/script/iepng/iepng.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.drag=      { url:'http://static.woniu.com/script/plugin/jquery-ui-drag.min.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.mouseWheel={ url:'http://static.woniu.com/script/plugin/jquery.mousewheel.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.MSClass=   { url:'http://static.woniu.com/script/plugin/MSClass.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.animateColors={ url:'http://static.woniu.com/script/plugin/jquery.animate-colors-min.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.cssSandpaper={ url:'http://static.woniu.com/script/plugin/cssSandpaper.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.tweenLite= { url:'http://static.woniu.com/script/plugin/greensock-v12-js/TweenLite.min.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.tweenMax= { url:'http://static.woniu.com/script/plugin/greensock-v12-js/TweenMax.min.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.testHtml5={ url:'http://static.woniu.com/script/plugin/modernizr.custom.testHtml5.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.preload={ url:'http://static.woniu.com/script/plugin/preloadjs-0.3.1.min.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.mobile={ url:'http://static.woniu.com/script/jquery/jquery.event.touch.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    if(typeof arr_requireJs==='string'){
        arr_requireJs=[arr_requireJs];
    }
    //防止请求脚本后面链接有随机数
    $.ajaxSetup({
        cache: true
    });
    if(arr_requireJs.length>0){
        for(var i=0;i<arr_requireJs.length;i++){
            switch (arr_requireJs[i]){
                case 'video':
                    $.getScript( senro.video.url,function(){
                        typeAction('video');
                    });
                    break;
                case 'swf':
                    $.getScript(senro.swf.url,function(){
                        typeAction('swf');
                    });
                    break;
                case 'login':
                    $.getScript(senro.login.url,function(){
                        typeAction('login');
                    });
                    break;
                case 'register':
                    $.getScript(senro.register.url,function(){
                        typeAction('register');
                    });
                    break;
                case 'iePng':
                    if(senro.isIE6()){
                        $.getScript(senro.iePng.url,function(){
                            typeAction('iePng');
                        });
                    }
                    break;
                case 'drag':
                    $.getScript(senro.drag.url,function(){
                        typeAction('drag');
                    });
                    break;
                case 'mouseWheel':
                    $.getScript(senro.mouseWheel.url,function(){
                        typeAction('mouseWheel');
                    });
                    break;
                case 'MSClass':
                    $.getScript(senro.MSClass.url,function(){
                        typeAction('MSClass');
                    });
                    break;
                case 'animateColors':
                    $.getScript(senro.animateColors.url,function(){
                        typeAction('animateColors');
                    });
                    break;
                case 'cssSandpaper':
                    $.getScript(senro.cssSandpaper.url,function(){
                        typeAction('cssSandpaper');
                    });
                    break;
                case 'tweenLite':
                    $.getScript(senro.tweenLite.url,function(){
                        typeAction('tweenLite');
                    });
                    break;
                case 'tweenMax':
                    $.getScript(senro.tweenMax.url,function(){
                        typeAction('tweenMax');
                    });
                    break;
                case 'testHtml5':
                    $.getScript(senro.testHtml5.url,function(){
                        typeAction('testHtml5');
                    });
                    break;
                case 'preload':
                    $.getScript(senro.preload.url,function(){
                        typeAction('preload');
                    });
                    break;
                case 'mobile':
                    $.getScript(senro.mobile.url,function(){
                        typeAction('mobile');
                    });
                    break;
            }
        }
    }
    function typeAction(type){
        senro[type].state=true;
        senro[type].action.fire();
        for(var i=0;i<senro[type].callbacks.length;i++){
            senro[type].callbacks[i]&&senro[type].callbacks[i](senro[type].objects[i]);
        }
        return false;
    }

    senro.errMsg={
        video:      "请在初始化Senro()时加入'video',例如new Senro('video');如有多个请以数组形式。",
        swf:        "请在初始化Senro()时加入'swf',例如new Senro('swf');如有多个请以数组形式。",
        login:      "请在初始化Senro()时加入'login',例如new Senro('login');如有多个请以数组形式。",
        register:      "请在初始化Senro()时加入'register',例如new Senro('register');如有多个请以数组形式。",
        iePng:      "请在初始化Senro()时加入'iePng',例如new Senro('iePng');如有多个请以数组形式。",
        drag:       "请在初始化Senro()时加入'drag',例如new Senro('drag');如有多个请以数组形式。",
        mouseWheel: "请在初始化Senro()时加入'mouseWheel',例如new Senro('mouseWheel');如有多个请以数组形式。",
        MSClass:    "请在初始化Senro()时加入'MSClass',例如new Senro('MSClass');如有多个请以数组形式。",
        animateColors:"请在初始化Senro()时加入'animateColors',例如new Senro('animateColors');如有多个请以数组形式。",
        cssSandpaper:"请在初始化Senro()时加入'cssSandpaper',例如new Senro('cssSandpaper');如有多个请以数组形式。",
        tweenLite:  "请在初始化Senro()时加入'tweenLite',例如new Senro('tweenLite');如有多个请以数组形式。",
        tweenMax:  "请在初始化Senro()时加入'tweenMax',例如new Senro('tweenMax');如有多个请以数组形式。",
        testHtml5:  "请在初始化Senro()时加入'testHtml5',例如new Senro('testHtml5');如有多个请以数组形式。",
        preload:  "请在初始化Senro()时加入'preload',例如new Senro('preload');如有多个请以数组形式。",
        mobile:  "请在初始化Senro()时加入'mobile',例如new Senro('mobile');如有多个请以数组形式。"
    };

    jQuery.extend({
        visibleHidden: function(e) {
            e.css({
                visibility: "hidden"
            });
            return false;
        },
        visibleShow: function(e) {
            e.css({
                visibility: "visible"
            });
            return false;
        }
    });
};

Senro.prototype={

    constructor: Senro,
checkRequire:function(type,fun_action){
        /*
         * @位置：  核心公用方法；
         * @名字：  checkRequire；
         * @翻译：  检测依赖（ 检测类型 ，回调）；
         * @参数：  checkRequire( type, fun_action )
         *         type（字符串）：【必填】'video','swf','login','iePng','drag','mouseWheel','MSClass'，'animateColors','cssSandpaper','tweenMax','testHtml5','preload'
         *         fun_action（函数）： 【必填】自定义；
         * @功能：  根据所传的依赖类型自动获取，所需依赖文件。并保证当该方法被多次调用时，引用文件只被加载一次。；
         * @返回：  无；
         * @实例：  /test-html/3.2/core/checkRequire.html；
         * @需要：  无；
         * @备注：  暂无；
         */
        var state=false;
        //判断type类型是否初始化
        for(var i=0;i<arr_requireJs.length;i++){
            if(arr_requireJs[i]==type){
                state=true;
                break;
            }
        }
        if(state){
            if(!senro[type].state){
                senro[type].action.add(fun_action);
            }else{
                fun_action();
                //保证方法异步执行，也会执行回调
                for(var j=0;j<senro[type].callbacks.length;j++){
                    senro[type].callbacks[j]&&senro[type].callbacks[j](senro[type].objects[j]);
                }
            }
        }else{
            alert(senro.errMsg[type]);
        }

        return false;
    }//checkRequire end
,
initRegister:function(formId,scope,successCallback){
        /*
         * @位置：  常用后端交互方法；
         * @名字：  initRegister；
         * @翻译：  初始化登录框（ 表单id，input包裹层类名，登录成功回调函数 ）；
         * @参数：  initRegister(formId,scope,successCallback)
         *         formId（字符串）：【必填】登录表单id
         *         scope（字符串）：【必填】input包裹层类名
         *         successCallback（函数）：【必填】登录成功回调函数;
         * @功能：  给注销按钮添加注销链接；
         * @返回：  无；
         * @实例：  /test-html/3.0/dataInteractive/initRegister.html；
         * @需要：  checkRequire；
         * @备注：  方法会自动改变form的action和method值，给前4个input进行初始化加上所需的类和name，
         *         参数
         *         username 	    必选 	用户名
         *         password 	    必选 	密码
         *         jumpurl 	        可选 	跳转路径
         *         jsoncallback 	可选 	JSON回调函数
         *         返回码
         *         1002 	登录成功
         *         2002 	通行证账号密码错误
         *         登录成功
         *         JSON
         *         {'msgcode': code, 'tips': tip, 'server_version': server_version,
         *         'server_time': server_time, 'server_environment': environment,
         *         'server_node': server_node,'account': account, 'realName': realName,
         *         'createDate': createDate, 'jumpurl': jumpurl}；
         */
        senro.checkRequire('register',function(){
            //add default input class
//            var $form=$(formId),
//                $inputs=$(formId).find('input');
//
//            $form.attr('method','post');
//            $form.attr('action','http://gwpassport.woniu.com/v2/login');
//            $inputs.each(function(index){
//                var $thisInput=$inputs.eq(index);
//                if(index==0){
//                    if(!$thisInput.hasClass('inputDefault')){
//                        $thisInput.addClass('inputDefault');
//                    }
//                    if($thisInput.attr('name')!='username'){
//                        $thisInput.attr('name','username');
//                    }
//                }else if(index==2){
//                    if(!$thisInput.hasClass('inputDefault')){
//                        $thisInput.addClass('inputDefault');
//                    }
//                    if($thisInput.attr('name')!='password'){
//                        $thisInput.attr('name','password');
//                    }
//                }else if(index==1||index==3){
//                    if(!$thisInput.hasClass('msgContainer')){
//                        $thisInput.addClass('msgContainer');
//                    }
//                }
//            });
            var register = new Passport({
                    formId:formId,
                    submit: {
                        node: 'input[type=submit]',
                        disabled: '.disabledSubmit'
                    },
                    elements: {
                        scope: scope,
                        input: {
                            node: '.inputDefault'
                        },
                        message: {
                            node: '.msgContainer',
                            error: '.msgError'
                        }
                    },
                    hiddenOptions: {
                        gameid: '17',
                        pagename: 'GW_HJ_DEFAULT'
                    },
                    success: function(data) {
                        successCallback&&successCallback(data);
                        register.reset();
                    }
                });

        });
        return false;
    }//initRegister end
};