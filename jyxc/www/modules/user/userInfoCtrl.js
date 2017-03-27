appMain
.controller('userInfoCtrl', function($ionicPlatform, $rootScope, $scope, $ionicActionSheet, $timeout, $location, $stateParams, dateSrv, $ionicModal, authSrv, $http, $cordovaToast, appNavibarSrv, $ionicHistory, $ionicLoading, appSrv,$cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera) {
	'use strict';

	$rootScope.variable.allowQuit = false;

	$scope.view = {
        age:'',
        sex:'',
        sexOptions:['请选择您的性别','男','女'],
        education:'',
        educationOptions:['请选择您的学历','小学及以下','初中','高中','大专','大学','研究生及以上'],
        role:'',
        roles:[],
        roleOptions:[]
    };

	$scope.form = {};

	$scope.loadData = function(){
		$scope.view.userName = $rootScope.variable.userName;
	    $scope.view.userPhoto = $rootScope.variable.userPhoto;
        /*$http({
	        method:'JSONP',
	        url:authSrv.getUserInfoAdr(),
	        params:{id:$rootScope.variable.userId}
	    }).success(function(succ) {
	    	$scope.view.userName = succ.data.name;
	    	$scope.view.userPhoto = succ.data.userPhoto;
	    });*/
	};

	$scope.selectUserPhoto = function(){
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
	};

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
		    ofText:'用户头像',
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

	$scope.uploadUserPhotoSure = function(){
        var url = authSrv.getUserPhotoUploadAdr(),
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
			$cordovaToast.showShortCenter('上传成功');
			$rootScope.variable.userPhoto = path;
			$scope.loadData();
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

	$scope.loadData();



	

    $scope.view.roleOptions.push('请选择您的职务');

	//获取角色
    var findRoles = function() {

        var url = authSrv.findRoles();
        $http.jsonp(url).success(function (data) {
            console.log("获取角色:"+ JSON.stringify(data) );
            if (data.success) {
                $scope.view.roles = data.data;
                for (var i = 0; i <= data.data.length - 1; i++) {
                    var dict = data.data[i];
                    $scope.view.roleOptions.push(dict.name);
                }
            }
            else {
                $cordovaToast.showShortCenter('获取角色失败');
            }

        }).error(function (error) {
            $cordovaToast.showShortCenter('网络请求失败');
        })
    }

    findRoles();

    //获取用户信息
    var getUserInfo = function() {

        var url = authSrv.getUserInfoAdr();
        var op = '&userId=' + ($rootScope.variable.userId || '') + '&token='+ ($rootScope.variable.token || '');
        url += op;
        $http.jsonp(url).success(function (data) {
            console.log("获取用户信息:"+ JSON.stringify(data) );
            if (data.success) {
            	if (!data.data.age) {
                	$scope.view.age = data.data.age;
            	}
            	else {
                	$scope.view.age = parseInt(data.data.age);
            	}
            	if(!data.data.sex){
            		$scope.view.sex = '请选择您的性别';
            	}else{
            		$scope.view.sex = data.data.sex;
            	}
            	if(!data.data.education){
            		$scope.view.education = '请选择您的学历';
            	}else{
            		$scope.view.education = data.data.education;
            	}
				if(!data.data.job){
            		$scope.view.role = '请选择您的职务';
            	}else{
            		$scope.view.role = data.data.job;
            	}
                //$scope.view.sex = data.data.sex;
        		//$scope.view.education = data.data.education;
        		//$scope.view.role = data.data.job;
            }
            else {
                $cordovaToast.showShortCenter('获取用户信息失败');
            }

        }).error(function (error) {
            $cordovaToast.showShortCenter('网络请求失败');
        })
    }

    getUserInfo();


    $scope.resetUserInfo = function() {
    	$ionicLoading.show({
            template: '保存中...'
        });

        var params = {};
        
        params.sex = $scope.view.sex == '请选择您的性别' ? '' : $scope.view.sex;
        params.age = $scope.view.age;
        params.education = $scope.view.education == '请选择您的学历' ? '' : $scope.view.education;
        params.dicId = '';
        for (var i = 0; i < $scope.view.roles.length; i++) {
            var role = $scope.view.roles[i];
            if (role.name == $scope.view.role) {
                params.dicId = role.id;
            }
        }

        if (authSrv.DeviceType == DeviceType.DeviceTypeOfBrower) {
            var url = authSrv.saveUserInfo();
            url += '&jsonParam=' + JSON.stringify(params);
            console.log("保存用户信息url:"+ url);
            $http.jsonp(url).success(function (data) {
                console.log("保存用户信息:"+ JSON.stringify(data) );
                $ionicLoading.hide();
                if (data.success) {
                	$scope.view.hasChangedValue = false;
                    $cordovaToast.showShortCenter('保存成功');
                }
                else {
                    $cordovaToast.showShortCenter(data.message);
                }

            }).error(function (error) {
                $ionicLoading.hide();
                $cordovaToast.showShortCenter('网络请求失败');
            })
        }
        else {
            var param = authSrv.getParams();
            param.jsonParam = JSON.stringify(params);

            $http.post(authSrv.saveUserInfo(),param).success(function(data) {
                $ionicLoading.hide();
                if (data.success) {
                	$scope.view.hasChangedValue = false;
                    $cordovaToast.showShortCenter('保存成功');
                }
                else {
                    $cordovaToast.showShortCenter(data.message);
                }
            }).error(function(err){
                $ionicLoading.hide();
                $cordovaToast.showShortCenter('网络请求失败');
            });
        }
    }

    $scope.changeValue = function() {
		$scope.view.age = parseInt($scope.view.age);
		$scope.view.age = $scope.view.age > 100 ? 100 : $scope.view.age;
    	$scope.view.hasChangedValue = true;
    }
});