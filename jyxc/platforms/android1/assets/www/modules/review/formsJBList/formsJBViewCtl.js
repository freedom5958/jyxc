appMain
.controller('formsJBViewCtl', function($rootScope, $scope, $stateParams, reviewSrv, $timeout,$ionicLoading,$http,$cordovaToast,authSrv,LTAction,$ionicModal) {

	$rootScope.variable.allowQuit = false;
	$rootScope.reviewListTabSelectedIndex = $rootScope.reviewListTabSelectedIndex || 0;
	
	$scope.params = {
		compId:$stateParams.compId,
		compType:''
	};

	switch($stateParams.compType){
		case '1' :
			$scope.params.compType = '建议';
			break;
		case '2' :
			$scope.params.compType = '投诉';
			break;
		case '3' :
			$scope.params.compType = '举报';
			break;
	}

	$scope.deptModel = [];

	$scope.showPic = function(img){
		var imglist = [];
		try{
			for(var n in img.fileList){
				imglist.push(img.fileList[n].path);
			}
		}catch(e){}
		var myApp = new Framework7();
        $scope.myPhotoBrowser = myApp.photoBrowser({
		    swipeToClose: false,
		    theme:'dark',
		    toolbar:false,
		    backLinkText:'',
		    ofText:'',
		    photos: imglist,
			navbarTemplate:'\
			<div class="navbar">\
			    <div class="navbar-inner">\
			        <div class="left sliding">\
			            <a style="font-size: 20px;" href="#" class="link close-popup photo-browser-close-link {{#unless backLinkText}}icon-only{{/unless}} {{js "this.type === \'page\' ? \'back\' : \'\'"}}">\
			                <i class="icon ion-ios-arrow-back"></i>\
			                {{#if backLinkText}}<span>{{backLinkText}}</span>{{/if}}\
			            </a>\
			        </div>\
			    </div>\
			</div>',
			onClick:function(){
				$scope.myPhotoBrowser.close();
			}
		});
		$scope.myPhotoBrowser.open();
	}

	$scope.view = {};

	$scope.data = {
		comp:null
	};

	LTAction.getComp(function(data){
		if(data.success) {
			//加载界面内容
			$scope.view = data.data;
		}else{
			LTAction.alert('加载内容失败');
		}
	},$scope.params);

	$scope.deptCheck = function(dept){
		comp = $scope.view;
		if(typeof comp != 'undefined'){
			$scope.data.comp = comp;
		}
		var deptParent = 0;
		if(typeof dept != 'object'){
			deptParent = dept;
		}else if(typeof dept != 'undefined'){
			deptParent = dept.deptId;
		}
		//打开窗口
		$ionicModal.fromTemplateUrl("modules/review/formsList/dept.html", {
			scope: $scope,
			animation: "slide-in-right"
		}).then(function(model) {
			//获取部门信息
			LTAction.getDeptList(function(data){
				model.scope.deptList = data.data;
				if(data.data.length>0){
					$scope.deptModel.push(model);
					model.show();
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
						$scope.deptModel[n].hide();
					}
				}
				//$scope.deptData = confirm;
				//$scope.params.deptId = $scope.deptData.deptId;
				//请服务器请求转部门信息
				LTAction.requestChangeDept(function(data){
					if(data.success) {
						//界面上将此内容更新为经手内容
						$scope.view.isActive = false;
						LTAction.alert('转发部门成功');
					}else{
						LTAction.alert(data.message);
					}
				},{
					compId:$scope.data.comp.compId,
					userId:$rootScope.variable.userId,
					deptId:confirm.deptId
				});
			}
		});
	}

	$scope.closeDept = function(){
		$scope.deptModel[$scope.deptModel.length-1].hide();
		$scope.deptModel.length--;
	}

	$scope.reContent = function(item){
		if(document.getElementById('input_'+item.compId).value == ''){
			LTAction.alert('请填写回复内容');
			return false;
		}
		//向服务器请求数据
		LTAction.requestReply(function(data){
			if(data.success) {
				$scope.view.reList.push({
					content:document.getElementById('input_'+item.compId).value,
					deptName:$rootScope.variable.userName
				});
				document.getElementById('input_'+item.compId).value = '';
			}else{
				LTAction.alert(data.message);
			}
		},{
			compId:item.compId,
			content:document.getElementById('input_'+item.compId).value
		});
	}
});