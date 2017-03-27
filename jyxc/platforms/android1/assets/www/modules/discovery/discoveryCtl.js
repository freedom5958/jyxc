appMain
.controller('discoveryCtl', function($rootScope, $scope,$timeout,$ionicLoading,$cordovaToast,$http) {
 	$rootScope.variable.allowQuit = true;
	$scope.bbs = {
		"height" : (window.innerHeight - 47) + "px",
		"width" : "100%"
	}
	 //window.open('baidu.html', '_self', 'hidden=yes');
 });