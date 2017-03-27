appMain.controller('activityListCtl', function($rootScope, $scope, reviewSrv, $timeout,$ionicLoading,$http,$cordovaToast,authSrv, LTAction) {

	$rootScope.variable.allowQuit = false;
	$rootScope.reviewListTabSelectedIndex = $rootScope.reviewListTabSelectedIndex || 3;

	if (!$rootScope.variable.isLogined) {
		$rootScope.reviewListTabSelectedIndex = 0;
	}

	$scope.params = {
		pageIndex:0,
		noticeType:1,
		pageSize:10,
		newData:[],
		noticeList:[]
	};

	//加载内容
	$scope.showInfo = function(item) {
		$rootScope.redirect('/review/activityList/view/'+item.noticeId);
	}

	$scope.loadMore = function(){
		LTAction.getNoticeList(function(data) {
			$scope.params.pageIndex++;
			$scope.params.newData = data.data;
			for(var n in data.data){
				$scope.params.noticeList.push(data.data[n]);
			}
			$scope.$broadcast('scroll.refreshComplete');
			//$scope.More();
		},$scope.params);
	}
	$scope.loadMore();

	$scope.doRefresh = function(item){
		$scope.params.pageIndex = 0;
		LTAction.getNoticeList(function(data) {
			$scope.params.noticeList = data.data;
			$scope.$broadcast('scroll.refreshComplete');
			//$scope.More();
		},$scope.params);
	}

});