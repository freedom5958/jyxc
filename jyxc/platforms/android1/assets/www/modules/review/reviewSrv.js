appMain.factory('reviewSrv', function($rootScope, authSrv, $http, $cordovaToast,$ionicLoading){
	'use strict';
	var reviewS = {};

	reviewS.waitEvaProjec = []; //待评议项目

	reviewS.projects = []; //项目
	reviewS.selectedProject = undefined; //已经选择的项目

	return reviewS;
});