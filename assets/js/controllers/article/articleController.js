define(function(require,module,exports){
    var adminApp = require('adminApp');

    adminApp.register.controller('articleController',['$scope',
        function(){
            console.log(322)
            $('.pagination').pagination(100,{});
        }
    ]);

    return adminApp;
});