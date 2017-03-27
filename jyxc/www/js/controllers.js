angular.module('starter')
.controller('mainCtrl', function(appSrv, $stateParams, $ionicPopup, $ionicPlatform, $rootScope, $scope, dbSrv, $ionicLoading, $ionicModal, $location, $ionicHistory, $cordovaNetwork, authSrv, User, Room, LTAction) {
	'use strict';
	//即时通讯 群组建立
	var e = $scope, t = $stateParams, i = $ionicModal, o = $location, a = $rootScope, s = $ionicPopup;
    var n = User, r = Room;
	
	/*$scope.createNewGroup = function(t) {
		LTAction.initNJMessage(function(){
			for (var n = "", i = 0; i < $scope.friends.length; i++){
				$scope.friends[i].checked && (n ? n += "+" + $scope.friends[i].userId : n = $scope.friends[i].userId);
			}
			if (n.split("+").length < 1 || !t || t == '') {
				if (n.split("+").length < 1) {
					s.alert({
						title: "请添加更多是人",
						template: "创建群组需要3个人以上",
						okType: "button-clear",
						okText:"确定"
					});
					return
				}
				if (!t || t == '') {
					s.alert({
						title: "请输入群组的名称",
						template: "取一个好的群组名字才有吸引力噢",
						okType: "button-clear",
						okText:"确定"
					});
					return
				}
			} else {
				//向服务器提交群组信息
				LTAction.requestAddGroup(function(data){
					$scope.closeNewGroup();
					//重新获取群组列表
					LTAction.getGroupList(function(data){
						consol$scope.log('新的群组信息');
						consol$scope.log(data);
						$scope.groups = [{
							id:'fdsdf',
							thumbnail:'rewer',
							title:'fdhsdf',
							activeTime:'日期',
							members:'fd,re'
						}];
					});
				},{
					groupName:t,//群组名称
					userIds:n,//用户唯一编号
					userId:$rootScop$scope.variabl$scope.userId//群主唯一编号
				});
			}
		},{
			userId:$rootScop$scope.variabl$scope.userId
		});
	}
	
	//获取好友信息
	/*LTAction.requireFriend(function(data){
		User.setFriendList(data.data);
		$scope.friends = User.all();
	});*/

	//初始化群组数据

    $ionicModal.fromTemplateUrl("modules/messages/new-chat.html", {
        scope: e,
        animation: "slide-in-up"
    }).then(function(t) {
        $scope.newChatmodal = t
    }
    ),
    $scope.openNewChat = function() {
        $scope.newChatmodal.show()
    }
    ,
    $scope.closeNewChat = function() {
        $scope.newChatmodal.hide()
    }

});
