define(function(require,module,exports){
    var app = require('adminApp');

    app.register.controller('articleController',['$scope', '$q', 'mLoading','mNotice','resource',
        function($scope, $q, mLoading,mNotice,resource){
            var articleDao = resource('/topic');

            // 分页
            $scope.pageModel = {
                page:1,
                pagesize:3,
                total:0   
            };
            // 查询条件
            $scope.queryData = {
                title:''
            };
            // 批量删除 默认disabled
            $scope.checked = false;
            // 点击全选checkbox
            $scope.checkAll = function($event){
                var dataList = $scope.dataList || [],target = $event.currentTarget, checked = target.checked;

                angular.forEach(dataList, function(item, _){
                    item._checked = checked;
                });
                if(checked){
                    $scope.checked = true;
                }else {
                    $scope.checked = false;
                }
                //console.log(checked,$scope.dataList);
            };
            // 点击单个checkbox
            $scope.check = function($event,data){
                var dataList = $scope.dataList || [],target = $event.currentTarget, checked = target.checked,ret = [];

                data._checked = checked;
                angular.forEach(dataList, function(item, _){
                    if(item._checked){ret.push(item);}
                });
                
                $scope.checked = ret.length>0?true:false;
                
            };
            $scope._delete = function(data){
                var dataList = $scope.dataList || [];

                mLoading.show('正在删除...');
                articleDao._delete({ id:data.id },function(result){
                    mLoading.success('删除成功');
                },function(result){
                    mLoading.hide();
                    mNotice(result.message,'error');
                },function(){
                    Utils.removeItem(dataList,data,'id');
                });
            };
            $scope.list = function(page){
                var page = page || 1, 
                    pagesize = $scope.pageModel.pagesize || 20,
                    title = $scope.queryData.title;

                mLoading.show();
                articleDao.list({ page:page,pagesize:pagesize,title:title },function(result){
                    var list = result.data || [], extra = result.extra || {};
                    
                    angular.forEach(list, function(item, _){
                        item._create_time = item.create_time.substring(0,10);
                    });
                    $scope.dataList = list;
                    $scope.pageModel.total = extra.total;

                },function(result){
                    mNotice(result.message,'error');

                },function(){
                    mLoading.hide();
                });
            };
            $scope.search = function(){
                $scope.list();
            };

            $scope.toBulkDeleteView = function(){
                var dataList = $scope.dataList || [], ret = [];

                Utils.confirm('确定批量删除?',function(){
                    angular.forEach(dataList, function(data, _){
                        if(data._checked){
                            $scope._delete(data);
                        };
                    });
                });
                

            };

            $scope.toDeleteView = function(data){
                Utils.confirm('确定删除?',function(){
                    $scope._delete(data);
                });
            };
            

            $scope.pageModel.click = function(page){
                console.log(page)
                $scope.list(page);
            };
            $scope.list();
            
        }
    ]);

    return app;
});