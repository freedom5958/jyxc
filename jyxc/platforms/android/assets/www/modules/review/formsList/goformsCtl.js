appMain
.controller('goformsCtl', function($rootScope, $scope, reviewSrv, $timeout,$ionicLoading,$http,$cordovaToast,authSrv,LTAction,$ionicModal,$ionicActionSheet,$cordovaImagePicker,$cordovaCamera,$cordovaFileTransfer,$cordovaGeolocation) {

	$rootScope.variable.allowQuit = false;
	$rootScope.reviewListTabSelectedIndex = $rootScope.reviewListTabSelectedIndex || 0;

	$scope.style = {
		tabType:1
	};

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
	
	$scope.params = {
		compType : $scope.style.tabType,
		deptId : 0,
		content:'',
		longitude:0,
		latitude:0,
		imageParams:[],
		imageList:[]
	};

	//选项卡
	$scope.goType = function(type){
		$scope.params.compType = $scope.style.tabType = type;
	};

	$scope.deptCheck = function(dept){
		var deptParent = 0;
		if(typeof dept != 'undefined'){
			deptParent = dept.deptId;
		}
		//打开窗口
		$ionicModal.fromTemplateUrl("modules/review/formsList/dept_check.html", {
			scope: $scope,
			animation: "slide-in-right"
		}).then(function(model) {
			//获取部门信息
			LTAction.getDeptList(function(data){
				console.log(data);
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

	$scope.goSubmit = function(){
		if(!$scope.params.deptId){
			LTAction.alert('请选择部门');
			return ;
		}
		if($scope.params.content == ''){
			LTAction.alert('内容太少');
			return ;
		}


		$scope.params.fileIds = $scope.params.imageList.join(',');
		LTAction.requestComp(function(data){
			if(data.success) {
				$scope.deptData = {
					deptId:0,
					deptName:'必须选择一个要发送的部门',
					deptParent:0
				};
				$scope.params.content = '';
				$scope.params.imageParams = [];
				$scope.params.imageList = [];
				LTAction.alert(data.message);
			}else{
				LTAction.alert(data.message);
			}
		},$scope.params);

	}

	$scope.goList = function(){
		$rootScope.redirect("/review/formsList/"+$scope.style.tabType);
	}

	$scope.form = {};

    $scope.selectUserPhotoFromAlbum = function() {
		var options = {
			maximumImagesCount: 1,
			width: 800,
			height: 800,
			quality: 80
		};
		$cordovaImagePicker.getPictures(options)
	    .then(function (res) {
	    	if(res.length > 0){
		    	var fp = res[0];
		    	$scope.form.selectUserPhoto = fp;
		    	$scope.uploadUserPhoto();
	    	}
	    });
	};

	$scope.uploadUserPhoto = function(){
        var myApp = new Framework7();
        $scope.myPhotoBrowser = myApp.photoBrowser({
		    swipeToClose: false,
		    theme:'dark',
		    toolbar:false,
		    backLinkText:'',
		    ofText:'选择图片',
		    photos: [{
				url: $scope.form.selectUserPhoto
			}],
			navbarTemplate:'\
			<div class="navbar">\
			    <div class="navbar-inner">\
			        <div class="left sliding">\
			            <a style="font-size: 20px;" href="#" class="link close-popup photo-browser-close-link {{#unless backLinkText}}icon-only{{/unless}} {{js "this.type === \'page\' ? \'back\' : \'\'"}}">\
			                <i class="icon ion-ios-arrow-back"></i>\
			                {{#if backLinkText}}<span>{{backLinkText}}</span>{{/if}}\
			            </a>\
			        </div>\
			        <div class="center sliding">\
			            <span class="photo-browser-of">{{ofText}}</span> \
			        </div>\
			        <div class="right" id="uploadUserPhotoSure">上传</div>\
			    </div>\
			</div>'
		});
		$scope.myPhotoBrowser.open();
		$('#uploadUserPhotoSure').click(function(){
			$scope.uploadUserPhotoSure();
		});
	};

	$scope.removePic = function(img){
		try{
			var imageParams = [],imageList = [];
			for(var n in $scope.params.imageParams){
				if(img.path != $scope.params.imageParams[n].path){
					imageParams.push($scope.params.imageParams[n]);
				}
			}
			for(var n in $scope.params.imageList){
				if(img.picId != $scope.params.imageList[n]){
					imageList.push($scope.params.imageList[n]);
				}
			}
			$scope.params.imageParams = imageParams;
			$scope.params.imageList = imageList;
		}catch(e){
			$cordovaToast.showShortCenter(e);
		}
	}

	$scope.GoList = function(){
		$rootScope.redirect("/review/formsList/"+$scope.style.tabType);
	}

	$scope.showPic = function(img){
		var myApp = new Framework7();
        $scope.myPhotoBrowser = myApp.photoBrowser({
		    swipeToClose: false,
		    theme:'dark',
		    toolbar:false,
		    backLinkText:'',
		    ofText:'',
		    photos: [{
				url: img.path
			}],
			navbarTemplate:'\
			<div class="navbar">\
			    <div class="navbar-inner">\
			        <div class="left sliding">\
			            <a style="font-size: 20px;" href="#" class="link close-popup photo-browser-close-link {{#unless backLinkText}}icon-only{{/unless}} {{js "this.type === \'page\' ? \'back\' : \'\'"}}">\
			                <i class="icon ion-ios-arrow-back"></i>\
			                {{#if backLinkText}}<span>{{backLinkText}}</span>{{/if}}\
			            </a>\
			        </div>\
			        <div class="center sliding">\
			            <span class="photo-browser-of">{{ofText}}</span> \
			        </div>\
			    </div>\
			</div>'
		});
		$scope.myPhotoBrowser.open();
	}

	$scope.uploadUserPhotoSure = function(){
        var url = authSrv.getPicUploadAdr({}),
			path = $scope.form.selectUserPhoto;
		var options = {
			fileKey:'image',
			fileName: path.substr(path.lastIndexOf('/') + 1),
			mimeType: path.substr(path.lastIndexOf('.') + 1),
			params:{
				userId:$rootScope.variable.userId
			}
		};
		$scope.myPhotoBrowser.close();
		$cordovaFileTransfer.upload(url, path, options).then(function(succ){
			try{
				$cordovaToast.showShortCenter('上传成功');
				/*上传成功后更新内容*/
				succ.response = JSON.parse(succ.response);
				for(var n in succ.response.data){				
					$scope.params.imageList.push(succ.response.data[n]);
					$scope.params.imageParams.push({
						path:path,
						picId:succ.response.data[n]
					});
				}
			}catch(e){
				$cordovaToast.showShortCenter(e);
			}
			/*上传成功后更新内容 END*/
		},function(err){
			$cordovaToast.showShortCenter('上传失败，请稍候再试');
		},function(progress){
			var uploadProgress = ((progress.loaded / progress.total) * 100).toFixed(1);
			$ionicLoading.show({
				template: '已上传 '+uploadProgress+' %'
			});
		}).finally(function(){
			$ionicLoading.hide();
		});
	};

	$scope.uploadImage = function(){
		$ionicActionSheet.show({
			buttons: [{ text: '拍照' },{ text: '从相册选取' }],
			cancelText: '取消',
			cancel: function() {
			},
			buttonClicked: function(index) {
				if(index == 0){
					$scope.captureImage();
				}else if(index == 1){
					$scope.selectUserPhotoFromAlbum();
				}
				return true;
			}
		});
	}

	$scope.captureImage = function(){
		var options = {
			quality: 80,
			destinationType: Camera.DestinationType.FILE_URI,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 1000,
			targetHeight: 1000,
			correctOrientation:true
		};
		$cordovaCamera.getPicture(options).then(function(data) {
			if(data){
				$scope.form.selectUserPhoto = data;
		    	$scope.uploadUserPhoto();
			}
		});
	};

	var getAutoLocation = function() {
		//GPS定位
		$scope.location = '';　
		$cordovaGeolocation.getCurrentPosition({
			timeout: 10000,
			enableHighAccuracy: false
		}).then(function(position) {
			$scope.params.longitude = position.coords.longitude;
			$scope.params.latitude = position.coords.latitude;
		}, function() {
			//定位失败后是否需要特殊处理
		});
	};

	getAutoLocation();

});