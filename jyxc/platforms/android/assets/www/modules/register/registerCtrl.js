appMain
.controller('registerCtrl', function($scope, $rootScope, $ionicLoading, $cordovaToast, $http, authSrv, $cordovaDialogs) {
	$rootScope.variable.allowQuit = false;
	$scope.view = {
		account:'',
		name:'',
		password:'',
		password2:'',
		email:''
	};
	$scope.submitRegister = function(){
		if(!$scope.view.name){
			$cordovaToast.showShortCenter('请输入用户名');
			return;
		}
		if(!$scope.view.account){
			$cordovaToast.showShortCenter('请输入帐号');
			return;
		}
		if(!$scope.view.password){
			$cordovaToast.showShortCenter('请输入密码');
			return;
		}
		if(!$scope.view.password2){
			$cordovaToast.showShortCenter('请再次输入密码');
			return;
		}
		if($scope.view.password != $scope.view.password2){
			$cordovaToast.showShortCenter('两次输入的密码不一致');
			return;
		}
		if($scope.view.email && !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($scope.view.email)){
			$cordovaToast.showShortCenter('请输入正确邮箱地址');
			return;
		}

		var jsonParam = {
			account:$scope.view.account,
			name:$scope.view.name,
			password:$scope.view.password,
			email:$scope.view.email
		};
		$http.post(authSrv.getRegisterAddr(),authSrv.getParams(JSON.stringify(jsonParam))).success(function(succ) {
			var msg = succ.message || '';
			$cordovaDialogs.alert(msg, '提示', '确定').then(function(){
				if(succ.success){
					authSrv.logout();
					$rootScope.goBack();
				}
			});
		}).error(function(err) {
			$cordovaToast.showShortCenter('注册信息提交失败，请稍候再试');
		});
	};
});