appMain
.controller('myReviewListCtl', function($rootScope, $scope, reviewSrv, $timeout,$ionicLoading,$http,$cordovaToast,authSrv) {

	$rootScope.variable.allowQuit = false;

	// $scope.waitEvaProjec = reviewSrv.waitEvaProjec;

	$rootScope.reviewListTabSelectedIndex = $rootScope.reviewListTabSelectedIndex || 0;

	if (!$rootScope.variable.isLogined) {
		$rootScope.reviewListTabSelectedIndex = 0;
	}

	$scope.subheaderView = {
		selectedIndex:0,
		hasSubheader:false,
		hasSubheaderValue:''
	};

	$scope.subheaderView.selectedIndex = $rootScope.reviewListTabSelectedIndex;

	if(parseInt($scope.subheaderView.selectedIndex) == 0){
		$scope.subheaderView.selectedIndex = 0;
	}

	$scope.view = {
		waitEva:[],
		alreadyEva:[],
		pageNumber:0
	}
	
	$scope.backParent = function() {
		$rootScope.goBack();
	}

	$scope.selectNeedReviewProject = function(item) {
		if (!$rootScope.variable.isLogined) {
			$ionicLoading.show({
				template:'请您先登录，再进行评议'
			});
			$timeout(function() {
				$ionicLoading.hide();
				$rootScope.isShowLoginView = true;
				$rootScope.userInfo();
			}, 1400);
		}
		else {
			if ($scope.subheaderView.selectedIndex == 0) {
				$rootScope.redirect('/review/fillReview/'+item.formId+'/'+item.name);
			}
			else {
				$rootScope.redirect('/governmentAffairs/showFilledReview/'+item.recordId);
			}
		}
	}

	//获取评议的项目
	$scope.findDeptForm = function() {
		$ionicLoading.show({
			template:'请求中...'
		});
		var url = authSrv.findDeptForm();
		if ($rootScope.variable.isLogined && $scope.subheaderView.selectedIndex == 1) {
			url += "&pageNumber="+$scope.view.pageNumber;
		}
		else {
			url += "&pageNumber=0";
		}
		
		console.log("获取评议的项目url:"+ url );
        $http.jsonp(url).success(function (data) {
            console.log("获取评议的项目:"+ JSON.stringify(data) );
            $ionicLoading.hide();
            if (data.success) {
            	if ($scope.view.pageNumber != 0) {
            		if (!data.data.alreadyEva || data.data.alreadyEva.length == 0) {
            			$cordovaToast.showShortCenter('没有更多数据');
            		}
            	}

            	$scope.view.waitEva = data.data.waitEva;
				$scope.view.alreadyEva = $scope.view.alreadyEva.concat(data.data.alreadyEva);
				// if ($scope.view.waitEva.length > 0 && $scope.view.alreadyEva.length > 0) {
				// 	$scope.subheaderView.hasSubheader = true;
				// 	$scope.subheaderView.hasSubheaderValue = 'has-subheader';
				// }
                if ($scope.subheaderView.selectedIndex == 0) {
                	$scope.waitEvaProjec = $scope.view.waitEva;
                }
                else {
                	$scope.waitEvaProjec = $scope.view.alreadyEva;
                }
            }
            else {
                $cordovaToast.showShortCenter('获取待评议的项目失败');
            }
            $scope.$broadcast('scroll.refreshComplete');
        }).error(function (error) {
        	$ionicLoading.hide();
            $cordovaToast.showShortCenter('网络请求失败');
            $scope.$broadcast('scroll.refreshComplete');
        })
	}

	// $scope.findDeptForm();

	$scope.$watch('variable.isLogined', function(){
		$scope.doRefresh();
	});
	

	$scope.subheaderViewSelected = function(index) {
		$scope.subheaderView.selectedIndex = index;
		$rootScope.reviewListTabSelectedIndex = index;
		if ($scope.subheaderView.selectedIndex == 0) {
            $scope.waitEvaProjec = $scope.view.waitEva;
        }
        else {
            $scope.waitEvaProjec = $scope.view.alreadyEva;
        }
	}

	$scope.loadMore = function() {
		$scope.view.pageNumber++;
		$scope.findDeptForm();
	}

	$scope.doRefresh = function() {
		a = 2;
        $scope.view.pageNumber = 0;
        $scope.view.waitEva = [];
        $scope.view.alreadyEva = [];
        $scope.waitEvaProjec = [];
		$scope.findDeptForm();
    }

    $scope.showStatisticsData = function() {
    	$rootScope.redirect('/projectOfReviewSelector/projectOfReviewSelector');
    }
});