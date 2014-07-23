/*
*  全局配置 
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
            // 根据用户跳转
            {
                body:'',
                route:'/homework/detail/:homeworkid',
                title:'作业辅助-作业详情',
                controller: function($scope, $routeParams, $location) {
                    var IGrow = window['IGrow'], user = IGrow.user, homeworkid = $routeParams.homeworkid,host = IGrow.host;

                    if(user.typeid == 4){
                        location.replace(host+'#/student/homework/detail/'+homeworkid);
                        
                    }else{
                        location.replace(host+'#/class/homework/detail/'+homeworkid);
                    }
                    
                },
                template: '',
                dependency:[],
                description:'作业详情-跳转'
            },
            {
                body:'page',
                route:['/student/profile','/:uid/student/profile'],
                controller:'studentProfileController',
                title:['我的资料','学生信息'],
                controllerUrl:'modules/student/studentProfileController.js',
                templateUrl:'modules/student/studentProfile.html',
                description:'学生个人资料'
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
            [ /^(.*\.(?:css|js))(.*)$/i, '$1?'+new Date().valueOf() ]
        ]
    });

    window['seajs'] && seajs.on('error', function(module){

        if(module.status!=5){
            alert(module.status)
            console.error('seajs error: ', module);
        }
    });

})();