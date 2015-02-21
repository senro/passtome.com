/**
 * Created with JetBrains WebStorm.
 * User: qiuyun
 * Date: 13-7-26
 * Time: 下午5:25
 * To change this template use File | Settings | File Templates.
 * 依赖jquery 1.9.1，主要是drag功能是用的jquery ui里的自定义drag组件，
 */
var Senro=function(requireJs){

    arr_requireJs=requireJs||[];
    senro=this;
    senro.video=     { state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.swf=       { state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.login=     { state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.iePng=     { state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.drag=      { state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.mouseWheel={ state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.MSClass=   { state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.animateColors={ state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.cssSandpaper={ state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    senro.tweenLite= { state: false, objects: [], action: $.Callbacks(), callbacks: [] };
    if(typeof arr_requireJs==='string'){
        arr_requireJs=[arr_requireJs];
    }
    if(arr_requireJs.length>0){
        for(var i=0;i<arr_requireJs.length;i++){
            switch (arr_requireJs[i]){
                case 'video':
                    $.getScript('http://static.woniu.com/script/jwplayer/jwplayer.js',function(){
                        typeAction('video');
                    });
                    break;
                case 'swf':
                    $.getScript('http://static.woniu.com/js/swfobject.js',function(){
                        typeAction('swf');
                    });
                    break;
                case 'login':
                    $.getScript('http://static.woniu.com/script/widget/passport/login.js',function(){
                        typeAction('login');
                    });
                    break;
                case 'iePng':
                    $.getScript('http://static.woniu.com/script/iepng/iepng.js',function(){
                        typeAction('iePng');
                    });
                    break;
                case 'drag':
                    $.getScript('http://static.woniu.com/script/jquery/jquery-ui-drag.min.js',function(){
                        typeAction('drag');
                    });
                    break;
                case 'mouseWheel':
                    $.getScript('http://static.woniu.com/script/jquery/jquery.mousewheel.js',function(){
                        typeAction('mouseWheel');
                    });
                    break;
                case 'MSClass':
                    $.getScript('http://static.woniu.com/script/plugin/MSClass.js',function(){
                        typeAction('MSClass');
                    });
                    break;
                case 'animateColors':
                    $.getScript('http://static.woniu.com/script/jquery/jquery.animate-colors-min.js',function(){
                        typeAction('animateColors');
                    });
                    break;
                case 'cssSandpaper':
                    $.getScript('http://static.woniu.com/script/plugin/cssSandpaper.js',function(){
                        typeAction('cssSandpaper');
                    });
                    break;
                case 'tweenLite':
                    $.getScript('http://static.woniu.com/script/plugin/TweenLite.min.js',function(){
                        typeAction('tweenLite');
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
        mouseWheel: "请在初始化Senro()时加入'mousewheel',例如new Senro('mousewheel');如有多个请以数组形式。",
        MSClass:    "请在初始化Senro()时加入'MSClass',例如new Senro('MSClass');如有多个请以数组形式。",
        animateColors:"请在初始化Senro()时加入'animateColors',例如new Senro('animateColors');如有多个请以数组形式。",
        cssSandpaper:"请在初始化Senro()时加入'cssSandpaper',例如new Senro('cssSandpaper');如有多个请以数组形式。",
        tweenLite:  "请在初始化Senro()时加入'tweenLite',例如new Senro('tweenLite');如有多个请以数组形式。"
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

    controlPop:function(str_type,$_mask,$_pop,$_close){
        //根据叠加层和对话框的类名字，显示或隐藏登录框和叠加层
        var $loginPop = $_pop,
            $overlay = $_mask,
            $close=$_close||'',
            maskHeight = Math.max($('body').height(),$(window).height()),
            maskWidth = $(window).width(),
            dialogTop = ($(window).height() - $loginPop.outerHeight()) / 2  + $(document).scrollTop(),
            dialogLeft = (maskWidth - $loginPop.outerWidth()) / 2;
        //如果有表单重置表单
        if($loginPop.find('form').length!=0){
            $loginPop.find('form')[0].reset();
        }
        if(str_type=="show"){
            $overlay.css({
                position: "absolute",
                left: "0",
                top: "0",
                height: maskHeight,
                width: maskWidth,
                backgroundColor: "#000",
                zIndex: "9998",
                opacity: 0.6
            }).show();

            $loginPop.css({
                top: dialogTop,
                left: dialogLeft,
                zIndex: "9999",
                margin: 0
            }).show();

        }else if(str_type=="hide"){
            $overlay.hide();
            $loginPop.hide();
        }
        if($close!=''){
            $close.click(function(){
                $loginPop.hide();
                $overlay.hide();
                return false;
            });
        }

        return false;
    },

    getJson:function (url,obj_argus,callback){
        /*argus 参数示例
        * var argus={
              argu1: argu1Value,
              argu2: argu2Value
         };
        * */
        var argus=obj_argus||{
            '': ''
        };
        var URL=url+'?jsoncallback=?';
        for(var i in argus){
            URL=URL+'&'+i+'='+argus[i];
        }
        $.getJSON(URL,function(data){
            callback&&callback(data);
        });
        return false;
    },

    initLogin:function(formId,scope,successCallback,input_node,input_write,input_done,msg_node,msg_hover,msg_error){
        /*
        参数
        * username 	    必选 	用户名
          password 	    必选 	密码
          jumpurl 	    可选 	跳转路径
          jsoncallback 	可选 	JSON回调函数
        返回码
         1002 	登录成功
         2002 	通行证账号密码错误
         登录成功
         JSON
         {'msgcode': code, 'tips': tip, 'server_version': server_version,
         'server_time': server_time, 'server_environment': environment,
         'server_node': server_node,'account': account, 'realName': realName,
         'createDate': createDate, 'jumpurl': jumpurl}
        * */
        senro.checkRequire('login',function(){
            var input_node=input_node||'.inputDefault',
                input_write=input_write||'.inputWrite',
                input_done=input_done||'.inputComplete',
                msg_node=msg_node||'.msgContainer',
                msg_hover=msg_hover||'.msgHover',
                msg_error=msg_error||'.msgError';

            var login = new Login({
                formId:formId,
                elements:{
                    scope:scope,
                    input:{
                        node:input_node,
                        write:input_write,
                        done:input_done
                    },
                    message:{
                        node:msg_node,
                        hover:msg_hover,
                        error:msg_error
                    }
                },
                success: function(data){
                    successCallback&&successCallback(data);
                },

                handleMessage: function (message) {
                    alert(message);
                }
            });
        });
        return false;
    },
    checkLogin: function(callback){
        /*
        * 1020  已登录
        * 1021 	未登录
        * 	JSON
         {'msgcode': msgcode, 'tips': tips, 'passport_username': passport_username,
         'server_version': server_version, 'server_time': server_time,
         'server_environment': environment, 'server_node': server_node,
         }
        * */
        $.getJSON("http://gwpassport.woniu.com/v2/islogin?jsoncallback=?",function(data){
            callback&&callback(data);
        });
    },
    loginOut: function($_a){
        //给传进来的a加注销链接
        var returnURL="?goto="+document.URL;
        $_a.attr("href","http://gwpassport.woniu.com/v2/logout"+returnURL);
    },
    marquee:function(str_containerId,str_direction,$_preBtn,$_nextBtn,num_speed){
        /*
        * 依赖MSClass.js,checkRequire内部方法
        * 主要作用:箭头控制滚动方向、加速及鼠标拖动实例
        * container必须设定宽高，内部获取其宽高作为设置参数,滚动元素最好用表格布局，好像MSClass自动变成表格布局，待研究。
        * MSClass是把你要滚动的元素自动再复制到一个td里，所有的滚动都是以表格的形式滚动的，并且在用ul+li布局的时候，ul不用设置absolute
        * 只要设置li的宽度*li的个数就行了，外面的container也不用设relative
        * */
        senro.checkRequire('MSClass',function(){
            var objMarquee=new Marquee(str_containerId),
                $null=$(''),
                $preBtn=$_preBtn||$null,
                $nextBtn=$_nextBtn||$null,
                speed=num_speed|| 1,
                $container=$('#'+str_containerId);

            switch (str_direction){//0上 1下 2左 3右 -1上下交替 4左右交替
                case 'left':
                    objMarquee.Direction=2;
                    $preBtn.mouseover(function(){
                        objMarquee.Direction=3;
                    });
                    $nextBtn.mouseover(function(){
                        objMarquee.Direction=2;
                    });
                    break;
                case 'right':
                    objMarquee.Direction=3;
                    $preBtn.mouseover(function(){
                        objMarquee.Direction=2;
                    });
                    $nextBtn.mouseover(function(){
                        objMarquee.Direction=3;
                    });
                    break;
                case 'top':
                    objMarquee.Direction=0;
                    $preBtn.mouseover(function(){
                        objMarquee.Direction=1;
                    });
                    $nextBtn.mouseover(function(){
                        objMarquee.Direction=0;
                    });
                    break;
                case 'bottom':
                    objMarquee.Direction=1;
                    $preBtn.mouseover(function(){
                        objMarquee.Direction=0;
                    });
                    $nextBtn.mouseover(function(){
                        objMarquee.Direction=1;
                    });
                    break;
            }
            objMarquee.Step=speed;//滚动的步长(数值越大,滚动越快,小于1切换为缓动。若为数组[0.5,20]形式，则可设置Tween的缓动类别,0.5为系数，20为缓动类别)
            objMarquee.Width=$container.width();
            objMarquee.Height=$container.height();
            objMarquee.Timer=40;//定时器，即频率/执行周期(默认值为30,数值越小,滚动的速度越快,1000=1秒,建议不小于20)
            objMarquee.ScrollStep=1;//间歇滚动间距(默认为翻屏宽/高度,该数值为-2，DelayTime为0则为鼠标悬停控制,-1禁止鼠标控制)
            objMarquee.Start();
            objMarquee.BakStep=objMarquee.Step;//本身没有BakStep属性，只是临时设置了个来保存原来的步长

            $preBtn.add($nextBtn).mousedown(function(){
                objMarquee.Step=objMarquee.BakStep+3;
            });
            $preBtn.add($nextBtn).mouseup(function(){
                objMarquee.Step=objMarquee.BakStep;
            });
        });

    },
    simpleSliderLR:function($_btn_l,$_btn_r,$_list,showNum){
        var $l_btn=$_btn_l,
            $r_btn=$_btn_r,
            $big_list=$_list,
            showNum=showNum|| 1,

            offset = $big_list.find('a').eq(1).outerWidth(true)||$big_list.find('img').eq(1).outerWidth(true)||$big_list.find('div').eq(1).outerWidth(true),
            left = 0,
            maxWidth = ($big_list.find('img').length - showNum) * offset;

        $l_btn.click(function(){
            jQuery.visibleShow($r_btn);
            if (left === 0) {
                jQuery.visibleHidden($l_btn);
                return false;
            }
            left+=offset;
            $big_list.animate({
                    left:left+'px'
                }
            );
            return false;
        });

        $r_btn.click(function(){
            jQuery.visibleShow($l_btn);
            if (left === -maxWidth) {
                jQuery.visibleHidden($r_btn);
                return false;
            }
            left-=offset;
            $big_list.animate({
                    left:left+'px'
                }
            );
            return false;
        });

    },
    sliderLR:function($_btn_l,$_btn_r,$_list,$_thumbBtn_l,$_thumbBtn_r,$_thumbList,$_sliderCube){
        /*
        * 依赖checkRequire方法
        * */
        var $l_btn=$_btn_l,
            $r_btn=$_btn_r,
            $big_list=$_list,
            $l_thumbBtn=$_thumbBtn_l||null,
            $r_thumbBtn=$_thumbBtn_r||null,
            $small_list=$_thumbList||null,
            $sliderCube=$_sliderCube||null;

        var maxIndex = $big_list.eq(0).find('img').length-1,
            currIndex=0;

        $l_btn.add($l_thumbBtn).click(function(){
            if(currIndex<=0){
                currIndex=0;
                return false;
            }
            currIndex--;
            gotoIndex($big_list,currIndex);
            if($small_list){
                gotoIndex($small_list,currIndex);
            }
            if($small_list){
                bindSliderCube($sliderCube,currIndex,maxIndex);
            }
            return false;
        });

        $r_btn.add($r_thumbBtn).click(function(){
            if(currIndex>=maxIndex){
                currIndex=maxIndex;
                return false;
            }
            currIndex++;
            gotoIndex($big_list,currIndex);
            if($small_list){
                gotoIndex($small_list,currIndex);
            }
            if($small_list){
                bindSliderCube($sliderCube,currIndex,maxIndex);
            }
            return false;
        });
        //初始化thumb图片点击
        if($small_list){
            var $item=$small_list.find('a')||$small_list.find('img');

            $item.click(function(){

                var index=$item.index(this);
                //console.log('clickIndex:'+index);
                if(index>maxIndex){
                    index=index-(maxIndex+1)*(index%(maxIndex+1));
                }
                currIndex=index;
                gotoIndex($big_list,currIndex);
                gotoIndex($small_list,currIndex);
                if($sliderCube){
                    bindSliderCube($sliderCube,currIndex,maxIndex);
                }
                //console.log("currIndex:"+currIndex);
                return false;
            });
        }
        //初始化拖拽
        if($sliderCube){
            senro.checkRequire('drag',function(){
                //reset sliderCube
                $sliderCube.css("left","0px");

                $sliderCube.draggable({ containment: "parent",stop:function(){
                    var index=$sliderCube.index(this),
                        $currDom=$sliderCube.eq(index),
                        $parentDom=$currDom.parent(),
                        dragRatio=($currDom.position().left+$currDom.width())/$parentDom.width();

                    //console.log('dragRatio:'+dragRatio.toFixed(1));
                    currIndex=Math.round(maxIndex*dragRatio.toFixed(1));

                    gotoIndex($big_list,currIndex);
                    if($small_list){
                        gotoIndex($small_list,currIndex);
                    }
                }});
            });
        }
        function bindSliderCube($_sliderCube,currIndex,maxIndex){
            var $parentDom=$_sliderCube.parent(),
                parentWidth=$parentDom.width(),
                dragRatio=(currIndex/maxIndex).toFixed(1);

            if(dragRatio==0){
                $_sliderCube.css("left",parentWidth*dragRatio+"px");
            }else{
                $_sliderCube.css("left",(parentWidth*dragRatio-$_sliderCube.width())+"px");
            }
        }

        function gotoIndex($_picList,index){
            var offset = $_picList.eq(0).find('a').eq(1).outerWidth(true)||$_picList.eq(0).find('img').eq(1).outerWidth(true),
                left=-index*offset;

            $_picList.animate({
                    left:left+'px'
            });

            addCurrent($small_list,index);

            return false;
        }
        function addCurrent($_small_list,int_currIndex){
            var $item=$_small_list.find('a')||$_small_list.find('img');

            $item.removeClass("current");
            $item.css("top","0px");
            $item.eq(int_currIndex).addClass("current");
            $item.eq(int_currIndex).css("top","-2px");
            return false;
        }
    },
    scrollBar:function($scrollCube,$container,speed){
        /*
        * 依赖checkRequire方法
        * 实现原理，首先利用jquery ui让滚动条可以在父层的限制内滚动，然后根据内容的实际高度与限制最大高度的比决定滑块的高度。
        * 根据改变高度后的滑块的实时top与滑块父层的最大高度的比去决定内容层移动的比率，此时要同步滚轮计数的值，根据当前的滑块的比率去反推
        * 滚轮计数的相对位置，将值还原成0到100之间的一个数。滚轮效果就是绑定滚轮事件，让向下滚滚轮计数+1，向上减一，控制其范围在0-100，
        * 然后让滑块和内容层去按这个滚动计数的百分比去各自方向滚动。
        * */
        var $ScrollContainerDom=$scrollCube.parent(),
            scrollContainerHeight=$ScrollContainerDom.outerHeight(),
            $containerWrap=$container.parent(),
            containerWrapHeight=$containerWrap.outerHeight(),
            containerHeight=$container.outerHeight(),
            scrollCubeHeight=$ScrollContainerDom.outerHeight()*$containerWrap.outerHeight()/$container.outerHeight(),
            wheel= 0,
            speed=speed||10;
        //改变滚动块的高度
        $scrollCube.css({
            height:  scrollCubeHeight+'px'
        });
        senro.checkRequire('drag',function(){
            $scrollCube.draggable({ containment: "parent",drag:function(){
                var index=$scrollCube.index(this),
                    $currDom=$scrollCube.eq(index),
                    ratio=$currDom.position().top/$ScrollContainerDom.outerHeight();
                //同步滚动条的相对位置
                wheel=Math.round(ratio*100/((scrollContainerHeight-scrollCubeHeight)/scrollContainerHeight));
                $container.css('top',-$container.outerHeight()*ratio+'px');
            }});
        });

        senro.checkRequire('mouseWheel',function(){
            //给$containerWrap添加滚轮事件
            $containerWrap.mousewheel(function(event, delta, deltaX, deltaY) {
                //往上滚+1，往下滚-1
                wheel-=(delta*speed);
                if(wheel>100){
                    wheel=100;
                }else if(wheel<0){
                    wheel=0;
                }
                var wheelRatio=wheel/100;

                $container.css('top',-(containerHeight-containerWrapHeight)*wheelRatio+'px');
                $scrollCube.css('top',(scrollContainerHeight-scrollCubeHeight)*wheelRatio+'px');

                //防止事件冒泡到body的滚动监听
                return false;
            });
        });
    },
    sliderTab:function($_btns,$_conts,str_btn_hover,str_trigerType){
        /*
        * str_trigerType必须是mouseover或者click，做为定义jquery事件类型名称
        * */
        var $btns=$_btns,
            $conts=$_conts,
            trigerType=str_trigerType||'mouseover',
            lastOne=0;
        //默认给第一个按钮加上hover,隐藏其他内容
        $btns.eq(0).addClass(str_btn_hover);
        for(var i=1;i<$conts.length;i++){
            $conts.eq(i).hide();
        }
        $btns.bind(trigerType,function(){
            var index=$btns.index(this);
            if(index==lastOne){
                return false;
            }

            $conts.eq(lastOne).hide();
            $btns.eq(lastOne).removeClass(str_btn_hover);

            $conts.eq(index).show();
            $btns.eq(index).addClass(str_btn_hover);

            lastOne=index;

            return false;
        });

        return false;
    },
    addNavFooter:function(str_gamename){
        var gameName=str_gamename||'',
            $doucumentHead=$("head")[0],
            timesTmp='?v='+new Date().getTime();

        var header_attrs={
            type   :"text/javascript",
            src    :'http://static.woniu.com/header_tl/pub-header.js',
            charset:"utf-8",
            id     :'pub-header'
        };
        var footer_attrs={
            type   :"text/javascript",
            src    :'http://static.woniu.com/footer_dl/pub-footer.js',
            charset:"utf-8",
            id     :'pub-footer'
        };
        var tongji_attrs={
            type   :"text/javascript",
            src    :'http://static.woniu.com/js/ga.js'
        };

        addScript(header_attrs);
        addScript(footer_attrs);
        addScript(tongji_attrs);
        $('#pub-footer').attr('gamename',gameName);

        function addScript(cus_attrs){

            var tmpScript = document.createElement('script');

            tmpScript.src = cus_attrs.src+timesTmp;/*附带时间参数，防止缓存*/
            for(var i in cus_attrs){
                tmpScript[i]=cus_attrs[i];
            }
            $doucumentHead.appendChild(tmpScript);
        }
        return false;
    },
    addVideo:function(str_id,str_file,str_image,num_width,num_height,callback){
        /*
        * 依赖checkRequire方法
        * str_Id 不需要#
        * */
        senro.checkRequire('video',function(){

            senro.video.objects.push(jwplayer(str_id).setup({
                flashplayer: 'http://static.woniu.com/script/jwplayer/player.swf',
                skin: 'http://static.woniu.com/script/jwplayer/skin/bekle.zip',
                file: str_file,
                image: str_image,
                width: num_width || 442,
                height: num_height || 331
            }));

            senro.video.callbacks.push(callback);
        });

        return false;
    },
    addSwf:function(str_id,str_file,num_width,num_height,callback){
        /*
        * 依赖checkRequire方法
        * str_id 不需要#
        * swfobject.embedSWF("circle.swf?"+new Date().getTime()+Math.random(), 'circle', 605, 605, 9,null,null,{wmode: 'transparent'});
        */
        senro.checkRequire('swf',function(){
            senro.swf.objects.push(addSWF(str_file, str_id, num_width, num_height));
            senro.swf.callbacks.push(callback);
        });

        return false;
    },
    tweenColor:function($dom,obj_attr,num_time){
        var time=num_time||2000;

        senro.checkRequire('animateColors',function(){
            $dom.animate(obj_attr,time);
        });

        return false;
    },
    addGradient:function($dom,str_config){
        /*
        * 建议用http://www.colorzilla.com/gradient-editor/生成想要的渐变效果
        * 然后拷贝其-webkit-gradient属性里的值当作第二个参数，这样最方便调试和使用
        * */
        var objDom=$dom[0];
        senro.checkRequire('cssSandpaper',function(){
            cssSandpaper.setGradient(objDom, "-sand-gradient("+str_config+");");
        });

        return false;
    },
    css3Rotate:function($dom,num_deg){
        var objDom=$dom[0],
            deg=num_deg||0;
        senro.checkRequire('cssSandpaper',function(){
            cssSandpaper.setTransform(objDom, "rotate("+deg+"deg)");
        });

        return false;
    },
    css3Translate:function($dom,num_x,num_y){
        var objDom=$dom[0],
            x=num_x|| 0,
            y=num_y|| 0;
        senro.checkRequire('cssSandpaper',function(){
            cssSandpaper.setTransform(objDom, "translate("+x+"px,"+y+"px)");
        });

        return false;
    },
    css3Scale:function($dom,num_x,num_y){
        var objDom=$dom[0],
            x=num_x|| 0,
            y=num_y|| 0;
        senro.checkRequire('cssSandpaper',function(){
            cssSandpaper.setTransform(objDom, "scale("+x+", "+y+")");
        });

        return false;
    },
    css3Skew:function($dom,num_x,num_y){
        var objDom=$dom[0],
            x=num_x|| 0,
            y=num_y|| 0;
        senro.checkRequire('cssSandpaper',function(){
            cssSandpaper.setTransform(objDom, "skew("+x+"deg, "+y+"deg)");
        });

        return false;
    },
    css3SetOpacity:function($dom,num_n){
        var objDom=$dom[0],
            n=num_n||1;
        senro.checkRequire('cssSandpaper',function(){
            cssSandpaper.setOpacity(objDom, n);
        });

        return false;
    },
    css3SetTransform:function($dom,str_config){
        /*
        * str_config:"rotate("+p.r+"deg) translate("+p.px+"px,"+p.py+"px"+") scale("+p.sx+", "+p.sy+") skew("+0+"deg, "+0+"deg)"
        * */
        var objDom=$dom[0];
        senro.checkRequire('cssSandpaper',function(){
            cssSandpaper.setTransform(objDom, str_config);
        });

        return false;
    },
    tween:function(obj,tweenObj,time,delay,ease,onUpdate,onUpdateParams,onComplete,onCompleteParams,callback){
        senro.checkRequire('tweenLite',function(){
            //var hideProps = {r:0, px:0, py:0,sx:1,sy:1,op:1};
            var props;
            for(var i in tweenObj){

            }
            var newTeen=TweenLite.to(hideProps, 5,  {
                r:360,
                px:0,
                py:0,
                sx:5,
                sy:5,
                op:0,
                ease:Cubic.easeIn,
                delay:0,
                onUpdate:applyProps,
                onUpdateParams:[hideProps]
                //onComplete:resetProps
                //onCompleteParams:[showProps,resetProp,i]
            });

        });
    },
    checkRequire:function(type,fun_action){
        /*
        * type:'video','swf','login','iePng','drag','mouseWheel','MSClass'
        * 检测需要加载的类型对象是否存在，如果存在则执行后面的函数，不存在提示加载方法
        * */
        var state=false;
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
            }
        }else{
            alert(senro.errMsg[type]);
        }

        return false;
    },
    checkInput:function($form,fun_callback,str_msgsClassName){
        /*
         * 实现原理：给此对象定义几个要检测的属性对象，他们每个对象包含它的选择符，提示框选择符，提示语言，检验状态，检测对象数组，提示框数组，方法
         * 当有输入框焦点移入时，开始执行收集所有要检测的输入框和提示框，并且存到指定的属性对象里，检验动作其实就两个状态需要检测，并且每个输入框的
         * 动作是一样的，都是点击输入框时其对应的提示框消失，当焦点移出时，用改属性对象的方法检测该输入框的值，并将其值保存在state属性数组里，
         * 如果state不正确，将错误信息放到提示框并显示出来，然后给显示出来的提示框加个点击操作，点击该提示框，让其消失，并把焦点移入其对应的输入框
         * 待改进的地方：
         * 如果第一次正确完成后，正常执行了回调函数，但是如果用户又去修改了某个值，并且该值不符合要求，但是此时因为之前已经执行过了回调，如果回调函数里
         * 是对submit按钮进行提交绑定，此时虽然信息填写错误，方法是不会去执行回调，但是之前已经绑定了，所以点submit按钮也能提交，所以应该考虑给回调函数里
         * 返回一个当前状态，或者设置两个回调函数（成功或失败）分别调用。*/
        var consoleStr=
            '使用Senro.checkInput方法需要结构是类似这样的'+'\n'+
            '<div class="row">'+'\n'+
            '<input type="text" class="email" />'+'\n'+
            '<input type="text" class="emailMsg msg none" />'+'\n'+
            '</div>'+'\n'+
            '其中msg不一定是input，可以是其他类型元素，至于选择标记符和提示框标记符可以通过修改对象的值修改，如：senro.checkInput.email.selecter="email1";';

        senro.console(consoleStr);

        var me=senro.checkInput,
            $inputs=$form.find('input'),
            msgsClassName=str_msgsClassName||'.msg',
            $msgs=$form.find(msgsClassName),
            allOk=0,
            beginCallback = $.Callbacks( "once" );

        if($msgs.length==0){
            alert('友情提示！没有找到提示框公用类msg，请给所有的提示框加个msg类，或者通过设置方法的最后一个可选参数自定义类名。');
        }else{
            me.require=  { selecter:'require', msgSelecter:'requireMsg',msgLang:'此项为必填！', state:[],inputs:[],msg:[],method:isNull };
            me.email=    { selecter:'email', msgSelecter:'emailMsg',msgLang:'邮箱格式不正确！', state:[],inputs:[],msg:[],method:isEmail };
            me.cellPhone={ selecter:'cellPhone', msgSelecter:'cellPhoneMsg',msgLang:'手机号码格式不正确！', state:[],inputs:[],msg:[],method:isCellPhone };
            me.chinaID=  { selecter:'chinaID', msgSelecter:'chinaIDMsg',msgLang:'身份证号码格式不正确！', state:[],inputs:[],msg:[],method:isChinaID };
            me.password= { selecter:'password', msgSelecter:'passwordMsg',msgLang:'待判断方法修改！', state:[],inputs:[],msg:[],method1: isPassword,method2:isSame };
            //reset form
            $form[0].reset();
            beginCallback.add(beginCheck);
            $inputs.focusin(function(){
                //有点击才开始执行检测，以便修改的默认属性生效
                beginCallback.fire();
            });
        }
        function beginCheck(){
            //根据类型收集要检测的元素
            $inputs.each(function(index){
                for(var type in me){
                    if($inputs.eq(index).hasClass( me[type].selecter)){
                        me[type].inputs.push($inputs.eq(index));
                        me[type].state.push(false);
                    }
                }
            });
            $msgs.each(function(index){
                for(var type in me){
                    if($msgs.eq(index).hasClass(me[type].msgSelecter)){
                        me[type].msg.push($msgs.eq(index));
                    }
                }
            });
            for(var i in me){
                doCheck(i);
            }
        }
        function doCheck(type){
            for(var i=0; i<me[type].inputs.length;i++){
                me[type].inputs[i].focusin(type,function(){
                    var i=$('.'+me[type].selecter).index(this);
                    if(me[type].msg[i]){
                        me[type].msg[i].hide();
                    }

                    return false;
                });
                me[type].inputs[i].focusout(type,function(){
                    var i=$('.'+me[type].selecter).index(this);

                    switch (type){
                        case 'password':
                            if(i==1){
                                //第二个密码框，调用方法2比较两个str是否一样，如果有三个密码的情况可能这里就待修改
                                me[type].state[i]=me[type].method2( me[type].inputs[0].val(), me[type].inputs[i].val() );
                            }else{
                                me[type].state[i]=me[type].method1( me[type].inputs[i].val() );
                            }
                            break;
                        default :
                            me[type].state[i]=me[type].method( me[type].inputs[i].val() );
                            break;
                    }

                    if(me[type].state[i]!==true){
                        //验证不通过
                        if(me[type].msg[i]){
                            if(me[type].msg[i].is('input')){
                                me[type].msg[i].val(me[type].msgLang);
                            }else{
                                me[type].msg[i].html(me[type].msgLang);
                            }
                            me[type].msg[i].show();
                            me[type].msg[i].click(type,function(){
                                me[type].msg[i].hide();
                                me[type].inputs[i].focus();

                                return false;
                            });
                        }
                    }
                    allOk=0;
                    for(var t in me){
                        for(var n=0;n<me[t].state.length;n++){
                            if(me[t].state[n]===true){
                                allOk++;
                            }else{
                                allOk--;
                            }
                        }
                    }
                    if(allOk==$msgs.length){
                        //按理说只能回调一次，待改进，todo
                        fun_callback&&fun_callback();
                    }
                    return false;
                });
            }

            return false;
        }

        function isNull( str ){
            //验证通过返回true，不通过返回false
            var str = $.trim(str);
            if(str.length==0){
                return false;
            }else{
                return true;
            }
        }

        function isEmail( str ){
            var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
            if(myReg.test(str)){
                return true;
            }else{
                return false;
            }
        }

        function isCellPhone( str ){
            var regu =/^[1][0-9][0-9]{9}$/;
            var re = new RegExp(regu);
            if (re.test(str)) {
                return true;
            }else{
                return false;
            }
        }

        function isChinaID(str){
            // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if(reg.test(str)){
                return true;
            }else{
                return false;
            }

        }
        function isPassword(str){
            //验证通过返回true，不通过返回false
            var str = $.trim(str);
            if(str.length<6){
                me.password.msgLang='密码不能小于6位';
                return false;
            }else{
                return true;
            }
        }
        function isSame(str1,str2){
            if(str1===str2){
                return true;
            }else{
                me.password.msgLang='两次密码不同';
                return false;
            }
        }
        function remote(str,name,url){
            $.getJSON(url+'?jsoncallback=?'+name+'='+str,function(data){

            });
        }
    },
    directionAnimate:function($container,$mask){
        $container.bind("mouseenter mouseleave",function(e){
            var w = $(this).width();
            var h = $(this).height();

            var x = (e.pageX - this.offsetLeft - (w/2)) * ( w > h ? (h/w) : 1 );
            var y = (e.pageY - this.offsetTop  - (h/2)) * ( h > w ? (w/h) : 1 );

            //判断鼠标移动方向
            var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180 ) / 90 ) + 3 )  % 4;

            var proform={};
            var proto={};
            switch(direction) {
                case 0:
                    proform={top:-h,left:0};
                    proto={top:0,left:0};
                    /** animations from the TOP **/
                    break;
                case 1:
                    proform={top:0,left:w};
                    proto={top:0,left:0};
                    /** animations from the RIGHT **/
                    break;
                case 2:
                    /** animations from the BOTTOM **/
                    proform={top:h,left:0};
                    proto={top:0,left:0};
                    break;
                case 3:
                    /** animations from the LEFT **/
                    proform={top:0,left:-w};
                    proto={top:0,left:0};
                    break;
            }
            var pro=[proform,proto];
            if(e.type=="mouseleave"){
                pro=[proto,proform];
            }
            $($mask,this).stop().css(pro[0]).animate(pro[1],200);
        });
    },
    console:function(str){
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
    },
    fixedDomPos:function($dom){
        if (senro.isIE6()) {
            $dom.css({
                position: 'absolute'
            });
            $(window).scroll(function(){
                var scrollTop = $(window).scrollTop();
                $dom.css({
                    top: scrollTop + 300
                });
            }).resize(function(){
                    $(this).scroll();
                }).scroll();
        }
        return false;
    },
    fixIE6Png:function(str_className){
        /*
         * 依赖checkRequire
         <!--[if IE 6]>
         <script src="http://static.woniu.com/script/iepng/iepng.js"></script>
         <script type="text/javascript">DD_belatedPNG.fix('.iePng');</script>
         <![endif]-->
         */
        senro.console('依赖checkRequire!');
        if(senro.isIE6()){
            senro.checkRequire('iePng',function(){
                DD_belatedPNG.fix(str_className);
            });
        }
        return false;
    },
    len:function (s) {
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
    },
    isIE6:function(){
        var ie6=!-[1,]&&!window.XMLHttpRequest;
        if(ie6){
            return true;
        }else{
            return false;
        }
    }

};