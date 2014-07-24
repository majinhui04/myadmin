define(function(require,module,exports){
    /*require('ueditor-config');
    require('ueditor-all');
    require('ueditor-lang');*/
    var adminApp = require('adminApp');

    adminApp.register.controller('articleAddController',['$scope',
        function($scope){
            $scope.goBack = function(){
                history.go(-1);

            };

            setTimeout(function(){
                console.log(222222)
                UE.getEditor('editor').ready(function() {
                    //this是当前创建的编辑器实例
                    this.setContent('内容1')
                });
            }, 100);
            
            

        }
    ]);

    adminApp.register.controller('articleUpdateController',['$scope',
        function($scope){
            $scope.goBack = function(){
                history.go(-1);

            };
            //var ue = UE.getEditor('editor');
            console.log('edit')

        }
    ]);

    return adminApp;
});