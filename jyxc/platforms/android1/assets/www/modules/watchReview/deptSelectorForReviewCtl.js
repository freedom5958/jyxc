appMain
.controller('deptSelectorForReviewCtl', function($rootScope, $scope,$timeout,$ionicLoading,$cordovaToast,$http,
	authSrv,$stateParams) {

    $rootScope.variable.allowQuit = false;
   
   	$scope.view = {};

	$scope.backParent = function() {
        $rootScope.goBack();
    }

    $scope.confirm = function() {
    	$rootScope.selectedDeptsForReview = [];
    	for (var i = 0; i < $scope.view.depts.length; i++) {
    		var dict = $scope.view.depts[i];
    		if(dict.selected) {
    			$rootScope.selectedDeptsForReview.push(dict);
    		}
    	}
    	$rootScope.goBack();
    }


    //获取部门
    var findDeptByFormId = function() {
    	$scope.view.depts = [];
    	$ionicLoading.show({
            template: '请求中...'
        });

        var url = authSrv.findDeptByFormId();
        url += '&formId='+$stateParams.formId;
        $http.jsonp(url).success(function (data) {
            console.log("获取部门:"+ JSON.stringify(data) );
            $ionicLoading.hide();
            if (data.success) {
                for (var i = 0; i < data.data.length; i++) {
                	var deptDict = data.data[i];
                	deptDict.selected = false;
                	// $scope.view.depts.push(deptDict);
                }
            }
            else {
            	$cordovaToast.showShortCenter('获取角色失败');
            }

        }).error(function (error) {
        	$ionicLoading.hide();
            $cordovaToast.showShortCenter('网络请求失败');
        })
	}

	findDeptByFormId();

});