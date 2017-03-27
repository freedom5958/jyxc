appMain.controller('formsListCtl', function($rootScope, $scope, $stateParams, reviewSrv, $timeout,$ionicLoading,$http,$cordovaToast,authSrv,LTAction,$ionicModal) {

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
		compList:[],
		showcheck:true
	};

	if($scope.params.compType != '1' && $scope.params.compType != '2' && $scope.params.compType != '3'){
		$scope.params.compType = '1';
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

	//获取当前用户是否为经办人
	$scope.loadMore = function(){
		LTAction.getCompList(function(data) {
			$scope.params.pageIndex++;
			$scope.params.newData = data.data;
			for(var n in data.data){
				$scope.params.compList.push(data.data[n]);
			}
			
			$scope.$broadcast('scroll.refreshComplete');
		},$scope.params);
	}
	$scope.loadMore();

	$scope.closeMap = function(){
		$scope.mapModal.remove();
	}

	$scope.doRefresh = function(item){
		$scope.params.pageIndex = 0;
		LTAction.getCompList(function(data) {
			$scope.params.newData = data.data;
			$scope.params.compList = data.data;
			$scope.$broadcast('scroll.refreshComplete');
		},$scope.params);
	}

	$scope.showInfo = function(item) {
		$rootScope.redirect('/review/formsList/view');
	}
	$scope.GoForms = function() {
		$rootScope.redirect('/review/formsList/goforms');
	}

	$scope.goTab = function(index){
		$rootScope.redirect('/review/formsList/'+index);
	}
});