/**
 * @版本: Senro.2.9.js(http://senro.cn/senro/Senro.2.9.js)
 * @依赖: jquery 1.9.1(http://static.woniu.com/script/jquery/jquery-1.9.1.min.js)
 * @作者: senro(http://senro.cn)
 * @版权: senro.cn(http://senro.cn)
 * @感谢: NightKnight(#)、蒹葭从风(#)、woniu.com(http://www.woniu.com)
 * @简介: Senro.js 是senro根据日常工作的需求开发的经验总结，目的是快速应对各种蜗牛前端开发中需要用到的常用js方法和组件，
 *       可以把这个对象想象成senro本人，它有自己的属性、方法。开发原则是尽量用一句话解决一个问题当然，尽量减少传参，参数按重要
 *       级别从左往右。由于水平有限，难免会有bug，和不完善，还请需要使用的各位，多多包涵，并指出不足，以便完善；
 * @包含: 核心公用方法(core)、常用组件(widget)、常用界面交互方法(UIInteractive)、常用后端交互方法(dataInteractive)、常用检测方法(check)、常用修复方法(fix)、资源加载(load)、常用js模拟html5效果方法(html5)、常用动画方法(animate)
 */
var Senro=function(requireJs){

    arr_requireJs=requireJs||[];
    senro=this;
    senro.video=     { url:'http://static.woniu.com/script/jwplayer/jwplayer.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.swf=       { url:'http://static.woniu.com/js/swfobject.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.login=     { url:'http://static.woniu.com/script/widget/passport/login.js',state: false, objects: [], action: $.Callbacks(), callbacks: [] };
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
    }//checkRequire end
,
console:function(str){
        /*
         * @位置：  核心公用方法；
         * @名字：  console；
         * @翻译：  输出（ 值 ）；
         * @参数：  console( str )
         *         str任意值【必填】；
         * @功能：  针对ie不支持console做兼容，保证ie使用console不报错；
         * @返回：  无；
         * @实例：  /test-html/2.8/core/console.html；
         * @需要：  无；
         * @备注：  暂无；
         */
        (function() {
            var method;
            var noop = function () {};
            var methods = [
                'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
                'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
                'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
                'timeStamp', 'trace', 'warn'
            ];
            var length = methods.length;
            var console = (window.console = window.console || {});

            while (length--) {
                method = methods[length];

                // Only stub undefined methods.
                if (!console[method]) {
                    console[method] = noop;
                }
            }
        }());

        console && console.log(str);
    }//console end
,
len:function (s) {
        /*
         * @位置：  核心公用方法；
         * @名字：  len；
         * @翻译：  字符串长度（ 字符串 ）；
         * @参数：  len( s )
         *         s任意字符串【必填】；
         * @功能：  英文字符算一个，中文字符算两个长度；
         * @返回：  长度（int）；
         * @实例：  /test-html/2.8/core/len.html；
         * @需要：  无；
         * @备注：  暂无；
         */
        var s=s||'';
        var l = 0;
        var a = s.split("");
        for (var i=0;i<a.length;i++) {
            if (a[i].charCodeAt(0)<299) {
                l++;
            } else {
                l+=2;
            }
        }
        return l;
    }//len end
,
random:function (min,max){
        /*
         * @位置：  核心公用方法；
         * @名字：  random；
         * @翻译：  随机区间（ 开始数，结束数 ）；
         * @参数：  random( min, max )
         *         min，max为数字【必填】；
         * @功能：  返回在min到max区间的随机数，返回值包括min，不包括max；
         * @返回：  随机数（int）；
         * @实例：  /test-html/2.8/core/random.html；
         * @需要：  无；
         * @备注：  暂无；
         */
        return Math.floor(min+Math.random()*(max-min));
    }//random end
,
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
    }//isIE6 end
,
addScript:function(cus_attrs,$domPos){
        /*
         * @位置：  核心公用方法；
         * @名字：  addScript；
         * @翻译：  加script标签（ 自定义属性对象，要插入的dom位置 ）；
         * @参数：  addScript( cus_attrs, $domPos )
         *         cus_attrs(对象)：【必填】标签包含的属性对象，例如{src:'',gameId:''}
         *         $domPos（$）: 【可选】用jquery选中的父节点，默认head里；
         * @功能：  向指定父元素插入带定义属性的script标签；
         * @返回：  无；
         * @实例：  /test-html/2.8/core/addScript.html；
         * @需要：  无；
         * @备注：  暂无 todo；
         */
        var tmpScript = document.createElement('script'),
            $doucumentHead=$domPos||$("head"),
            timesTmp='?v='+new Date().getTime();

        for(var i in cus_attrs){
            tmpScript[i]=cus_attrs[i];
        }
        tmpScript.src = cus_attrs.src+timesTmp;/*附带时间参数，防止缓存*/
        $doucumentHead.after(tmpScript);
        return false;
    }//addScript end
,
getItems:function($itemWrap){
        /*
         * @位置：  核心公用方法；
         * @名字：  getItems；
         * @翻译：  获取要滚动的元素（ 滚动元素父层 ）；
         * @参数：  getItems( $itemWrap )
         *         $itemWrap($)：【必填】jquery选中要获取的滚动元素的父层；
         * @功能：  分析传入层的子元素的层级关系，按优先顺序返回同级元素，优先顺序是：div>li>a>img；
         * @返回：  无；
         * @实例：  /test-html/2.8/core/getItems.html；
         * @需要：  无；
         * @备注：  暂无 todo；
         */
        var $items;
        if($itemWrap.find('div').length>0){
            if($itemWrap.find('div').length==1){
                $items=$itemWrap.find('div');
            }else{
                $items=$itemWrap.find('div').siblings();
            }
        }else if($itemWrap.find('li').length>0){
            if($itemWrap.find('li').length==1){
                $items=$itemWrap.find('li');
            }else{
                $items=$itemWrap.find('li').siblings();
            }
        }else if($itemWrap.find('a').length>0){
            if($itemWrap.find('a').length==1){
                $items=$itemWrap.find('a');
            }else{
                $items=$itemWrap.find('a').siblings();
            }
        }else if($itemWrap.find('img').length>0){
            if($itemWrap.find('img').length==1){
                $items=$itemWrap.find('img');
            }else{
                $items=$itemWrap.find('img').siblings();
            }
        }

        return $items;
    }//getItems end
};