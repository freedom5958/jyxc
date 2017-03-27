appMain
.controller('projectOfReviewSelectorCtl', function($rootScope, $scope, $http,$cordovaToast,$ionicLoading,authSrv) {

	// (function(){
	// 	$scope.projects = [];
	// 	for (var i = 0; i < reviewSrv.projects.length; i++) {
	// 		var item = reviewSrv.projects[i]
	// 		item.checked = false;
	// 		$scope.projects.push(item);
	// 	}
	// }());

	$rootScope.variable.allowQuit = false;
	
	$scope.backParent = function() {
		$rootScope.goBack();
	}

	// $scope.makeSure = function() {
	// 	for (var i = 0; i < reviewSrv.projects.length; i++) {
	// 		var item = reviewSrv.projects[i]
	// 		if (item.checked) {
	// 			reviewSrv.selectedProject = item;
	// 			break;
	// 		}
	// 	}
	// 	$rootScope.goBack();
	// }

	var findRelevantForm = function(){
		$ionicLoading.show({
            template: '请求中...'
        });
		var url = authSrv.findRelevantForm();
        $http.jsonp(url).success(function (data) {
            console.log("获取已评议的项目信息:"+ JSON.stringify(data) );
            $ionicLoading.hide();
            if (data.success) {
                $scope.projects = data.data;
            }
            else {
                $cordovaToast.showShortCenter('获取已评议的项目失败');
            }
            $scope.$broadcast('scroll.refreshComplete');
        }).error(function (error) {
        	$ionicLoading.hide();
            $cordovaToast.showShortCenter('网络请求失败');
            $scope.$broadcast('scroll.refreshComplete');
        })

	}

	findRelevantForm();
	
	$scope.doRefresh = function() {
        findRelevantForm();
    }

    $scope.selectProject = function(project) {
    	$rootScope.redirect('/singleProjectStatistics/singleProjectStatistics/'+project.formId + '/' + project.name);
    }
});