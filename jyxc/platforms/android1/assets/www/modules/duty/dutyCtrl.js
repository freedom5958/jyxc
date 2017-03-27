appMain
.controller('dutyCtrl', function($rootScope, $scope, $ionicActionSheet, $timeout, $location, $stateParams, dateSrv, $ionicModal, authSrv, $http, $cordovaToast, $ionicHistory, $cordovaDialogs, $ionicLoading) {
	'use strict';
	$scope.view = {
		noreply:[{
			id:'aa',
			name:'aa'
		},{
			id:'bb',
			name:'bb'
		}],
		replied:[{
			id:'cc',
			name:'cc'
		},{
			id:'dd',
			name:'dd'
		}],
		depts:[{id:'jy',name:'教育'},{id:'jt',name:'交通'},{id:'jz',name:'建筑'}],
		userfulExpression:[{id:'a',content:'你好'},{id:'b',content:'你不好'},{id:'c',content:'骚等'},{id:'d',content:'待会回复你'},{id:'e',content:'是吗'}],
		form : {}
	};

	$scope.refresh = function(){
		$scope.loadAccs();
		$scope.loadDepts();
		$scope.loadUsefulExpression();
	};

	$scope.loadAccs = function(){
		$http({
			method:'JSONP',
			url:authSrv.loadAccsAdr(),
			params:authSrv.getParams()
		}).success(function(succ) {
			$scope.view.notReplyAcc = succ.data.notReplyAcc;
			$scope.view.yetReplyAcc = succ.data.yetReplyAcc;
		});
	};

	$scope.loadDepts = function(){
		$http({
			method:'JSONP',
			url:authSrv.deptsAdr(),
			params:{}
		}).success(function(succ) {
			$scope.view.depts = succ.data;
		});
	};

	$scope.loadUsefulExpression = function(){
		$http({
			method:'JSONP',
			url:authSrv.loadUsefulExpressionAdr(),
			params:authSrv.getParams()
		}).success(function(succ) {
			$scope.view.userfulExpression = succ.data;
			// console.log(JSON.stringify(succ.data));
		});
	};

	var myApp = new Framework7();
	
	$scope.addDuty = function(){
		$scope.view.form = {
			dutyContent : '',
			selectedDeptId : ''
		};
		$scope.view.selectedDeptName = '';
		angular.forEach($scope.view.depts, function(d){
			d.selected = false;
		});

		$ionicModal.fromTemplateUrl('modules/duty/dutyAdd.html', {
            scope: $scope,
            animation: 'none'
        }).then(function(modal) {
            modal.show();
            $scope.addDutyModal = modal;
        });
	};

	$scope.dutyCheck = function(id){
		$location.path('/dutyCheck/'+id);
	};

	$scope.selectUsefulExpression = function(){
		myApp.pickerModal('.picker-info');
	};

	$scope.selectUsefulExpressionCancel = function(){
		myApp.closeModal('.picker-info');
	};

	$scope.selectUsefulExpressionSure = function(text){
		if(text){
			$scope.view.form.dutyContent = text;
			myApp.closeModal('.picker-info');
		}
	};

	$scope.goEditUsefulExpression = function($event){
		$event.stopPropagation();
		$ionicModal.fromTemplateUrl('modules/usefulExpression/usefulExpression.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function(modal) {
            modal.show();
            $scope.usefulExpressionModal = modal;
        });
	};

	$scope.closeUsefulExpression = function(){
		$scope.usefulExpressionModal.hide();
		$scope.usefulExpressionModal.remove();
	};

	$scope.addUsefulExpression = function(){
		$cordovaDialogs.prompt('请输入常用语', '常用语', ['取消','确定']).then(function(o) {
			if(o.buttonIndex == 2){
				var content = o.input1;
				if(!content){
					return;
				}
				var p = authSrv.getParams();
				p.content = content;
				$ionicLoading.show({
					template: '正在提交，请稍候'
				});
				$http.post(authSrv.saveUsefulExpressionAdr(),p).success(function(succ) {
					$ionicLoading.hide();
					$scope.loadUsefulExpression();
					$cordovaToast.showShortCenter(succ.message);
				}).error(function(err){
					$ionicLoading.hide();
					$cordovaToast.showShortCenter('保存失败，请稍候再试');
				});
			}
		});
	};

	$scope.editUsefulExpression = function(eid){
		$cordovaDialogs.prompt('请输入常用语', '常用语', ['取消','确定'], 'aaaa').then(function(o) {
			console.log(o);
		});
	};

	$scope.delUsefulExpression = function(eid){
		$cordovaDialogs.confirm('确定删除常用语？', '常用语', ['取消','删除']).then(function(buttonIndex) {
			if(buttonIndex == 2){
				$http({
					method:'JSONP',
					url:authSrv.delUsefulExpressionAdr(),
					params:{ids:eid}
				}).success(function(succ) {
					$scope.loadUsefulExpression();
					$cordovaToast.showShortCenter(succ.message);
				}).error(function(err){
					$cordovaToast.showShortCenter('删除失败，请稍候再试');
				});
			}
		});
	};

	$scope.goSelectDept = function(){
		$ionicModal.fromTemplateUrl('modules/duty/dutySelectDept.html', {
            scope: $scope,
            animation: 'slide-in-right'
        }).then(function(modal) {
            modal.show();
            $scope.selectDeptModal = modal;
        });
	};

	$scope.selectDept = function(did){
		angular.forEach($scope.view.depts, function(d){
			d.selected = false;
			if(d.id == did){
				d.selected = true;
				$scope.view.form.selectedDeptId = d.id;
				$scope.view.selectedDeptName = d.name;
			}
		});
		$scope.selectDeptModal.hide();
		$scope.selectDeptModal.remove();
	};

	$scope.selectDeptSure = function(){
		$scope.selectDeptModal.hide();
		$scope.selectDeptModal.remove();
	};

	$scope.sendDutyCancel = function(){
		$scope.addDutyModal.hide();
		$scope.addDutyModal.remove();
	};

	$scope.sendDutySure = function(){
		if(!$scope.view.form.dutyContent){
			$cordovaToast.showShortCenter('请填写问责内容');
			return;
		}
		if(!$scope.view.form.selectedDeptId){
			$cordovaToast.showShortCenter('请选择问责部门');
			return;
		}
		var jsonParam = {
			content:$scope.view.form.dutyContent,
			deptId:$scope.view.form.selectedDeptId
		};
		$http.post(authSrv.saveAccountabilityAdr(),authSrv.getParams(JSON.stringify(jsonParam))).
		/*$http({
			method:'JSONP',
			url:authSrv.saveAccountabilityAdr(true),
			params:authSrv.getParams(jsonParam)
		}).*/
		success(function(succ) {
			if(succ.success){
				$scope.loadAccs();
				$scope.sendDutyCancel();
			}
			$cordovaToast.showShortCenter(succ.message);
		}).error(function(err) {
			$cordovaToast.showShortCenter('问责发送失败，请稍候再试');
		});
	};

	$scope.refresh();
});