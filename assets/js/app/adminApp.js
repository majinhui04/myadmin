define(function(require, exports, module) {
    require('angular-route');
    require('angular-lazyload');
    require('angular-core');
    require('angular-sanitize');
    
    var app = angular.module('adminApp', ['ngRoute','angular-lazyload', 'angular-core','ngSanitize']);
    var IGrow = window['IGrow'];
    //配置期
    app.config(['$routeProvider','$compileProvider',
        function($routeProvider,$compileProvider) {
            // 去除链接中的unsafe
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
        }
    ]);
    // 若图片加载不出来
    app.directive('imgError',function(){
        return {
                restrict : 'A',
                link:function(scope, elm, attr, ngModelCtrl){
                    var imgError = '/assets/img/public/img-error.jpg';
                 
                    elm[0].onerror = function(){
                        this.src = imgError;
                        this.setAttribute('data-original', imgError);
                    };
                }
        }; 
    });
    /*
        置顶 <div class="m-gotop-box"><i class="fa fa-chevron-up"></i></div>
    */
    app.directive('gotop',function(){

        return {
            restrict: 'A',
            link: function (scope, elm, attr, ngModelCtrl) {
                Utils.bindGoTop(elm);
                
            }
        };

    });
    /* 自定义 MLoading */
    app.factory('mLoading',function(){
        return Utils.mLoading;
    });
    /* 自定义 MNotice */
    app.factory('mNotice',function(){

        return Utils.mNotice;
    });
    app.controller('adminController',['$scope','$q','$route','$timeout','routeConfig','resource', 'mLoading','mNotice','$routeParams',function($scope,$q,$route,$timeout,routeConfig,resource,mLoading,mNotice,$routeParams){
        var userDao = resource('/user'),
            hash = location.hash;
       
            

        $scope.run = function(){
            bind();
            // 获取当前用户
            userDao.get({},function(result){
                var user = result.data || {};

                $scope.user = IGrow.user = user;
                initRouteConifg();

            },function(result){
                mNotice(result.message,'error');
            });
        };

        $scope.run();


        // 初始化路由
        function initRouteConifg(){
            // 配置路由
            routeConfig(IGrow.modules);
            $route.reload();

        }
        function bind(){
            /*
                自适应高度

             */
            var resizeTimer;
            var resize = function(){

                clearInterval(resizeTimer);
                resizeTimer = null;
                var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                var headerHeight = $('#header').height();
                var containerHieght = winHeight-headerHeight;

                resizeTimer = setTimeout(function(){

                    $('#container').css('height',containerHieght + 'px');
                }, 100);
                
            };
            resize();

            $(window).bind('resize',resize);
        }

            
            
       
        
    }]);

    //运行期
    app.run(['$rootScope','$lazyload', function($rootScope,$lazyload) {
            //Step5: init lazyload & hold refs
            $lazyload.init(app);
            app.register = $lazyload.register;

            var locationChangeStartOff = $rootScope.$on('$locationChangeStart', locationChangeStart);  
            var locationChangeSuccessOff = $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);  
            var routeChangeStartOff = $rootScope.$on('$routeChangeStart', routeChangeStart);  
            var routeChangeSuccessOff = $rootScope.$on('$routeChangeSuccess', routeChangeSuccess);  
          
            function locationChangeStart(event) {  
                //$log.log('locationChangeStart');  
                //$log.log(arguments);  
            }  
          
            function locationChangeSuccess(event) {  
                //$log.log('locationChangeSuccess');  
                //$log.log(arguments); 
                hashChange();
            }  
          
            function routeChangeStart(event) {  
                //$log.log('routeChangeStart');  
                //$log.log(arguments);  
            }  
          
            function routeChangeSuccess(event) {  
                //$log.log('routeChangeSuccess');  
                //$log.log(arguments); 
                //$log.log(11111111111111,$location.hash(),location.hash) 
                
            }  



            function hashChange(hash) {
                var hash = hash || location.hash|| '',
                    $target = $('.sidebar').find('[href="'+hash+'"]'),
                    title = $target.attr('data-title') || '',
                    $parent = $target.parent();

                if(!$target.length) {
                    return;
                }
                $parent.addClass('active').siblings().removeClass('active');
            }

        }
    ]);

    module.exports = app;
});