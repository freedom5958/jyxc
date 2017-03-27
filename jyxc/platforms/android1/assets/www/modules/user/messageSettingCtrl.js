appMain
.controller('messageSettingCtrl', function($ionicPlatform, $rootScope, $scope, $ionicActionSheet, $timeout, $location, $stateParams, dateSrv, $ionicModal, authSrv, $http, $cordovaToast, appNavibarSrv, $ionicHistory, $ionicLoading, appSrv,$cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera) {
	'use strict';
	$scope.view = {
		acceptMessage : true,
		voice : false,
		shake : false
	};

});