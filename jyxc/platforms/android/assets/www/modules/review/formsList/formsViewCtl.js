appMain
.controller('formsViewCtl', function($rootScope, $scope, $stateParams, reviewSrv, $timeout,$ionicLoading,$http,$cordovaToast,authSrv,LTAction) {

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
			$scope.params.compType = '诉求';
			break;
		case '3' :
			$scope.params.compType = '监督';
			break;
	}

	$scope.showPic = function(comp){
		var imglist = [];
		console.log(comp);
		try{
			for(var n in comp.fileList){
				imglist.push(comp.fileList[n].path);
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

	LTAction.getComp(function(data){
		if(data.success) {
			//加载界面内容
			$scope.view = data.data;
		}else{
			LTAction.alert('加载内容失败');
		}
	},$scope.params);

	//部门窗口数据
	$scope.deptModel = [];

	//部门列表数据
	$scope.deptList = [];

	$scope.deptCheck = function(dept){
		var deptParent = 0;
		if(typeof dept != 'undefined'){
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
				$scope.deptData = confirm;
				$scope.params.deptId = $scope.deptData.deptId;
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
				for(var n in $scope.params.compList) {
					if($scope.params.compList[n].compId == item.compId) {
						$scope.params.compList[n].reList.push({
							content:document.getElementById('input_'+item.compId).value,
							deptName:$rootScope.variable.userName
						});
					}
				}
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