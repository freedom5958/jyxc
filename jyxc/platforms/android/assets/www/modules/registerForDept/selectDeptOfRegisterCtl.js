appMain
.controller('selectDeptOfRegisterCtl', function($rootScope, $scope, registerForDeptSrv,$http,$ionicLoading,$cordovaToast,authSrv,$timeout,$ionicHistory) {

    $rootScope.variable.allowQuit = false;
    
	$scope.view={
		depts:[],
		selectedDept:undefined
	}
	
	$scope.backParent = function() {
		$rootScope.goBack();
	}

	//获取部门
	void function(){
		$ionicLoading.show({
            template: '请求中...'
        });

        var url = authSrv.getDepartmentInfoJSONP();
        url += '&phoneNumber=' + $scope.view.account;
        $http.jsonp(url).success(function (data) {
            console.log("获取部门:"+ JSON.stringify(data) );
            $ionicLoading.hide();
            if (data.success) {
                $scope.view.depts = data.data;
            }
            else {
            	$cordovaToast.showShortCenter(data.message);
            }

        }).error(function (error) {
        	$ionicLoading.hide();
            $cordovaToast.showShortCenter('网络请求失败');
        })
	}();


	$scope.selectDeptForRegister = function(dept) {
		for (var i = $scope.view.depts.length - 1; i >= 0; i--) {
			var d = $scope.view.depts[i];
			if (d.id != dept.id) {
				d.selected = false;
			}
		}
		$scope.view.selectedDept = dept;
	}
	
	//确认注册
	$scope.makeSureToRegister = function() {
		if ($scope.view.selectedDept == undefined) {
			$cordovaToast.showShortCenter('请选择部门');
			return;
		}
		register();
	}

	function register() {
		$ionicLoading.show({
            template: '注册中...'
        });

        var params = {};
        params.account = registerForDeptSrv.account;
		params.password = registerForDeptSrv.password;
		params.name = registerForDeptSrv.userName;
		params.email = registerForDeptSrv.email;
		params.deptId = $scope.view.selectedDept.id;
        params.sex = registerForDeptSrv.sex;
        params.age = registerForDeptSrv.age;
        params.education = registerForDeptSrv.education;
        params.dicId = registerForDeptSrv.jobId || '';


        if (authSrv.DeviceType == DeviceType.DeviceTypeOfBrower) {
            console.log('注册参数:'+JSON.stringify(params));
            var url = authSrv.registerForDept();
            url += '&jsonParam=' + JSON.stringify(params);
            $http.jsonp(url).success(function (data) {
                console.log("注册:"+ JSON.stringify(data) );
                $ionicLoading.hide();
                if (data.success) {
                    $cordovaToast.showShortCenter('注册成功');
                    $timeout(function() {
                    	// $rootScope.userInfo();
                    	$ionicHistory.goBack(-2);
                    }, 1600);
                }
                else {
                    $cordovaToast.showShortCenter(data.message);
                }

            }).error(function (error) {
                $ionicLoading.hide();
                $cordovaToast.showShortCenter('网络请求失败');
            })
        }
        else {
            var param = authSrv.getParams();
            param.jsonParam = JSON.stringify(params);

            $http.post(authSrv.registerForDept(),param).success(function(data) {
                $ionicLoading.hide();
                if (data.success) {
                    $cordovaToast.showShortCenter('注册成功');
                    $timeout(function() {
                    	// $rootScope.userInfo();
                    	$ionicHistory.goBack(-2);
                    }, 1600);
                }
                else {
                    $cordovaToast.showShortCenter(data.message);
                }
            }).error(function(err){
                $ionicLoading.hide();
                $cordovaToast.showShortCenter('网络请求失败');
            });
        }
	}
});