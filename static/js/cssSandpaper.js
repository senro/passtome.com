
/*EventHelpers.js begin*/
/*******************************************************************************
 * This notice must be untouched at all times.
 *
 * This javascript library contains helper routines to assist with event
 * handling consinstently among browsers
 *
 * EventHelpers.js v.1.3 available at http://www.useragentman.com/
 *
 * released under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 *******************************************************************************/
var EventHelpers = new function(){
    var me = this;

    var safariTimer;
    var isSafari = /WebKit/i.test(navigator.userAgent);
    var globalEvent;

    me.init = function () {
        if (me.hasPageLoadHappened(arguments)) {
            return;
        }

        if (document.createEventObject){
            // dispatch for IE
            globalEvent = document.createEventObject();
        } else 	if (document.createEvent) {
            globalEvent = document.createEvent("HTMLEvents");
        }

        me.docIsLoaded = true;
    };

    /**
     * Adds an event to the document.  Examples of usage:
     * me.addEvent(window, "load", myFunction);
     * me.addEvent(docunent, "keydown", keyPressedFunc);
     * me.addEvent(document, "keyup", keyPressFunc);
     *
     * @author Scott Andrew - http://www.scottandrew.com/weblog/articles/cbs-events
     * @author John Resig - http://ejohn.org/projects/flexible-javascript-events/
     * @param {Object} obj - a javascript object.
     * @param {String} evType - an event to attach to the object.
     * @param {Function} fn - the function that is attached to the event.
     */
    me.addEvent = function(obj, evType, fn){

        if (obj.addEventListener) {
            obj.addEventListener(evType, fn, false);
        } else if (obj.attachEvent) {
            obj['e' + evType + fn] = fn;
            obj[evType + fn] = function(){
                obj["e" + evType + fn](self.event);
            };
            obj.attachEvent("on" + evType, obj[evType + fn]);
        }
    };


    /**
     * Removes an event that is attached to a javascript object.
     *
     * @author Scott Andrew - http://www.scottandrew.com/weblog/articles/cbs-events
     * @author John Resig - http://ejohn.org/projects/flexible-javascript-events/	 * @param {Object} obj - a javascript object.
     * @param {String} evType - an event attached to the object.
     * @param {Function} fn - the function that is called when the event fires.
     */
    me.removeEvent = function(obj, evType, fn){

        if (obj.removeEventListener) {
            obj.removeEventListener(evType, fn, false);
        } else if (obj.detachEvent) {
            try {
                obj.detachEvent("on" + evType, obj[evType + fn]);
                obj[evType + fn] = null;
                obj["e" + evType + fn] = null;
            }
            catch (ex) {
                // do nothing;
            }
        }
    };

    function removeEventAttribute(obj, beginName){
        var attributes = obj.attributes;
        for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            var name = attribute.name;
            if (name.indexOf(beginName) == 0) {
                //obj.removeAttributeNode(attribute);
                attribute.specified = false;
            }
        }
    }

    me.addScrollWheelEvent = function(obj, fn){
        if (obj.addEventListener) {
            /** DOMMouseScroll is for mozilla. */
            obj.addEventListener('DOMMouseScroll', fn, true);
        }

        /** IE/Opera. */
        if (obj.attachEvent) {
            obj.attachEvent("onmousewheel", fn);
        }

    };

    me.removeScrollWheelEvent = function(obj, fn){
        if (obj.removeEventListener) {
            /** DOMMouseScroll is for mozilla. */
            obj.removeEventListener('DOMMouseScroll', fn, true);
        }

        /** IE/Opera. */
        if (obj.detachEvent) {
            obj.detatchEvent("onmousewheel", fn);
        }

    };

    /**
     * Given a mouse event, get the mouse pointer's x-coordinate.
     *
     * @param {Object} e - a DOM Event object.
     * @return {int} - the mouse pointer's x-coordinate.
     */
    me.getMouseX = function(e){
        if (!e) {
            return;
        }
        // NS4
        if (e.pageX != null) {
            return e.pageX;
            // IE
        } else if (window.event != null && window.event.clientX != null &&
            document.body != null &&
            document.body.scrollLeft != null)
            return window.event.clientX + document.body.scrollLeft;
        // W3C
        else if (e.clientX != null)
            return e.clientX;
        else
            return null;
    };

    /**
     * Given a mouse event, get the mouse pointer's y-coordinate.
     * @param {Object} e - a DOM Event Object.
     * @return {int} - the mouse pointer's y-coordinate.
     */
    me.getMouseY = function(e){
        // NS4
        if (e.pageY != null)
            return e.pageY;
        // IE
        else if (window.event != null && window.event.clientY != null &&
            document.body != null &&
            document.body.scrollTop != null)
            return window.event.clientY + document.body.scrollTop;
        // W3C
        else if (e.clientY != null) {
            return e.clientY;
        }
    };
    /**
     * Given a mouse scroll wheel event, get the "delta" of how fast it moved.
     * @param {Object} e - a DOM Event Object.
     * @return {int} - the mouse wheel's delta.  It is greater than 0, the
     * scroll wheel was spun upwards; if less than 0, downwards.
     */
    me.getScrollWheelDelta = function(e){
        var delta = 0;
        if (!e) /* For IE. */
            e = window.event;
        if (e.wheelDelta) { /* IE/Opera. */
            delta = e.wheelDelta / 120;
            /** In Opera 9, delta differs in sign as compared to IE.
             */
            if (window.opera) {
                delta = -delta;
            }
        } else if (e.detail) { /** Mozilla case. */
            /** In Mozilla, sign of delta is different than in IE.
             * Also, delta is multiple of 3.
             */
            delta = -e.detail / 3;
        }
        return delta
    };

    /**
     * Sets a mouse move event of a document.
     *
     * @deprecated - use only if compatibility with IE4 and NS4 is necessary.  Otherwise, just
     * 		use EventHelpers.addEvent(window, 'mousemove', func) instead. Cannot be used to add
     * 		multiple mouse move event handlers.
     *
     * @param {Function} func - the function that you want a mouse event to fire.
     */
    me.addMouseEvent = function(func){

        if (document.captureEvents) {
            document.captureEvents(Event.MOUSEMOVE);
        }

        document.onmousemove = func;
        window.onmousemove = func;
        window.onmouseover = func;

    };



    /**
     * Find the HTML object that fired an Event.
     *
     * @param {Object} e - an HTML object
     * @return {Object} - the HTML object that fired the event.
     */
    me.getEventTarget = function(e){
        // first, IE method for mouse events(also supported by Safari and Opera)
        if (e.toElement) {
            return e.toElement;
            // W3C
        } else if (e.currentTarget) {
            return e.currentTarget;

            // MS way
        } else if (e.srcElement) {
            return e.srcElement;
        } else {
            return null;
        }
    };




    /**
     * Given an event fired by the keyboard, find the key associated with that event.
     *
     * @param {Object} e - an event object.
     * @return {String} - the ASCII character code representing the key associated with the event.
     */
    me.getKey = function(e){
        if (e.keyCode) {
            return e.keyCode;
        } else if (e.event && e.event.keyCode) {
            return window.event.keyCode;
        } else if (e.which) {
            return e.which;
        }
    };


    /**
     *  Will execute a function when the page's DOM has fully loaded (and before all attached images, iframes,
     *  etc., are).
     *
     *  Usage:
     *
     *  EventHelpers.addPageLoadEvent('init');
     *
     *  where the function init() has this code at the beginning:
     *
     *  function init() {
     *
     *  if (EventHelpers.hasPageLoadHappened(arguments)) return;
     *
     *	// rest of code
     *   ....
     *  }
     *
     * @author This code is based off of code from http://dean.edwards.name/weblog/2005/09/busted/ by Dean
     * Edwards, with a modification by me.
     *
     * @param {String} funcName - a string containing the function to be called.
     */
    me.addPageLoadEvent = function(funcName){

        var func = eval(funcName);

        // for Internet Explorer (using conditional comments)
        /*@cc_on @*/
        /*@if (@_win32)
         pageLoadEventArray.push(func);
         return;
         /*@end @*/
        if (isSafari) { // sniff
            pageLoadEventArray.push(func);

            if (!safariTimer) {

                safariTimer = setInterval(function(){
                    if (/loaded|complete/.test(document.readyState)) {
                        clearInterval(safariTimer);

                        /*
                         * call the onload handler
                         * func();
                         */
                        me.runPageLoadEvents();
                        return;
                    }
                    set = true;
                }, 10);
            }
            /* for Mozilla */
        } else if (document.addEventListener) {
            var x = document.addEventListener("DOMContentLoaded", func, null);

            /* Others */
        } else {
            me.addEvent(window, 'load', func);
        }
    };

    var pageLoadEventArray = new Array();

    me.runPageLoadEvents = function(e){
        if (isSafari || e.srcElement.readyState == "complete") {

            for (var i = 0; i < pageLoadEventArray.length; i++) {
                pageLoadEventArray[i]();
            }
        }
    };
    /**
     * Determines if either addPageLoadEvent('funcName') or addEvent(window, 'load', funcName)
     * has been executed.
     *
     * @see addPageLoadEvent
     * @param {Function} funcArgs - the arguments of the containing. function
     */
    me.hasPageLoadHappened = function(funcArgs){
        // If the function already been called, return true;
        if (funcArgs.callee.done)
            return true;

        // flag this function so we don't do the same thing twice
        funcArgs.callee.done = true;
    };



    /**
     * Used in an event method/function to indicate that the default behaviour of the event
     * should *not* happen.
     *
     * @param {Object} e - an event object.
     * @return {Boolean} - always false
     */
    me.preventDefault = function(e){

        if (e.preventDefault) {
            e.preventDefault();
        }

        try {
            e.returnValue = false;
        }
        catch (ex) {
            // do nothing
        }

    };

    me.cancelBubble = function(e){
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        try {
            e.cancelBubble = true;
        }
        catch (ex) {
            // do nothing
        }
    };

    /*
     * Fires an event manually.
     * @author Scott Andrew - http://www.scottandrew.com/weblog/articles/cbs-events
     * @author John Resig - http://ejohn.org/projects/flexible-javascript-events/	 * @param {Object} obj - a javascript object.
     * @param {String} evType - an event attached to the object.
     * @param {Function} fn - the function that is called when the event fires.
     *
     */
    me.fireEvent = function (element,event, options){

        if(!element) {
            return;
        }

        if (document.createEventObject){
            /*
             var stack = DebugHelpers.getStackTrace();
             var s = stack.toString();
             jslog.debug(s);
             if (s.indexOf('fireEvent') >= 0) {
             return;
             }
             */
            return element.fireEvent('on' + event, globalEvent);
            jslog.debug('ss');

        }
        else{
            // dispatch for firefox + others
            globalEvent.initEvent(event, true, true); // event type,bubbling,cancelable
            return !element.dispatchEvent(globalEvent);
        }
    };

    /* EventHelpers.init () */
    function init(){
        // Conditional comment alert: Do not remove comments.  Leave intact.
        // The detection if the page is secure or not is important. If
        // this logic is removed, Internet Explorer will give security
        // alerts.
        /*@cc_on @*/
        /*@if (@_win32)

         document.write('<script id="__ie_onload" defer src="' +

         ((location.protocol == 'https:') ? '//0' : 'javascript:void(0)') + '"><\/script>');

         var script = document.getElementById("__ie_onload");

         me.addEvent(script, 'readystatechange', me.runPageLoadEvents);

         /*@end @*/

    }

    init();
};

