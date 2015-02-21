/**
 * @版本: Senro.3.0.js(http://www.passtome.com/js/Senro.3.0.js)
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
,
simpleSliderLR:function($_btn_l,$_btn_r,$_list,int_showNum,str_loop,int_speed,str_autoPlay,int_autoPlayTime,str_touchType){
        /*
         * @位置： 常用组件；
         * @名字：  simpleSliderLR；
         * @翻译：  简单的带箭头图片滚动（ 左按钮，右按钮，图片包裹层，展示图片数量，循环，速度,自动播放,自动播放时间 ）；
         * @参数：  simpleSliderLR($btn_l,$btn_r,$list,showNum,loop,speed,autoPlay,autoPlayTime)
         *         $btn_l（$）：【必填】jquery选中的左按钮
         *         $btn_r（$）：【必填】jquery选中的右按钮
         *         $list（$）：【必填】jquery选中的图片包裹层
         *         showNum（数字）：【可选】显示个数，即移动步长，默认1
         *         loop（布尔）：【可选】是否循环，true，循环，false，不循环，默认false
         *         speed（数字）：【可选】切换缓动时间，默认200
         *         autoPlay(字符)：【可选】是否自动播放，默认false
         *         autoPlayTime(字符)：【可选】自动播放时间，默认3000；
         * @功能：  初始化带左右箭头的轮播图片组件；
         * @返回：  无；
         * @实例：  /test-html/2.9/widget/simpleSliderLR.html；
         * @需要：  getItems；
         * @备注：  支持移动端，注意在初始化时，该$list里的元素不能被隐藏，否则offset会为0
         *         可以使用< !--senroLabel.simpleSliderLR[属性名：属性值][...]-- >这样的标签格式调用，目前支持属性：
         *         id、class、width（图片宽度）、height（图片高度）；
         */

        var $l_btn=$_btn_l,
            $r_btn=$_btn_r,
            $big_list=$_list,
            showNum=int_showNum|| 1,
            loop=str_loop||false,
            speed=int_speed||200,
            touchType=str_touchType||'normal',
            swipeSpeed=touchType=='normal'?10:80,
            $items=senro.getItems($big_list),
            offset = $items.eq(1).outerWidth(true),
            left = 0,
            oringeLeft,
            itemsLength=$items.length,
            maxWidth = (itemsLength - showNum) * offset,
            autoPlay=str_autoPlay||false,
            autoPlayTime=int_autoPlayTime||3000,
            autoInterval,
            needPlay=true;
        senro.checkRequire('mobile',function(){
            $items
            .on('swipeleft',function(){
                if(touchType=='normal'){
                    rightAction();
                }
            })
            .on('swiperight',function(){
                if(touchType=='normal'){
                    leftAction();
                }
            })
            .on('movestart', function(e) {
                // If the movestart heads off in a upwards or downwards
                // direction, prevent it so that the browser scrolls normally.
                if ((e.distX > e.distY && e.distX < -e.distY) ||
                    (e.distX < e.distY && e.distX > -e.distY)) {
                    e.preventDefault();
                    return false;
                }
                oringeLeft=parseInt($big_list.css('left'));
            })
            .on('move', function(e) {
                var realLeft=parseInt($big_list.css('left')),
                    left = realLeft+swipeSpeed*e.distX / offset;
                // Move slides with the finger e.distX < 0向左滑e.distX > 0向右滑
                $big_list.css({ left: left + 'px' });
            }).on('moveend', function(e) {
                var left=parseInt($big_list.css('left'));

                if(left > 0){
                    $big_list.animate({ left: 0 + 'px' });
                }else if(left < -maxWidth){
                    $big_list.animate({ left: -maxWidth + 'px' });
                }else{
                    if(touchType!='normal'){
                        $big_list.animate({ left: left });
                    }else{
                        $big_list.animate({ left: oringeLeft });
                    }
                }
            });
        });
        if($l_btn&&$l_btn){
            $l_btn.click(function(){
                leftAction();
                return false;
            });
            $r_btn.click(function(){
                rightAction();
                return false;
            });
            $l_btn.add($r_btn).add($big_list).mouseenter(function(){
                needPlay=false;
            });
            $l_btn.add($r_btn).add($big_list).mouseleave(function(){
                needPlay=true;
            });
        }

        if(autoPlay){
            setAutoPlay();
        }
        function leftAction(){
            if(!loop){
                jQuery.visibleShow($r_btn);
                if ($big_list.is(":animated")) {
                    return false;
                }
                if (left === 0) {
                    jQuery.visibleHidden($l_btn);
                    return false;
                }
                left+=offset;
                $big_list.animate({
                        left:left+'px'
                    },speed
                );
                oringeLeft=left;
            }else{
                if ($big_list.is(":animated")) {
                    return false;
                }
                moveItem('right');
            }
            return false;
        }
        function rightAction(){
            if(!loop){
                jQuery.visibleShow($l_btn);
                if ($big_list.is(":animated")) {
                    return false;
                }
                if (left === -maxWidth) {
                    jQuery.visibleHidden($r_btn);
                    return false;
                }
                left-=offset;
                $big_list.animate({
                        left:left+'px'
                    },speed
                );
                oringeLeft=left;
            }else{
                if ($big_list.is(":animated")) {
                    return false;
                }
                moveItem('left');
            }
            return false;
        }
        function setAutoPlay(){
            autoInterval=setInterval(function(){
                if(needPlay){
                    $r_btn.click();
                }
            },autoPlayTime);
        }
        function moveItem(direction){
            $items=senro.getItems($big_list);
            if(direction=='left'){
                $big_list.animate({
                        left:-offset*showNum+'px'
                    }
                ,speed,null,function(){
                    $big_list.append($items.eq(0).add($items.eq(showNum-1)).remove()).css({
                        left: '0px'
                    });
                });
            }else{
                $big_list.prepend($items.eq(itemsLength-1).add($items.eq(itemsLength-1-(showNum-1))).remove()).css({
                    left: -offset*showNum+'px'
                }).animate({
                    left: '0px'
                },speed);
            }
        }
    }//simpleSliderLR end
};