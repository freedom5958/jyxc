appMain.controller("factiveCtl", function($scope, $stateParams, $ionicPopup, User, Room, $state, LTAction,$ionicLoading,$cordovaToast,$rootScope,NJMessage,authSrv,$http) {
	$rootScope.variable.allowQuit = false;
    var e = $scope, t = $stateParams, n = $ionicPopup, i = User, r = Room, o = $state;
    e.$state = o;

	$scope.FriendHBack = function(){
		$rootScope.redirect('/tab/messages');
	}

	$scope.verifyNumber = 0;
	
	$scope.updateVerify = function(){
		LTAction.requireVerifyFriend(function(data){
			$scope.verifyNumber = 0;
			for(var n in data.data){
				if(data.data[n].verifyType == 'requested' && data.data[n].verifyStatus == '0'){
					$scope.verifyNumber++;
				}
			}
		});
	}

	LTAction.requireVerifyFriend(function(data){
		$scope.verifyNumber = 0;
		for(var n in data.data){
			if(data.data[n].verifyType == 'requested' && data.data[n].verifyStatus == '0'){
				$scope.verifyNumber++;
			}
		}
		i.setFriendList(data.data);
		e.friends = i.all();
		e.showPromptAdd = function() {
			$ionicPopup.prompt({
				title: "添加联系人",
				template: "输入手机号码查找好友！",
				inputType: "number",
				inputPlaceholder: "手机号码",
				cancelType: "button-clear",
				cancelText : "取消",
				okText: "添加",
				okType: "button-calm"
			}).then(function(promptData) {
				if(typeof promptData == 'undefined'){
					return ;
				}
				if(!/^[0-9]{11}$/.test(promptData)){
					LTAction.alert('请输入正确的手机号码');
					return ;
				}
				$ionicLoading.show({
					template:'请求中'
				});
				LTAction.requestGetUserinfoByMobile(function(data){
					if(data.success){
						//检验用户是否与当前用户是同一人
						if(data.data.userId == $rootScope.variable.userId){
							LTAction.alert('您不能添加自己为好友');
							return ;
						}
						LTAction.requestAddFriend(function(data){
							LTAction.requireVerifyFriend(function(data){
								$ionicLoading.hide();
								i.setFriendList(data.data);
								console.log(data.data);
								e.friends = i.all();
							});
						},{
							toUserId:data.data.userId
						});
					}else{
						$ionicLoading.hide();
						LTAction.alert(data.message);
					}
				},{
					account:promptData
				});
				
			})
		}
	});

    

	e.verifyFriend = function(item){
		$ionicLoading.show({
			template:'请求中'
		});
		LTAction.requireVerifyFriend(function(data){
			$ionicLoading.hide();
			//更新当前好友信息列表
			i.removeData(item);
			e.friends = i.all();
		},{
			userId:$rootScope.variable.userId
		});
	}

	LTAction.initNJMessage(function(){
		$ionicLoading.hide();
	},{
		userId:$rootScope.variable.userId
	});

	

	$scope.goVerifyFriend = function(user,el){
		console.log("触发了接受好友请求事件");
		//极光注册对方信息
		NJMessage.register(user.userId,'99SDRAKCY',function(data){});
		//向服务器请求
		LTAction.requestConfirmFriend(function(data){
			console.log(data);
			if(data.success){
				$scope.updateVerify();
				//将内容更变
				user.verifyStatus = '1';
				i.updateFriend(user);
				e.friends = i.all();
				LTAction.alert('通过好友验证');
			}else{
				LTAction.alert('通过好友验证失败');
			}
		},{
			verifyId:user.verifyId,
			status:1
		});
	}
});