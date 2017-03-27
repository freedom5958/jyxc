appMain.controller("friendsCtl", function($scope, $stateParams, $ionicPopup, User, Room, $state,LTAction,$ionicLoading,$rootScope) {
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
	
	$scope.updateVerify();
    
    /*
	屏蔽
	for (var a in e.friends) {
        var s = r.getByUserId(e.friends[a].id);
        e.friends[a].room = s
    }*/
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
						$ionicLoading.hide();
						//暂时为必须验证，这里暂时不放内容，如果需要即时通过验证的分支的话可以在这里加上刷新内容代码
						LTAction.alert(data.message);
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

	LTAction.requireFriend(function(data){
		console.log(data);
		i.setFriendList(data.data);
		e.friends = i.all();
		console.log('会话列表信息:' + JSON.stringify(i.all()));
	});
});