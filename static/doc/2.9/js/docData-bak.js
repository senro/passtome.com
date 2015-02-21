/**
 * Created with JetBrains WebStorm.
 * User: qiuyun
 * Date: 13-11-15
 * Time: 下午3:00
 * To change this template use File | Settings | File Templates.
 */

var senroDoc={
    version:  { name:' Senro.2.7-todo',url:'#'},
    require:  { name:'jquery 1.9.1',url:'#'},
    author:   { name:' senro',url:'http://www.senro.cn'},
    copyRight: { name: 'senro.cn',url:'http://www.senro.cn'},
    thanks: [ { name:'NightKnight', url:'#' } , { name:'woniu', url:'#' } ],
    introduction: '暂无',
    contains: {
        core:{
            translate: '核心公用方法',
            contains:{
                checkRequire:{
                    location: '核心公用方法',
                    translate: ' 检测依赖（ 检测类型 ，回调）',
                    parameters:  ["sliderTab(type,fun_action)","type（字符串）：'testHtml5','preload'","fun_action（函数）： 自定义"],
                    return: 'null' ,
                    function: '根据所传的依赖类型自动获取，所需依赖文件。并保证当该方法被多次调用时，引用文件只被加载一次。',
                    example: '../test-html/test-checkRequire.html',
                    need: ['checkRequire'],
                    description: '暂无'
                }
            }
        }

    }
};