EventHelpers.addPageLoadEvent('EventHelpers.init');
/*cssQuery.js begin*/
/*
 cssQuery, version 2.0.2 (2005-08-19)
 Copyright: 2004-2005, Dean Edwards (http://dean.edwards.name/)
 License: http://creativecommons.org/licenses/LGPL/2.1/
 */
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('7 x=6(){7 1D="2.0.2";7 C=/\\s*,\\s*/;7 x=6(s,A){33{7 m=[];7 u=1z.32.2c&&!A;7 b=(A)?(A.31==22)?A:[A]:[1g];7 1E=18(s).1l(C),i;9(i=0;i<1E.y;i++){s=1y(1E[i]);8(U&&s.Z(0,3).2b("")==" *#"){s=s.Z(2);A=24([],b,s[1])}1A A=b;7 j=0,t,f,a,c="";H(j<s.y){t=s[j++];f=s[j++];c+=t+f;a="";8(s[j]=="("){H(s[j++]!=")")a+=s[j];a=a.Z(0,-1);c+="("+a+")"}A=(u&&V[c])?V[c]:21(A,t,f,a);8(u)V[c]=A}m=m.30(A)}2a x.2d;5 m}2Z(e){x.2d=e;5[]}};x.1Z=6(){5"6 x() {\\n  [1D "+1D+"]\\n}"};7 V={};x.2c=L;x.2Y=6(s){8(s){s=1y(s).2b("");2a V[s]}1A V={}};7 29={};7 19=L;x.15=6(n,s){8(19)1i("s="+1U(s));29[n]=12 s()};x.2X=6(c){5 c?1i(c):o};7 D={};7 h={};7 q={P:/\\[([\\w-]+(\\|[\\w-]+)?)\\s*(\\W?=)?\\s*([^\\]]*)\\]/};7 T=[];D[" "]=6(r,f,t,n){7 e,i,j;9(i=0;i<f.y;i++){7 s=X(f[i],t,n);9(j=0;(e=s[j]);j++){8(M(e)&&14(e,n))r.z(e)}}};D["#"]=6(r,f,i){7 e,j;9(j=0;(e=f[j]);j++)8(e.B==i)r.z(e)};D["."]=6(r,f,c){c=12 1t("(^|\\\\s)"+c+"(\\\\s|$)");7 e,i;9(i=0;(e=f[i]);i++)8(c.l(e.1V))r.z(e)};D[":"]=6(r,f,p,a){7 t=h[p],e,i;8(t)9(i=0;(e=f[i]);i++)8(t(e,a))r.z(e)};h["2W"]=6(e){7 d=Q(e);8(d.1C)9(7 i=0;i<d.1C.y;i++){8(d.1C[i]==e)5 K}};h["2V"]=6(e){};7 M=6(e){5(e&&e.1c==1&&e.1f!="!")?e:23};7 16=6(e){H(e&&(e=e.2U)&&!M(e))28;5 e};7 G=6(e){H(e&&(e=e.2T)&&!M(e))28;5 e};7 1r=6(e){5 M(e.27)||G(e.27)};7 1P=6(e){5 M(e.26)||16(e.26)};7 1o=6(e){7 c=[];e=1r(e);H(e){c.z(e);e=G(e)}5 c};7 U=K;7 1h=6(e){7 d=Q(e);5(2S d.25=="2R")?/\\.1J$/i.l(d.2Q):2P(d.25=="2O 2N")};7 Q=6(e){5 e.2M||e.1g};7 X=6(e,t){5(t=="*"&&e.1B)?e.1B:e.X(t)};7 17=6(e,t,n){8(t=="*")5 M(e);8(!14(e,n))5 L;8(!1h(e))t=t.2L();5 e.1f==t};7 14=6(e,n){5!n||(n=="*")||(e.2K==n)};7 1e=6(e){5 e.1G};6 24(r,f,B){7 m,i,j;9(i=0;i<f.y;i++){8(m=f[i].1B.2J(B)){8(m.B==B)r.z(m);1A 8(m.y!=23){9(j=0;j<m.y;j++){8(m[j].B==B)r.z(m[j])}}}}5 r};8(![].z)22.2I.z=6(){9(7 i=0;i<1z.y;i++){o[o.y]=1z[i]}5 o.y};7 N=/\\|/;6 21(A,t,f,a){8(N.l(f)){f=f.1l(N);a=f[0];f=f[1]}7 r=[];8(D[t]){D[t](r,A,f,a)}5 r};7 S=/^[^\\s>+~]/;7 20=/[\\s#.:>+~()@]|[^\\s#.:>+~()@]+/g;6 1y(s){8(S.l(s))s=" "+s;5 s.P(20)||[]};7 W=/\\s*([\\s>+~(),]|^|$)\\s*/g;7 I=/([\\s>+~,]|[^(]\\+|^)([#.:@])/g;7 18=6(s){5 s.O(W,"$1").O(I,"$1*$2")};7 1u={1Z:6(){5"\'"},P:/^(\'[^\']*\')|("[^"]*")$/,l:6(s){5 o.P.l(s)},1S:6(s){5 o.l(s)?s:o+s+o},1Y:6(s){5 o.l(s)?s.Z(1,-1):s}};7 1s=6(t){5 1u.1Y(t)};7 E=/([\\/()[\\]?{}|*+-])/g;6 R(s){5 s.O(E,"\\\\$1")};x.15("1j-2H",6(){D[">"]=6(r,f,t,n){7 e,i,j;9(i=0;i<f.y;i++){7 s=1o(f[i]);9(j=0;(e=s[j]);j++)8(17(e,t,n))r.z(e)}};D["+"]=6(r,f,t,n){9(7 i=0;i<f.y;i++){7 e=G(f[i]);8(e&&17(e,t,n))r.z(e)}};D["@"]=6(r,f,a){7 t=T[a].l;7 e,i;9(i=0;(e=f[i]);i++)8(t(e))r.z(e)};h["2G-10"]=6(e){5!16(e)};h["1x"]=6(e,c){c=12 1t("^"+c,"i");H(e&&!e.13("1x"))e=e.1n;5 e&&c.l(e.13("1x"))};q.1X=/\\\\:/g;q.1w="@";q.J={};q.O=6(m,a,n,c,v){7 k=o.1w+m;8(!T[k]){a=o.1W(a,c||"",v||"");T[k]=a;T.z(a)}5 T[k].B};q.1Q=6(s){s=s.O(o.1X,"|");7 m;H(m=s.P(o.P)){7 r=o.O(m[0],m[1],m[2],m[3],m[4]);s=s.O(o.P,r)}5 s};q.1W=6(p,t,v){7 a={};a.B=o.1w+T.y;a.2F=p;t=o.J[t];t=t?t(o.13(p),1s(v)):L;a.l=12 2E("e","5 "+t);5 a};q.13=6(n){1d(n.2D()){F"B":5"e.B";F"2C":5"e.1V";F"9":5"e.2B";F"1T":8(U){5"1U((e.2A.P(/1T=\\\\1v?([^\\\\s\\\\1v]*)\\\\1v?/)||[])[1]||\'\')"}}5"e.13(\'"+n.O(N,":")+"\')"};q.J[""]=6(a){5 a};q.J["="]=6(a,v){5 a+"=="+1u.1S(v)};q.J["~="]=6(a,v){5"/(^| )"+R(v)+"( |$)/.l("+a+")"};q.J["|="]=6(a,v){5"/^"+R(v)+"(-|$)/.l("+a+")"};7 1R=18;18=6(s){5 1R(q.1Q(s))}});x.15("1j-2z",6(){D["~"]=6(r,f,t,n){7 e,i;9(i=0;(e=f[i]);i++){H(e=G(e)){8(17(e,t,n))r.z(e)}}};h["2y"]=6(e,t){t=12 1t(R(1s(t)));5 t.l(1e(e))};h["2x"]=6(e){5 e==Q(e).1H};h["2w"]=6(e){7 n,i;9(i=0;(n=e.1F[i]);i++){8(M(n)||n.1c==3)5 L}5 K};h["1N-10"]=6(e){5!G(e)};h["2v-10"]=6(e){e=e.1n;5 1r(e)==1P(e)};h["2u"]=6(e,s){7 n=x(s,Q(e));9(7 i=0;i<n.y;i++){8(n[i]==e)5 L}5 K};h["1O-10"]=6(e,a){5 1p(e,a,16)};h["1O-1N-10"]=6(e,a){5 1p(e,a,G)};h["2t"]=6(e){5 e.B==2s.2r.Z(1)};h["1M"]=6(e){5 e.1M};h["2q"]=6(e){5 e.1q===L};h["1q"]=6(e){5 e.1q};h["1L"]=6(e){5 e.1L};q.J["^="]=6(a,v){5"/^"+R(v)+"/.l("+a+")"};q.J["$="]=6(a,v){5"/"+R(v)+"$/.l("+a+")"};q.J["*="]=6(a,v){5"/"+R(v)+"/.l("+a+")"};6 1p(e,a,t){1d(a){F"n":5 K;F"2p":a="2n";1a;F"2o":a="2n+1"}7 1m=1o(e.1n);6 1k(i){7 i=(t==G)?1m.y-i:i-1;5 1m[i]==e};8(!Y(a))5 1k(a);a=a.1l("n");7 m=1K(a[0]);7 s=1K(a[1]);8((Y(m)||m==1)&&s==0)5 K;8(m==0&&!Y(s))5 1k(s);8(Y(s))s=0;7 c=1;H(e=t(e))c++;8(Y(m)||m==1)5(t==G)?(c<=s):(s>=c);5(c%m)==s}});x.15("1j-2m",6(){U=1i("L;/*@2l@8(@\\2k)U=K@2j@*/");8(!U){X=6(e,t,n){5 n?e.2i("*",t):e.X(t)};14=6(e,n){5!n||(n=="*")||(e.2h==n)};1h=1g.1I?6(e){5/1J/i.l(Q(e).1I)}:6(e){5 Q(e).1H.1f!="2g"};1e=6(e){5 e.2f||e.1G||1b(e)};6 1b(e){7 t="",n,i;9(i=0;(n=e.1F[i]);i++){1d(n.1c){F 11:F 1:t+=1b(n);1a;F 3:t+=n.2e;1a}}5 t}}});19=K;5 x}();',62,190,'|||||return|function|var|if|for||||||||pseudoClasses||||test|||this||AttributeSelector|||||||cssQuery|length|push|fr|id||selectors||case|nextElementSibling|while||tests|true|false|thisElement||replace|match|getDocument|regEscape||attributeSelectors|isMSIE|cache||getElementsByTagName|isNaN|slice|child||new|getAttribute|compareNamespace|addModule|previousElementSibling|compareTagName|parseSelector|loaded|break|_0|nodeType|switch|getTextContent|tagName|document|isXML|eval|css|_1|split|ch|parentNode|childElements|nthChild|disabled|firstElementChild|getText|RegExp|Quote|x22|PREFIX|lang|_2|arguments|else|all|links|version|se|childNodes|innerText|documentElement|contentType|xml|parseInt|indeterminate|checked|last|nth|lastElementChild|parse|_3|add|href|String|className|create|NS_IE|remove|toString|ST|select|Array|null|_4|mimeType|lastChild|firstChild|continue|modules|delete|join|caching|error|nodeValue|textContent|HTML|prefix|getElementsByTagNameNS|end|x5fwin32|cc_on|standard||odd|even|enabled|hash|location|target|not|only|empty|root|contains|level3|outerHTML|htmlFor|class|toLowerCase|Function|name|first|level2|prototype|item|scopeName|toUpperCase|ownerDocument|Document|XML|Boolean|URL|unknown|typeof|nextSibling|previousSibling|visited|link|valueOf|clearCache|catch|concat|constructor|callee|try'.split('|'),0,{}))
/*sylvester.js begin*/
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('9 17={3i:\'0.1.3\',16:1e-6};l v(){}v.23={e:l(i){8(i<1||i>7.4.q)?w:7.4[i-1]},2R:l(){8 7.4.q},1u:l(){8 F.1x(7.2u(7))},24:l(a){9 n=7.4.q;9 V=a.4||a;o(n!=V.q){8 1L}J{o(F.13(7.4[n-1]-V[n-1])>17.16){8 1L}}H(--n);8 2x},1q:l(){8 v.u(7.4)},1b:l(a){9 b=[];7.28(l(x,i){b.19(a(x,i))});8 v.u(b)},28:l(a){9 n=7.4.q,k=n,i;J{i=k-n;a(7.4[i],i+1)}H(--n)},2q:l(){9 r=7.1u();o(r===0){8 7.1q()}8 7.1b(l(x){8 x/r})},1C:l(a){9 V=a.4||a;9 n=7.4.q,k=n,i;o(n!=V.q){8 w}9 b=0,1D=0,1F=0;7.28(l(x,i){b+=x*V[i-1];1D+=x*x;1F+=V[i-1]*V[i-1]});1D=F.1x(1D);1F=F.1x(1F);o(1D*1F===0){8 w}9 c=b/(1D*1F);o(c<-1){c=-1}o(c>1){c=1}8 F.37(c)},1m:l(a){9 b=7.1C(a);8(b===w)?w:(b<=17.16)},34:l(a){9 b=7.1C(a);8(b===w)?w:(F.13(b-F.1A)<=17.16)},2k:l(a){9 b=7.2u(a);8(b===w)?w:(F.13(b)<=17.16)},2j:l(a){9 V=a.4||a;o(7.4.q!=V.q){8 w}8 7.1b(l(x,i){8 x+V[i-1]})},2C:l(a){9 V=a.4||a;o(7.4.q!=V.q){8 w}8 7.1b(l(x,i){8 x-V[i-1]})},22:l(k){8 7.1b(l(x){8 x*k})},x:l(k){8 7.22(k)},2u:l(a){9 V=a.4||a;9 i,2g=0,n=7.4.q;o(n!=V.q){8 w}J{2g+=7.4[n-1]*V[n-1]}H(--n);8 2g},2f:l(a){9 B=a.4||a;o(7.4.q!=3||B.q!=3){8 w}9 A=7.4;8 v.u([(A[1]*B[2])-(A[2]*B[1]),(A[2]*B[0])-(A[0]*B[2]),(A[0]*B[1])-(A[1]*B[0])])},2A:l(){9 m=0,n=7.4.q,k=n,i;J{i=k-n;o(F.13(7.4[i])>F.13(m)){m=7.4[i]}}H(--n);8 m},2Z:l(x){9 a=w,n=7.4.q,k=n,i;J{i=k-n;o(a===w&&7.4[i]==x){a=i+1}}H(--n);8 a},3g:l(){8 S.2X(7.4)},2d:l(){8 7.1b(l(x){8 F.2d(x)})},2V:l(x){8 7.1b(l(y){8(F.13(y-x)<=17.16)?x:y})},1o:l(a){o(a.K){8 a.1o(7)}9 V=a.4||a;o(V.q!=7.4.q){8 w}9 b=0,2b;7.28(l(x,i){2b=x-V[i-1];b+=2b*2b});8 F.1x(b)},3a:l(a){8 a.1h(7)},2T:l(a){8 a.1h(7)},1V:l(t,a){9 V,R,x,y,z;2S(7.4.q){27 2:V=a.4||a;o(V.q!=2){8 w}R=S.1R(t).4;x=7.4[0]-V[0];y=7.4[1]-V[1];8 v.u([V[0]+R[0][0]*x+R[0][1]*y,V[1]+R[1][0]*x+R[1][1]*y]);1I;27 3:o(!a.U){8 w}9 C=a.1r(7).4;R=S.1R(t,a.U).4;x=7.4[0]-C[0];y=7.4[1]-C[1];z=7.4[2]-C[2];8 v.u([C[0]+R[0][0]*x+R[0][1]*y+R[0][2]*z,C[1]+R[1][0]*x+R[1][1]*y+R[1][2]*z,C[2]+R[2][0]*x+R[2][1]*y+R[2][2]*z]);1I;2P:8 w}},1t:l(a){o(a.K){9 P=7.4.2O();9 C=a.1r(P).4;8 v.u([C[0]+(C[0]-P[0]),C[1]+(C[1]-P[1]),C[2]+(C[2]-(P[2]||0))])}1d{9 Q=a.4||a;o(7.4.q!=Q.q){8 w}8 7.1b(l(x,i){8 Q[i-1]+(Q[i-1]-x)})}},1N:l(){9 V=7.1q();2S(V.4.q){27 3:1I;27 2:V.4.19(0);1I;2P:8 w}8 V},2n:l(){8\'[\'+7.4.2K(\', \')+\']\'},26:l(a){7.4=(a.4||a).2O();8 7}};v.u=l(a){9 V=25 v();8 V.26(a)};v.i=v.u([1,0,0]);v.j=v.u([0,1,0]);v.k=v.u([0,0,1]);v.2J=l(n){9 a=[];J{a.19(F.2F())}H(--n);8 v.u(a)};v.1j=l(n){9 a=[];J{a.19(0)}H(--n);8 v.u(a)};l S(){}S.23={e:l(i,j){o(i<1||i>7.4.q||j<1||j>7.4[0].q){8 w}8 7.4[i-1][j-1]},33:l(i){o(i>7.4.q){8 w}8 v.u(7.4[i-1])},2E:l(j){o(j>7.4[0].q){8 w}9 a=[],n=7.4.q,k=n,i;J{i=k-n;a.19(7.4[i][j-1])}H(--n);8 v.u(a)},2R:l(){8{2D:7.4.q,1p:7.4[0].q}},2D:l(){8 7.4.q},1p:l(){8 7.4[0].q},24:l(a){9 M=a.4||a;o(1g(M[0][0])==\'1f\'){M=S.u(M).4}o(7.4.q!=M.q||7.4[0].q!=M[0].q){8 1L}9 b=7.4.q,15=b,i,G,10=7.4[0].q,j;J{i=15-b;G=10;J{j=10-G;o(F.13(7.4[i][j]-M[i][j])>17.16){8 1L}}H(--G)}H(--b);8 2x},1q:l(){8 S.u(7.4)},1b:l(a){9 b=[],12=7.4.q,15=12,i,G,10=7.4[0].q,j;J{i=15-12;G=10;b[i]=[];J{j=10-G;b[i][j]=a(7.4[i][j],i+1,j+1)}H(--G)}H(--12);8 S.u(b)},2i:l(a){9 M=a.4||a;o(1g(M[0][0])==\'1f\'){M=S.u(M).4}8(7.4.q==M.q&&7.4[0].q==M[0].q)},2j:l(a){9 M=a.4||a;o(1g(M[0][0])==\'1f\'){M=S.u(M).4}o(!7.2i(M)){8 w}8 7.1b(l(x,i,j){8 x+M[i-1][j-1]})},2C:l(a){9 M=a.4||a;o(1g(M[0][0])==\'1f\'){M=S.u(M).4}o(!7.2i(M)){8 w}8 7.1b(l(x,i,j){8 x-M[i-1][j-1]})},2B:l(a){9 M=a.4||a;o(1g(M[0][0])==\'1f\'){M=S.u(M).4}8(7.4[0].q==M.q)},22:l(a){o(!a.4){8 7.1b(l(x){8 x*a})}9 b=a.1u?2x:1L;9 M=a.4||a;o(1g(M[0][0])==\'1f\'){M=S.u(M).4}o(!7.2B(M)){8 w}9 d=7.4.q,15=d,i,G,10=M[0].q,j;9 e=7.4[0].q,4=[],21,20,c;J{i=15-d;4[i]=[];G=10;J{j=10-G;21=0;20=e;J{c=e-20;21+=7.4[i][c]*M[c][j]}H(--20);4[i][j]=21}H(--G)}H(--d);9 M=S.u(4);8 b?M.2E(1):M},x:l(a){8 7.22(a)},32:l(a,b,c,d){9 e=[],12=c,i,G,j;9 f=7.4.q,1p=7.4[0].q;J{i=c-12;e[i]=[];G=d;J{j=d-G;e[i][j]=7.4[(a+i-1)%f][(b+j-1)%1p]}H(--G)}H(--12);8 S.u(e)},31:l(){9 a=7.4.q,1p=7.4[0].q;9 b=[],12=1p,i,G,j;J{i=1p-12;b[i]=[];G=a;J{j=a-G;b[i][j]=7.4[j][i]}H(--G)}H(--12);8 S.u(b)},1y:l(){8(7.4.q==7.4[0].q)},2A:l(){9 m=0,12=7.4.q,15=12,i,G,10=7.4[0].q,j;J{i=15-12;G=10;J{j=10-G;o(F.13(7.4[i][j])>F.13(m)){m=7.4[i][j]}}H(--G)}H(--12);8 m},2Z:l(x){9 a=w,12=7.4.q,15=12,i,G,10=7.4[0].q,j;J{i=15-12;G=10;J{j=10-G;o(7.4[i][j]==x){8{i:i+1,j:j+1}}}H(--G)}H(--12);8 w},30:l(){o(!7.1y){8 w}9 a=[],n=7.4.q,k=n,i;J{i=k-n;a.19(7.4[i][i])}H(--n);8 v.u(a)},1K:l(){9 M=7.1q(),1c;9 n=7.4.q,k=n,i,1s,1n=7.4[0].q,p;J{i=k-n;o(M.4[i][i]==0){2e(j=i+1;j<k;j++){o(M.4[j][i]!=0){1c=[];1s=1n;J{p=1n-1s;1c.19(M.4[i][p]+M.4[j][p])}H(--1s);M.4[i]=1c;1I}}}o(M.4[i][i]!=0){2e(j=i+1;j<k;j++){9 a=M.4[j][i]/M.4[i][i];1c=[];1s=1n;J{p=1n-1s;1c.19(p<=i?0:M.4[j][p]-M.4[i][p]*a)}H(--1s);M.4[j]=1c}}}H(--n);8 M},3h:l(){8 7.1K()},2z:l(){o(!7.1y()){8 w}9 M=7.1K();9 a=M.4[0][0],n=M.4.q-1,k=n,i;J{i=k-n+1;a=a*M.4[i][i]}H(--n);8 a},3f:l(){8 7.2z()},2y:l(){8(7.1y()&&7.2z()===0)},2Y:l(){o(!7.1y()){8 w}9 a=7.4[0][0],n=7.4.q-1,k=n,i;J{i=k-n+1;a+=7.4[i][i]}H(--n);8 a},3e:l(){8 7.2Y()},1Y:l(){9 M=7.1K(),1Y=0;9 a=7.4.q,15=a,i,G,10=7.4[0].q,j;J{i=15-a;G=10;J{j=10-G;o(F.13(M.4[i][j])>17.16){1Y++;1I}}H(--G)}H(--a);8 1Y},3d:l(){8 7.1Y()},2W:l(a){9 M=a.4||a;o(1g(M[0][0])==\'1f\'){M=S.u(M).4}9 T=7.1q(),1p=T.4[0].q;9 b=T.4.q,15=b,i,G,10=M[0].q,j;o(b!=M.q){8 w}J{i=15-b;G=10;J{j=10-G;T.4[i][1p+j]=M[i][j]}H(--G)}H(--b);8 T},2w:l(){o(!7.1y()||7.2y()){8 w}9 a=7.4.q,15=a,i,j;9 M=7.2W(S.I(a)).1K();9 b,1n=M.4[0].q,p,1c,2v;9 c=[],2c;J{i=a-1;1c=[];b=1n;c[i]=[];2v=M.4[i][i];J{p=1n-b;2c=M.4[i][p]/2v;1c.19(2c);o(p>=15){c[i].19(2c)}}H(--b);M.4[i]=1c;2e(j=0;j<i;j++){1c=[];b=1n;J{p=1n-b;1c.19(M.4[j][p]-M.4[i][p]*M.4[j][i])}H(--b);M.4[j]=1c}}H(--a);8 S.u(c)},3c:l(){8 7.2w()},2d:l(){8 7.1b(l(x){8 F.2d(x)})},2V:l(x){8 7.1b(l(p){8(F.13(p-x)<=17.16)?x:p})},2n:l(){9 a=[];9 n=7.4.q,k=n,i;J{i=k-n;a.19(v.u(7.4[i]).2n())}H(--n);8 a.2K(\'\\n\')},26:l(a){9 i,4=a.4||a;o(1g(4[0][0])!=\'1f\'){9 b=4.q,15=b,G,10,j;7.4=[];J{i=15-b;G=4[i].q;10=G;7.4[i]=[];J{j=10-G;7.4[i][j]=4[i][j]}H(--G)}H(--b);8 7}9 n=4.q,k=n;7.4=[];J{i=k-n;7.4.19([4[i]])}H(--n);8 7}};S.u=l(a){9 M=25 S();8 M.26(a)};S.I=l(n){9 a=[],k=n,i,G,j;J{i=k-n;a[i]=[];G=k;J{j=k-G;a[i][j]=(i==j)?1:0}H(--G)}H(--n);8 S.u(a)};S.2X=l(a){9 n=a.q,k=n,i;9 M=S.I(n);J{i=k-n;M.4[i][i]=a[i]}H(--n);8 M};S.1R=l(b,a){o(!a){8 S.u([[F.1H(b),-F.1G(b)],[F.1G(b),F.1H(b)]])}9 d=a.1q();o(d.4.q!=3){8 w}9 e=d.1u();9 x=d.4[0]/e,y=d.4[1]/e,z=d.4[2]/e;9 s=F.1G(b),c=F.1H(b),t=1-c;8 S.u([[t*x*x+c,t*x*y-s*z,t*x*z+s*y],[t*x*y+s*z,t*y*y+c,t*y*z-s*x],[t*x*z-s*y,t*y*z+s*x,t*z*z+c]])};S.3b=l(t){9 c=F.1H(t),s=F.1G(t);8 S.u([[1,0,0],[0,c,-s],[0,s,c]])};S.39=l(t){9 c=F.1H(t),s=F.1G(t);8 S.u([[c,0,s],[0,1,0],[-s,0,c]])};S.38=l(t){9 c=F.1H(t),s=F.1G(t);8 S.u([[c,-s,0],[s,c,0],[0,0,1]])};S.2J=l(n,m){8 S.1j(n,m).1b(l(){8 F.2F()})};S.1j=l(n,m){9 a=[],12=n,i,G,j;J{i=n-12;a[i]=[];G=m;J{j=m-G;a[i][j]=0}H(--G)}H(--12);8 S.u(a)};l 14(){}14.23={24:l(a){8(7.1m(a)&&7.1h(a.K))},1q:l(){8 14.u(7.K,7.U)},2U:l(a){9 V=a.4||a;8 14.u([7.K.4[0]+V[0],7.K.4[1]+V[1],7.K.4[2]+(V[2]||0)],7.U)},1m:l(a){o(a.W){8 a.1m(7)}9 b=7.U.1C(a.U);8(F.13(b)<=17.16||F.13(b-F.1A)<=17.16)},1o:l(a){o(a.W){8 a.1o(7)}o(a.U){o(7.1m(a)){8 7.1o(a.K)}9 N=7.U.2f(a.U).2q().4;9 A=7.K.4,B=a.K.4;8 F.13((A[0]-B[0])*N[0]+(A[1]-B[1])*N[1]+(A[2]-B[2])*N[2])}1d{9 P=a.4||a;9 A=7.K.4,D=7.U.4;9 b=P[0]-A[0],2a=P[1]-A[1],29=(P[2]||0)-A[2];9 c=F.1x(b*b+2a*2a+29*29);o(c===0)8 0;9 d=(b*D[0]+2a*D[1]+29*D[2])/c;9 e=1-d*d;8 F.13(c*F.1x(e<0?0:e))}},1h:l(a){9 b=7.1o(a);8(b!==w&&b<=17.16)},2T:l(a){8 a.1h(7)},1v:l(a){o(a.W){8 a.1v(7)}8(!7.1m(a)&&7.1o(a)<=17.16)},1U:l(a){o(a.W){8 a.1U(7)}o(!7.1v(a)){8 w}9 P=7.K.4,X=7.U.4,Q=a.K.4,Y=a.U.4;9 b=X[0],1z=X[1],1B=X[2],1T=Y[0],1S=Y[1],1M=Y[2];9 c=P[0]-Q[0],2s=P[1]-Q[1],2r=P[2]-Q[2];9 d=-b*c-1z*2s-1B*2r;9 e=1T*c+1S*2s+1M*2r;9 f=b*b+1z*1z+1B*1B;9 g=1T*1T+1S*1S+1M*1M;9 h=b*1T+1z*1S+1B*1M;9 k=(d*g/f+h*e)/(g-h*h);8 v.u([P[0]+k*b,P[1]+k*1z,P[2]+k*1B])},1r:l(a){o(a.U){o(7.1v(a)){8 7.1U(a)}o(7.1m(a)){8 w}9 D=7.U.4,E=a.U.4;9 b=D[0],1l=D[1],1k=D[2],1P=E[0],1O=E[1],1Q=E[2];9 x=(1k*1P-b*1Q),y=(b*1O-1l*1P),z=(1l*1Q-1k*1O);9 N=v.u([x*1Q-y*1O,y*1P-z*1Q,z*1O-x*1P]);9 P=11.u(a.K,N);8 P.1U(7)}1d{9 P=a.4||a;o(7.1h(P)){8 v.u(P)}9 A=7.K.4,D=7.U.4;9 b=D[0],1l=D[1],1k=D[2],1w=A[0],18=A[1],1a=A[2];9 x=b*(P[1]-18)-1l*(P[0]-1w),y=1l*((P[2]||0)-1a)-1k*(P[1]-18),z=1k*(P[0]-1w)-b*((P[2]||0)-1a);9 V=v.u([1l*x-1k*z,1k*y-b*x,b*z-1l*y]);9 k=7.1o(P)/V.1u();8 v.u([P[0]+V.4[0]*k,P[1]+V.4[1]*k,(P[2]||0)+V.4[2]*k])}},1V:l(t,a){o(1g(a.U)==\'1f\'){a=14.u(a.1N(),v.k)}9 R=S.1R(t,a.U).4;9 C=a.1r(7.K).4;9 A=7.K.4,D=7.U.4;9 b=C[0],1E=C[1],1J=C[2],1w=A[0],18=A[1],1a=A[2];9 x=1w-b,y=18-1E,z=1a-1J;8 14.u([b+R[0][0]*x+R[0][1]*y+R[0][2]*z,1E+R[1][0]*x+R[1][1]*y+R[1][2]*z,1J+R[2][0]*x+R[2][1]*y+R[2][2]*z],[R[0][0]*D[0]+R[0][1]*D[1]+R[0][2]*D[2],R[1][0]*D[0]+R[1][1]*D[1]+R[1][2]*D[2],R[2][0]*D[0]+R[2][1]*D[1]+R[2][2]*D[2]])},1t:l(a){o(a.W){9 A=7.K.4,D=7.U.4;9 b=A[0],18=A[1],1a=A[2],2N=D[0],1l=D[1],1k=D[2];9 c=7.K.1t(a).4;9 d=b+2N,2h=18+1l,2o=1a+1k;9 Q=a.1r([d,2h,2o]).4;9 e=[Q[0]+(Q[0]-d)-c[0],Q[1]+(Q[1]-2h)-c[1],Q[2]+(Q[2]-2o)-c[2]];8 14.u(c,e)}1d o(a.U){8 7.1V(F.1A,a)}1d{9 P=a.4||a;8 14.u(7.K.1t([P[0],P[1],(P[2]||0)]),7.U)}},1Z:l(a,b){a=v.u(a);b=v.u(b);o(a.4.q==2){a.4.19(0)}o(b.4.q==2){b.4.19(0)}o(a.4.q>3||b.4.q>3){8 w}9 c=b.1u();o(c===0){8 w}7.K=a;7.U=v.u([b.4[0]/c,b.4[1]/c,b.4[2]/c]);8 7}};14.u=l(a,b){9 L=25 14();8 L.1Z(a,b)};14.X=14.u(v.1j(3),v.i);14.Y=14.u(v.1j(3),v.j);14.Z=14.u(v.1j(3),v.k);l 11(){}11.23={24:l(a){8(7.1h(a.K)&&7.1m(a))},1q:l(){8 11.u(7.K,7.W)},2U:l(a){9 V=a.4||a;8 11.u([7.K.4[0]+V[0],7.K.4[1]+V[1],7.K.4[2]+(V[2]||0)],7.W)},1m:l(a){9 b;o(a.W){b=7.W.1C(a.W);8(F.13(b)<=17.16||F.13(F.1A-b)<=17.16)}1d o(a.U){8 7.W.2k(a.U)}8 w},2k:l(a){9 b=7.W.1C(a.W);8(F.13(F.1A/2-b)<=17.16)},1o:l(a){o(7.1v(a)||7.1h(a)){8 0}o(a.K){9 A=7.K.4,B=a.K.4,N=7.W.4;8 F.13((A[0]-B[0])*N[0]+(A[1]-B[1])*N[1]+(A[2]-B[2])*N[2])}1d{9 P=a.4||a;9 A=7.K.4,N=7.W.4;8 F.13((A[0]-P[0])*N[0]+(A[1]-P[1])*N[1]+(A[2]-(P[2]||0))*N[2])}},1h:l(a){o(a.W){8 w}o(a.U){8(7.1h(a.K)&&7.1h(a.K.2j(a.U)))}1d{9 P=a.4||a;9 A=7.K.4,N=7.W.4;9 b=F.13(N[0]*(A[0]-P[0])+N[1]*(A[1]-P[1])+N[2]*(A[2]-(P[2]||0)));8(b<=17.16)}},1v:l(a){o(1g(a.U)==\'1f\'&&1g(a.W)==\'1f\'){8 w}8!7.1m(a)},1U:l(a){o(!7.1v(a)){8 w}o(a.U){9 A=a.K.4,D=a.U.4,P=7.K.4,N=7.W.4;9 b=(N[0]*(P[0]-A[0])+N[1]*(P[1]-A[1])+N[2]*(P[2]-A[2]))/(N[0]*D[0]+N[1]*D[1]+N[2]*D[2]);8 v.u([A[0]+D[0]*b,A[1]+D[1]*b,A[2]+D[2]*b])}1d o(a.W){9 c=7.W.2f(a.W).2q();9 N=7.W.4,A=7.K.4,O=a.W.4,B=a.K.4;9 d=S.1j(2,2),i=0;H(d.2y()){i++;d=S.u([[N[i%3],N[(i+1)%3]],[O[i%3],O[(i+1)%3]]])}9 e=d.2w().4;9 x=N[0]*A[0]+N[1]*A[1]+N[2]*A[2];9 y=O[0]*B[0]+O[1]*B[1]+O[2]*B[2];9 f=[e[0][0]*x+e[0][1]*y,e[1][0]*x+e[1][1]*y];9 g=[];2e(9 j=1;j<=3;j++){g.19((i==j)?0:f[(j+(5-i)%3)%3])}8 14.u(g,c)}},1r:l(a){9 P=a.4||a;9 A=7.K.4,N=7.W.4;9 b=(A[0]-P[0])*N[0]+(A[1]-P[1])*N[1]+(A[2]-(P[2]||0))*N[2];8 v.u([P[0]+N[0]*b,P[1]+N[1]*b,(P[2]||0)+N[2]*b])},1V:l(t,a){9 R=S.1R(t,a.U).4;9 C=a.1r(7.K).4;9 A=7.K.4,N=7.W.4;9 b=C[0],1E=C[1],1J=C[2],1w=A[0],18=A[1],1a=A[2];9 x=1w-b,y=18-1E,z=1a-1J;8 11.u([b+R[0][0]*x+R[0][1]*y+R[0][2]*z,1E+R[1][0]*x+R[1][1]*y+R[1][2]*z,1J+R[2][0]*x+R[2][1]*y+R[2][2]*z],[R[0][0]*N[0]+R[0][1]*N[1]+R[0][2]*N[2],R[1][0]*N[0]+R[1][1]*N[1]+R[1][2]*N[2],R[2][0]*N[0]+R[2][1]*N[1]+R[2][2]*N[2]])},1t:l(a){o(a.W){9 A=7.K.4,N=7.W.4;9 b=A[0],18=A[1],1a=A[2],2M=N[0],2L=N[1],2Q=N[2];9 c=7.K.1t(a).4;9 d=b+2M,2p=18+2L,2m=1a+2Q;9 Q=a.1r([d,2p,2m]).4;9 e=[Q[0]+(Q[0]-d)-c[0],Q[1]+(Q[1]-2p)-c[1],Q[2]+(Q[2]-2m)-c[2]];8 11.u(c,e)}1d o(a.U){8 7.1V(F.1A,a)}1d{9 P=a.4||a;8 11.u(7.K.1t([P[0],P[1],(P[2]||0)]),7.W)}},1Z:l(a,b,c){a=v.u(a);a=a.1N();o(a===w){8 w}b=v.u(b);b=b.1N();o(b===w){8 w}o(1g(c)==\'1f\'){c=w}1d{c=v.u(c);c=c.1N();o(c===w){8 w}}9 d=a.4[0],18=a.4[1],1a=a.4[2];9 e=b.4[0],1W=b.4[1],1X=b.4[2];9 f,1i;o(c!==w){9 g=c.4[0],2l=c.4[1],2t=c.4[2];f=v.u([(1W-18)*(2t-1a)-(1X-1a)*(2l-18),(1X-1a)*(g-d)-(e-d)*(2t-1a),(e-d)*(2l-18)-(1W-18)*(g-d)]);1i=f.1u();o(1i===0){8 w}f=v.u([f.4[0]/1i,f.4[1]/1i,f.4[2]/1i])}1d{1i=F.1x(e*e+1W*1W+1X*1X);o(1i===0){8 w}f=v.u([b.4[0]/1i,b.4[1]/1i,b.4[2]/1i])}7.K=a;7.W=f;8 7}};11.u=l(a,b,c){9 P=25 11();8 P.1Z(a,b,c)};11.2I=11.u(v.1j(3),v.k);11.2H=11.u(v.1j(3),v.i);11.2G=11.u(v.1j(3),v.j);11.36=11.2I;11.35=11.2H;11.3j=11.2G;9 $V=v.u;9 $M=S.u;9 $L=14.u;9 $P=11.u;',62,206,'||||elements|||this|return|var||||||||||||function|||if||length||||create|Vector|null|||||||||Math|nj|while||do|anchor||||||||Matrix||direction||normal||||kj|Plane|ni|abs|Line|ki|precision|Sylvester|A2|push|A3|map|els|else||undefined|typeof|contains|mod|Zero|D3|D2|isParallelTo|kp|distanceFrom|cols|dup|pointClosestTo|np|reflectionIn|modulus|intersects|A1|sqrt|isSquare|X2|PI|X3|angleFrom|mod1|C2|mod2|sin|cos|break|C3|toRightTriangular|false|Y3|to3D|E2|E1|E3|Rotation|Y2|Y1|intersectionWith|rotate|v12|v13|rank|setVectors|nc|sum|multiply|prototype|eql|new|setElements|case|each|PA3|PA2|part|new_element|round|for|cross|product|AD2|isSameSizeAs|add|isPerpendicularTo|v22|AN3|inspect|AD3|AN2|toUnitVector|PsubQ3|PsubQ2|v23|dot|divisor|inverse|true|isSingular|determinant|max|canMultiplyFromLeft|subtract|rows|col|random|ZX|YZ|XY|Random|join|N2|N1|D1|slice|default|N3|dimensions|switch|liesIn|translate|snapTo|augment|Diagonal|trace|indexOf|diagonal|transpose|minor|row|isAntiparallelTo|ZY|YX|acos|RotationZ|RotationY|liesOn|RotationX|inv|rk|tr|det|toDiagonalMatrix|toUpperTriangular|version|XZ'.split('|'),0,{}))

