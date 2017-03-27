appMain.controller("roomCtl", function(LS,$ionicModal,$rootScope, $scope, $stateParams, Room, Chat, LTAction, $ionicLoading, NJMessage, $ionicScrollDelegate) {
	var e = $scope, t = $stateParams, n = Room, i = Chat;
	$rootScope.variable.allowQuit = false;

	if(t.roomId.indexOf('group_') > -1){//群聊
		t.roomId = t.roomId.substring(6);
		t.roomType = 'group';
	}else{//单聊
		t.roomId = t.roomId.substring(5);
		t.roomType = 'user';
	}

	LS.set('message_'+t.roomType+'_'+t.roomId,0);

	$ionicLoading.show({
		template: '连线中...'
	});

	$scope.$on('$destroy',function(){            
		$rootScope.event_jMessageOnMsgReceiveCallback['room'] = null;
		LS.set('message_'+t.roomType+'_'+t.roomId,0);
		$rootScope.messageNumber = LS.allNumber();
	});

	$scope.groupUserList = [];

	$scope.roomType = t.roomType;
	$scope.goUserList = function(){
		$ionicModal.fromTemplateUrl("modules/messages/groupUserList.html", {
	        scope: $scope,
	        animation: "slide-in-right"
	    }).then(function(model) {
	    	//获取群组成员
	    	LTAction.getGroupUserList(function(data){
	    		$scope.groupUserList = data.data;
	    		console.log(data);
	    	},{
	    		groupCode:t.roomId
	    	});
	        $scope.groupUserListModel = model;
	        $scope.groupUserListModel.show();
	    })
	};

	$scope.goRoom = function(user){
		if(user.userId == $rootScope.variable.userId){
			LTAction.alert('您不能与自己对话');
			return false;
		}
		$scope.groupUserListModel.remove();
		$rootScope.redirect('/room/user_'+user.userId+'/'+user.nickName);
	}

	$scope.closeGroupUserList = function(){
		try{
			$scope.groupUserListModel.remove();
		}catch(e){}
	}

	//获取聊天信息列表
	if(t.roomType == 'user') {
		LTAction.getUserMessageDataList(function(data){
			Chat.setChatList(data.data);
			document.getElementById('content').innerHTML = Chat.html($rootScope.variable.userId);
			$ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();

			LTAction.initNJMessage(function(){
				$rootScope.event_jMessageOnMsgReceiveCallback['room'] = function(data){
					for(var n in data.messages){
						if(data.messages[n].content.target_type != 'single' || data.messages[n].content.from_id != $stateParams.roomId){
							continue;
						}
						/*cordova.plugins.notification.local.schedule({  
							id: 1,
							title: '您有新消息',  
							text: data.messages[n].content,
							at: new Date().getTime(),  
							badge: 2  
						});
							alert(3);*/
						if(Chat.notLoad(data.messages[n].msg_id)){
							//LTAction.getUserInfo(function(resp){
								Chat.add(data.messages[n].content.msg_body.text,data.msg_id,data.messages[n].content.from_id,'img/default_head.png',t.nickname);
							//},{
							//	userId:data.messages[n].content.from_id
							//});
						}
						
					}
					document.getElementById('content').innerHTML = Chat.html($rootScope.variable.userId);
					$ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
				}
			},{
				userId:$rootScope.variable.userId
			});

			
		},{
			userId:$rootScope.variable.userId,
			toUserId:t.roomId
		});
		
		
		//获取对方用户信息
		$scope.room = {
			title:t.nickname
		};
		//END
	}else{
		LTAction.getGroupMessageDataList(function(data){
			Chat.setChatList(data.data);
			document.getElementById('content').innerHTML = Chat.html($rootScope.variable.userId,'group');
			$ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
		},{
			userId:$rootScope.variable.userId,
			toGroupId:t.roomId
		});

		LTAction.initNJMessage(function(){},{
			userId:$rootScope.variable.userId,
			onMsgReceive:function(data){
				for(var n in data.messages){
					//如果不是群组消息则去除
					if(data.messages[n].content.target_type != 'group' || data.messages[n].content.target_id != $stateParams.roomId){
						continue;
					}
					if(Chat.notLoad(data.messages[n].msg_id)){
						LTAction.getUserInfo(function(resp){
							Chat.add(data.messages[n].content.msg_body.text,data.msg_id,data.messages[n].content.from_id,'img/default_head.png',resp.data.name);
							document.getElementById('content').innerHTML = Chat.html($rootScope.variable.userId,'group');
							$ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
						},{
							userId:data.messages[n].content.from_id
						});
					}
				}
				
			}
		});
		//获取对方用户信息
		$scope.room = {
			title:t.nickname
		};
		//END
	}

	$scope.sendChat = function(n) {
		//发送信息
		if(t.roomType == 'group'){
			var photo = 'img/default_head.png';
			if($rootScope.variable.userPhoto != '' && typeof $rootScope.variable.userPhoto != 'undefined' && $rootScope.variable.userPhoto.indexOf('head_portrait') == -1 && $rootScope.variable.userPhoto.substring($rootScope.variable.userPhoto.length-1) != '/'){
				photo = $rootScope.variable.userPhoto;
			}
			LTAction.sendGroupMessage(function(data){
				Chat.add(n,$stateParams.roomId,$rootScope.variable.userId,photo,$rootScope.variable.userName);
				//$scope.room.ltcontent = Math.random();
				document.getElementById('content').innerHTML = Chat.html($rootScope.variable.userId,'group');
				$ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
				$scope.chatText = '';
			},{
				fromUserId:$rootScope.variable.userId,
				toUserId:t.roomId,
				//toUserId:'ff80808159b7af8a0159c3fa901e00ea',
				content:n,
				activeType:'1'
			});
			$ionicLoading.hide();

		}else{
			var photo = 'img/default_head.png';
			if($rootScope.variable.userPhoto != '' && typeof $rootScope.variable.userPhoto != 'undefined' && $rootScope.variable.userPhoto.indexOf('head_portrait') == -1 && $rootScope.variable.userPhoto.substring($rootScope.variable.userPhoto.length-1) != '/'){
				photo = $rootScope.variable.userPhoto;
			}
			LTAction.sendMessage(function(data){
				Chat.add(n,data.msg_id,$rootScope.variable.userId,photo,$rootScope.variable.userName);
				//$scope.room.ltcontent = Math.random();
				document.getElementById('content').innerHTML = Chat.html($rootScope.variable.userId);
				$ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
				$scope.chatText = '';
			},{
				fromUserId:$rootScope.variable.userId,
				toUserId:t.roomId,
				//toUserId:'ff80808159b7af8a0159c3fa901e00ea',
				content:n,
				activeType:'0'
			});
			$ionicLoading.hide();
		}
    };

	goRoom = function(url){
		$rootScope.redirect(url);
	}
});