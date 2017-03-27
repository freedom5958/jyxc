appMain
.controller('registerForDeptCtl', function($rootScope, $scope,$timeout,authSrv,registerForDeptSrv,$http,$cordovaToast,$interval) {
    $rootScope.variable.allowQuit = false;

	$scope.getSecurityCodeNotify = '获取验证码'

	$scope.view = {
       	account: '',
        securityCode: '',
        userName:'',
        password: '',
        password2: '',
        enableGetSecurityCode: true,
        registedAccount:'',
        age:'',
        job:'',
        sex:'请选择您的性别',
        sexOptions:['请选择您的性别','男','女'],
        education:'请选择您的学历',
        educationOptions:['请选择您的学历','小学及以下','初中','高中','大专','大学','研究生及以上'],
        role:'请选择您的职务',
        roles:[],
        roleOptions:[]
    };

    $scope.view.roleOptions.push('请选择您的职务');
	
	$scope.backParent = function() {
		$rootScope.goBack();

		$timeout(function() {
			$rootScope.userInfo()
		}, 70);
	}

	$scope.accountBlur = function(){
		console.log('验证账号是否注册过');
		if (0 == $scope.view.account.trim().length) {
			return;
		}
		$scope.view.registedAccount = '';
		var url = authSrv.isRegister();
        url += '&phoneNumber=' + $scope.view.account;
        $http.jsonp(url).success(function (data) {
            console.log("验证账号是否注册过:"+ JSON.stringify(data) );
   
            if (!data.success) {
                $scope.view.registedAccount = $scope.view.account;
                $cordovaToast.showShortCenter('此账号已经注册过');
            }

        }).error(function (error) {
            $cordovaToast.showShortCenter('网络请求失败');
        })
	}

	// 获取验证码
	$scope.getSecurityCode = function() {
		if (!$scope.view.account) {
            $cordovaToast.showShortCenter('请输入手机号');
            return;
        }

        $scope.view.enableGetSecurityCode = false;
        $scope.setDownTime();

        var url = authSrv.getPhoneCodeAddr();
        url += '&phoneNumber=' + $scope.view.account;
        url += '&type=1';
        $http.jsonp(url).success(function (data) {
            console.log("获取验证码:"+ JSON.stringify(data) );
            if (data.success) {
                $cordovaToast.showShortCenter('验证码已发送到手机:\n'+ $scope.view.account +'请查收');
            }
            else {
            	$cordovaToast.showShortCenter('发送验证码失败');
            }

        }).error(function (error) {
            $cordovaToast.showShortCenter('网络请求失败');
        })
	}

	$scope.nextStep = function() {

		if (!$scope.view.account) {
                $cordovaToast.showShortCenter('请输入手机号');
                return;
        }
        if (!$scope.view.securityCode) {
                $cordovaToast.showShortCenter('请输入验证码');
                return;
        }
        if (!$scope.view.userName) {
                $cordovaToast.showShortCenter('请输入用户名');
                return;
        }
        // if ($scope.view.sex == '请选择您的性别' || $scope.view.sex.length == 0) {
        //     $cordovaToast.showShortCenter('请选择您的性别');
        //     return;
        // }
        // if(isNaN($scope.view.age)){
        //     $cordovaToast.showShortCenter('请输入数字');
        //     return;
        // }

        // if (!$scope.view.age) {
        //     $cordovaToast.showShortCenter('请输入您的年龄');
        //     return;
        // }

        // if ($scope.view.education == '请选择您的学历' || $scope.view.education.length == 0) {
        //     $cordovaToast.showShortCenter('请选择您的学历');
        //     return;
        // }
        // if ($scope.view.role == '请选择您的职务' || $scope.view.role.length == 0) {
        //     $cordovaToast.showShortCenter('请选择您的职务');
        //     return;
        // }
        // if (!$scope.view.job) {
        //     $cordovaToast.showShortCenter('请输入您的职务');
        //     return;
        // }
        if (!$scope.view.password) {
                $cordovaToast.showShortCenter('请输入密码');
                return;
        }
        if (!$scope.view.password2) {
                $cordovaToast.showShortCenter('请再次输入密码');
                return;
        }
        if ($scope.view.password != $scope.view.password2) {
                $cordovaToast.showShortCenter('两次输入的密码不一致');
                return;
        }
        if ($scope.view.registedAccount.trim() == $scope.view.account.trim()) {
        	$cordovaToast.showShortCenter('此账号已经注册过');
        	return;
        }

        $timeout(function() {
        	checkVerificationCode();
        }, 1000);
	}

	function goToNextPage() {
        registerForDeptSrv.account = $scope.view.account;
    	registerForDeptSrv.securityCode = $scope.view.securityCode;
    	registerForDeptSrv.userName = $scope.view.userName;
    	registerForDeptSrv.password = $scope.view.password;
    	registerForDeptSrv.password2 = $scope.view.password2;
        registerForDeptSrv.age = $scope.view.age;
        registerForDeptSrv.job = $scope.view.role;
        registerForDeptSrv.sex = $scope.view.sex;
        registerForDeptSrv.education = $scope.view.education;

        for (var i = 0; i < $scope.view.roles.length; i++) {
            var role = $scope.view.roles[i];
            if (role.name == $scope.view.role) {
                registerForDeptSrv.jobId = role.id;
            }
        }
		$rootScope.redirect('selectDeptOfRegister');

	}
	

	$scope.codetime = "获取验证码";
    // 设置倒计时
    $scope.setDownTime = function() {
        $scope.time = 60;
        var timer = null;
        timer = $interval(function(){
        	$scope.time = $scope.time - 1;
        	$scope.codetime = $scope.time+"秒";
            if($scope.time === 0) {
        		$scope.view.enableGetSecurityCode = true;
                $scope.codetime = "获取验证码";
                $interval.cancel(timer);
            }
        }, 1000);
    };
	
    //校验短信验证码是否正确
    function checkVerificationCode() {
    	if (authSrv.DeviceType == DeviceType.DeviceTypeOfBrower) {
            var url = authSrv.checkVerificationCode();
            url += '&phoneNumber=' + $scope.view.account;
            url += '&verificationCode=' + $scope.view.securityCode;
            console.log('校验短信验证码是否正确URL:'+ url);
            $http.jsonp(url).success(function (data) {
            	console.log('校验短信验证码是否正确:'+ JSON.stringify(data));
                if (data.success) {
                    goToNextPage();
                }
                else {
                    $cordovaToast.showShortCenter(data.message);
                }

            }).error(function (error) {
                $cordovaToast.showShortCenter('网络请求失败');
            });
        }
        else {
        	// $cordovaToast.showShortCenter('校验短信验证码是否正确:');
            var param = authSrv.getParams();
            param.phoneNumber = $scope.view.account;
			param.verificationCode = $scope.view.securityCode;

            $http.post(authSrv.checkVerificationCode(),param).success(function(data) {
            	// $cordovaToast.showShortCenter(JSON.stringify(data));
                if (data.success) {
                    goToNextPage();
                }
                else {
					goToNextPage();

                    $cordovaToast.showShortCenter(data.message);
                }
            }).error(function(err){
				//<JQQ> 屏蔽验证码
				goToNextPage();
				//<JQQ> END
                //$cordovaToast.showShortCenter('网络请求失败');
            });
        }
    }

    // //获取角色
    // var findRoles = function() {

    //     var url = authSrv.findRoles();
    //     $http.jsonp(url).success(function (data) {
    //         console.log("获取角色:"+ JSON.stringify(data) );
    //         if (data.success) {
    //             $scope.view.roles = data.data;
    //             for (var i = 0; i <= data.data.length - 1; i++) {
    //                 var dict = data.data[i];
    //                 $scope.view.roleOptions.push(dict.name);
    //             }
    //         }
    //         else {
    //             $cordovaToast.showShortCenter('获取角色失败');
    //         }

    //     }).error(function (error) {
    //         $cordovaToast.showShortCenter('网络请求失败');
    //     })
    // }

    // findRoles();
    
});