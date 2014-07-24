/*
    全局 api 配置 
    请求地址:version + api
    @params
        demo:'统一本地资源前缀'
        host:'http://api.igrow.com'
        version:''  
        mode: 'server' or 'demo' or '' 。 'server':全局使用服务器接口,'demo':全局使用本地模拟数据,'':根据匹配到的api具体配置
 */
(function(){
    window.API = {
        host:'http://' + location.host,
        version:'',
        demo:'/assets/api',
        mode:'',
        map:{
            '/user/get':{
                mode:'demo',
                description:''
            }
            
        }
    };
})();

/*
*  全局参数配置 
*  IGrow = { api:'ajax前缀',dir:'网站根目录',modules = [] }
*/

(function(){
    
    var IGrow = window['IGrow'] = {
        host:'http://' + location.host,
        dir:'http://' + location.host + '/',
        page:'_page',
        pagesize:'_pagesize',
        log:function(){
            console.log.apply(console,arguments);
        },
        constant:{
        },
        modules:[
            /* 公共 */
            /*{
                redirectTo:'/error'
            },*/
            /*出错*/
            {
                body:'',
                route:'/error',
                title:'error',
                template:'<div style=" text-align:center;padding:15px;">error</div>',
                dependency:[]
            },
            // 首页
            {
                route:'/dashboard',
                title:'',
                controller: function($scope, $routeParams, $location) {
                    console.log(111)
                    
                },
                template: '<h1 class="headline1">首页</h1>',
                dependency:[],
                description:'作业详情-跳转'
            },
            // 文章列表
            {
                route:'/article',
                controller:'articleController',
                title:'文章列表',
                controllerUrl:'/assets/js/controllers/article/articleController.js',
                templateUrl:'/assets/js/controllers/article/article.html',
                description:''
            },
            // 文章添加
            {
                route:'/article/add',
                controller:'articleAddController',
                title:'',
                controllerUrl:'/assets/js/controllers/article/articleEditController.js',
                templateUrl:'/assets/js/controllers/article/articleEdit.html',
                description:''
            },
            // 文章编辑
            {
                route:'/article/update/:id',
                controller:'articleUpdateController',
                title:'',
                controllerUrl:'/assets/js/controllers/article/articleEditController.js',
                templateUrl:'/assets/js/controllers/article/articleEdit.html',
                description:''
            }
            
            
        ]
    };
    


})();

/* 
*
*  seajs 配置 
*  
*/
(function(){
   
    // 设置别名
    var alias = {
        // libs
        'angular-sanitize':'/assets/js/libs/angularjs/1.2.14/angular-sanitize.min.js',
        'angular-route':'/assets/js/libs/angularjs/1.2.14/angular-route.min.js',
        'ueditor-config':'/assets/js/libs/ueditor/1.4.3/ueditor.config.js',
        'ueditor-all':'/assets/js/libs/ueditor/1.4.3/ueditor.all.min.js',
        'ueditor-lang':'/assets/js/libs/ueditor/1.4.3/lang/zh-cn/zh-cn.js',
        // plugins
        'datetimepicker.css':'/assets/js/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
        'datetimepicker.js':'/assets/js/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
        'mediaelement.js':'/assets/js/plugins/mediaelement/2.13.1/mediaelement-and-player.min.js',
        'mediaelement.css':'/assets/js/plugins/mediaelement/2.13.1/mediaelementplayer.min.css',
        // core
        'angular-core':'/assets/js/core/angular-core.js',
        'angular-lazyload': '/assets/js/core/angular-lazyload.js',
        // seajs module
        'datetimepickerDirective':'/assets/js/directive/datetimepickerDirective.js',
        'media':'/assets/js/public/media.js',
        // seajs app
        'adminApp':'/assets/js/app/adminApp.js'

    };

    window['seajs'] && seajs.config({
        alias:alias,
        charset: 'utf-8',
        map: [
            [ /(controllers\/\w+\/\w+)(\.js)/i,'$1$2?'+new Date().valueOf() ]
            //[ /^(.*\.(?:css|js))(.*)$/i, '$1?'+new Date().valueOf() ]
        ]
    });

    window['seajs'] && seajs.on('error', function(module){

        if(module.status!=5){
            alert(module.status)
            console.error('seajs error: ', module);
        }
    });

})();