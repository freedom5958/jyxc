appMain
.controller('fillReviewCtl', function($rootScope, $scope,$ionicActionSheet,$cordovaCamera,
    $cordovaCapture,$timeout,$stateParams,$ionicLoading,$http,$cordovaToast,authSrv,
    $cordovaFileTransfer,$ionicPopup,$timeout,$ionicHistory,$cordovaDialogs) {

    $rootScope.variable.allowQuit = false;

    $scope.view = {};
    $scope.hasSubmit = false;
    
    $scope.backParent = function() {
        $rootScope.goBack();
    }

    $scope.imageList = [];
    $scope.video = {
        hasVideo:false
    };

    $scope.hasUploadFiles = [];

        // 视频
        $scope.captureVideo = function () {
            var options = { limit: 1, duration: 60 };

            $cordovaCapture.captureVideo(options).then(function (videoData) {
                // Success! Video data is here
                console.log('video' + JSON.stringify(videoData));
                if (videoData[0].name != '') {
                    $scope.video = videoData[0];
                    $scope.video.hasVideo = true;
                }
            }, function (err) {
                // An error occurred. Show a message to the user
                // $cordovaToast.showShortCenter('打开相机失败');
            });
        };

        // 拍照和相册
        $scope.selectPicture = function (e, ind) {
            // e.stopPropagation();
            console.log(ind);
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: '拍照' },
                    { text: '从相册选择' }
                ],
                destructiveText: '',
                titleText: '请选择',
                cancelText: '取消',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    if (index === 0) {
                        $scope.openCamera();
                    } else {
                        $scope.captureImage();
                    }
                    return true;
                }
            });
            $timeout(function () {
                hideSheet();
            }, 5000);

        };

        // 拍照
        $scope.openCamera = function () {
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                // destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA
            };

            if (authSrv.DeviceType == DeviceType.DeviceTypeOfBrower) {
                options.destinationType = Camera.DestinationType.DATA_URL;
            }

            $cordovaCamera.getPicture(options).then(function (imageURI) {
                if (authSrv.DeviceType == DeviceType.DeviceTypeOfBrower) {
                    $scope.imageList.push('data:image/jpeg;base64,' + imageURI);
                }
                else{
                    $scope.imageList.push(imageURI);
                }
            }, function (err) {
                // $cordovaToast.showShortCenter('打开相机失败');
            });
        };

        // 相册
        $scope.captureImage = function () {
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                // destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                saveToPhotoAlbum: true,
                targetWidth: 800,
                targetHeight: 800
            };

            if (authSrv.DeviceType == DeviceType.DeviceTypeOfBrower) {
                options.destinationType = Camera.DestinationType.DATA_URL;
            }

            $cordovaCamera.getPicture(options).then(function (imageData) {
                var imgurl = imageData;
                if (authSrv.DeviceType == DeviceType.DeviceTypeOfBrower) {
                    $scope.imageList.push('data:image/jpeg;base64,' + imgurl);
                }
                else {
                    $scope.imageList.push(imgurl);
                }
            }, function (err) {
                // $cordovaToast.showShortCenter('打开相册失败');
            });
        };


    //获取表单
    var findEmptyForm = function() {
        $ionicLoading.show({
            template: '请求中...'
        });

        var formId = $stateParams.formId;

        if (authSrv.DeviceType == DeviceType.DeviceTypeOfBrower) {
            var url = authSrv.findEmptyForm();
            url += '&formId=' + formId;
            $http.jsonp(url).success(function (data) {
                console.log("获取要填写的评议的空表单信息:"+ JSON.stringify(data) );
                $ionicLoading.hide();
                if (data.success) {
                    $scope.view.fillForms = JSON.parse(data.data.sortFileds);
                    $scope.view.description = data.data.description;
                    $scope.view.dept = getDeptsNameStr(data.data.dept);

					$scope.view.satisficingSta = data.data.satisficingSta;

                    if (data.data.file && data.data.file.length > 0) {
                        $scope.view.descriptionFile = data.data.file[0];
                    }
                    // $scope.view.descriptionFile = {};
                    // $scope.view.descriptionFile.smallPicPath = 'https://img5.doubanio.com/lpic/s29172186.jpg';
                    // $scope.view.descriptionFile.path = 'https://img3.doubanio.com/lpic/s29126913.jpg';
                    // $scope.view.description = '故事的主角是布拉德·皮特饰演的美国作家罗兰德（Roland）和他的妻子——茱莉饰演的瓦妮莎（Vanessa），两人结婚多年却遭遇婚姻危机，于是他们来到了法国一处风景如画的、宁静的海边度假胜地散心。在这里他们遇到了一对新婚夫妇和几个当地人，多年来的心结也渐渐打开。';
                    
                    setPlaceHolder();
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
            /*var param = authSrv.getParams();
            param.formId = formId;

            $http.post(authSrv.findEmptyForm(),param).success(function(data) {
                $ionicLoading.hide();
                if (data.success) {
                    $scope.view.fillForms = JSON.parse(data.data.sortFileds);
                    $scope.view.description = data.data.description;
                    $scope.view.dept = getDeptsNameStr(data.data.dept);

					$scope.view.satisficingSta = data.data.satisficingSta;

                    if (data.data.file && data.data.file.length > 0) {
                        $scope.view.descriptionFile = data.data.file[0];
                    }
                    setPlaceHolder();
                }
                else {
                    $cordovaToast.showShortCenter(data.message);
                }
            }).error(function(err){
                $ionicLoading.hide();
                $cordovaToast.showShortCenter('网络请求失败');
            });*/
			var param = authSrv.getParams();
            param.formId = formId;

            $http.jsonp(authSrv.getFillReview(param)).success(function(data) {
                $ionicLoading.hide();
                if (data.success) {
                    $scope.view.fillForms = JSON.parse(data.data.sortFileds);
                    $scope.view.description = data.data.description;
                    $scope.view.dept = getDeptsNameStr(data.data.dept);

					$scope.view.satisficingSta = data.data.satisficingSta;

                    if (data.data.file && data.data.file.length > 0) {
                        $scope.view.descriptionFile = data.data.file[0];
                    }
                    setPlaceHolder();
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

    findEmptyForm();

	$scope.goProject = function(project){
		$rootScope.redirect('/watchReview/watchReviewList/'+$stateParams.formId+'/first');
	}


    function setPlaceHolder() {
        for (var i = $scope.view.fillForms.length - 1; i >= 0; i--) {
            var form = $scope.view.fillForms[i];
            form.title = form.title.trim();

            if (form.placeholder == undefined || form.placeholder.length == 0) {
                if (form.type == 'text') {
                    form.placeholder = '请填写' + form.title;
                }
                if (form.type == 'number') {
                    form.placeholder = '请填写' + form.title;
                }
                if (form.type == 'textarea') {
                    form.placeholder = '请填写' + form.title;
                }

                if (form.type == 'radio') {
                    var placeholder  = '请选择' + form.title;
                    form.placeholder = placeholder;
                }
                if (form.type == 'select') {
                    var placeholder  = '请选择' + form.title;
                    form.placeholder = placeholder;
                }
            }
            if (form.type == 'radio') {
                form.options.splice(0, 0, form.placeholder); 
                form.fillData = placeholder;
            }
            if (form.type == 'select') {
                form.options.splice(0, 0, form.placeholder); 
                form.fillData = placeholder;
            }
        }
    }


    //保存表单数据
    var saveFormRecord  = function(params) {
        console.log('====>INTERFACE saveFormRecord:'+JSON.stringify(params));
        $ionicLoading.show({
            template: '提交中...'
        });

        var formId = $stateParams.formId;
        params.formId = formId;

        if (authSrv.DeviceType == DeviceType.DeviceTypeOfBrower) {
            var url = authSrv.saveFormRecord();
            url += '&formId=' + formId;
            url += '&jsonParam=' + JSON.stringify(params);
            $http.jsonp(url).success(function (data) {
                console.log("提交表单信息:"+ JSON.stringify(data) );
                $ionicLoading.hide();
                if (data.success) {
                    $scope.savedFormObjectId = data.data;
                    if ($scope.video.hasVideo || $scope.imageList.length > 0) {
                        postFile();
                    }
                    else {
                        $cordovaToast.showShortCenter(data.message);
                        $timeout(function() {
                            // $rootScope.goBack();
                            $ionicHistory.goBack(-1);
                        }, 2000);
                    }
                }
                else {
                    $cordovaToast.showShortCenter(data.message);
                    $scope.hasSubmit = false;
                }

            }).error(function (error) {
                $ionicLoading.hide();
                $cordovaToast.showShortCenter('网络请求失败');
                $scope.hasSubmit = false;
            })
        }
        else {
            var param = authSrv.getParams();
            param.formId = formId;
            param.jsonParam = JSON.stringify(params);

            $http.post(authSrv.saveFormRecord(),param).success(function(data) {
                $ionicLoading.hide();
                if (data.success) {
                    $scope.savedFormObjectId = data.data;
                    if ($scope.video.hasVideo || $scope.imageList.length > 0) {
                        $ionicLoading.show({
                            template: '上传文件中...'
                        });
                        postFile();
                    }
                    else {
                        $cordovaToast.showShortCenter('提交成功，感谢您的参与！');
                        $timeout(function() {
                            // $rootScope.goBack();
                            $ionicHistory.goBack(-1);
                        }, 2000);
                    }
                }
                else {
                    $cordovaToast.showShortCenter(data.message);
                    $scope.hasSubmit = false;
                }
            }).error(function(err){
                $ionicLoading.hide();
                $cordovaToast.showShortCenter('网络请求失败');
                $scope.hasSubmit = false;
            });
        }
    }
    
    //检查填写数据的有效性
    var checkValidOfFillData = function() {
        for (var i = 0; i < $scope.view.fillForms.length; ++i) {
            var form = $scope.view.fillForms[i];
            if (form.required) {
                if (form.fillData == undefined || form.fillData.length == 0) {
                    $cordovaToast.showShortCenter('请填写'+form.title);
                    return false;
                }


                if (form.type == 'radio') {
                    if (form.fillData ==  form.placeholder) {
                        $cordovaToast.showShortCenter('请选择'+form.title);
                        return false;
                    }
                }
                if (form.type == 'select') {
                    if (form.fillData ==  form.placeholder) {
                        $cordovaToast.showShortCenter('请选择'+form.title);
                        return false;
                    }
                }
            }
        }
        return true;
    }


    //提交填写数据
    $scope.submitFillData = function() {
        if ($scope.hasSubmit) {
            $cordovaToast.showShortCenter('已经提交');
            return;
        }
        
        $cordovaDialogs.confirm('提交后无法修改，是否提交?', '提示', ['取消','提交'])
        .then(function(buttonIndex) {
            var btnIndex = buttonIndex;
            console.log('buttonIndex'+buttonIndex);
            // $cordovaToast.showShortCenter('buttonIndex'+buttonIndex);
            if (btnIndex == 2) {
                submitFilledData();
            }
        });
    }

    var submitFilledData = function() {

        console.log('提交表单数据:'+JSON.stringify($scope.view.fillForms));
        if (!checkValidOfFillData()) {
            return;
        }
        var filledData = {};
        var filledForm = {};
        for (var i = $scope.view.fillForms.length - 1; i >= 0; i--) {
            var form = $scope.view.fillForms[i];

            
            if (form.type == 'radio') {
                if (form.fillData ==  form.placeholder) {
                    form.fillData = '';
                }
            }
            if (form.type == 'select') {
                if (form.fillData ==  form.placeholder) {
                    form.fillData = '';
                }
            }

            filledForm[form.id] = form.fillData;

            // filledForm.id = form.id;
            if (form.type == 'text') {
                filledForm[form.id] = form.fillData;
            }
            if (form.type == 'number') {
                filledForm[form.id] = form.fillData;
            }
            if (form.type == 'textarea') {
                filledForm[form.id] = form.fillData;
            }

            if (form.title == "年龄") {
                filledData.ageMark = form.fillData;
            }
            if (form.title == "性别") {
                filledData.sexMark = form.fillData;
            }
            if (form.title == "学历") {
                filledData.educationMark = form.fillData;
            }
            if (form.title == "满意度") {
                filledData.satisficingMark = form.fillData;
            }

        }
        filledData.evaCrowdsMark = 'government';
        filledData.filedValues = filledForm;

        // 测试
        // filledData.ageMark = 25;
        // filledData.sexMark = '男';
        // filledData.educationMark = '大学';
        // filledData.satisficingMark = '好';

        
        $scope.hasSubmit = true;
        $scope.hasUploadFiles.splice(0,$scope.hasUploadFiles.length);
        saveFormRecord(filledData);
    }

    //
    var postFile = function () {
        console.log('上传文件:'+JSON.stringify($scope.video)+'====img count:'+$scope.imageList.length)

        if ($scope.video.hasVideo) {
            if ($scope.hasUploadFiles.indexOf($scope.video.fullPath) == -1) {
                upload($scope.video.fullPath);
                return;
            }
        }
        for (var i = $scope.imageList.length - 1; i >= 0; i--) {
            var image = $scope.imageList[i];
            var format = 'data:image/jpeg;base64,';

            var imgurl = image;
            if (authSrv.DeviceType == DeviceType.DeviceTypeOfBrower) {
                imgurl = image.substring(format.length, image.length);
            }
            if ($scope.hasUploadFiles.indexOf(imgurl) == -1) {
                upload(imgurl);
                break;
            }
        }

    }

    // 上传
    function upload(filePath) {
        console.log("上传文件"+filePath);


        var myfname = filePath.substr(filePath.lastIndexOf("/") + 1); // 截取文件名
        var temps  = myfname.substr(myfname.lastIndexOf(".") + 1);
        

        var newOptions = {
            fileKey: "file",
            fileName: myfname,
            chunkedMode: false,
            params: {
                objectId: $scope.savedFormObjectId,
                userId:$rootScope.variable.userId
            }
        };

        var server = authSrv.getServerAdr() + "/mobile/file/saveFile";

        console.log('upload: server:' + server +' filePath:'+filePath+' newOptions:'+JSON.stringify(newOptions));

        $cordovaFileTransfer.upload(server, filePath, newOptions)
        .then(function (result) {
            $ionicLoading.hide();
            $scope.hasUploadFiles.push(filePath);

            if (hasUploadAllFiles()) {
                $ionicLoading.hide();
                $timeout(function() {
                    $cordovaToast.showShortCenter('提交成功，感谢您的参与！');
                }, 300);
                $timeout(function() {
                    // $rootScope.goBack();
                    $ionicHistory.goBack(-1);
                }, 2600);
            }
            else {
                postFile(); // 继续上传文件
                console.log('继续上传文件');
            }
        }, function (err) {
            $ionicLoading.hide();
            var errorcode = err.code;
            var errstr = "";
            switch (errorcode) {
                case 1 :
                {
                    errstr = "源文件路径异常，请重试！" + filePath;
                    break;
                }
                case 2 :
                {
                    errstr = "目标地址无效,请重试！";
                    break;
                }
                case 3 :
                {
                    errstr = "您手机或者后台服务器网络异常,请重试！";
                    break;
                }
                default :
                {
                    errstr = "程序出错";
                    break;
                }
            }

            // var alertPopup = $ionicPopup.alert({
            //     title: '提示',
            //     template: errstr,
            //     okText: '确定'
            // });
            // alertPopup.then(function (res) {
            // });
            $cordovaToast.showShortCenter(errstr);
            console.log(errstr);
            $scope.hasSubmit = false;
        }, function (progress) {
            var uploadProgress = (progress.loaded / progress.total) * 100;
            // $ionicLoading.show({
            //     // template: "已经上传：" + Math.floor(uploadProgress) + "%"
            //     template:'' + myfname + ' ' + Math.floor(uploadProgress) + "%"
            // });
            // if (uploadProgress > 99) {
            //     $ionicLoading.hide();
            // }
            console.log('upload.... '+ uploadProgress);
        });
    };


    //判断是否上传完所有文件
    function hasUploadAllFiles() {
        // if ($scope.video.hasVideo) {
        //     return ($scope.imageList.length + 1) == $scope.hasUploadFiles.length;
        // }
        // else {
        //     return $scope.imageList.length == $scope.hasUploadFiles.length;
        // }
        return hasUploadAllImages() && hasUploadAllVideos();
    }

    //判断是否上传完所有图片
    function hasUploadAllImages() {
        for (var i = 0; i < $scope.imageList.length; i++) {
            var image = $scope.imageList[i];
            if ($scope.hasUploadFiles.indexOf(image) == -1) {
                return false;
            }
        }
        return true;
    }

    //判断是否上传完所有视频
    function hasUploadAllVideos() {
        if ($scope.video.hasVideo) {
            if ($scope.hasUploadFiles.indexOf($scope.video.fullPath) == -1) {
                return false;
            }
        }
        return true;
    }

    //重新选择图片
    $scope.resetSelectedImage = function(imgIndex) {
        console.log('imgIndex:'+imgIndex);
        if (imgIndex < $scope.imageList.length) {
            $scope.imageList.splice(imgIndex,1);
        }
    }

    $scope.showImage = function(imgPath) {
        console.log('显示图片'+imgPath);
        $scope.showImageView([imgPath]);
    }

    $scope.showVideo = function() {
        if ($scope.video.hasVideo) {
            console.log('显示视频'+$scope.video.fullPath);
            var video = {};
            video.path = $scope.video.fullPath;
            $scope.showVideoView(video);
        }
    }

    $scope.showVideoView = function(video){
        console.log('显示视频===>>'+JSON.stringify(video));
        var myApp = new Framework7();
        var myPhotoBrowser = myApp.photoBrowser({
            swipeToClose: false,
            initialSlide:0,
            theme:'dark',
            toolbar:false,
            backLinkText:'',
            ofText:' / ',
            photos: [{
                html:'<video id="video-view" class="video-js vjs-default-skin" controls preload="auto" width="300" height="300" data-setup="{}">\
                    <source src="'+video.path+'" type="video/mp4" />\
                </video>'
            }],
            onClose: function(){
                
            }
        });   
        myPhotoBrowser.open();
    };

    $scope.showImageView = function(images, index){
        var myApp = new Framework7();
        var myPhotoBrowser = myApp.photoBrowser({
            swipeToClose: false,
            initialSlide:index,
            theme:'dark',
            toolbar:false,
            backLinkText:'',
            ofText:' / ',
            photos: images,
            // photos: ['img/adam.jpg','img/ben.png','img/max.png'],
            onClose: function(){
                
            }
        });   
        myPhotoBrowser.open();
    };

    $scope.resetSelectedVideo = function() {
        $scope.video = {}
        $scope.video.hasVideo = false;
    }


    var getDeptsNameStr = function(deptList) {
        var deptNameList = [];
        for (var i = 0; i < deptList.length; i++) {
            var dept = deptList[i];
            deptNameList.push(dept.name);
        }
        return deptNameList.join(' ');
    }
});
