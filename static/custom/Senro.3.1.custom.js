/**
 * @版本: Senro.3.1.js(http://www.passtome.com/js/Senro.3.1.js)
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
    senro.version=3.1;
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
parseArgus:function (arguments,attr){
        /*
         * @位置：  核心公用方法；
         * @名字：  parseArgus；
         * @翻译：  解析参数（ 函数参数数组，属性对象 ）；
         * @参数：  parseArgus( arguments,attr )
         *         arguments(数组)：【必填】参数数组
         *         attr(对象)：【必填】属性对象；
         * @功能：  解析参数赋值给对应对象属性；
         * @返回：  无；
         * @实例：  /test-html/3.1/core/parseArgus.html；
         * @需要：  无；
         * @备注：  暂无 todo；
         */
        var j=0;
        for(var i in attr){
            attr[i]=objectType(arguments[0])=='object'?arguments[0][i]?arguments[0][i]:attr[i]:arguments[j]?arguments[j]:attr[i];
            j++;
        }
        function objectType (obj){
            if( obj instanceof jQuery){
                return '$';
            }else if( typeof obj =='object'){
                return 'object';
            }
            return false;
        }

    }//parseArgus end
,
controlPop:function(str_type,$_pop,$_close,$_mask,num_speed,bool_maskClose){
        /*
         * @位置： 常用界面交互方法；
         * @名字：  controlPop；
         * @翻译：  控制弹窗（ 类型，弹框主体，关闭按钮，遮罩层 ）；
         * @参数：  controlPop(type,pop,close,mask,speed)【支持对象传参，以下是属性】
         *         {
         *         type（字符串）：【必填】‘show’，显示，‘hide’，隐藏
         *         pop（$）：【必填】jquery选中的弹框主体
         *         close（$）：【可选】jquery选中的关闭按钮
         *         mask（$）：【可选】jquery选中的自定义遮罩层，默认是黑色，透明度0.6
         *         speed（数字）：【可选】显示缓动时间,默认为0，也可传”fast“，”slow“
         *         };
         * @功能：  显示或隐藏弹窗，自带遮罩，根据窗口大小自动居中；
         * @返回：  无；
         * @实例：  /test-html/3.1/UIInteractive/controlPop.html；
         * @需要：  parseArgus；
         * @备注：  如果弹框主体里有表单重置表单；
         */
        var attr={
            type: '',
            pop: $,
            close: null,
            mask: null,
            speed:0,
            maskClose: false
        };

        senro.parseArgus(arguments,attr);

        var str_type=attr['type'],
            $_pop=attr['pop'],
            $_close=attr['close'],
            $_mask=attr['mask'],
            num_speed=attr['speed'],
            bool_maskClose=attr['maskClose'];

        var $mainPop = $_pop,
            $mask = $_mask||$('<div class="senroPopMask"></div>'),
            maskColor=$_mask?$mask.css('backgroundColor'):'#000',
            maskOpacity=$_mask?$mask.css('opacity'):0.6,
            $close=$_close||null,
            $body=$('body'),
            speed=num_speed|| 0,
            hasMask= $_mask ? true : false;

        //如果有表单重置表单
        if($mainPop.find('form').length!=0){
            $mainPop.find('form')[0].reset();
        }
        //reset Pops
        $mainPop.css({
            zIndex: "9999",
            margin: 0
        });
        $mask.css({
            position: "absolute",
            left: "0",
            top: "0",
            zIndex: "9998",
            backgroundColor: maskColor,
            opacity: maskOpacity
        });
        $(window).resize(function(){
            if($mainPop.is(':visible')){
                setPop();
            }
            return false;
        });
        if(str_type=="show"){
            setPop();
            if(!hasMask){
                $body.append($mask);
            }
            $mask.fadeIn(speed);

        }else if(str_type=="hide"){
            $mainPop.add($mask).fadeOut(speed,function(){
                if(!hasMask){
                    $('.senroPopMask').remove();
                }else{
                    $mask.remove();
                }
            });

        }
        if(bool_maskClose){
            $mask.click(function(){
                $mainPop.add($mask).fadeOut(speed,function(){
                    if(!hasMask){
                        $mask.remove();
                    }
                });

                return false;
            });
        }

        if($close){
            $close.click(function(){
                $mainPop.add($mask).fadeOut(speed,function(){
                    if(!hasMask){
                        $mask.remove();
                    }
                });

                return false;
            });
        }

        function setPop(){
            var maskHeight = Math.max($body.height(),$(window).height()),
                maskWidth = $(window).width(),
                dialogTop = ($(window).height() - $mainPop.outerHeight(true)) / 2  + $(document).scrollTop(),
                dialogLeft = (maskWidth - $mainPop.outerWidth(true)) / 2;
            jQuery.visibleShow($mainPop);
            $mainPop.hide();
            $mainPop.css({
                top: dialogTop,
                left: dialogLeft
            }).fadeIn(speed);

            createMask($mask,maskWidth,maskHeight);
            return false;
        }
        function createMask($mask,maskWidth,maskHeight){

            $mask.css({
                height: maskHeight,
                width: maskWidth
            });
            return false;
        }
        return false;
    }//controlPop end
};