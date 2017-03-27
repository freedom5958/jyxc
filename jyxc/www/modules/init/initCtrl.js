appMain
.controller('initCtrl', function(LS,LTAction, $ionicPlatform, $state,$rootScope, $scope, $ionicActionSheet, $timeout, $location, $stateParams, dateSrv, $ionicModal, authSrv, $http, $cordovaToast, appNavibarSrv, $ionicHistory, $ionicLoading, appSrv,$cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera) {
	'use strict';

	$scope.loginToHome = false;
	
	$ionicModal.fromTemplateUrl('modules/login/login.html', {
		scope: $rootScope
	}).then(function(modal) {
		$rootScope.loginboxShow = true;
		$rootScope.loginModal = modal;
	});

	$rootScope.userInfo = function() {
		$rootScope.loginModal.show();
	};

	$rootScope.closeLogin = function() {
		$rootScope.loginboxShow = false;
		$rootScope.loginModal.hide();
		// ionic.Platform.exitApp();
	};

	$rootScope.toRegister = function() {
		$rootScope.closeLogin();
		
		// $rootScope.redirect('register');
		$rootScope.redirect('registerForDept');
		// $rootScope.redirect('selectDeptOfRegister');
	};

	$rootScope.doLogin = function() {
		if((!$rootScope.variable.account) || (!$rootScope.variable.password)){
			$cordovaToast.showShortCenter('用户名密码不能为空');
			return;
		}
		$ionicLoading.show({
	    	content: 'Loading',
	    	animation: 'fade-in',
	    	// showBackdrop: true,
	    	// maxWidth: 200,
	    	// showDelay: 0
	  	});
		console.log("处理登录");
		authSrv.login().then(function(succ){
			$rootScope.closeLogin();
			$ionicLoading.hide();
			$rootScope.redirect('/tab/works');
			return false;
			if ($scope.loginToHome) {
				// $rootScope.redirect('/tab/home');
	        		$rootScope.redirect('/tab/governmentAffairs');
			}
		},function(err){
			$ionicLoading.hide();
			var message = err.msg || '登录失败，请重试';
			$cordovaToast.showShortCenter(message);
			if (message == '帐号不存在！') {
				$timeout(function() {
					//$rootScope.toRegister();
				}, 1600);
			}
		});
	};

	/*
	 * 导航
	 */
	$rootScope.redirect = function(url){
		if(url){
			$location.path(url);
		}
	};

	/*
	 * 返回
	 */
	$rootScope.goBack = function() {
		$ionicHistory.goBack();
	};


	var getNewVersions = function() {
		var url = authSrv.getNewVersions();
        url += '&type=dept';
        $http.jsonp(url).success(function (data) {
            console.log("获取版本信息:"+ JSON.stringify(data) );
            if (data.success) {
                $scope.newVersion = data.data;
                $scope.view = {};
                $scope.view.newVersion = data.data;
                if ($scope.newVersion.version && 
                	($rootScope.constant.APP_VERSION != $scope.newVersion.version)) {
                	$ionicModal.fromTemplateUrl('modules/user/updatePage.html', {
						scope: $scope,
						animation: 'none'
					}).then(function(modal) {
						modal.show();
						$scope.updatePageModal = modal;
					});
                }
                else {
                	initApp();
                }
            }
            else {
            	initApp();
            }

        }).error(function (error) {
            initApp();
        })
	}

	$ionicPlatform.ready(function() {
		getNewVersions();
        // if(window.cordova){
        //     $rootScope.constant.DB = window.sqlitePlugin.openDatabase({name: 'jyxcleader.db', location: 'default'});
        // }else{
        //     $rootScope.constant.DB = window.openDatabase("jyxcleader.db", '1.0', 'jyxcleader', 1024 * 1024 * 2);
        // }
        // appSrv.initDb().then(function(){
        //     return authSrv.getAuthInfo().then(function(){
        //         return authSrv.login();
        //     },function(){
        //     	$scope.loginToHome = true;
        //     	$rootScope.userInfo();
        //     });
        // }).finally(function(){
	       //  // appNavibarSrv.loadAttentions().finally(function(){
	       //  	if ($rootScope.variable.isLogined) {
	       //  		// $rootScope.redirect('/tab/home');
	       //  		$rootScope.redirect('/tab/governmentAffairs');
	       //  	}
	       //  	else {
	       //  		$scope.loginToHome = true;
        //     		$rootScope.userInfo();
	       //  	}
	       //  // });
        // });
    });

	// old 启动登录
    // var initApp = function () {
    // 	if(window.cordova){
    //         $rootScope.constant.DB = window.sqlitePlugin.openDatabase({name: 'jyxcleader.db', location: 'default'});
    //     }else{
    //         $rootScope.constant.DB = window.openDatabase("jyxcleader.db", '1.0', 'jyxcleader', 1024 * 1024 * 2);
    //     }
    //     appSrv.initDb().then(function(){
    //         return authSrv.getAuthInfo().then(function(){
    //             return authSrv.login();
    //         },function(){
    //         	$scope.loginToHome = true;
    //         	$rootScope.userInfo();
    //         });
    //     }).finally(function(){
	   //      // appNavibarSrv.loadAttentions().finally(function(){
	   //      	if ($rootScope.variable.isLogined) {
	   //      		// $rootScope.redirect('/tab/home');
	   //      		$rootScope.redirect('/tab/governmentAffairs');
	   //      	}
	   //      	else {
	   //      		$scope.loginToHome = true;
    //         		$rootScope.userInfo();
	   //      	}
	   //      // });
    //     });
    // }


    var initApp = function () {
    	if(window.cordova){
            $rootScope.constant.DB = window.sqlitePlugin.openDatabase({name: 'jyxcleader.db', location: 'default'});
        }else{
            $rootScope.constant.DB = window.openDatabase("jyxcleader.db", '1.0', 'jyxcleader', 1024 * 1024 * 2);
        }

		//提前引入LTAction
		LTAction.init();
        appSrv.initDb().then(function(){
            return authSrv.getAuthInfo().then(function(){
                return authSrv.login(true);
            });
        }).finally(function(){
	        $rootScope.redirect('/tab/works');
        });
    }



	$scope.gotoUpdate = function() {
		cordova.InAppBrowser.open($scope.newVersion.path, '_system', 'location=no');
		// cordova.InAppBrowser.open('http://www.163.com', '_system', 'location=no');
	};

	$scope.closeUpdatePage = function(){
        $scope.updatePageModal.hide();
        $scope.updatePageModal.remove();
        if ($scope.newVersion.isMustUp) {
        	ionic.Platform.exitApp();
        }
        else {
        	$rootScope.variable.isUpdatable = true;
        	initApp();
        }
    };

	$rootScope.doLogout = function() {
		authSrv.logout();
		$scope.loginToHome = true;
        $rootScope.userInfo();
	};


	/*
	 * 注册极光信息
	 */
	try{
		window.plugins.jPushPlugin.init();
		window.plugins.jPushPlugin.setDebugMode(true);
		window.plugins.jPushPlugin.setStatisticsOpen(true);
		/*window.plugins.jPushPlugin.errorCallback = function(msg){
			LTAction.error('jPush init errorcallback：'+msg);
		};*/

		/*window.plugins.jPushPlugin.receiveMessage = function(data){
			alert('receiveMessage');
		}
		/*document.addEventListener("jpush.init",function(event){
			alert('jpush init end');
		});*/
		//setTagsWithAlias
		document.addEventListener("jpush.setTagsWithAlias",function(event){
			if(event.resultCode != '0'){
				LTAction.alert('Set push alias error'+event.resultCode);
			}
		});
		/*for(var n in window.plugins.jPushPlugin){
			alert(n+':'+window.plugins.jPushPlugin[n]);
		}*/

		//绑定设备标识
		//if($rootScope.variable.userId){
			//setTimeout(function(){
				//window.plugins.jPushPlugin.setAlias($rootScope.variable.userId);
				//window.plugins.jPushPlugin.setTagsWithAlias(null,$rootScope.variable.userId);
			//},1000);
		//}
		//window.plugins.jPushPlugin.stopPush();
		//alert('init jpush end');
	}catch(e){
		//LTAction.alert('Init push error：'+e);
	}
	
	/*
	* 推送信息处理
	*/
	try{

		document.addEventListener('pause',function(){
			//window.plugins.jPushPlugin.resumePush();
			//请求服务器更新用户在线状态
			if($rootScope.variable.isLogined){
				LTAction.requestUpdateOnline(function(){},{
					status:'0'
				});
			}
		});
		document.addEventListener('resume',function(){
			//window.plugins.jPushPlugin.stopPush();
			if($rootScope.variable.isLogined){
				LTAction.requestUpdateOnline(function(){},{
					status:'1'
				});
			}
		});

		$rootScope.updateOnline = function(){
			//注册极光事件处理
			LTAction.initNJMessage(function(){},{
				userId:$rootScope.variable.userId
			});

			$rootScope.event_jMessageOnMsgReceiveCallback.def = function(data){
				//将消息写入LS中
				for(var n in data.messages){
					if(data.messages[n].msg_type == '3'){
						LS.setInc('message_user_'+data.messages[n].content.from_id);
					}else{
						LS.setInc('message_group_'+data.messages[n].from_gid);
					}
				}
				$rootScope.messageNumber = LS.allNumber();
				$rootScope.$apply();
			};
			$rootScope.messageNumber = LS.allNumber();
			LTAction.requestUpdateOnline(function(){},{
				status:'1'
			});
		}

		window.plugins.jPushPlugin.openNotification = window.plugins.jPushPlugin.openNotificationInAndroidCallback = function(data){
			try{
				if(data.extras.noticeType == 'message'){//即时聊天
					if(data.extras.activeType == '0'){
						$state.go('room',{roomId:'user_'+data.extras.acceptUserId,nickname:data.extras.acceptUserName});
						//$rootScope.redirect('/room/user_'+data.extras.acceptUserId+'/'+data.extras.acceptUserName);
					}else{
						$state.go('room',{roomId:'group_'+data.extras.acceptUserId,nickname:data.extras.acceptUserName});
						//$rootScope.redirect('/room/group_'+data.extras.acceptUserId+'/'+data.extras.acceptUserName);
					}
				}else if(data.extras.noticeType == 'notice'){
					$state.go('infoView',{noticeId:data.extras.noticeId});
					//$rootScope.redirect('/review/infoList/view/'+data.extras.toId);
				}else if(data.extras.noticeType == 'activity'){
					//$rootScope.redirect('/review/activityList/view/'+data.extras.toId);
					$state.go('activityView',{activityId:data.extras.activityId});
				}else if(data.extras.noticeType == 'verifyFriend'){
					$state.go('tab.factive');
				}
			}catch(e){
				LTAction.alert('解析推送信息错误：'+e);
			}
		}
	}catch(e){
		//LTAction.alert('Init push listence error：'+e);
	}
});