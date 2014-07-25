define(function(require,module,exports){
    /*require('ueditor-config');*/
    require('ueditor-all');
    var adminApp = require('adminApp');

    adminApp.register.controller('articleAddController',['$scope', '$q', 'mLoading','mNotice','resource',
        function($scope, $q, mLoading,mNotice,resource){
            var articleDao = resource('/topic');
            var articleTypeDao = resource('/topicType');
            var date = new Date();
            var $editor = $('.editor');
            var timeStamp = new Date().valueOf();
            var editorID = 'editor'+timeStamp;
        
            $scope.save  = function(){
                var formData = $scope.formData,
                    content = UE.getEditor(editorID).getContent();

                console.log(formData,content)
                

                mLoading.show('正在保存');
                articleDao.create(formData,function(result){
                    mLoading.success(function(){
                        location.hash = '#/article';
                    });
                    
                },function(result){
                    mNotice(result.message,'error');
                    mLoading.hide();
                });
            };

            $scope.run = function(){

                $editor.attr('id',editorID);
            
                UE.getEditor(editorID).ready(function() {
                    //this是当前创建的编辑器实例
                    this.setContent('')
                });

                $scope._action = '添加';
                $scope.formData = {
                    create_time:Utils.formatDate(date,'yyyy-MM-dd hh:mm'),
                    author:'匿名',
                    istop:0,
                    isshow:1
                };

                mLoading.show();

                articleTypeDao.list({},function(result){
                    $scope.articleTypeList = result.data || [];
                },function(result){
                    mNotice(result.message,'error');
                },function(){
                    mLoading.hide();
                });
            };

            $scope.run();
            
            

        }
    ]);

    adminApp.register.controller('articleUpdateController',['$scope', '$q', 'mLoading','mNotice','resource','$routeParams',
        function($scope, $q, mLoading,mNotice,resource,$routeParams){
            var articleDao = resource('/topic');
            var articleTypeDao = resource('/topicType');
            var date = new Date();
            var $editor = $('.editor');
            var timeStamp = new Date().valueOf();
            var editorID = 'editor'+timeStamp;
        
            $scope.save  = function(){
                var formData = $scope.formData,
                    content = UE.getEditor(editorID).getContent();

                console.log(formData,content)
                

                mLoading.show('正在保存');
                articleDao.update(formData,function(result){
                    mLoading.success(function(){
                        location.hash = '#/article';
                    });
                    
                },function(result){
                    mNotice(result.message,'error');
                    mLoading.hide();
                });
            };

            $scope.run = function(){

                $editor.attr('id',editorID);
            
                UE.getEditor(editorID).ready(function() {
                    //this是当前创建的编辑器实例
                    this.setContent('')
                });

                $scope._action = '修改';
                
                mLoading.show();

                // 获取类别列表
                var promise1 = articleTypeDao.list({},function(result){
                    $scope.articleTypeList = result.data || [];
                },function(result){
                    mNotice(result.message,'error');
                },function(){
                    mLoading.hide();
                });

                // 获取文章详情
                var promise2 = articleDao.get({id:$routeParams.id},function(result){
                    $scope.formData = result.data || {};
                    $scope.formData.typeid = $scope.formData.type.id;
                    UE.getEditor(editorID).setContent($scope.formData.content);

                },function(result){
                    mNotice(result.message,'error');
                },function(){
                    mLoading.hide();
                });
            };

            $scope.run();

        }
    ]);

    return adminApp;
});