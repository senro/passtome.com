var Senro=function(requireJs){

    arr_requireJs=requireJs||[];
    senro=this;
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
         * @实例：  /test-html/2.8/core/checkRequire.html；
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
    },//checkRequire end
isIE6:function(){
        /*
         * @位置：  核心公用方法；
         * @名字：  isIE6；
         * @翻译：  是否是ie6（ ）；
         * @参数：  isIE6()；
         * @功能：  检测是否是ie6；
         * @返回：  true或false（boolean）；
         * @实例：  /test-html/2.8/isIE6.html；
         * @需要：  无；
         * @备注：  暂无；
         */
        var ie6=!-[1,]&&!window.XMLHttpRequest;
        if(ie6){
            return true;
        }else{
            return false;
        }
    },//isIE6 end
fixIE6Png:function(str_className){
        /*
         * @位置：  常用修复方法；
         * @名字：  fixIE6Png；
         * @翻译：  修复ie6的png（ 需要修复的dom类名 ）；
         * @参数：  fixIE6Png(className)
         *         className（字符串）：【必填】需要修复的dom类名,需要'.',可以用','多选;
         * @功能：  修复ie6的png问题；
         * @返回：  无；
         * @实例：  /test-html/3.0/fix/fixIE6Png.html；
         * @需要：  checkRequire、isIE6；
         * @备注：  该修复可能导致的问题：
         *         1.被修复的dom在ie6下动态加的类的样式不能及时呈现
         *         2.有hover状态的background-position移动会很卡
         *         封装了
         *         "<!--[if IE 6]>
         *             <script src="http://static.woniu.com/script/iepng/iepng.js"></script>
         *             <script type="text/javascript">DD_belatedPNG.fix('.iePng');</script>
         *         <![endif]-->"；
         */
        if(senro.isIE6()){
            senro.checkRequire('iePng',function(){
                DD_belatedPNG.fix(str_className);
            });
        }
        return false;
    }//fixIE6Png end
};