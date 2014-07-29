define(function(require, exports, module) {
    require('datetimepicker.css');
    require('datetimepicker.js');
    require('angular-route');
    require('angular-lazyload');
    require('angular-core');
    require('angular-sanitize');
    
    /*
        日历控件


     */
    jQuery.fn.datetimepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今日",
        suffix: [],
        meridiem: []
    };


    var app = angular.module('adminApp', ['ngRoute','angular-lazyload', 'angular-core','ngSanitize']);
    var IGrow = window['IGrow'];
    //配置期
    app.config(['$routeProvider','$compileProvider',
        function($routeProvider,$compileProvider) {
            // 去除链接中的unsafe
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
        }
    ]);


    /*分页*/
    app.directive('pagination', function () {
       
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elm, attr, ngModelCtrl) {

                var pageModel = scope[attr.ngModel];
                var target = attr.ngModel+'.total';
        
                if(!ngModelCtrl) return;
                if(!pageModel) return;
            
                scope.$watch(target, function (total) {
                    var pageModel = scope[attr.ngModel];
                
                    pageModel.page = pageModel.page || 1;
                    page = pageModel.page;
                
                    total = total ? total : 0;
                    //console.log(total)
                    if (total === 0) {
                        elm.html('');
                        return;
                    }
                    elm.addClass('pagination');
                    elm.pagination(total,{
                        current_page:page - 1,
                        items_per_page:pageModel.pagesize,
                        $scope:scope,
                        callback:function(page){
                            pageModel.page = page+1;
                            pageModel.click && pageModel.click(page+1);
                            return false;
                        }
                    }); 

                });
               
            }
        }
    });
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

    /* 日历 */
    //yyyy-mm-dd hh:ii
    app.directive('datetimepicker', ['$filter', function ($filter) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function($scope,$element, $attr, $ctrl){
                var model = $scope[$attr.ngModel],options = $attr.options,defOpt,data = $element.data();

                if(!$ctrl){
                    return;
                }
                $element.attr('readOnly','readOnly');
                options = $scope[$attr.datetimepicker] || {};
                if(data.format) {
                    options.format = data.format;
                }
                if(data.minview!==undefined) {
                    options.minView = data.minview;
                }
                if(data.startview){
                    options.startView = data.startview;
                }
                if(data.todaybtn){
                    options.todayBtn = data.todaybtn;
                }
                if(data.pickerposition){
                    options.pickerPosition = data.pickerposition;
                }
                if(data.initialdate){
                    options.initialDate = data.initialdate;
                }
                //console.log($scope,$element,$attr,ctrl);
                defOpt = {
                    //initialDate:'2012-12-12',
                    language:'zh-CN',
                    format:'yyyy-mm-dd',// yyyy-mm-dd hh:ii
                    weekStart: 1,// 一周从哪一天开始。0（星期日）到6（星期六）
                    todayBtn:  1,
                    autoclose: 1,
                    startView: 2,//默认值：0 , 'hour' 1 , 'day' 2 , 'month' 3 , 'year' 4 , 'decade'
                    minView:2,//默认值：0, 'hour' 2
                    pickerPosition:'bottom-left' // bottom-right
                };
                console.log('datetimepicker element',$element)
    
                var opts = $.extend({},defOpt,options);
                //console.log(opts,data,options)
                $element.datetimepicker(opts).on('changeDate', function(e){
                    var value = e.currentTarget.value,date = e.date,time = '';
                    if(!value){
                        value = $(e.currentTarget).find('input[type=text]').val();
                    }
                    console.log('datetimepicker value',value);
                    time =  date && date.getTime();
                    $element.attr('data-time',time);
                    $scope[$attr.ngModel] = value;
                    $ctrl.$setViewValue(value);
                    $scope.$apply();
                   
                }).on('show',function(){
                    $('.datetimepicker .icon-arrow-left').addClass('fa fa-arrow-left');
                    $('.datetimepicker .icon-arrow-right').addClass('fa fa-arrow-right');
                    //console.log('show')
                });
            }
        };
    }]);
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
    app.controller('adminController',['$scope','$q','$route','$timeout','routeConfig','resource', 'mLoading','mNotice','$routeParams','$route',function($scope,$q,$route,$timeout,routeConfig,resource,mLoading,mNotice,$routeParams,$route){
        var userDao = resource('/user',{ extra:'user' },{current:{}});
       
        $scope.logout = IGrow.logout;
        $scope.reload = function($event){
            var target = $event.currentTarget,
                href = target.href,
                hash = location.hash;

            if(href.indexOf(hash)>-1) {
                $route.reload();
            }
            
        };
        $scope.run = function(){
            bind();
            // 获取当前用户
            userDao.current({__action:'user.current'},function(result){
                var user = result.data || {};

                $scope.user = IGrow.user = user;

                initRouteConifg();

            },function(result){
                //mNotice(result.message,'error');
                location.href = IGrow.logout;
            });
        };

        $scope.run();


        // 初始化路由
        function initRouteConifg(){

            if(!location.hash){
                location.hash = '#/dashboard';
            }
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
                    match = /(#\/\w+)\/?\S*?/.exec(hash),
                    route = match?match[1]:'',
                    $target = $('.sidebar').find('[href="'+route+'"]'),
                    title = $target.attr('data-title') || '',
                    $parent = $target.parent();

                //console.log(hash,route)
                if(!$target.length) {
                    return;
                }
                $parent.addClass('active').siblings().removeClass('active');
            }

        }
    ]);

    module.exports = app;
});