appMain
.controller('settingCtrl', function($ionicPlatform, $rootScope, $scope, $ionicActionSheet, $timeout, $location, $stateParams, dateSrv, $ionicModal, authSrv, $http, $cordovaToast, appNavibarSrv, $ionicHistory, $ionicLoading, appSrv,$cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera) {
	'use strict';

	$scope.view = {};

	$scope.form = {};

	$scope.versionUpdate = function(){
		getNewVersions();
	};

	$scope.gotoUpdate = function() {
		cordova.InAppBrowser.open($scope.view.newVersion.path, '_system', 'location=no');
	};

	$scope.closeUpdatePage = function(){
        $scope.updatePageModal.hide();
        $scope.updatePageModal.remove();
    };

	$scope.goMessageSetting = function(){
		$rootScope.redirect('messageSetting');
	};


	var getNewVersions = function() {
		var url = authSrv.getNewVersions();
        url += '&type=dept';
        $http.jsonp(url).success(function (data) {
            console.log("获取版本信息:"+ JSON.stringify(data) );
            if (data.success) {
                $scope.view.newVersion = data.data;
                if ($scope.view.newVersion.version && 
                	($rootScope.constant.APP_VERSION != $scope.view.newVersion.version)) {
                	$ionicModal.fromTemplateUrl('modules/user/updatePage.html', {
						scope: $scope,
						animation: 'none'
					}).then(function(modal) {
						modal.show();
						$scope.updatePageModal = modal;
					});
                }
                else {
                	$cordovaToast.showShortCenter('当前版本已经是最新版本');
                }
            }
            else {
            	$cordovaToast.showShortCenter(data.message);
            }

        }).error(function (error) {
            $cordovaToast.showShortCenter('网络请求失败');
        })
	}
});