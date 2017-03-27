appMain
.controller('userCtrl', function($ionicPlatform, $rootScope, $scope, $ionicActionSheet, $timeout, $location, $stateParams, dateSrv, $ionicModal, authSrv, $http, $cordovaToast, appNavibarSrv, $ionicHistory, $ionicLoading, appSrv,$cordovaImagePicker) {
	'use strict';
	$rootScope.variable.allowQuit = true;
	$scope.goUserInfo = function(){
        if($rootScope.variable.isLogined){
        	$rootScope.redirect('userInfo');
        }else{
        	$rootScope.userInfo();
        }
	};

	$scope.goRegisterUser = function(){
		$rootScope.redirect('register');
	};

	$scope.goUpdatePwd = function(){
		$rootScope.redirect('updatePwd');
	};

	$scope.goSetting = function(){
		$rootScope.redirect('setting');
	};


});