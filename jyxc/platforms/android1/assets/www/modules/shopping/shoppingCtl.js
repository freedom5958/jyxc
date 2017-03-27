appMain
.controller('shoppingCtl', function($rootScope, $scope,$timeout,$ionicLoading,$cordovaToast,$http) {
 	$rootScope.variable.allowQuit = true;
	$scope.shopping = {
		"height" : (window.innerHeight - 47) + "px",
		"width" : "100%"
	}
 });