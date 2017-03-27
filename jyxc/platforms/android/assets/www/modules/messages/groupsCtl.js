appMain.controller("groupsCtl", function($rootScope, $scope, Room, LTAction, User,$ionicModal,$ionicPopup,$ionicHistory) {
	var e = $scope;
	$rootScope.variable.allowQuit = false;
	
	LTAction.initNJMessage(function(){
		LTAction.getGroupList(function(data){
			$scope.groups = data.data;
			console.log(data.data);
			$scope.createNewGroup = function(t) {
				
					for (var n = "", i = 0; i < $scope.friends.length; i++){
						$scope.friends[i].checked && (n ? n += "+" + $scope.friends[i].userId : n = $scope.friends[i].userId);
					}
					if (n.split("+").length < 2 || !t || t == '') {
						if (n.split("+").length < 2) {
							var popup = $ionicPopup.alert({
								title: "请添加更多是人",
								template: "创建群组需要勾选2个人以上",
								okType: "button-clear",
								okText:"确定"
							});
							return
						}
						if (!t || t == '') {
							$ionicPopup.alert({
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
								$scope.groups = data.data;
							});
						},{
							groupName:t,//群组名称
							userIds:n,//用户唯一编号
						});
					}
				
			}
		});
	},{
		userId:$rootScope.variable.userId
	});

	$scope.closePage = function(){
		try{
			$scope.newGroupModal.remove();
		}catch(e){}
		$rootScope.redirect('/tab/messages');
		//$ionicHistory.goBack();
	}

	$ionicModal.fromTemplateUrl("modules/messages/new-group.html", {
        scope: e,
        animation: "slide-in-up"
    }).then(function(t) {
		LTAction.requireFriend(function(data){
			User.setFriendList(data.data);
			$scope.friends = User.all();
		});
        $scope.newGroupModal = t
    }
    ),
    $scope.openNewGroup = function() {
        $scope.newGroupModal.show()
    }
    ,
    $scope.closeNewGroup = function() {
        $scope.newGroupModal.hide()
    }
});