/*CSSSandpaper.js begin*/
/*******************************************************************************
 * This notice must be untouched at all times.
 *
 * CSS Sandpaper: smooths out differences between CSS implementations.
 *
 * This javascript library contains routines to implement the CSS transform,
 * box-shadow and gradient in IE.  It also provides a common syntax for other
 * browsers that support vendor-specific methods.
 *
 * Written by: Zoltan Hawryluk. Version 1.0 beta 1 completed on March 8, 2010.
 * Version 1.5 completed June 20, 2011.
 *
 * Some routines are based on code from CSS Gradients via Canvas v1.2
 *   by Weston Ruter <http://weston.ruter.net/projects/css-gradients-via-canvas/>
 * Includes code from Kazumasa Hasegawa's textshadow.js <http://asamuzak.jp/html/322>
 *   to implement text-shadows in IE.
 * 
 * Requires sylvester.js by James Coglan to implement CSS3 transforms:
 *    http://sylvester.jcoglan.com/
 *
 * cssSandpaper.js v.1.5 available at http://www.useragentman.com/
 *
 * released under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 ******************************************************************************/
if (!document.querySelectorAll) {
    document.querySelectorAll = cssQuery;
}

var cssSandpaper = new function(){
    var me = this;
    
    var styleNodes, styleSheets = new Array();
    
    var ruleSetRe = /[^\{]*{[^\}]*}/g;
    var ruleSplitRe = /[\{\}]/g;
    
    var reGradient = /gradient\([\s\S]*\)/g;
    var reHSL = /hsl\([\s\S]*\)/g;
    
    // This regexp from the article 
    // http://james.padolsey.com/javascript/javascript-comment-removal-revisted/
    var reMultiLineComment = /\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g;
    
    var reAtRule = /@[^\{\};]*;|@[^\{\};]*\{[^\}]*\}/g;
    
    var reFunctionSpaces = /\(\s*/g
    var reMatrixFunc = /matrix\(([^\,]+),([^\,]+),([^\,]+),([^\,]+),([^\,]+),([^\,]+)\)/g
    
    
    var ruleLists = new Array();
    var styleNode;
    
    var tempObj;
    var body;
    
    
    me.init = function(reinit){
   
        if (EventHelpers.hasPageLoadHappened(arguments) && !reinit) {
            return;
        }
		
        body = document.body;
        
        tempObj = document.createElement('div');
        
        getStyleSheets();
        
        indexRules();
        
	setChromaOverrides();
	fixTransforms();
	
	if (window.textShadowForMSIE) {
		fixTextShadows();
	}
        
        fixBoxShadow();
        fixLinearGradients();
        
        fixBackgrounds();
       	fixColors();
        fixOpacity();
        setClasses();
        //fixBorderRadius();
    
    }
	
	function setChromaOverrides() {
		 var rules = getRuleList('-sand-chroma-override').values;
        
         for (var i in rules) {
            var rule = rules[i];
            var nodes = document.querySelectorAll(rule.selector);
            
            for (var j = 0; j < nodes.length; j++) {
				DOMHelpers.setDatasetItem(nodes[j], 'cssSandpaper-chroma', new RGBColor(rule.value).toHex())
            }
            
        }
	}
    
    me.setOpacity = function(obj, value){
        var property = CSS3Helpers.findProperty(document.body, 'opacity');
        
        if (property == "filter") {
            // IE must have layout, see 
            // http://jszen.blogspot.com/2005/04/ie6-opacity-filter-caveat.html
            // for details.
            obj.style.zoom = "100%";
            
            var filter = CSS3Helpers.addFilter(obj, 'DXImageTransform.Microsoft.Alpha', StringHelpers.sprintf("opacity=%d", ((value) * 100)));
            
            filter.opacity = value * 100;
            
            
        } else if (obj.style[property] != null) {
            obj.style[property] = value;
        }
    }
    
    
    function fixOpacity(){
    
        var transformRules = getRuleList('opacity').values;
        
        for (var i in transformRules) {
            var rule = transformRules[i];
            var nodes = document.querySelectorAll(rule.selector);
            
            for (var j = 0; j < nodes.length; j++) {
                me.setOpacity(nodes[j], rule.value)
            }
            
        }
        
    }
	
	
    
    
    
    me.setTransform = function(obj, transformString){
        var property = CSS3Helpers.findProperty(obj, 'transform');
        
        if (property == "filter") {
            var matrix = CSS3Helpers.getTransformationMatrix(transformString);
            CSS3Helpers.setMatrixFilter(obj, matrix)
        } else if (obj.style[property] != null) {
			/*
			 * Firefox likes the matrix notation to be like this: 
			 *   matrix(4.758, -0.016, -0.143, 1.459, -7.058px, 85.081px);
			 * All others like this:
			 *   matrix(4.758, -0.016, -0.143, 1.459, -7.058, 85.081);
			 * (Note the missing px strings at the end of the last two parameters)
			 */ 
			
			
			
			var agentTransformString = transformString;
			if (property == "MozTransform") {
				agentTransformString = agentTransformString.replace(reMatrixFunc, 'matrix($1, $2, $3, $4, $5px, $6px)');
			}
            obj.style[property] = agentTransformString;
        }
    }
    
    function fixTransforms(){
    
        var transformRules = getRuleList('-sand-transform').values;
        var property = CSS3Helpers.findProperty(document.body, 'transform');
        
        
        for (var i in transformRules) {
            var rule = transformRules[i];
            var nodes = document.querySelectorAll(rule.selector);
            
            for (var j = 0; j < nodes.length; j++) {
                me.setTransform(nodes[j], rule.value)
            }
            
        }
        
    }
	
	function fixTextShadows() {
		var rules = getRuleList('text-shadow').values;
        var property = CSS3Helpers.findProperty(document.body, 'textShadow');
        
		if (property == 'filter' && window.textShadowForMSIE == undefined) {
			// The text-shadow library is not loaded. Bail.
			return;
		}
			
			for (var i in rules) {
				var rule = rules[i];
				
				var sels = rule.selector.split(',');
				if (property == 'filter') {
					for (var j in sels) {
						textShadowForMSIE.ieShadowSettings.push({
							sel: sels[j],
							shadow: rule.value
						});
					}
				} else {
					var nodes = document.querySelectorAll(rule.selector);
            
		            for (var j = 0; j < nodes.length; j++) {
		                nodes[j].style[property] =  rule.value;
		            }
				}
			}
		textShadowForMSIE.init()
		
	}
    
    me.setBoxShadow = function(obj, value){
        var property = CSS3Helpers.findProperty(obj, 'boxShadow');
        
        var values = CSS3Helpers.getBoxShadowValues(value);
        
        if (property == "filter") {
            var filter = CSS3Helpers.addFilter(obj, 'DXImageTransform.Microsoft.DropShadow', StringHelpers.sprintf("color=%s,offX=%d,offY=%d", values.color, values.offsetX, values.offsetY));
            filter.color = values.color;
            filter.offX = values.offsetX;
            filter.offY = values.offsetY;
            
        } else if (obj.style[property] != null) {
            obj.style[property] = value;
        }
    }
    
    function fixBoxShadow(){
    
        var transformRules = getRuleList('-sand-box-shadow').values;
        
        //var matrices = new Array();
        
        
        for (var i in transformRules) {
            var rule = transformRules[i];
            
            var nodes = document.querySelectorAll(rule.selector);
            
            
            
            for (var j = 0; j < nodes.length; j++) {
                me.setBoxShadow(nodes[j], rule.value)
                
            }
            
        }
        
    }
    
    function setGradientFilter(node, values){
    
        if (values.colorStops.length == 2 &&
        values.colorStops[0].stop == 0.0 &&
        values.colorStops[1].stop == 1.0) {
            var startColor = new RGBColor(values.colorStops[0].color);
            var endColor = new RGBColor(values.colorStops[1].color);
            
            startColor = startColor.toHex();
            endColor = endColor.toHex();
            
            var filter = CSS3Helpers.addFilter(node, 'DXImageTransform.Microsoft.Gradient', StringHelpers.sprintf("GradientType = %s, StartColorStr = '%s', EndColorStr = '%s'", values.IEdir, startColor, endColor));
            
            filter.GradientType = values.IEdir;
            filter.StartColorStr = startColor;
            filter.EndColorStr = endColor;
            node.style.zoom = 1;
        }
    }
    
    me.setGradient = function(node, value){
    
        var support = CSS3Helpers.reportGradientSupport();
        
        var values = CSS3Helpers.getGradient(value);
        
        if (values == null) {
            return;
        }
        
        if (node.filters && (support != implementation.CANVAS_WORKAROUND || CSSHelpers.isMemberOfClass(document.body, 'cssSandpaper-IEuseGradientFilter') || CSSHelpers.isMemberOfClass(node, 'cssSandpaper-IEuseGradientFilter'))) {
            setGradientFilter(node, values);
        } else if (support == implementation.MOZILLA) {
        	
            node.style.backgroundImage = StringHelpers.sprintf('-moz-gradient( %s, %s, from(%s), to(%s))', values.dirBegin, values.dirEnd, values.colorStops[0].color, values.colorStops[1].color);
        } else if (support == implementation.WEBKIT) {
            var tmp = StringHelpers.sprintf('-webkit-gradient(%s, %s, %s %s, %s %s)', values.type, values.dirBegin, values.r0 ? values.r0 + ", " : "", values.dirEnd, values.r1 ? values.r1 + ", " : "", listColorStops(values.colorStops));
            node.style.backgroundImage = tmp;
        } else if (support == implementation.CANVAS_WORKAROUND) {
            try {
                CSS3Helpers.applyCanvasGradient(node, values);
            } 
            catch (ex) {
                // do nothing (for now).
            }
        }
    }
    
    me.setRGBABackground = function(node, value){
    
        var support = CSS3Helpers.reportColorSpaceSupport('RGBA', colorType.BACKGROUND);
        
        switch (support) {
            case implementation.NATIVE:
                node.style.value = value;
                break;
            case implementation.FILTER_WORKAROUND:
                setGradientFilter(node, {
                    IEdir: 0,
                    colorStops: [{
                        stop: 0.0,
                        color: value
                    }, {
                        stop: 1.0,
                        color: value
                    }]
                });
                
                break;
        }
        
    }
    
    me.setHSLABackground = function(node, value) {
    	var support = CSS3Helpers.reportColorSpaceSupport('HSLA', colorType.BACKGROUND);
        
        switch (support) {
            case implementation.NATIVE:
                /* node.style.value = value;
                break; */
            case implementation.FILTER_WORKAROUND:
            	var rgbColor =  new RGBColor(value);
            	
            	if (rgbColor.a == 1) {
            		node.style.backgroundColor = rgbColor.toHex();
            	} else {
            		var rgba = rgbColor.toRGBA();
	                setGradientFilter(node, {
	                    IEdir: 0,
	                    colorStops: [{
	                        stop: 0.0,
	                        color: rgba
	                    }, {
	                        stop: 1.0,
	                        color: rgba
	                    }]
	                });
                }
                break;
        }
    }
    
    /**
	 * Convert a hyphenated string to camelized text.  For example, the string "font-type" will be converted
	 * to "fontType".
	 * 
	 * @param {Object} s - the string that needs to be camelized.
	 * @return {String} - the camelized text.
	 */
	me.camelize = function (s) {
		var r="";
		
		for (var i=0; i<s.length; i++) {
			if (s.substring(i, i+1) == '-') {
				i++;
				r+= s.substring(i, i+1).toUpperCase();
			} else {
				r+= s.substring(i, i+1);
			}
		}
		
		return r;
	}
    
    me.setHSLColor = function (node, property, value) {
    	var support = CSS3Helpers.reportColorSpaceSupport('HSL', colorType.FOREGROUND);
    	
    	switch (support) {
            case implementation.NATIVE:
                /* node.style.value = value;
                break; */
            case implementation.HEX_WORKAROUND:
            	
            	var hslColor = value.match(reHSL)[0];
            	var hexColor = new RGBColor(hslColor).toHex()
            	var newPropertyValue = value.replace(reHSL, hexColor);
            	
            	
            	
                node.style[me.camelize(property)] = newPropertyValue;
                
                break;
        }
    		
    }
    
    
    function fixLinearGradients(){
    
        var backgroundRules = getRuleList('background').values.concat(getRuleList('background-image').values);
        
        for (var i in backgroundRules) {
            var rule = backgroundRules[i];
            var nodes = document.querySelectorAll(rule.selector);
            for (var j = 0; j < nodes.length; j++) {
                me.setGradient(nodes[j], rule.value)
            }
        }
    }
    
    function fixBackgrounds(){
    
        var support = CSS3Helpers.reportColorSpaceSupport('RGBA', colorType.BACKGROUND);
        if (support == implementation.NATIVE) {
            return;
        } 
       
        
        var backgroundRules = getRuleList('background').values.concat(getRuleList('background-color').values);
       
        for (var i in backgroundRules) {
            var rule = backgroundRules[i];
            var nodes = document.querySelectorAll(rule.selector);
            for (var j = 0; j < nodes.length; j++) {
                if (rule.value.indexOf('rgba(') == 0) {
                    me.setRGBABackground(nodes[j], rule.value);
                } else if (rule.value.indexOf('hsla(') == 0 || rule.value.indexOf('hsl(') == 0) {
                	
                	me.setHSLABackground(nodes[j], rule.value);
                } 
            }
        }
    }
    
    me.getProperties = function (obj, objName)
	{
		var result = ""
		
		if (!obj) {
			return result;
		}
		
		for (var i in obj)
		{
			try {
				result += objName + "." + i.toString() + " = " + obj[i] + ", ";
			} catch (ex) {
				// nothing
			}
		}
		return result
	}
    
    function fixColors() {
    	var support = CSS3Helpers.reportColorSpaceSupport('HSL', colorType.FOREGROUND);
    	if (support == implementation.NATIVE) {
            return;
        } 
        
        var colorRules = getRuleList('color').values;
        
        var properties = ['color', 'border', 
        	'border-left', 	'border-right', 'border-bottom', 'border-top',
        	'border-left-color', 'border-right-color', 'border-bottom-color', 'border-top-color'];
        
        for (var i=0; i<properties.length; i++) {
        	var rules = getRuleList(properties[i]).values;
    		colorRules = colorRules.concat(rules);
       	} 
       	
        for (var i in colorRules) {
            var rule = colorRules[i];
            
            var nodes = document.querySelectorAll(rule.selector);
            for (var j = 0; j < nodes.length; j++) {
            	var isBorder = (rule.name.indexOf('border') == 0);
            	var ruleMatch = rule.value.match(reHSL);
            	
            	
                if (ruleMatch) {
                	
                	var cssProperty;
                	if (isBorder && rule.name.indexOf('-color') < 0) {
                		cssProperty = rule.name;
                	} else {
                		cssProperty = rule.name;
                	}
                	
                	me.setHSLColor(nodes[j], cssProperty, rule.value);
                			
                } 
            }
        }
    }
    
    
    
    function listColorStops(colorStops){
        var sb = new StringBuffer();
        
        for (var i = 0; i < colorStops.length; i++) {
            sb.append(StringHelpers.sprintf("color-stop(%s, %s)", colorStops[i].stop, colorStops[i].color));
            if (i < colorStops.length - 1) {
                sb.append(', ');
            }
        }
        
        return sb.toString();
    }
    
    
    function getStyleSheet(node){
        var sheetCssText;
        switch (node.nodeName.toLowerCase()) {
            case 'style':
                sheetCssText = StringHelpers.uncommentHTML(node.innerHTML); //does not work with inline styles because IE doesn't allow you to get the text content of a STYLE element
                break;
            case 'link':
                try {
	                var xhr = XMLHelpers.getXMLHttpRequest(node.href, null, "GET", null, false);
	                sheetCssText = xhr.responseText;
                } catch (ex) {
                	sheetCssText = "";
                }
                break;
        }
        
        sheetCssText = sheetCssText.replace(reMultiLineComment, '').replace(reAtRule, '');
        
        return sheetCssText;
    }
    
    function getStyleSheets(){
    
        styleNodes = document.querySelectorAll('style, link[rel="stylesheet"]');
        
        for (var i = 0; i < styleNodes.length; i++) {
            if (!CSSHelpers.isMemberOfClass(styleNodes[i], 'cssSandpaper-noIndex')) {
                styleSheets.push(getStyleSheet(styleNodes[i]))
            }
        }
    }
    
    function indexRules(){
    
        for (var i = 0; i < styleSheets.length; i++) {
            var sheet = styleSheets[i];
            
            rules = sheet.match(ruleSetRe);
            if (rules) {
                for (var j = 0; j < rules.length; j++) {
                    var parsedRule = rules[j].split(ruleSplitRe);
                    var selector = parsedRule[0].trim();
                    var propertiesStr = parsedRule[1];
                    var properties = propertiesStr.split(';');
                    for (var k = 0; k < properties.length; k++) {
                        if (properties[k].trim() != '') {
                            var splitProperty = properties[k].split(':')
                            var name = splitProperty[0].trim().toLowerCase();
                            var value = splitProperty[1];
                            if (!ruleLists[name]) {
                                ruleLists[name] = new RuleList(name);
                            }
                            
                            if (value && typeof(ruleLists[name]) == 'object') {
                                ruleLists[name].add(selector, value.trim());
                            }
                        }
                    }
                }
            }
        }
        
    }
    
    function getRuleList(name){
        var list = ruleLists[name];
        if (!list) {
            list = new RuleList(name);
        }
        return list;
    }
    
    function setClasses(){
    
    
        var htmlNode = document.getElementsByTagName('html')[0];
        var properties = ['transform', 'opacity'];
        
        for (var i = 0; i < properties.length; i++) {
            var prop = properties[i];
            if (CSS3Helpers.supports(prop)) {
                CSSHelpers.addClass(htmlNode, 'cssSandpaper-' + prop);
            }
        }
		
		// Now .. remove the initially hidden classes
		var hiddenNodes = CSSHelpers.getElementsByClassName(document, 'cssSandpaper-initiallyHidden');
		
		for (var i=0; i<hiddenNodes.length; i++){
			CSSHelpers.removeClass(hiddenNodes[i], 'cssSandpaper-initiallyHidden');
		} 
    }
	
	me.getChromaColor = function (obj) {
		var background = DOMHelpers.getDatasetItem(obj, 'cssSandpaper-chroma');
			
		if (!background) {
			background = "#808080";
		}
		return background;
	}
}

