appMain.controller('messagesCtl', function($rootScope, $scope,$timeout,$ionicPopup,$ionicLoading,$cordovaToast,$http,Room,User,LTAction,$ionicModal) {
 	$rootScope.variable.allowQuit = false;
	LTAction.getMessageList(function(data){
		console.log(data.data);
		$scope.activities = data.data;
	});
	/*LTAction.initNJMessage(function(){
		
			LTAction.getConversation(function(data){

				var userList = {};
				var groupIds = [];
				var userIds = [];
				var conversationsData = data;
				for(var n in data.conversations){
					if(data.conversations[n].type == '3'){//如果是用户聊天
						userIds.push(data.conversations[n].name);
					}else if(data.conversations[n].type == '4'){
						groupIds.push(data.conversations[n].key);
					}
				}
				//获取这些用户信息
				LTAction.getConversationList(function(data){
					for(var m in data.data){
						userList[data.data[m].userId] = data.data[m];
					}
					//生成输出内容
					var datalist = [];
					//console.log(groupList);
					//console.log(conversationsData.conversations);
					for(var n in conversationsData.conversations){
						if(conversationsData.conversations[n].type == '4'){
							try{
								datalist.push({
									id:userList[conversationsData.conversations[n].key].userId,
									title:userList[conversationsData.conversations[n].key].nickName,//头像
									thumbnail:userList[conversationsData.conversations[n].key].userPhoto,//类型，是否有新消息
									latest_chat:userList[conversationsData.conversations[n].key].lastMessageContent,//昵称
									activeTime:userList[conversationsData.conversations[n].key].lastMessageTime,//最后回复时间
									type:'group'
								});
							}catch(e){}
						}else{
							try{
								datalist.push({
									id:userList[conversationsData.conversations[n].name].userId,
									title:userList[conversationsData.conversations[n].name].nickName,//头像
									thumbnail:userList[conversationsData.conversations[n].name].userPhoto,//类型，是否有新消息
									latest_chat:userList[conversationsData.conversations[n].name].lastMessageContent,//昵称
									activeTime:userList[conversationsData.conversations[n].name].lastMessageTime,//最后回复时间
									type:'user'
								});
							}catch(e){}
						}
					}
					$scope.activities = datalist;
				},{
					userIds:userIds,
					groupIds:groupIds
				});
				
			});
		
	},{
		userId:$rootScope.variable.userId
	});*/
	/*LTAction.initNJMessage(function(){},{
		userId:$rootScope.variable.userId,
		onMsgReceive:function(data){
			//当停留在此界面，并有新消息时，进行新消息提示
			for(var n in data.messages){
				//如果不是群组消息则去除
				if(data.messages[n].content.target_type != 'group' || data.messages[n].content.target_id != $stateParams.roomId){
					continue;
				}
				if(Chat.notLoad(data.messages[n].msg_id)){
					Chat.add(data.messages[n].content.msg_body.text,data.msg_id,data.messages[n].content.from_id);
				}
			}
			document.getElementById('content').innerHTML = Chat.html($rootScope.variable.userId);
			$ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
		}
	});*/

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

    $scope.remove = function(e) {
        Room.remove(e)
    };
    $scope.goFriendsList = function(){
    	$rootScope.redirect('/tab/friends');
    };
	$scope.setUserInfo = function(userId,nickname){
		$rootScope.variable.userId = userId;
		$rootScope.variable.userName = nickname;
	};
	$scope.openGroups = function(){
    	$rootScope.redirect("/tab/groups");
    }

	if(!$rootScope.variable.isLogined){
		$ionicModal.fromTemplateUrl('modules/login/login.html', {
			scope: $rootScope
		}).then(function(modal) {
			modal.scope.close = 'false';
			modal.show();
			$rootScope.loginboxShow = true;
			$rootScope.loginModal = modal;
		});
	}
 });
 