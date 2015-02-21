/**
 * Created with WebStorm.
 * User: qiuyun
 * Date: 14-5-5
 * Time: 下午3:58
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function () {
    var senro=new Senro('cssSandpaper');
    senro.addGradient($('.bg'),'linear, left top, left bottom, color-stop(0%,#1e5799), color-stop(100%,#7db9e8)');
});
