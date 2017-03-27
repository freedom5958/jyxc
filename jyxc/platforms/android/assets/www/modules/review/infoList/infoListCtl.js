appMain.controller('infoListCtl', function($rootScope, $scope, reviewSrv, $timeout,$ionicLoading,$http,$cordovaToast,authSrv, LTAction,$ionicModal) {

	$rootScope.variable.allowQuit = false;
	$rootScope.reviewListTabSelectedIndex = $rootScope.reviewListTabSelectedIndex || 3;

	if (!$rootScope.variable.isLogined) {
		$rootScope.reviewListTabSelectedIndex = 0;
	}

	$scope.params = {
		pageIndex:0,
		noticeType:0,
		pageSize:10,
		newData:[],
		noticeList:[],
		deptId:''
	};

	$scope.domail_url = $rootScope.constant.SERVER_ADDRESS;

	//加载内容
	$scope.showInfo = function(item) {
		$rootScope.redirect('/review/infoList/view/'+item.noticeId);
	}

	$scope.loadMore = function(){
		LTAction.getNoticeList(function(data) {
			$scope.params.pageIndex++;
			$scope.params.newData = data.data;
			for(var n in data.data){
				$scope.params.noticeList.push(data.data[n]);
			}
			$scope.$broadcast('scroll.refreshComplete');
			//$scope.More();
		},$scope.params);
	}
	$scope.loadMore();

	$scope.doRefresh = function(item){
		$scope.params.pageIndex = 0;
		console.log($scope.params);
		LTAction.getNoticeList(function(data) {
			$scope.params.noticeList = data.data;
			$scope.params.newData = data.data;
			$scope.$broadcast('scroll.refreshComplete');
			//$scope.More();
		},$scope.params);
	}

	//部门窗口数据
	$scope.deptModel = [];

	//部门列表数据
	$scope.deptList = [];

	//部门默认数据
	$scope.deptData = {
		deptId:0,
		deptName:'必须选择一个要发送的部门',
		deptParent:0
	};

	$scope.view = {
		defaultDeptName : '其它部门'
	};

	$scope.deptCheck = function(dept){
		var deptParent = 0,title = '选择部门';
		if(typeof dept != 'undefined'){
			deptParent = dept.deptId;
			title = dept.deptName;
		}
		//jQuery('.backdrop').addClass('self_show');
		//打开窗口
		$ionicModal.fromTemplateUrl("modules/review/infoList/dept.html", {
			scope: $scope,
			title: title,
			animation: "slide-in-right"
		}).then(function(model) {
			//获取部门信息
			LTAction.getDeptList(function(data){
				console.log(data);
				model.scope.title = model.title;
				model.scope.deptList = data.data;
				if(data.data.length>0){
					$scope.deptModel.push(model);
					model.show();
					jQuery('.modal-backdrop').last().find('ion-modal-view').css({
						left:'100px',
						width:(jQuery(window).width()-100)+'px'
					});
					jQuery('.active').first().siblings('.modal-backdrop').css({
						'background-color':'transparent'
					});
				}
			},{
				deptParent:deptParent
			});
			
			model.scope.deptChange = function(dept){
				for(var n in model.scope.deptList){
					if(dept.deptId != model.scope.deptList[n].deptId){
						model.scope.deptList[n].checked = false;
					}
				}
			}
			model.scope.confirmDept = function(){
				var confirm = false;
				for(var n in model.scope.deptList){
					if(model.scope.deptList[n].checked){
						confirm = model.scope.deptList[n];
					}
				}
				if(!confirm) {
					LTAction.alert('请选择部门');
				}else{
					for(var n in $scope.deptModel){
						$scope.deptModel[n].remove();
					}
					$scope.deptModel = [];
				}
				$scope.view.defaultDeptName = confirm.deptName;
				model.scope.deptData = $scope.deptData = confirm;
				$scope.params.deptId = $scope.deptData.deptId;
				jQuery('#deptName').html($scope.view.defaultDeptName);

				//刷新界面内容
				$scope.doRefresh();
			}
		});
	}

	$scope.closeDept = function(){
		$scope.view.defaultDeptName = '其它部门';
		$scope.deptModel[$scope.deptModel.length-1].remove();
		$scope.deptModel.length--;
		if($scope.deptModel.length < 1){
			$scope.params.deptId = '';
			$scope.doRefresh();
		}
		jQuery('#deptName').html($scope.view.defaultDeptName);
	}

	$scope.$on('modal.removed', function() {
		if($scope.deptModel.length < 1){
			$scope.params.deptId = '';
			$scope.doRefresh();
		}
	});
});