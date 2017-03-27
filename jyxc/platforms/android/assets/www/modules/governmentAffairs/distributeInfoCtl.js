appMain
.controller('distributeInfoCtl', function($rootScope, $scope,$timeout,$ionicLoading,$cordovaToast,$http,$stateParams) {
 	$rootScope.variable.allowQuit = false;

 	$scope.title = $stateParams.title;

 	$scope.backParent = function() {
        $rootScope.goBack();
    }
 });