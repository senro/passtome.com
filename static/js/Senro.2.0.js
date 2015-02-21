/**
 * Created with JetBrains WebStorm.
 * User: qiuyun
 * Date: 13-7-15
 * Time: 上午9:40
 * To change this template use File | Settings | File Templates.
 */
var Senro=function(){

};
Senro.prototype={

    constructor: Senro,

    controlPop:function(string_type,$_mask,$_pop,$_close){
        //根据叠加层和对话框的类名字，显示或隐藏登录框和叠加层
        var $loginPop = $_pop,
            $overlay = $_mask,
            $close=$_close||'',
            maskHeight = Math.max($('body').height(),$(window).height()),
            maskWidth = $(window).width(),
            dialogTop = ($(window).height() - $loginPop.height()) / 2  + $(document).scrollTop(),
            dialogLeft = (maskWidth - $loginPop.width()) / 2;
        //重置表单
        if($loginPop.find('form').length!=0){
            $loginPop.find('form')[0].reset();
        }
        if(string_type=="show"){
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

        }else if(type=="hidden"){
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

    getJson:function (url,argus,callback){
        /*argus 参数示例
        var argus={
           vars:[mobile,email],
           values:[mobile,email]
        }*/
        var aVar=[],
            URL=url+'?jsoncallback=?';
        for(var i= 0,L=argus.vars.length;i<L;i++){
            aVar[i]='&'+argus.vars[i]+'=';
            URL=URL+aVar[i]+argus.values[i];
        }
        $.getJSON(URL,callback);
        return false;
    },
    simpleSliderLR:function($_btn_l,$_btn_r,$_list,showNum){
        var $l_btn=$_btn_l,
            $r_btn=$_btn_r,
            $big_list=$_list,

            offset = $big_list.find('a').eq(1).outerWidth(true),
            left = 0,
            maxWidth = ($big_list.find('img').length - showNum) * offset;

        $l_btn.click(function(){
            visibleShow($r_btn);
            if (left === 0) {
                visibleHidden($l_btn);
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
            visibleShow($l_btn);
            if (left === -maxWidth) {
                visibleHidden($r_btn);
                return false;
            }
            left-=offset;
            $big_list.animate({
                    left:left+'px'
                }
            );
            return false;
        });

        function visibleHidden(e){
            e.css({
                visibility: "hidden"
            });
            return false;
        }
        function visibleShow(e){
            e.css({
                visibility: "visible"
            });
            return false;
        }
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
                bindSliderCube($sliderCube,currIndex,maxIndex);
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
        function visibleHidden(e){
            e.css({
               visibility: "hidden"
            });
            return false;
        }
        function visibleShow(e){
            e.css({
                visibility: "visible"
            });
            return false;
        }
    },
    sliderTab:function($_btns,$_conts,string_btn_hover,string_trigerType){
        var $btns=$_btns,
            $conts=$_conts,
            trigerType=string_trigerType||'mouseover',
            lastOne=0;
        //默认给第一个按钮加上hover,隐藏其他内容
        $btns.eq(0).addClass(string_btn_hover);
        for(var i=1;i<$conts.length;i++){
            $conts.eq(i).hide();
        }
        switch (trigerType){
            case "mouseover":
                $btns.mouseover(function(){

                    var index=$btns.index(this);
                    if(index==lastOne){
                        return false;
                    }

                    $conts.eq(lastOne).hide();
                    if($conts.eq(lastOne).find('iframe')){
                        $conts.eq(lastOne).find('iframe').hide();
                    }
                    $btns.eq(lastOne).removeClass(string_btn_hover);

                    $conts.eq(index).show();
                    if($conts.eq(lastOne).find('iframe')){
                        $conts.eq(lastOne).find('iframe').show();
                    }
                    $btns.eq(index).addClass(string_btn_hover);

                    lastOne=index;

                    return false;
                });
                break;
            case "click":
                $btns.click(function(){

                    var index=$btns.index(this);
                    if(index==lastOne){
                        return false;
                    }

                    $conts.eq(lastOne).hide();
                    if($cont.eq(lastOne).find('iframe')){
                        $cont.eq(lastOne).find('iframe').hide();
                    }
                    $btns.eq(lastOne).removeClass(string_btn_hover);

                    $conts.eq(index).show();
                    if($cont.eq(lastOne).find('iframe')){
                        $cont.eq(lastOne).find('iframe').show();
                    }
                    $btns.eq(index).addClass(string_btn_hover);

                    lastOne=index;

                    return false;
                });
                break;
        }

    return false;
    },
    setupVideos:function(containers){

        var videos = [];
        for(var i in containers){
            var curVideo = containers[i];
            videos.push(jwplayer(i).setup({
                flashplayer: 'http://static.woniu.com/script/jwplayer/player.swf',
                skin: 'http://static.woniu.com/script/jwplayer/skin/bekle.zip',
                file: curVideo.file,
                image: curVideo.image,
                width: curVideo.width || 442,
                height: curVideo.height || 331
            }));
        }
        return videos;

    },
    fixedDomPos:function($dom){
        var isIe6=false;
        if($dom.css('position')=="fixed"){
            isIe6=false;
        }else{
            isIe6=true;
        }
        if (isIe6) {
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

    }
};