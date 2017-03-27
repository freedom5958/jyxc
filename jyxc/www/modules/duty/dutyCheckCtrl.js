appMain
.controller('dutyCheckCtrl', function($rootScope, $scope, $ionicActionSheet, $timeout, $location, $stateParams, dateSrv, $ionicModal, authSrv, $http, $cordovaToast, $ionicHistory, $cordovaDialogs, $ionicLoading) {
	'use strict';
	$scope.view = {};
    $scope.form = {
        id : $stateParams.id
    };

    $scope.refresh = function(){
		$scope.loadAccDetail();
	};

    $scope.loadAccDetail = function(){
		$http({
			method:'JSONP',
			url:authSrv.loadAccDetailAdr(),
			params:{id:$scope.form.id}
		}).success(function(succ) {
			$scope.view = succ.data;
		});
	};

	$scope.urgeReply = function(){
		$cordovaDialogs.prompt('请输入催促内容', '催促责任部门回复？', ['取消','催促']).then(function(o) {
			if(o.buttonIndex == 2){
				var content = o.input1;
				var others = {
					id : $scope.form.id,
					deptId : $scope.view.deptId,
					content : content
				};
				var p = authSrv.getParams(JSON.stringify(others));
				$ionicLoading.show({
					template: '正在提交，请稍候'
				});
				$http.post(authSrv.urgeReplyAdr(),p).success(function(succ) {
					$ionicLoading.hide();
					$cordovaToast.showShortCenter(succ.message);
				}).error(function(err){
					$ionicLoading.hide();
					$cordovaToast.showShortCenter('操作失败，请稍候再试');
				});
			}
		});
	};

	$scope.backParent = function(){
		$ionicHistory.goBack();
	};

	$scope.dutyMore = function(){
		$ionicActionSheet.show({
			buttons: [{ text: '删除问责' }],
			cancelText: '取消',
			cancel: function() {
			},
			buttonClicked: function(index) {
				if(index == 0){
					$scope.deleteDuty();
				}
				return true;
			}
		});
	};

	$scope.deleteDuty = function(){
		$cordovaDialogs.confirm('确定删除？', '删除问责', ['取消','删除']).then(function(buttonIndex) {
			if(buttonIndex == 2){
				$http({
					method:'JSONP',
					url:authSrv.delAccAdr(),
					params:{id:$scope.form.id}
				}).success(function(succ) {
					$scope.backParent();
					$cordovaToast.showShortCenter(succ.message);
				}).error(function(err){
					$cordovaToast.showShortCenter('删除失败，请稍候再试');
				});
			}
		});
	};

	$scope.refresh();
});