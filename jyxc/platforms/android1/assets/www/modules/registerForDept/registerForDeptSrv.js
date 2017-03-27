appMain.factory('registerForDeptSrv', function($rootScope, authSrv, $http, $cordovaToast,$ionicLoading){
	'use strict';
	var registerSrv = {};

	registerSrv.account = '';
    registerSrv.securityCode = '';
    registerSrv.userName = '';
    registerSrv.password = '';
    registerSrv.email = '';
    registerSrv.age ='';
    registerSrv.job = '';
    registerSrv.sex = '';
    registerSrv.education ='';

    registerSrv.jobId = '';

	return registerSrv;
});