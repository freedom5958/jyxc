appMain.controller('activityViewCtl', function($rootScope, $scope, reviewSrv,$stateParams, $timeout,$ionicLoading,$http,$cordovaToast,authSrv, LTAction) {

	$rootScope.variable.allowQuit = false;
	$rootScope.reviewListTabSelectedIndex = $rootScope.reviewListTabSelectedIndex || 0;

	$scope.params = {
		noticeId:$stateParams.activityId,
		noticeType:1,
		view:{}
	};

	LTAction.requestGetNotice(function(data){
		$scope.view = data.data;
		for( var n in $scope.view.mobileimage){
			$scope.view.mobileimage[n] = $scope.params.server_path+$scope.view.mobileimage[n];
		}
		console.log(data);
	},$scope.params);
});