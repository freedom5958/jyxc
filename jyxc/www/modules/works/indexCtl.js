appMain
.controller('indexCtl', function($rootScope, $scope,$timeout,$ionicLoading,$cordovaToast,$http,LTAction,$ionicModal) {
 	$rootScope.variable.allowQuit = true;

	$scope.showMyReview = function() {
 		$rootScope.redirect('/review/myReviewList');
 	}
 	$scope.showInfo = function(){
 		$rootScope.redirect('/review/infoList');
 	}
 	$scope.showForms = function(){
 		$rootScope.redirect('/review/forms2List');
 	}
 	$scope.showActivity = function(str) {
 		$rootScope.redirect('/review/activityList');
 	}

	//加载用户是否为经办人
	LTAction.requestGetUserHandle(function(data){
		//如果不是经办人则跳转到内容提交
		if(data.data == 'N'){
			$scope.showForms = function(){
				$rootScope.redirect('/review/formsList');
			}
		}
	});

	if(!$rootScope.variable.isLogined){
		$ionicModal.fromTemplateUrl('modules/login/login.html', {
			scope: $rootScope
		}).then(function(modal) {
			modal.scope.close = 'false';
			modal.show();
			$rootScope.loginboxShow = true;
			$rootScope.loginModal = modal;
		});
	}

 });