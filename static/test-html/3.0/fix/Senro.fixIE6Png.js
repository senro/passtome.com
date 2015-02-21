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
        video:      "���ڳ�ʼ��Senro()ʱ����'video',����new Senro('video');���ж������������ʽ��",
        swf:        "���ڳ�ʼ��Senro()ʱ����'swf',����new Senro('swf');���ж������������ʽ��",
        login:      "���ڳ�ʼ��Senro()ʱ����'login',����new Senro('login');���ж������������ʽ��",
        register:      "���ڳ�ʼ��Senro()ʱ����'register',����new Senro('register');���ж������������ʽ��",
        iePng:      "���ڳ�ʼ��Senro()ʱ����'iePng',����new Senro('iePng');���ж������������ʽ��",
        drag:       "���ڳ�ʼ��Senro()ʱ����'drag',����new Senro('drag');���ж������������ʽ��",
        mouseWheel: "���ڳ�ʼ��Senro()ʱ����'mouseWheel',����new Senro('mouseWheel');���ж������������ʽ��",
        MSClass:    "���ڳ�ʼ��Senro()ʱ����'MSClass',����new Senro('MSClass');���ж������������ʽ��",
        animateColors:"���ڳ�ʼ��Senro()ʱ����'animateColors',����new Senro('animateColors');���ж������������ʽ��",
        cssSandpaper:"���ڳ�ʼ��Senro()ʱ����'cssSandpaper',����new Senro('cssSandpaper');���ж������������ʽ��",
        tweenLite:  "���ڳ�ʼ��Senro()ʱ����'tweenLite',����new Senro('tweenLite');���ж������������ʽ��",
        tweenMax:  "���ڳ�ʼ��Senro()ʱ����'tweenMax',����new Senro('tweenMax');���ж������������ʽ��",
        testHtml5:  "���ڳ�ʼ��Senro()ʱ����'testHtml5',����new Senro('testHtml5');���ж������������ʽ��",
        preload:  "���ڳ�ʼ��Senro()ʱ����'preload',����new Senro('preload');���ж������������ʽ��",
        mobile:  "���ڳ�ʼ��Senro()ʱ����'mobile',����new Senro('mobile');���ж������������ʽ��"
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
         * @λ�ã�  ���Ĺ��÷�����
         * @���֣�  checkRequire��
         * @���룺  ��������� ������� ���ص�����
         * @������  checkRequire( type, fun_action )
         *         type���ַ������������'video','swf','login','iePng','drag','mouseWheel','MSClass'��'animateColors','cssSandpaper','tweenMax','testHtml5','preload'
         *         fun_action���������� ������Զ��壻
         * @���ܣ�  �������������������Զ���ȡ�����������ļ�������֤���÷�������ε���ʱ�������ļ�ֻ������һ�Ρ���
         * @���أ�  �ޣ�
         * @ʵ����  /test-html/2.8/core/checkRequire.html��
         * @��Ҫ��  �ޣ�
         * @��ע��  ���ޣ�
         */
        var state=false;
        //�ж�type�����Ƿ��ʼ��
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
                //��֤�����첽ִ�У�Ҳ��ִ�лص�
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
         * @λ�ã�  ���Ĺ��÷�����
         * @���֣�  isIE6��
         * @���룺  �Ƿ���ie6�� ����
         * @������  isIE6()��
         * @���ܣ�  ����Ƿ���ie6��
         * @���أ�  true��false��boolean����
         * @ʵ����  /test-html/2.8/isIE6.html��
         * @��Ҫ��  �ޣ�
         * @��ע��  ���ޣ�
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
         * @λ�ã�  �����޸�������
         * @���֣�  fixIE6Png��
         * @���룺  �޸�ie6��png�� ��Ҫ�޸���dom���� ����
         * @������  fixIE6Png(className)
         *         className���ַ��������������Ҫ�޸���dom����,��Ҫ'.',������','��ѡ;
         * @���ܣ�  �޸�ie6��png���⣻
         * @���أ�  �ޣ�
         * @ʵ����  /test-html/3.0/fix/fixIE6Png.html��
         * @��Ҫ��  checkRequire��isIE6��
         * @��ע��  ���޸����ܵ��µ����⣺
         *         1.���޸���dom��ie6�¶�̬�ӵ������ʽ���ܼ�ʱ����
         *         2.��hover״̬��background-position�ƶ���ܿ�
         *         ��װ��
         *         "<!--[if IE 6]>
         *             <script src="http://static.woniu.com/script/iepng/iepng.js"></script>
         *             <script type="text/javascript">DD_belatedPNG.fix('.iePng');</script>
         *         <![endif]-->"��
         */
        if(senro.isIE6()){
            senro.checkRequire('iePng',function(){
                DD_belatedPNG.fix(str_className);
            });
        }
        return false;
    }//fixIE6Png end
};