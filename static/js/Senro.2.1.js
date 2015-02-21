/**
 * Created with JetBrains WebStorm.
 * User: qiuyun
 * Date: 13-7-26
 * Time: 下午5:25
 * To change this template use File | Settings | File Templates.
 * 如果用到了拖拽功能就需要 jquery 1.9.1和jquery-ui其他情况jquery1.7.1即可
 */
var Senro=function(){

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
        /*argus 参数示例*/
        var argus=obj_argus||[
            { vars: '', values: '' }
        ];
        var aVar=[],
            URL=url+'?jsoncallback=?';
        for(var i= 0,L=argus.length;i<L;i++){
            aVar[i]='&'+argus[i].vars+'=';
            URL=URL+aVar[i]+argus[i].values;
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
         2003 	通行证用户名不存在
         2004 	通行证账号被冻结
         3001 	未知错误
         3003 	没有提交正确的参数username
         3004 	没有提交正确的参数password
         3101 	与计费中心连接失败或超时，请稍后再试
         3102 	TOKEN验证错误，请刷新页面后再试
         登录成功
         JSON
         {'msgcode': code, 'tips': tip, 'server_version': server_version,
         'server_time': server_time, 'server_environment': environment,
         'server_node': server_node,'account': account, 'realName': realName,
         'createDate': createDate, 'jumpurl': jumpurl}
        * */
        //引入蜗牛login.js
        $.getScript('http://static.woniu.com/script/widget/passport/login.js',function(){

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

            return false;
        });
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

        //var returnURL=str_returnURL==undefined ? "?goto="+str_returnURL : "" ||"";
        $_a.attr("href","http://gwpassport.woniu.com/v2/logout"+returnURL);
    },
    addNavFooter:function(str_gamename){
        var gameName=str_gamename||'',
            $doucumentHead=$("head")[0];

        /*JavaScript动态加载Js文件*/
        var scriptPubHead = document.createElement('script');
        scriptPubHead.charset="utf-8";
        scriptPubHead.id='pub-header';
        scriptPubHead.src = 'http://static.woniu.com/header_tl/pub-header.js';/*附带时间参数，防止缓存*/
        $doucumentHead.appendChild(scriptPubHead);

        var scriptPubfooter = document.createElement('script');
        scriptPubfooter.charset="utf-8";
        scriptPubfooter.id='pub-footer';
        scriptPubfooter.gamename=gameName;
        scriptPubfooter.src = 'http://static.woniu.com/footer_dl/pub-footer.js';/*附带时间参数，防止缓存*/
        $doucumentHead.appendChild(scriptPubfooter);

        var tongji= document.createElement('script');
        tongji.type="text/javascript";
        tongji.src = 'http://static.woniu.com/js/ga.js';/*附带时间参数，防止缓存*/
        $doucumentHead.appendChild(tongji);

        return false;
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
        //    初始化拖拽
        if($sliderCube){
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
    setupVideos:function(str_Id,str_file,str_image,num_width,num_height){
        /*
        * str_Id 不需要#
        * */
        $.getScript('http://static.woniu.com/script/jwplayer/jwplayer.js',function(){
             jwplayer(str_Id).setup({
                flashplayer: 'http://static.woniu.com/script/jwplayer/player.swf',
                skin: 'http://static.woniu.com/script/jwplayer/skin/bekle.zip',
                file: str_file,
                image: str_image,
                width: num_width || 442,
                height: num_height || 331
             });
        });
        return false;
    },
    fixedDomPos:function($dom){
        var ie6=!-[1,]&&!window.XMLHttpRequest;

        if (ie6) {
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
    fixIE6Png:function(str_className){
        /*
        <!--[if IE 6]>
          <script src="http://static.woniu.com/script/iepng/iepng.js"></script>
          <script type="text/javascript">DD_belatedPNG.fix('.iePng');</script>
        <![endif]-->
        */
        var ie6=!-[1,]&&!window.XMLHttpRequest;
        if(ie6){
            $.getScript('http://static.woniu.com/script/iepng/iepng.js',function(){
                DD_belatedPNG.fix(str_className);
            });
        }
        return false;
    },
    checkInput:function($form,selectArgus,errorArgus,msgLang){
        /*
        *传入form，然后通过input上指定的类去给不同的input加验证事件，并且显示默认的提示的信息，
        * 必须传个msg显示框，最好以后写的输入框，就重叠两个，一个真输入，一个用来显示错误信息，
        * 如果这个form所有的检测都通过了，就回调某个函数，然后再给submit按钮添加提交事件
        * */
        var selectArgus = {
                    require:   'require',
                    email:       'email',
                    cellphone:'cellPhone'
                    }||selectArgus,
            errorArgus = {
                    require:   'requireMsg',
                    email:       'emailMsg',
                    cellphone:'cellPhoneMsg'
            }||errorArgus,
            msgLang={
                    require:     '此项为必填！',
                    email:       '邮箱格式不正确！',
                    cellphone:   '手机号码格式不正确！'
                    }||msgLang,
            $inputs=$form.find('input');
        //console.log($inputs);
        $inputs.each(function(index){
            $inputs.eq(index).focusin(function(){
                console.log('focusin');
                if($inputs.eq(index).hasClass(selectArgus.email)){
                    console.log('this is email');
                }
                return false;
            });
            $inputs.eq(index).focusout(function(){
                console.log('focusout');
                if($inputs.eq(index).hasClass(selectArgus.email)){
                    console.log('this is email');
                }
                return false;
            });
        });

//        switch (str_type){
//            case 'isNull':
//                $input.blur(function(){
//                    var value=$input.val();
//                    if(isNull( value )){
//                        this.ok=true;
//                    }else{
//                        this.ok=false;
//                        $msgBox.html('输入不能为空！');
//                    }
//                });
//                break;
//            case 'email':
//                $input.blur(function(){
//                    var value=$input.val();
//                    if(isEmail( value )){
//                        this.ok=true;
//                    }else{
//                        this.ok=false;
//                        $msgBox.html('请输入正确的邮箱格式！');
//                    }
//                });
//                break;
//            case 'cellPhone':
//                $input.blur(function(){
//                    var value=$input.val();
//                    if(isCellPhone( value )){
//                        this.ok=true;
//                    }else{
//                        this.ok=false;
//                        $msgBox.html('请输入正确的手机号码！');
//                    }
//                });
//                break;
//        }

        function isNull( str ){
            if ( str == "" ) return true;
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            return re.test(str);
        }

        function isEmail( str ){
            var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
            if(myReg.test(str)){
                return true;
            }else{
                return false;
            }
        }

        function isCellPhone( s ){
            var regu =/^[1][3][0-9]{9}$/;
            var re = new RegExp(regu);
            if (re.test(s)) {
                return true;
            }else{
                return false;
            }
        }
    }
};