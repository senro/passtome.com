/**
 * Created with JetBrains WebStorm.
 * User: qiuyun
 * Date: 13-11-21
 * Time: 下午12:04
 * To change this template use File | Settings | File Templates.
 */
var $asideCont=$('.aside-cont'),
    $locationValue=$('.location-value'),
    $name=$('.name'),
    $translateValue=$('.translate-value'),
    $parametersValue=$('.parameters-value'),
    $returnValue=$('.return-value'),
    $functionValue=$('.function-value'),
    $descriptionValue=$('.description-value'),
    $exampleValue=$('.example-value'),
    $indexPage=$('.indexPage'),
    $infoPage=$('.infoPage'),
    $versionValue=$('.version-value'),
    $requireValue=$('.require-value'),
    $authorValue=$('.author-value'),
    $copyRightValue=$('.copyRight-value'),
    $thanksValue=$('.thanks-value'),
    $introductionValue=$('.introduction-value'),
    $listPageCont=$('.listPage-cont'),
    $logo=$('.logo'),
    $listPage=$('.listPage'),
    docUrl=window.location.href,
    method={},
    senroDoc,
    $export=$('.export'),
    $ifCompress=$('.ifCompress'),
    version,
    versionNum,
    $toggleAll=$('.toggleAll');

//reset
setAsideHeight();

$(window).resize(function(){
    setAsideHeight();
    return false;
});

function setAsideHeight(){
    $asideCont.css('height',$(window).height()-$('.aside-tit').height()-30);
    return false;
}

