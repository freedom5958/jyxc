appMain
.controller('developerCtrl', function($scope, $rootScope, $ionicActionSheet, $cordovaToast, appSrv) {
	$rootScope.variable.allowQuit = true;
	
	$scope.goBack = function(){
		$rootScope.goBack();
	};

	$scope.showActionSheet = function(){
		$ionicActionSheet.show({
			buttons: [{ text: '网络状态'}, { text: '连接状态'}],
			cancelText: '取消',
			cancel: function() {
			},
			buttonClicked: function(index) {
				if(index == 0){
					$scope.netState();
				}else if(index == 1){
					$scope.testLink();
				}
				return true;
			}
		});
	};

	$scope.netState = function(){
		$cordovaToast.showShortCenter(JSON.stringify($rootScope.variable.netType));
	};

	$scope.testLink = function(){
		appSrv.testLink().then(function(succ){
			$rootScope.variable.isConnected = true;
			$cordovaToast.showShortCenter(JSON.stringify($rootScope.variable.isConnected));
		},function(err){
			$rootScope.variable.isConnected = false;
			$cordovaToast.showShortCenter(JSON.stringify($rootScope.variable.isConnected));
		});
	};
});