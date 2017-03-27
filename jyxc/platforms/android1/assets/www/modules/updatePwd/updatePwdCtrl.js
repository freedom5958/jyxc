appMain
.controller('updatePwdCtrl', function($scope, $rootScope, $ionicLoading, $cordovaToast, $http, authSrv, $cordovaDialogs,LTAction) {
	$rootScope.variable.allowQuit = false;
	$scope.view = {
		oldPwd:'',
		password:'',
		password2:''
	};
	$scope.submitRegister = function(){
		if(!$scope.view.oldPwd){
			LTAction.alert('请输入旧密码');
			return;
		}
		if(!$scope.view.password){
			LTAction.alert('请输入新密码');
			return;
		}
		if(!$scope.view.password2){
			LTAction.alert('请再次输入新密码');
			return;
		}
		if($scope.view.password != $scope.view.password2){
			LTAction.alert('两次输入的新密码不一致');
			return;
		}

		var p = {
			id:$rootScope.variable.userId,
			oldPwd:authSrv.encry($scope.view.oldPwd),
			newPwd:authSrv.encry($scope.view.password)
		};
		$http.post(authSrv.getUpdateUserPassWordAddr(),p).success(function(succ) {
			var msg = succ.message || '';
			$cordovaDialogs.alert(msg, '提示', '确定').then(function(){
				if(succ.success){
					authSrv.logout();
					$rootScope.redirect('/tab/work');
				}
			});
		}).error(function(err) {
			LTAction.alert('操作失败，请稍候再试');
		});
	};
});