$.getJSON('js/docData.json',function(docData){
    senroDoc=docData;

    parseIndex(senroDoc);
    parseCat(senroDoc);
    version=senroDoc['version']['name'];
    versionNum=parseVersionNum(version);
    showAllList(version);
    $logo.html(version);
    $logo.click(function(){
        var exportListObj={ version:versionNum },
            url='/exportDoc',
            params;
        params= JSON_stringify(exportListObj);

        window.open(url+'?'+params);
        showIndexPage();
        return false;
    });
    parseHashUrl();
    $('.catLink').click(function(){
        var name=$(this).data("name");
        showCatList(name);

        return false;
    });
    $toggleAll.click(function(){
        var isChecked=$(this).is(':checked');
        if(isChecked){
            $checkBox.prop('checked',true);//不能用attr
        }else{
            $checkBox.removeProp('checked');
        }
    });
    var  $checkBox=$('.checkBox');
    $checkBox.click(function(){
        var type=$(this).data('type'),
            catName,
            isChecked=$(this).is(':checked');

        if(type=='cat'){
            catName=$(this).data('name');
            if(isChecked){
                $checkBox.filter('[data-cat='+catName+']').prop('checked',true);//不能用attr
                checkNeed($checkBox);
            }else{
                $checkBox.filter('[data-cat='+catName+']').removeProp('checked');
                checkNeed($checkBox);
            }
        }else{
            catName=$(this).data('cat');
            checkNeed($checkBox);
            //$checkBox.filter('[data-name='+catName+']').attr('checked',false);
        }

    });
    function parseVersionNum(str){
        //todo 待优化正则
        var tmpArr=str.match(/[0-9]/g),
            num='';
        for(var i= 0,L=tmpArr.length;i<L;i++){
            if(i<L-1){
                num+=tmpArr[i]+'.';
            }else{
                num+=tmpArr[i];
            }
        }
        return num
    }
    function checkNeed($checkBox){
        var needs=[],realNeeds;
        $checkBox.each(function(index){
            var $this=$checkBox.eq(index),
                isChecked=$this.is(':checked'),
                type=$this.data('type');
            if(isChecked&&type=='method'){
                var name=$this.data('name'),
                    need=method[name]['need'];
                if(typeof(need)=='object'){
                    needs=needs.concat(need);//todo
                }else{
                    needs.push(need);
                }

            }
        });
        realNeeds=needs.distinct();

        for(var i= 0,L=realNeeds.length;i<L;i++){
            if(realNeeds[i]!='无'&&realNeeds[i]!=undefined){
                $checkBox.filter('[data-name='+realNeeds[i]+']').prop('checked',true);//不能用attr
            }else{
                //$checkBox.removeProp('checked');
            }
        }
    }
    //去掉数组中重复的元素
    Array.prototype.distinct = function(){
        var newArr=[],obj={};
        for(var i=0,len=this.length;i<len;i++){
            if(!obj[typeof(this[i]) + this[i]]){
                newArr.push(this[i]);
                obj[typeof(this[i])+this[i]]='new';
            }
        }
        return newArr;
    };

    function openwin(url) {
        var a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("target", "_blank");
        a.setAttribute("id", "openwin");
        document.body.appendChild(a);
        a.click();
    }
    //导出自定义

    $export.click(function(){

        var exportList=buildExportList(),
            exportListObj={ methods: exportList, compress: false, version: versionNum},
            url='/exportCustom',
            params;
        if($ifCompress.is(':checked')){
            exportListObj.compress=true;
        }
        params= JSON_stringify(exportListObj);

        $.getJSON(url+'?'+params,function(data){
            if(data.msgcode==1){
                var currUrl=window.location.href;
                openwin('/'+data.url);
                //window.open('/'+data.url);
            }
        });
        //window.open(url+'?'+params);

        return false;
    });
});
function JSON_stringify (obj) {
    //如果是IE8+ 浏览器(ff,chrome,safari都支持JSON对象)，使用JSON.stringify()来序列化
    if (window.JSON) {
        return JSON.stringify(obj);
    }
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    } else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);

        // fix.
        var self = arguments.callee;

        for (n in obj) {
            v = obj[n];
            t = typeof(v);
            if (obj.hasOwnProperty(n)) {
                if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null)
                // v = jQuery.stringify(v);
                    v = self(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
}
function buildExportList(){
    var $methodCheckBox=$('.methodCheckBox'),
        $checkedMethod,
        exportList=[];

    $checkedMethod=$methodCheckBox.filter(':checked');
    $checkedMethod.each(function(index){
        var mehtodName=$checkedMethod.eq(index).data('name');
        exportList.push(mehtodName);
    });
    return exportList;
}
function parseHashUrl(){
    var hashName=docUrl.split('#')[1];
    if(hashName){
        showMethod(hashName);
    }

    return false;
}
function parseCat(doc){
    for(var i in doc['contains']){
        $asideCont.append(
            '<ul class="firstClass cat-'+i+'">'+
                '<li class="firstClass-name clearfix">'+
                '<a href="javascript:;" class="catLink" data-name="'+i+'">'+doc['contains'][i]['translate']+'</a>'+
                '<input type="checkbox" class="checkBox catCheckBox '+i+'-checkBox" data-type="cat" data-name="'+i+'" />'+
                '</li>'+
                '</ul>'
        );

        for(var j in doc['contains'][i]['contains']){

            method[j]=doc['contains'][i]['contains'][j];
            method[j]['map']=doc['version']['name']+'/'+i+'/'+j;
            $('.cat-'+i).append(
                '<li class="secClass">'+
                    '<a class="secClassLink method-'+j+'" href="javascript:;">'+j+'</a>'+
                    '<input type="checkbox" class="checkBox methodCheckBox '+j+'-checkBox" data-type="method" data-need="'+parseMethodNeed(method[j]['need'])+'" data-cat="'+i+'" data-name="'+j+'" />'+
                    '</li>'
            );
            $('.method-'+j).click(function(){
                var methodName=$(this).html(),
                    hasHashReg=/#/;
                if(hasHashReg.test(docUrl)){
                    var realUrl=docUrl.split('#')[0];
                    window.location.href=realUrl+'#'+methodName;
                }else{
                    window.location.href=docUrl+'#'+methodName;
                }
                showMethod(methodName);

                return false;
            });
        }

    }

    return false;
}
function parseMethodNeed(data){
    var str='';
    if( typeof(data)== 'object'){
        for(var i= 0,L=data.length;i<L;i++){
            if(i!=L-1){
                str+=data[i]+',';
            }else{
                str+=data[i];
            }
        }
        return str;
    }else{
        str+=data;
        return str;
    }
}
function parseIndex(doc){
    $versionValue.append('<a class="valueLink" href="'+doc['version']['url']+'" target="_blank">'+doc['version']['name']+'</a>');
    $requireValue.append('<a class="valueLink" href="'+doc['require']['url']+'" target="_blank">'+doc['require']['name']+'</a>');
    $authorValue.append('<a class="valueLink" href="'+doc['author']['url']+'" target="_blank">'+doc['author']['name']+'</a>');
    $copyRightValue.append('<a class="valueLink" href="'+doc['copyRight']['url']+'" target="_blank">'+doc['copyRight']['name']+'</a>');
    for(var i=0 ;i<doc['thanks'].length;i++){
        $thanksValue.append('<a class="valueLink thankPerson '+doc['thanks'][i]['name']+'" href="'+doc['thanks'][i]['url']+'" target="_blank">'+doc['thanks'][i]['name']+'</a>');
        if(i!=doc['thanks'].length-1){
            $thanksValue.append('、');
        }
    }
    $introductionValue.html(removeNewline(doc['introduction']));

    return false;
}
function showIndexPage(){
    $infoPage.hide();
    $listPage.hide();
    $indexPage.show();
    return false;
}
function showMethod(name){
    parseInfoMap($locationValue,method[name]['map'],name);
    $name.html(name);
    $translateValue.html(method[name]['translate']);

    $parametersValue.html(parseNewline(method[name]['parameters']));
    $returnValue.html(method[name]['return']);
    $functionValue.html(method[name]['function']);
    $exampleValue.attr('href',method[name]['example']);
    $descriptionValue.html(parseNewline(method[name]['description']));

    if($('.infoPage:visible').length==0){
        $infoPage.show();
        $indexPage.hide();
        $listPage.hide();
    }
    return false;
}
function removeNewline(data){
    if($.isArray(data)){
        var parametersStr='';
        for(var i= 0,L=data.length;i<L;i++){
            parametersStr+=data[i];
        }
        return parametersStr;
    }else{
        return data;
    }
}
function parseNewline(data){
    if($.isArray(data)){
        var parametersStr='';
        for(var i= 0,L=data.length;i<L;i++){
            if(i!=L-1){
                parametersStr+=data[i]+'<br/>';
            }else{
                parametersStr+=data[i];
            }
        }
        return parametersStr;
    }else{
        return data;
    }
}
function parseInfoMap($loaction,str_map,name){
    var mapNode=str_map.split('/');
    $loaction.html(
        '<a class="map" data-level="1" data-name="'+$.trim(mapNode[0])+'" href="javascript:;">'+senroDoc['version']['name']+'</a>'+'&gt;'+
            '<a class="map" data-level="2" data-name="'+mapNode[1]+'" href="javascript:;">'+method[name]['location']+'</a>'+'&gt;'+
            '<a class="map" data-level="3" data-name="'+mapNode[2]+'" href="javascript:;">'+name+'</a>'
    );
    $('.map').click(function(){
        var name=$(this).data("name"),
            level=$(this).data("level");
        switch(level){
            case 1:
                showIndexPage();
                break;
            case 2:
                showCatList(name);
                break;
        }

        return false;
    });
}
function parseListMap($loaction,name){
    $loaction.html(
        '<a class="map" data-level="1" data-name="'+$.trim(senroDoc['version']['name'])+'" href="javascript:;">'+senroDoc['version']['name']+'</a>'+'&gt;'+
            '<a class="map" data-level="2" data-name="'+name+'" href="javascript:;">'+senroDoc['contains'][name]['translate']+'</a>'
    );
    $('.map').click(function(){
        var name=$(this).data("name"),
            level=$(this).data("level");
        switch(level){
            case 1:
                showIndexPage();
                break;
            case 2:
                //showCatList(name);
                break;
        }

        return false;
    });
}
function count(o){
    var t = typeof o;
    if(t == 'string'){
        return o.length;
    }else if(t == 'object'){
        var n = 0;
        for(var i in o){
            n++;
        }
        return n;
    }
}

function showAllList(name){
    var catsString='',j=0;
    for(var i in senroDoc['contains']){
        if(j!=count(senroDoc['contains'])-1){
            catsString+='<a href="javascript:;" class="catLink" data-name="'+i+'">'+senroDoc['contains'][i]['translate']+'</a>'+'、';
        }else{
            catsString+='<a href="javascript:;" class="catLink" data-name="'+i+'">'+senroDoc['contains'][i]['translate']+'</a>'+'<br/>';
        }
        j++;
    }
    $introductionValue.prepend(name+' 目前包含分类：'+catsString);

    return false;
}
function showCatList(name){
    parseListMap($locationValue,name);
    var listPageCont='';
    for(var i in senroDoc['contains'][name]['contains']){
        listPageCont+=
            '<div class="info name arial">'+
                '<a href="javascript:;" class="list-method list-method-'+i+'">'+i+'</a>'+
                '</div>'+
                '<div class="info translate">'+
                '翻译：'+
                '<span class="value translate-value">'+
                method[i]['translate']+
                '</span>'+
                '</div>'+
                '<div class="info function">'+
                '功能：'+
                '<span class="value function-value">'+
                method[i]['function']+
                '</span>'+
                '</div>'+
                '<hr class="listPageHr">';


    }
    $listPageCont.html(listPageCont);
    for(var j in senroDoc['contains'][name]['contains']){
        $('.list-method-'+j).click(function(){
            var name=$(this).html();
            showMethod(name);
            parseInfoMap($locationValue,method[name]['map'],name);
            return false;
        });
    }
    $listPage.show();
    $infoPage.hide();
    $indexPage.hide();

    return false;
}