function RuleList(propertyName){
    var me = this;
    me.values = new Array();
    me.propertyName = propertyName;
    me.add = function(selector, value){
        me.values.push(new CSSRule(selector, me.propertyName, value));
    }
}

function CSSRule(selector, name, value){
    var me = this;
    me.selector = selector;
    me.name = name;
    me.value = value;
    
    me.toString = function(){
        return StringHelpers.sprintf("%s { %s: %s}", me.selector, me.name, me.value);
    }
}

if (window.$M) {
	var MatrixGenerator = new function(){
		var me = this;
		var reUnit = /[a-z]+$/;
		me.identity = $M([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
		
		
		function degreesToRadians(degrees){
			return (degrees - 360) * Math.PI / 180;
		}
		
		function getRadianScalar(angleStr){
		
			var num = parseFloat(angleStr);
			var unit = angleStr.match(reUnit);
			
			
			if (angleStr.trim() == '0') {
				num = 0;
				unit = 'rad';
			}
			
			if (unit.length != 1 || num == 0) {
				return 0;
			}
			
			
			unit = unit[0];
			
			
			var rad;
			switch (unit) {
				case "deg":
					rad = degreesToRadians(num);
					break;
				case "rad":
					rad = num;
					break;
				default:
					throw "Not an angle: " + angleStr;
			}
			return rad;
		}
		
		me.prettyPrint = function(m){
			return StringHelpers.sprintf('| %s %s %s | - | %s %s %s | - |%s %s %s|', m.e(1, 1), m.e(1, 2), m.e(1, 3), m.e(2, 1), m.e(2, 2), m.e(2, 3), m.e(3, 1), m.e(3, 2), m.e(3, 3))
		}
		
		me.rotate = function(angleStr){
			var num = getRadianScalar(angleStr);
			return Matrix.RotationZ(num);
		}
		
		me.scale = function(sx, sy){
			sx = parseFloat(sx)
			
			if (!sy) {
				sy = sx;
			}
			else {
				sy = parseFloat(sy)
			}
			
			
			return $M([[sx, 0, 0], [0, sy, 0], [0, 0, 1]]);
		}
		
		me.scaleX = function(sx){
			return me.scale(sx, 1);
		}
		
		me.scaleY = function(sy){
			return me.scale(1, sy);
		}
		
		me.skew = function(ax, ay){
			var xRad = getRadianScalar(ax);
			var yRad;
			
			if (ay != null) {
				yRad = getRadianScalar(ay)
			}
			else {
				yRad = xRad
			}
			
			if (xRad != null && yRad != null) {
			
				return $M([[1, Math.tan(xRad), 0], [Math.tan(yRad), 1, 0], [0, 0, 1]]);
			}
			else {
				return null;
			}
		}
		
		me.skewX = function(ax){
		
			return me.skew(ax, "0");
		}
		
		me.skewY = function(ay){
			return me.skew("0", ay);
		}
		
		me.translate = function(tx, ty){
		
			var TX = parseInt(tx);
			var TY = parseInt(ty)
			
			//jslog.debug(StringHelpers.sprintf('translate %f %f', TX, TY));
			
			return $M([[1, 0, TX], [0, 1, TY], [0, 0, 1]]);
		}
		
		me.translateX = function(tx){
			return me.translate(tx, 0);
		}
		
		me.translateY = function(ty){
			return me.translate(0, ty);
		}
		
		
		me.matrix = function(a, b, c, d, e, f){
		
			// for now, e and f are ignored
			return $M([[a, c, parseInt(e)], [b, d, parseInt(f)], [0, 0, 1]])
		}
	}
}

var CSS3Helpers = new function(){
    var me = this;
    
    
    var reTransformListSplitter = /[a-zA-Z]+\([^\)]*\)\s*/g;
    
    var reLeftBracket = /\(/g;
    var reRightBracket = /\)/g;
    var reComma = /,/g;
    
    var reSpaces = /\s+/g
    
    var reFilterNameSplitter = /progid:([^\(]*)/g;
    
    var reLinearGradient
    
    var canvas;
    
    var cache = new Array();
    var filterDatasetName = 'csssandpaper-filter-';
    
    me.supports = function(cssProperty){
        if (CSS3Helpers.findProperty(document.body, cssProperty) != null) {
            return true;
        } else {
            return false;
        }
    }
    
    me.getCanvas = function(){
    
        if (canvas) {
            return canvas;
        } else {
            canvas = document.createElement('canvas');
            return canvas;
        }
    }
    
    me.getTransformationMatrix = function(CSS3TransformProperty, doThrowIfError){
    
        var transforms = CSS3TransformProperty.match(reTransformListSplitter);
		
		/*
		 * Do a check here to see if there is anything in the transformation
		 * besides legit transforms
		 */
		if (doThrowIfError) {
			var checkString = transforms.join(" ").replace(/\s*/g, ' ');
			var normalizedCSSProp = CSS3TransformProperty.replace(/\s*/g, ' ');
			
			if (checkString != normalizedCSSProp) {
				throw ("An invalid transform was given.")	
			}
		}
		
		
        var resultantMatrix = MatrixGenerator.identity;
        
        for (var j = 0; j < transforms.length; j++) {
        
            var transform = transforms[j];
			
            transform = transform.replace(reLeftBracket, '("').replace(reComma, '", "').replace(reRightBracket, '")');
            
            
            try {
                var matrix = eval('MatrixGenerator.' + transform);
				
				
                //jslog.debug( transform + ': ' + MatrixGenerator.prettyPrint(matrix))
                resultantMatrix = resultantMatrix.x(matrix);
            } 
            catch (ex) {
            	
				if (doThrowIfError) {
					var method = transform.split('(')[0];

					var funcCall = transform.replace(/\"/g, '');

					if (MatrixGenerator[method]  == undefined) {
						throw "Error: invalid tranform function: " + funcCall;
					} else {
						throw "Error: Invalid or missing parameters in function call: " + funcCall;

					}
				}
                // do nothing;
            }
        }
        
        return resultantMatrix;
        
    }
    
    me.getBoxShadowValues = function(propertyValue){
        var r = new Object();
        
        var values = propertyValue.split(reSpaces);
        
        if (values[0] == 'inset') {
            r.inset = true;
            values = values.reverse().pop().reverse();
        } else {
            r.inset = false;
        }
        
        r.offsetX = parseInt(values[0]);
        r.offsetY = parseInt(values[1]);
        
        if (values.length > 3) {
            r.blurRadius = values[2];
            
            if (values.length > 4) {
                r.spreadRadius = values[3]
            }
        }
        
        r.color = values[values.length - 1];
        
        return r;
    }
    
    me.getGradient = function(propertyValue){
        var r = new Object();
        r.colorStops = new Array();
        
        
        var substring = me.getBracketedSubstring(propertyValue, '-sand-gradient');
        if (substring == undefined) {
            return null;
        }
        var parameters = substring.match(/[^\(,]+(\([^\)]*\))?[^,]*/g); //substring.split(reComma);
        r.type = parameters[0].trim();
        
        if (r.type == 'linear') {
            r.dirBegin = parameters[1].trim();
            r.dirEnd = parameters[2].trim();
            var beginCoord = r.dirBegin.split(reSpaces);
            var endCoord = r.dirEnd.split(reSpaces);
            
            for (var i = 3; i < parameters.length; i++) {
                r.colorStops.push(parseColorStop(parameters[i].trim(), i - 3));
            }
            
            
            
            
            /* The following logic only applies to IE */
            if (document.body.filters) {
                if (r.x0 == r.x1) {
                    /* IE only supports "center top", "center bottom", "top left" and "top right" */
                    
                    switch (beginCoord[1]) {
                        case 'top':
                            r.IEdir = 0;
                            break;
                        case 'bottom':
                            swapIndices(r.colorStops, 0, 1);
                            r.IEdir = 0;
                            /* r.from = parameters[4].trim();
                         r.to = parameters[3].trim(); */
                            break;
                    }
                }
                
                if (r.y0 == r.y1) {
                    switch (beginCoord[0]) {
                        case 'left':
                            r.IEdir = 1;
                            break;
                        case 'right':
                            r.IEdir = 1;
                            swapIndices(r.colorStops, 0, 1);
                            
                            break;
                    }
                }
            }
        } else {
        
            // don't even bother with IE
            if (document.body.filters) {
                return null;
            }
            
            
            r.dirBegin = parameters[1].trim();
            r.r0 = parameters[2].trim();
            
            r.dirEnd = parameters[3].trim();
            r.r1 = parameters[4].trim();
            
            var beginCoord = r.dirBegin.split(reSpaces);
            var endCoord = r.dirEnd.split(reSpaces);
            
            for (var i = 5; i < parameters.length; i++) {
                r.colorStops.push(parseColorStop(parameters[i].trim(), i - 5));
            }
            
        }
        
        
        r.x0 = beginCoord[0];
        r.y0 = beginCoord[1];
        
        r.x1 = endCoord[0];
        r.y1 = endCoord[1];
        
        return r;
    }
    
    function swapIndices(array, index1, index2){
        var tmp = array[index1];
        array[index1] = array[index2];
        array[index2] = tmp;
    }
    
    function parseColorStop(colorStop, index){
        var r = new Object();
        var substring = me.getBracketedSubstring(colorStop, 'color-stop');
        var from = me.getBracketedSubstring(colorStop, 'from');
        var to = me.getBracketedSubstring(colorStop, 'to');
        
        
        if (substring) {
            //color-stop
            var parameters = substring.split(',')
            r.stop = normalizePercentage(parameters[0].trim());
            r.color = parameters[1].trim();
        } else if (from) {
            r.stop = 0.0;
            r.color = from.trim();
        } else if (to) {
            r.stop = 1.0;
            r.color = to.trim();
        } else {
            if (index <= 1) {
                r.color = colorStop;
                if (index == 0) {
                    r.stop = 0.0;
                } else {
                    r.stop = 1.0;
                }
            } else {
                throw (StringHelpers.sprintf('invalid argument "%s"', colorStop));
            }
        }
        return r;
    }
    
    function normalizePercentage(s){
        if (s.substring(s.length - 1, s.length) == '%') {
            return parseFloat(s) / 100 + "";
        } else {
            return s;
        }
        
    }
    
    me.reportGradientSupport = function(){
    
        if (!cache["gradientSupport"]) {
            var r;
            var div = document.createElement('div');
            div.style.cssText = "background-image:-webkit-gradient(linear, 0% 0%, 0% 100%, from(red), to(blue));";
            
            if (div.style.backgroundImage) {
                r = implementation.WEBKIT;
                
            } else {
            
                /* div.style.cssText = "background-image:-moz-linear-gradient(top, blue, white 80%, orange);";
                 
                 if (div.style.backgroundImage) {
                 
                 r = implementation.MOZILLA;
                 
                 } else { */
                var canvas = CSS3Helpers.getCanvas();
                if (canvas.getContext && canvas.toDataURL) {
                    r = implementation.CANVAS_WORKAROUND;
                    
                } else {
                    r = implementation.NONE;
                }
                /* } */
            }
            
            cache["gradientSupport"] = r;
        }
        return cache["gradientSupport"];
    }
    
    me.reportColorSpaceSupport = function(colorSpace, type){
    	
        if (!cache[colorSpace + type]) {
            var r;
            var div = document.createElement('div');
            
            switch (type) {
            	
            	case colorType.BACKGROUND:
            		
		            switch(colorSpace) {
		            	case 'RGBA':
		            		div.style.cssText = "background-color: rgba(255, 32, 34, 0.5)";
		            		break;
		            	case 'HSL': 
		            		div.style.cssText = "background-color: hsl(0,0%,100%)";
		            		break;
		            	case 'HSLA': 
		            		div.style.cssText = "background-color: hsla(0,0%,100%,.5)";
		            		break;
		            	
		            	default:
		            		break;
		            }
	            
	            
	            
		            var body = document.body;
		            
		            
		            if (div.style.backgroundColor) {
		                r = implementation.NATIVE;
		                
		            } else if (body.filters && body.filters != undefined) {
		                r = implementation.FILTER_WORKAROUND;
		            } else {
		                r = implementation.NONE;
		            }
		            break;
		        case colorType.FOREGROUND:
		        	switch(colorSpace) {
		            	case 'RGBA':
		            		div.style.cssText = "color: rgba(255, 32, 34, 0.5)";
		            		break;
		            	case 'HSL': 
		            		div.style.cssText = "color: hsl(0,0%,100%)";
		            		break;
		            	case 'HSLA': 
		            		div.style.cssText = "color: hsla(0,0%,100%,.5)";
		            		break;
		            	
		            	default:
		            		break;
		            }
		           
		            if (div.style.color) {
		                r = implementation.NATIVE; 
		            } else if (colorSpace == 'HSL') {
		            
						r = implementation.HEX_WORKAROUND;
		            } else {
		                r = implementation.NONE;
		            }
		            break
	        }
           
            
            cache[colorSpace] = r;
        }
        return cache[colorSpace];
    }
    
    
    
    me.getBracketedSubstring = function(s, header){
        var gradientIndex = s.indexOf(header + '(')
        
        if (gradientIndex != -1) {
            var substring = s.substring(gradientIndex);
            
            var openBrackets = 1;
            for (var i = header.length + 1; i < 100 || i < substring.length; i++) {
                var c = substring.substring(i, i + 1);
                switch (c) {
                    case "(":
                        openBrackets++;
                        break;
                    case ")":
                        openBrackets--;
                        break;
                }
                
                if (openBrackets == 0) {
                    break;
                }
                
            }
            
            return substring.substring(gradientIndex + header.length + 1, i);
        }
        
        
    }
    
    
    me.setMatrixFilter = function(obj, matrix){
	
	
		if (!hasIETransformWorkaround(obj)) {
			addIETransformWorkaround(obj)
		}
		
		var container = obj.parentNode;
		//container.xTransform = degrees;
		
		
		filter = obj.filters.item('DXImageTransform.Microsoft.Matrix');
		//jslog.debug(MatrixGenerator.prettyPrint(matrix))
		filter.M11 = matrix.e(1, 1);
		filter.M12 = matrix.e(1, 2);
		filter.M21 = matrix.e(2, 1);
		filter.M22 = matrix.e(2, 2);
		filter = me.addFilter(obj, 
			'DXImageTransform.Microsoft.Matrix', 
			StringHelpers.sprintf("M11=%f, M12=%f, M21=%f, M22=%f, sizingMethod='auto expand'",
				matrix.e(1, 1), matrix.e(1, 2), matrix.e(2, 1), matrix.e(2, 2)));
            
		
		// Now, adjust the margins of the parent object
		var offsets = me.getIEMatrixOffsets(obj, matrix, container.xOriginalWidth, container.xOriginalHeight);
		container.style.marginLeft = offsets.x;
		container.style.marginTop = offsets.y;
		container.style.marginRight = 0;
		container.style.marginBottom = 0;
	}
	
	me.getTransformedDimensions = function (obj, matrix) {
		var r = {};
		
		if (hasIETransformWorkaround(obj)) {
			r.width = obj.offsetWidth;
			r.height = obj.offsetHeight;
		} else {
			var pts = [
				matrix.x($V([0, 0, 1]))	,
				matrix.x($V([0, obj.offsetHeight, 1])),
				matrix.x($V([obj.offsetWidth, 0, 1])),
				matrix.x($V([obj.offsetWidth, obj.offsetHeight, 1]))
			];
			var maxX = 0, maxY =0, minX=0, minY=0;
			
			for (var i = 0; i < pts.length; i++) {
				var pt = pts[i];
				var x = pt.e(1), y = pt.e(2);
				var minX = Math.min(minX, x);
				var maxX = Math.max(maxX, x);
				var minY = Math.min(minY, y);
				var maxY = Math.max(maxY, y);
			}
			
			
				r.width = maxX - minX;
				r.height = maxY - minY;
				 
		}
		
		return r;
	}
	
	me.getIEMatrixOffsets = function (obj, matrix, width, height) {
        var r = {};
		
		var originalWidth = parseFloat(width);
		var originalHeight = parseFloat(height);
		
		
        var offset;
        if (CSSHelpers.getComputedStyle(obj, 'display') == 'inline') {
            offset = 0;
        } else {
            offset = 13; // This works ... don't know why.
        }
		var transformedDimensions = me.getTransformedDimensions(obj, matrix);
        
        r.x = (((originalWidth - transformedDimensions.width) / 2) - offset + matrix.e(1, 3)) + 'px';
        r.y  = (((originalHeight - transformedDimensions.height) / 2) - offset + matrix.e(2, 3)) + 'px';
        
		return r;
    }
    
    function hasIETransformWorkaround(obj){
    
        return CSSHelpers.isMemberOfClass(obj.parentNode, 'IETransformContainer');
    }
    
    function addIETransformWorkaround(obj){
        if (!hasIETransformWorkaround(obj)) {
            var parentNode = obj.parentNode;
            var filter;
            
            // This is the container to offset the strange rotation behavior
            var container = document.createElement('div');
            CSSHelpers.addClass(container, 'IETransformContainer');
            
            
            container.style.width = obj.offsetWidth + 'px';
            container.style.height = obj.offsetHeight + 'px';
            
            container.xOriginalWidth = obj.offsetWidth;
            container.xOriginalHeight = obj.offsetHeight;
            container.style.position = 'absolute'
            container.style.zIndex = obj.currentStyle.zIndex;
            
            
            var horizPaddingFactor = 0; //parseInt(obj.currentStyle.paddingLeft); 
            var vertPaddingFactor = 0; //parseInt(obj.currentStyle.paddingTop);
            if (obj.currentStyle.display == 'block') {
                container.style.left = obj.offsetLeft + 13 - horizPaddingFactor + "px";
                container.style.top = obj.offsetTop + 13 + -vertPaddingFactor + 'px';
            } else {
                container.style.left = obj.offsetLeft + "px";
                container.style.top = obj.offsetTop + 'px';
                
            }
            //container.style.float = obj.currentStyle.float;
            
            
            obj.style.top = "auto";
            obj.style.left = "auto"
            obj.style.bottom = "auto";
            obj.style.right = "auto";
            // This is what we need in order to insert to keep the document
            // flow ok
            var replacement = obj.cloneNode(true);
            replacement.style.visibility = 'hidden';
            
            obj.replaceNode(replacement);
            
            // now, wrap container around the original node ... 
            
            obj.style.position = 'absolute';
            container.appendChild(obj);
            parentNode.insertBefore(container, replacement);
            container.style.backgroundColor = 'transparent';
            
            container.style.padding = '0';
            //var background = cssSandpaper.getChromaColor(obj);
			
			//obj.style.backgroundColor = background;
			//filter = CSS3Helpers.addFilter(obj, 'DXImageTransform.Microsoft.Chroma', StringHelpers.sprintf("color=%s", background));
            //sefilter.color = background;
            filter = me.addFilter(obj, 'DXImageTransform.Microsoft.Matrix', "M11=1, M12=0, M21=0, M22=1, sizingMethod='auto expand'")
            var bgImage = obj.currentStyle.backgroundImage.split("\"")[1];
            /*
            
             
            
             if (bgImage) {
            
             
            
             var alphaFilter = me.addFilter(obj, "DXImageTransform.Microsoft.AlphaImageLoader", "src='" + bgImage + "', sizingMethod='scale'");
            
             
            
             alert(bgImage)
            
             
            
             alphaFilter.src = bgImage;
            
             
            
             sizingMethod = 'scale';
            
             
            
             obj.style.background = 'none';
            
             
            
             obj.style.backgroundImage = 'none';
            
             
            
             }
            
             
            
             */
            
        }
        
    }
    
    me.addFilter = function(obj, filterName, filterValue){
        // now ... insert the filter so we can exploit its wonders
        	
        var filter;
        
            
       
        
        
        var comma = ", ";
        
        if (obj.filters.length == 0) {
            comma = "";
        }
        
        obj.style.filter = getPreviousFilters(obj, filterName) + StringHelpers.sprintf("progid:%s(%s)", filterName, filterValue);
        
		
		try {
			filter = obj.filters.item(filterName);
		} catch (ex) {
			return null;
		}
            
        
		// set dataset
		DOMHelpers.setDatasetItem(obj, filterDatasetName + filterName, filterValue.toLowerCase())
        return filter;
    }
	
	function getPreviousFilters(obj, exceptFilter) {
		var r = new StringBuffer();
		var dataset = DOMHelpers.getDataset(obj);
		for (var i in dataset) {
			if (i.indexOf(filterDatasetName) == 0) {
				var filterName = i.replace(filterDatasetName , "");
				if (filterName != exceptFilter.toLowerCase()) {
					r.append(StringHelpers.sprintf("progid:%s(%s) ", filterName, dataset[i]));
				}
				
			}
		}
		return r.toString();
	}
    
    
    function degreesToRadians(degrees){
        return (degrees - 360) * Math.PI / 180;
    }
    
    me.findProperty = function(obj, type){
        capType = type.capitalize();
        
       
        
        var r = cache[type]
        if (!r) {
        
        	var isTransform = (type == 'transform');
            var style = obj.style;
            
            
            var properties = [type, 'Moz' + capType, 'Webkit' + capType, 'O' + capType];
            
            if ((isTransform && !CSSHelpers.isMemberOfClass(document.body, 'cssSandpaper-noMSTransform')) || !isTransform) {
            	properties.push('ms' + capType);
            } 
            properties.push('filter');
           
            for (var i = 0; i < properties.length; i++) {
                if (style[properties[i]] != null) {
                    r = properties[i];
                    break;
                }
            }
            
            if (r == 'filter' && document.body.filters == undefined) {
                r = null;
            }
            cache[type] = r;
        }
        return r;
    }
    
    /*
     * "A point is a pair of space-separated values. The syntax supports numbers,
     *  percentages or the keywords top, bottom, left and right for point values."
     *  This keywords and percentages into pixel equivalents
     */
    me.parseCoordinate = function(value, max){
        //Convert keywords
        switch (value) {
            case 'top':
            case 'left':
                return 0;
            case 'bottom':
            case 'right':
                return max;
            case 'center':
                return max / 2;
        }
        
        //Convert percentage
        if (value.indexOf('%') != -1) 
            value = parseFloat(value.substr(0, value.length - 1)) / 100 * max;
        //Convert bare number (a pixel value)
        else 
            value = parseFloat(value);
        if (isNaN(value)) 
            throw Error("Unable to parse coordinate: " + value);
        return value;
    }
    
    me.applyCanvasGradient = function(el, gradient){
    
        var canvas = me.getCanvas();
        var computedStyle = document.defaultView.getComputedStyle(el, null);
        
        canvas.width = parseInt(computedStyle.width) + parseInt(computedStyle.paddingLeft) + parseInt(computedStyle.paddingRight) + 1; // inserted by Zoltan
        canvas.height = parseInt(computedStyle.height) + parseInt(computedStyle.paddingTop) + parseInt(computedStyle.paddingBottom) + 2; // 1 inserted by Zoltan
        var ctx = canvas.getContext('2d');
        
        //Iterate over the gradients and build them up
        
        var canvasGradient;
        // Linear gradient
        if (gradient.type == 'linear') {
        
        
            canvasGradient = ctx.createLinearGradient(me.parseCoordinate(gradient.x0, canvas.width), me.parseCoordinate(gradient.y0, canvas.height), me.parseCoordinate(gradient.x1, canvas.width), me.parseCoordinate(gradient.y1, canvas.height));
        } // Radial gradient
 else /*if(gradient.type == 'radial')*/ {
            canvasGradient = ctx.createRadialGradient(me.parseCoordinate(gradient.x0, canvas.width), me.parseCoordinate(gradient.y0, canvas.height), gradient.r0, me.parseCoordinate(gradient.x1, canvas.width), me.parseCoordinate(gradient.y1, canvas.height), gradient.r1);
        }
        
        //Add each of the color stops to the gradient
        for (var i = 0; i < gradient.colorStops.length; i++) {
            var cs = gradient.colorStops[i];
            
            canvasGradient.addColorStop(cs.stop, cs.color);
        };
        
        //Paint the gradient
        ctx.fillStyle = canvasGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        
        //Apply the gradient to the selectedElement
        el.style.backgroundImage = "url('" + canvas.toDataURL() + "')";
        
    }
    
}





var implementation = new function(){
    this.NONE = 0;
    
    // Native Support.
    this.NATIVE = 1;
    
    // Vendor specific prefix implementations
    this.MOZILLA = 2;
    this.WEBKIT = 3;
    this.IE = 4;
    this.OPERA = 5;
    
    // Non CSS3 Workarounds 
    this.CANVAS_WORKAROUND = 6;
    this.FILTER_WORKAROUND = 7;
    this.HEX_WORKAROUND = 8;
}

var colorType = new function () {
	this.BACKGROUND = 0;
	this.FOREGROUND = 1;
}

/*
 * Extra helper routines
 */
if (!window.StringHelpers) {
StringHelpers = new function(){
    var me = this;
    
    // used by the String.prototype.trim()			
    me.initWhitespaceRe = /^\s\s*/;
    me.endWhitespaceRe = /\s\s*$/;
    me.whitespaceRe = /\s/;
    
    /*******************************************************************************
     * Function sprintf(format_string,arguments...) Javascript emulation of the C
     * printf function (modifiers and argument types "p" and "n" are not supported
     * due to language restrictions)
     *
     * Copyright 2003 K&L Productions. All rights reserved
     * http://www.klproductions.com
     *
     * Terms of use: This function can be used free of charge IF this header is not
     * modified and remains with the function code.
     *
     * Legal: Use this code at your own risk. K&L Productions assumes NO
     * resposibility for anything.
     ******************************************************************************/
    me.sprintf = function(fstring){
        var pad = function(str, ch, len){
            var ps = '';
            for (var i = 0; i < Math.abs(len); i++) 
                ps += ch;
            return len > 0 ? str + ps : ps + str;
        }
        var processFlags = function(flags, width, rs, arg){
            var pn = function(flags, arg, rs){
                if (arg >= 0) {
                    if (flags.indexOf(' ') >= 0) 
                        rs = ' ' + rs;
                    else if (flags.indexOf('+') >= 0) 
                        rs = '+' + rs;
                } else 
                    rs = '-' + rs;
                return rs;
            }
            var iWidth = parseInt(width, 10);
            if (width.charAt(0) == '0') {
                var ec = 0;
                if (flags.indexOf(' ') >= 0 || flags.indexOf('+') >= 0) 
                    ec++;
                if (rs.length < (iWidth - ec)) 
                    rs = pad(rs, '0', rs.length - (iWidth - ec));
                return pn(flags, arg, rs);
            }
            rs = pn(flags, arg, rs);
            if (rs.length < iWidth) {
                if (flags.indexOf('-') < 0) 
                    rs = pad(rs, ' ', rs.length - iWidth);
                else 
                    rs = pad(rs, ' ', iWidth - rs.length);
            }
            return rs;
        }
        var converters = new Array();
        converters['c'] = function(flags, width, precision, arg){
            if (typeof(arg) == 'number') 
                return String.fromCharCode(arg);
            if (typeof(arg) == 'string') 
                return arg.charAt(0);
            return '';
        }
        converters['d'] = function(flags, width, precision, arg){
            return converters['i'](flags, width, precision, arg);
        }
        converters['u'] = function(flags, width, precision, arg){
            return converters['i'](flags, width, precision, Math.abs(arg));
        }
        converters['i'] = function(flags, width, precision, arg){
            var iPrecision = parseInt(precision);
            var rs = ((Math.abs(arg)).toString().split('.'))[0];
            if (rs.length < iPrecision) 
                rs = pad(rs, ' ', iPrecision - rs.length);
            return processFlags(flags, width, rs, arg);
        }
        converters['E'] = function(flags, width, precision, arg){
            return (converters['e'](flags, width, precision, arg)).toUpperCase();
        }
        converters['e'] = function(flags, width, precision, arg){
            iPrecision = parseInt(precision);
            if (isNaN(iPrecision)) 
                iPrecision = 6;
            rs = (Math.abs(arg)).toExponential(iPrecision);
            if (rs.indexOf('.') < 0 && flags.indexOf('#') >= 0) 
                rs = rs.replace(/^(.*)(e.*)$/, '$1.$2');
            return processFlags(flags, width, rs, arg);
        }
        converters['f'] = function(flags, width, precision, arg){
            iPrecision = parseInt(precision);
            if (isNaN(iPrecision)) 
                iPrecision = 6;
            rs = (Math.abs(arg)).toFixed(iPrecision);
            if (rs.indexOf('.') < 0 && flags.indexOf('#') >= 0) 
                rs = rs + '.';
            return processFlags(flags, width, rs, arg);
        }
        converters['G'] = function(flags, width, precision, arg){
            return (converters['g'](flags, width, precision, arg)).toUpperCase();
        }
        converters['g'] = function(flags, width, precision, arg){
            iPrecision = parseInt(precision);
            absArg = Math.abs(arg);
            rse = absArg.toExponential();
            rsf = absArg.toFixed(6);
            if (!isNaN(iPrecision)) {
                rsep = absArg.toExponential(iPrecision);
                rse = rsep.length < rse.length ? rsep : rse;
                rsfp = absArg.toFixed(iPrecision);
                rsf = rsfp.length < rsf.length ? rsfp : rsf;
            }
            if (rse.indexOf('.') < 0 && flags.indexOf('#') >= 0) 
                rse = rse.replace(/^(.*)(e.*)$/, '$1.$2');
            if (rsf.indexOf('.') < 0 && flags.indexOf('#') >= 0) 
                rsf = rsf + '.';
            rs = rse.length < rsf.length ? rse : rsf;
            return processFlags(flags, width, rs, arg);
        }
        converters['o'] = function(flags, width, precision, arg){
            var iPrecision = parseInt(precision);
            var rs = Math.round(Math.abs(arg)).toString(8);
            if (rs.length < iPrecision) 
                rs = pad(rs, ' ', iPrecision - rs.length);
            if (flags.indexOf('#') >= 0) 
                rs = '0' + rs;
            return processFlags(flags, width, rs, arg);
        }
        converters['X'] = function(flags, width, precision, arg){
            return (converters['x'](flags, width, precision, arg)).toUpperCase();
        }
        converters['x'] = function(flags, width, precision, arg){
            var iPrecision = parseInt(precision);
            arg = Math.abs(arg);
            var rs = Math.round(arg).toString(16);
            if (rs.length < iPrecision) 
                rs = pad(rs, ' ', iPrecision - rs.length);
            if (flags.indexOf('#') >= 0) 
                rs = '0x' + rs;
            return processFlags(flags, width, rs, arg);
        }
        converters['s'] = function(flags, width, precision, arg){
            var iPrecision = parseInt(precision);
            var rs = arg;
            if (rs.length > iPrecision) 
                rs = rs.substring(0, iPrecision);
            return processFlags(flags, width, rs, 0);
        }
        farr = fstring.split('%');
        retstr = farr[0];
        fpRE = /^([-+ #]*)(\d*)\.?(\d*)([cdieEfFgGosuxX])(.*)$/;
        for (var i = 1; i < farr.length; i++) {
            fps = fpRE.exec(farr[i]);
            if (!fps) 
                continue;
            if (arguments[i] != null) 
                retstr += converters[fps[4]](fps[1], fps[2], fps[3], arguments[i]);
            retstr += fps[5];
        }
        return retstr;
    }
    
    /**
     * Take out the first comment inside a block of HTML
     *
     * @param {String} s - an HTML block
     * @return {String} s - the HTML block uncommented.
     */
    me.uncommentHTML = function(s){
        if (s.indexOf('-->') != -1 && s.indexOf('<!--') != -1) {
            return s.replace("<!--", "").replace("-->", "");
        } else {
            return s;
        }
    }
}
}

if (!window.XMLHelpers) {

XMLHelpers = new function(){

    var me = this;
    
    /**
     * Wrapper for XMLHttpRequest Object.  Grabbing data (XML and/or text) from a URL.
     * Grabbing data from a URL. Input is one parameter, url. It returns a request
     * object. Based on code from
     * http://www.xml.com/pub/a/2005/02/09/xml-http-request.html.  IE caching problem
     * fix from Wikipedia article http://en.wikipedia.org/wiki/XMLHttpRequest
     *
     * @param {String} url - the URL to retrieve
     * @param {Function} processReqChange - the function/method to call at key events of the URL retrieval.
     * @param {String} method - (optional) "GET" or "POST" (default "GET")
     * @param {String} data - (optional) the CGI data to pass.  Default null.
     * @param {boolean} isAsync - (optional) is this call asyncronous.  Default true.
     *
     * @return {Object} a XML request object.
     */
    me.getXMLHttpRequest = function(url, processReqChange) //, method, data, isAsync)
    {
        var argv = me.getXMLHttpRequest.arguments;
        var argc = me.getXMLHttpRequest.arguments.length;
        var httpMethod = (argc > 2) ? argv[2] : 'GET';
        var data = (argc > 3) ? argv[3] : "";
        var isAsync = (argc > 4) ? argv[4] : true;
        
        var req;
        // branch for native XMLHttpRequest object
        if (window.XMLHttpRequest) {
            req = new XMLHttpRequest();
            // branch for IE/Windows ActiveX version
        } else if (window.ActiveXObject) {
            try {
                req = new ActiveXObject('Msxml2.XMLHTTP');
            } 
            catch (ex) {
                req = new ActiveXObject("Microsoft.XMLHTTP");
            }
            // the browser doesn't support XML HttpRequest. Return null;
        } else {
            return null;
        }
        
        if (isAsync) {
            req.onreadystatechange = processReqChange;
        }
        
        if (httpMethod == "GET" && data != "") {
            url += "?" + data;
        }
        
        req.open(httpMethod, url, isAsync);
        
        //Fixes IE Caching problem
        req.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
        req.send(data);
        
        return req;
    }
}
}


if (!window.CSSHelpers) {
CSSHelpers = new function(){
    var me = this;
    
    var blankRe = new RegExp('\\s');
    
	/*
	 * getComputedStyle: code from http://blog.stchur.com/2006/06/21/css-computed-style/
	 */
	me.getComputedStyle = function(elem, style)
	{
	  var computedStyle;
	  if (typeof elem.currentStyle != 'undefined')
	    { computedStyle = elem.currentStyle; }
	  else
	    { computedStyle = document.defaultView.getComputedStyle(elem, null); }
	
	  return computedStyle[style];
	}
	
	
    /**
     * Determines if an HTML object is a member of a specific class.
     * @param {Object} obj - an HTML object.
     * @param {Object} className - the CSS class name.
     */
    me.isMemberOfClass = function(obj, className){
    
        if (blankRe.test(className)) 
            return false;
        
        var re = new RegExp(getClassReString(className), "g");
        
        return (re.test(obj.className));
        
        
    }
    
    /**
     * Make an HTML object be a member of a certain class.
     *
     * @param {Object} obj - an HTML object
     * @param {String} className - a CSS class name.
     */
    me.addClass = function(obj, className){
        if (blankRe.test(className)) {
            return;
        }
        
        // only add class if the object is not a member of it yet.
        if (!me.isMemberOfClass(obj, className)) {
            obj.className += " " + className;
        }
    }
    
    /**
     * Make an HTML object *not* be a member of a certain class.
     *
     * @param {Object} obj - an HTML object
     * @param {Object} className - a CSS class name.
     */
    me.removeClass = function(obj, className){
    
        if (blankRe.test(className)) {
            return;
        }
        
        
        var re = new RegExp(getClassReString(className), "g");
        
        var oldClassName = obj.className;
        
        
        if (obj.className) {
            obj.className = oldClassName.replace(re, '');
        }
        
        
    }
	
	function getClassReString(className) {
		return '\\s'+className+'\\s|^' + className + '\\s|\\s' + className + '$|' + '^' + className +'$';
	}
	
	/**
	 * Given an HTML element, find all child nodes of a specific class.
	 * 
	 * With ideas from Jonathan Snook 
	 * (http://snook.ca/archives/javascript/your_favourite_1/)
	 * Since this was presented within a post on this site, it is for the 
	 * public domain according to the site's copyright statement.
	 * 
	 * @param {Object} obj - an HTML element.  If you want to search a whole document, set
	 * 		this to the document object.
	 * @param {String} className - the class name of the objects to return
	 * @return {Array} - the list of objects of class cls. 
	 */
	me.getElementsByClassName = function (obj, className)
	{
		if (obj.getElementsByClassName) {
			return DOMHelpers.nodeListToArray(obj.getElementsByClassName(className))
		}
		else {
			var a = [];
			var re = new RegExp(getClassReString(className));
			var els = DOMHelpers.getAllDescendants(obj);
			for (var i = 0, j = els.length; i < j; i++) {
				if (re.test(els[i].className)) {
					a.push(els[i]);
					
				}
			}
			return a;
		}
	}
    
    /**
     * Generates a regular expression string that can be used to detect a class name
     * in a tag's class attribute.  It is used by a few methods, so I
     * centralized it.
     *
     * @param {String} className - a name of a CSS class.
     */
    function getClassReString(className){
        return '\\s' + className + '\\s|^' + className + '\\s|\\s' + className + '$|' + '^' + className + '$';
    }
    
    
}
}


/* 
 * Adding trim method to String Object.  Ideas from
 * http://www.faqts.com/knowledge_base/view.phtml/aid/1678/fid/1 and
 * http://blog.stevenlevithan.com/archives/faster-trim-javascript
 */
String.prototype.trim = function(){
    var str = this;
    
    // The first method is faster on long strings than the second and 
    // vice-versa.
    if (this.length > 6000) {
        str = this.replace(StringHelpers.initWhitespaceRe, '');
        var i = str.length;
        while (StringHelpers.whitespaceRe.test(str.charAt(--i))) 
            ;
        return str.slice(0, i + 1);
    } else {
        return this.replace(StringHelpers.initWhitespaceRe, '').replace(StringHelpers.endWhitespaceRe, '');
    }
    
    
};

if (!window.DOMHelpers) {

	DOMHelpers = new function () {
		var me = this;
		
		/**
		 * Returns all children of an element. Needed if it is necessary to do
		 * the equivalent of getElementsByTagName('*') for IE5 for Windows.
		 * 
		 * @param {Object} e - an HTML object.
		 */
		me.getAllDescendants = function(obj) {
			return obj.all ? obj.all : obj.getElementsByTagName('*');
		}
		
		/******
		* Converts a DOM live node list to a static/dead array.  Good when you don't
		* want the thing you are iterating in a for loop changing as the DOM changes.
		* 
		* @param {Object} nodeList - a node list (like one returned by document.getElementsByTagName)
		* @return {Array} - an array of nodes.
		* 
		*******/
		me.nodeListToArray = function (nodeList) 
		{ 
		    var ary = []; 
		    for(var i=0, len = nodeList.length; i < len; i++) 
		    { 
		        ary.push(nodeList[i]); 
		    } 
		    return ary; 
		}
		
		me.getDefinedAttributes = function (obj) {
		
			var attrs = obj.attributes;
			var r = new Array();
			
			for (var i=0; i<attrs.length; i++) {
				attr = attrs[i];
				if (attr.specified) {
					r[attr.name] = attr.value;
					
				}
			}
		
			return r;
		}
		
		/**
		 * Given an HTML or XML object, find the an attribute by name.
		 * 
		 * @param {Object} obj - a DOM object.
		 * @param {String} attrName - the name of an attribute inside the DOM object.
		 * @return {Object} - the attribute object or null if there isn't one.
		 */
		me.getAttributeByName = function (obj, attrName) {
	
			var attributes = obj.attributes;
			
			try {
				return attributes.getNamedItem(attrName);
				
			} 
			catch (ex) {
				var i;
				
				for (i = 0; i < attributes.length; i++) {
					var attr = attributes[i]
					if (attr.nodeName == attrName && attr.specified) {
						return attr;
					}
				}
				return null;
			}
			
		}
		
		/**
		 * Given an HTML or XML object, find the value of an attribute.
		 * 
		 * @param {Object} obj - a DOM object.
		 * @param {String} attrName - the name of an attribute inside the DOM object.
		 * @return {String} - the value of the attribute.
		 */
		me.getAttributeValue = function (obj, attrName) {
			var attr = me.getAttributeByName(obj, attrName);
			
			if (attr != null) {
				return attr.nodeValue;
			} else {
				return obj[attrName];
			}
		}
		
		/**
		 * Given an HTML or XML object, set the value of an attribute.
		 * 
		 * @param {Object} obj - a DOM object.
		 * @param {String} attrName - the name of an attribute inside the DOM object.
		 * @param {String} attrValue - the value of the attribute.
		 */
		me.setAttributeValue = function (obj, attrName, attrValue) {
			var attr = me.getAttributeByName(obj, attrName);
			
			if (attr != null) {
				attr.nodeValue = attrValue;
			} else {
				attr = document.createAttribute(attrName);
				attr.value = attrValue;
				obj.setAttributeNode(attr)
				//obj[attrName] = attrValue;
			}
		}
		
		/*
		 * HTML5 dataset
		 */	
		me.getDataset = function (obj) {
			var r = new Array();
			
			var attributes = DOMHelpers.getDefinedAttributes(obj);
			//jslog.debug('entered')
			for (var i in attributes) {
				//var attr = attributes[i];
				
				if (i.indexOf('data-') == 0) {
					//jslog.debug('adding ' + name)
					var name = i.substring(5);
					//jslog.debug('adding ' + name)
					r[name] = attributes[i];
				}
			}
			
			//jslog.debug('dataset = ' + DebugHelpers.getProperties(r))
			return r;
		}
		
		me.getDatasetItem = function (obj, name) {
			var dataName = 'data-' + name.toLowerCase();
			var r = DOMHelpers.getAttributeValue(obj, dataName);
			
			
			if (!r) {
				r = obj[dataName];
			}
			return r;
		}
		
		me.setDatasetItem = function (obj, name, value) {
			var attrName = 'data-' + name.toLowerCase();
			
			var val = DOMHelpers.setAttributeValue(obj, attrName, value);
			
			if (DOMHelpers.getAttributeValue(obj, attrName) == null) {
				obj[attrName] = value;
				
			}
		}
	}
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/string/capitalize [v1.0]

String.prototype.capitalize = function(){ //v1.0
    return this.charAt(0).toUpperCase() + this.substr(1);
    
};


/*
 *  stringBuffer.js - ideas from
 *  http://www.multitask.com.au/people/dion/archives/000354.html
 */
function StringBuffer(){
    var me = this;
    
    var buffer = [];
    
    
    me.append = function(string){
        buffer.push(string);
        return me;
    }
    
    me.appendBuffer = function(bufferToAppend){
        buffer = buffer.concat(bufferToAppend);
    }
    
    me.toString = function(){
        return buffer.join("");
    }
    
    me.getLength = function(){
        return buffer.length;
    }
    
    me.flush = function(){
        buffer.length = 0;
    }
    
}

/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com> (with modifications)
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */
function RGBColor(color_string){

    var me = this;
    
    
    
    me.ok = false;
    
    // strip any leading #
    if (color_string.charAt(0) == '#') { // remove # if any
        color_string = color_string.substr(1, 6);
    }
    
    color_string = color_string.replace(/ /g, '');
    color_string = color_string.toLowerCase();
    
    // before getting into regexps, try simple matches
    // and overwrite the input
    var simple_colors = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '00ffff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000000',
        blanchedalmond: 'ffebcd',
        blue: '0000ff',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '00ffff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dodgerblue: '1e90ff',
        feldspar: 'd19275',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'ff00ff',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred: 'cd5c5c',
        indigo: '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslateblue: '8470ff',
        lightslategray: '778899',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '00ff00',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'ff00ff',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        red: 'ff0000',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        metle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        violetred: 'd02090',
        wheat: 'f5deb3',
        white: 'ffffff',
        whitesmoke: 'f5f5f5',
        yellow: 'ffff00',
        yellowgreen: '9acd32'
    };
    for (var key in simple_colors) {
        if (color_string == key) {
            color_string = simple_colors[key];
        }
    }
    // emd of simple type-in colors
    
    // array of color definition objects
    var color_defs = [{
        re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
        example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
        process: function(bits){
            return [parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3])];
        }
    }, {
        re: /^(\w{2})(\w{2})(\w{2})$/,
        example: ['#00ff00', '336699'],
        process: function(bits){
            return [parseInt(bits[1], 16), parseInt(bits[2], 16), parseInt(bits[3], 16)];
        }
    }, {
        re: /^(\w{1})(\w{1})(\w{1})$/,
        example: ['#fb0', 'f0f'],
        process: function(bits){
            return [parseInt(bits[1] + bits[1], 16), parseInt(bits[2] + bits[2], 16), parseInt(bits[3] + bits[3], 16)];
        }
    }, {
        re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0{0,1}\.\d{1,}|0\.{0,}0*|1\.{0,}0*)\)$/,
        example: ['rgba(123, 234, 45, 22)', 'rgba(255, 234,245, 34)'],
        process: function(bits){
            return [parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3]), parseFloat(bits[4])];
        }
    }, {
        re: /^hsla\((\d{1,3}),\s*(\d{1,3}%),\s*(\d{1,3}%),\s*(0{0,1}\.\d{1,}|0\.{0,}0*|1\.{0,}0*)\)$/,
        example: ['hsla(0,100%,50%,0.2)'],
        process: function(bits){
        	var result = hsl2rgb(parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3]), parseFloat(bits[4]));
        	
        	return [result.r, result.g, result.b, parseFloat(bits[4])];
            
        }
    }, {
        re: /^hsl\((\d{1,3}),\s*(\d{1,3}%),\s*(\d{1,3}%)\)$/,
        example: ['hsl(0,100%,50%)'],
        process: function(bits){
        	var result = hsl2rgb(parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3]), 1);
        	
        	return [result.r, result.g, result.b, 1];
            
        }
    }];
    
    // search through the definitions to find a match
    for (var i = 0; i < color_defs.length; i++) {
        var re = color_defs[i].re;
        var processor = color_defs[i].process;
        var bits = re.exec(color_string);
        if (bits) {
            channels = processor(bits);
            me.r = channels[0];
            me.g = channels[1];
            me.b = channels[2];
            me.a = channels[3];
            me.ok = true;
        }
        
    }
    
    // validate/cleanup values
    me.r = (me.r < 0 || isNaN(me.r)) ? 0 : ((me.r > 255) ? 255 : me.r);
    me.g = (me.g < 0 || isNaN(me.g)) ? 0 : ((me.g > 255) ? 255 : me.g);
    me.b = (me.b < 0 || isNaN(me.b)) ? 0 : ((me.b > 255) ? 255 : me.b);
    
    
    
    me.a = (isNaN(me.a)) ? 1 : ((me.a > 255) ? 255 : (me.a < 0) ? 0 : me.a);
    
    
    
    // some getters
    me.toRGB = function(){
        return 'rgb(' + me.r + ', ' + me.g + ', ' + me.b + ')';
    }
    
    // some getters
    me.toRGBA = function(){
        return 'rgba(' + me.r + ', ' + me.g + ', ' + me.b + ', ' + me.a + ')';
    }
    
    /**
     * Converts an RGB color value to HSV. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h, s, and v in the set [0, 1].
     *
     * This routine by Michael Jackson (not *that* one),
     * from http://www.mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
     *
     * @param   Number  r       The red color value
     * @param   Number  g       The green color value
     * @param   Number  b       The blue color value
     * @return  Array           The HSV representation
     */
    me.toHSV = function(){
        var r = me.r / 255, g = me.g / 255, b = me.b / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;
        
        var d = max - min;
        s = max == 0 ? 0 : d / max;
        
        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        
        return {
            h: h,
            s: s,
            v: v
        };
    }
    
    /*
     * hsl2rgb from http://codingforums.com/showthread.php?t=11156 
     * code by Jason Karl Davis (http://www.jasonkarldavis.com)
     */
    function hsl2rgb(h, s, l) {
		var m1, m2, hue;
		var r, g, b
		s /=100;
		l /= 100;
		if (s == 0)
			r = g = b = (l * 255);
		else {
			if (l <= 0.5)
				m2 = l * (s + 1);
			else
				m2 = l + s - l * s;
			m1 = l * 2 - m2;
			hue = h / 360;
			r = HueToRgb(m1, m2, hue + 1/3);
			g = HueToRgb(m1, m2, hue);
			b = HueToRgb(m1, m2, hue - 1/3);
		}
		return {r: Math.round(r), g: Math.round(g), b: Math.round(b)}; 
	}
	
	function HueToRgb(m1, m2, hue) {
		var v;
		if (hue < 0)
			hue += 1;
		else if (hue > 1)
			hue -= 1;
	
		if (6 * hue < 1)
			v = m1 + (m2 - m1) * hue * 6;
		else if (2 * hue < 1)
			v = m2;
		else if (3 * hue < 2)
			v = m1 + (m2 - m1) * (2/3 - hue) * 6;
		else
			v = m1;
	
		return 255 * v;
	}
    
    
    
    me.toHex = function(){
        var r = me.r.toString(16);
        var g = me.g.toString(16);
        var b = me.b.toString(16);
        
        var a = Math.floor((me.a * 255)).toString(16);
        
        if (r.length == 1) 
            r = '0' + r;
        if (g.length == 1) 
            g = '0' + g;
        if (b.length == 1) 
            b = '0' + b;
        
        
        if (a == 'ff') {
            a = '';
        } else if (a.length == 1) {
            a = '0' + a;
        }
        return '#' + a + r + g + b;
    }
    
    
    
}

document.write('<style type="text/css">.cssSandpaper-initiallyHidden { visibility: hidden;} </style>');



EventHelpers.addPageLoadEvent('cssSandpaper.init')

