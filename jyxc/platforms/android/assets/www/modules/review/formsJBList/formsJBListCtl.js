appMain.controller('formsJBListCtl', function($rootScope, $scope, $stateParams, reviewSrv, $timeout,$ionicLoading,$http,$cordovaToast,authSrv,LTAction,$ionicModal) {

	$rootScope.variable.allowQuit = false;
	$rootScope.reviewListTabSelectedIndex = $rootScope.reviewListTabSelectedIndex || 0;

	if (!$rootScope.variable.isLogined) {
		$rootScope.reviewListTabSelectedIndex = 0;
	}

	$scope.FormHBack = function(){
		$rootScope.redirect('/tab/works');
	}

	$scope.params = {
		compType:$stateParams.compType,
		pageIndex:0,
		pageSize:10,
		newData:[],
		compList:[]
	};

	if($scope.params.compType != '1' && $scope.params.compType != '2' && $scope.params.compType != '3'){
		$scope.params.compType = '1';
	}

	$scope.showPic = function(comp){
		var imglist = [];
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

	switch($scope.params.compType){
		case '1':
			$scope.compText = '建议';
			break;
		case '2':
			$scope.compText = '诉求';
			break;
		case '3':
			$scope.compText = '监督';
			break;
		default:
			$scope.compText = '其它';
			break;
	}

	//获取当前用户是否为经办人
	$scope.loadMore = function(){
		LTAction.getCompJBList(function(data) {
			$scope.params.pageIndex++;
			$scope.params.newData = data.data;
			for(var n in data.data){
				$scope.params.compList.push(data.data[n]);
			}
			$scope.$broadcast('scroll.refreshComplete');
		},$scope.params);
	}
	$scope.loadMore();

	$scope.map = null;
	$scope.point = null;

	$scope.showMap = function(comp){
		/*$ionicModal.fromTemplateUrl("modules/messages/map.html", {
			scope: $scope,
			bmap:BMap,
			animation: "slide-in-right"
		}).then(function(model) {
			$scope.mapModal = model;
			$scope.mapModal.show();
			//setTimeout(function(){
				var map = new model.bmap.Map("map");
				var point = new model.bmap.Point(comp.longitude, comp.latitude); // 创建点坐标
				map.centerAndZoom(point,15);
				var marker1 = new model.bmap.Marker(new model.bmap.Point(comp.longitude, comp.latitude));  //创建标注
				map.addOverlay(marker1);
			//},3000);
		});*/
		var myApp = new Framework7();
		myApp.popup('.popup-about');
		jQuery('#framework_model_7').css({
			height:jQuery(window).height()+'px'
		});
		jQuery('#map').css({
			height:(jQuery(window).height()-44)+'px'
		});
		if($scope.map === null){
			$scope.map = new BMap.Map("map");
			$scope.point = new BMap.Point(comp.longitude, comp.latitude); // 创建点坐标
			$scope.map.centerAndZoom($scope.point,15);
		}else{
			$scope.point = new BMap.Point(comp.longitude, comp.latitude); // 创建点坐标
			setTimeout(function(){
				$scope.map.setCenter($scope.point);
			},200);
		}
		
		$scope.map.clearOverlays();
		var marker = new BMap.Marker($scope.point);  //创建标注
		$scope.map.addOverlay(marker);
	}

	$scope.doRefresh = function(item){
		$scope.params.pageIndex = 0;
		LTAction.getCompJBList(function(data) {
			$scope.params.newData = data.data;
			$scope.params.compList = data.data;
			$scope.$broadcast('scroll.refreshComplete');
		},$scope.params);
	}

	$scope.showInfo = function(item) {
		$rootScope.redirect('/review/forms2List/view');
	}
	$scope.GoForms = function() {
		$rootScope.redirect('/review/forms2List/goforms');
	}

	$scope.goTab = function(index){
		$rootScope.redirect('/review/forms2List/'+index);
	}

	//部门窗口数据
	$scope.deptModel = [];

	//部门列表数据
	$scope.deptList = [];

	$scope.data = {
		comp:[]
	};

	$scope.deptCheck = function(dept,comp){
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
						for(var n in $scope.params.compList){
							if($scope.params.compList[n].compId == $scope.data.comp.compId){
								$scope.params.compList[n].isActive = false;
							}
						}
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

	$scope.showCon = function(compId){
		$("#con_"+compId).slideToggle("show"); 
	}
});