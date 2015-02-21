/*this js is exported by senroLabel © www.passtome.com/senroLabel/*/
var senro=new Senro(['drag','mouseWheel','video']);
//  sliderLR方法js开始
    //senro.sliderLR($('#sliderLR1 .itemWrap'),$('#sliderLR1 .arrowLeft'),$('#sliderLR1 .arrowRight'),$('#sliderLR1 .thumbsWrap'),null,null,$( "#sliderLR1 .scrollCube"));
    senro.sliderLR({
        list:$('#sliderLR1 .itemWrap'),
        btn_l:$('#sliderLR1 .arrowLeft'),
        btn_r:$('#sliderLR1 .arrowRight'),
        thumbList:$('#sliderLR1 .thumbsWrap'),
        sliderCube:$( "#sliderLR1 .scrollCube"),
        current:'thumb_current'
    });
//  sliderLR方法js结束
//  simpleSliderLR方法js开始
    //senro.simpleSliderLR($('#s1 .arrowLeft'),$('#s1 .arrowRight'),$('#s1 .itemWrap'),1);
    senro.simpleSliderLR({
        btn_l:$('#s1 .arrowLeft'),
        btn_r:$('#s1 .arrowRight'),
        list:$('#s1 .itemWrap'),
        showNum:1
    });
//  simpleSliderLR方法js结束
//  simpleSliderLR方法js开始
    //senro.simpleSliderLR($('#s2 .arrowLeft'),$('#s2 .arrowRight'),$('#s2 .itemWrap'),1);
    senro.simpleSliderLR({
        btn_l:$('#s2 .arrowLeft'),
        btn_r:$('#s2 .arrowRight'),
        list:$('#s2 .itemWrap'),
        showNum:1
    });
//  simpleSliderLR方法js结束
//  bigEye方法js开始
    //senro.bigEye($('#bigEye1 .itemWrap'),$('#bigEye1 .dots'),'dot_current',null,'fade',true);
    senro.bigEye({
        items:$('#bigEye1 .itemWrap'),
        dots:$('#bigEye1 .dots'),
        current:'dot_current',
        transType:'fade',
        autoPlay:true
    });
//  bigEye方法js结束
//  simpleSliderLR方法js开始
    //senro.simpleSliderLR($('.simpleSliderLR3 .arrowLeft'),$('.simpleSliderLR3 .arrowRight'),$('.simpleSliderLR3 .itemWrap'),1);
    senro.simpleSliderLR({
        btn_l:$('.simpleSliderLR3 .arrowLeft'),
        btn_r:$('.simpleSliderLR3 .arrowRight'),
        list:$('.simpleSliderLR3 .itemWrap'),
        showNum:1
    });
//  simpleSliderLR方法js结束
//  marquee方法js开始
    senro.marquee($('.marqueeV .itemWrap'),'bottom',$('.marqueeV .preBtn'),$('.marqueeV .nextBtn'));
    //  marquee方法js结束
//  simpleSliderLR方法js开始
    //senro.simpleSliderLR($('.simpleSliderLR .arrowLeft'),$('.simpleSliderLR .arrowRight'),$('.simpleSliderLR .itemWrap'),1);
    senro.simpleSliderLR({
        btn_l:$('.simpleSliderLR .arrowLeft'),
        btn_r:$('.simpleSliderLR .arrowRight'),
        list:$('.simpleSliderLR .itemWrap'),
        showNum:1
    });
//  simpleSliderLR方法js结束
