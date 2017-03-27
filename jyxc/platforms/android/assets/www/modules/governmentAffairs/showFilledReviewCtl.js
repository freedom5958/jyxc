appMain
.controller('showFilledReviewCtl', function($rootScope, $scope,
    $timeout,$stateParams,$ionicLoading,$http,$cordovaToast,authSrv,$timeout,$ionicHistory) {

    $rootScope.variable.allowQuit = false;

    $scope.view = {};
    
    $scope.backParent = function() {
        $rootScope.goBack();
    }

    $scope.imageList = [];
    $scope.video = {
        hasVideo:false
    };


    //获取已填写的评议的信息
    var findRecordDetails = function() {
        $ionicLoading.show({
            template: '请求中...'
        });

        var recordId = $stateParams.recordId;

        var url = authSrv.findRecordDetails();
        url += '&recordId=' + recordId;
        $http.jsonp(url).success(function (data) {
            console.log("获取已填写的评议的信息:"+ JSON.stringify(data) );
            $ionicLoading.hide();
            if (data.success) {
                $scope.view.fillForms = JSON.parse(data.data.fileds);
                $scope.view.filledValues = JSON.parse(data.data.filedValues);
                $scope.view.description = data.data.description;
                $scope.view.dept = getDeptsNameStr(data.data.dept);
                if (data.data.formFile && data.data.formFile.length > 0) {
                    $scope.view.descriptionFile = data.data.formFile[0];
                }

                for (var i = 0; i < data.data.file.length; i++) {
                    var file = data.data.file[i];
                    var temps  = file.name.substr(file.name.lastIndexOf(".") + 1).toLowerCase();
                    if (temps == 'mov' || temps == 'mp4') {
                        $scope.video.hasVideo = true;
                        $scope.video.id = file.id;
                        $scope.video.smallPicPath = file.smallPicPath;
                        $scope.video.name = file.name;
                        $scope.video.path = file.path;
                    }
                    else {
                        $scope.imageList.push(file);
                    }
                }
                    
                setFilledValue();
            }
            else {
                $cordovaToast.showShortCenter(data.message);
            }

        }).error(function (error) {
            $ionicLoading.hide();
            $cordovaToast.showShortCenter('网络请求失败');
        })
    }

    findRecordDetails();


    var setFilledValue = function() {
        for (var i = 0; i < $scope.view.fillForms.length; i++) {
            var item = $scope.view.fillForms[i];
            // for (var j = 0; j < $scope.view.filledValues.length; j++) {
            //     var valueItem = $scope.view.filledValues[j];
            //     if (valueItem[item.id]) {
            //         item.fillData = valueItem[item.id];
            //         break;
            //     }
            // }
            if ($scope.view.filledValues[item.id]) {
                item.fillData = $scope.view.filledValues[item.id];
            }
        }
    }

    $scope.showDescriptImage = function(imageUrl) {
        $scope.showImageView([imageUrl],0);
    }
    

    $scope.showImage = function(index) {
        var imgPathList = [];
        for (var i = 0; i < $scope.imageList.length; i++) {
            var img = $scope.imageList[i];
            imgPathList.push(img.path);
        }
        $scope.showImageView(imgPathList, index);
    }

    $scope.showVideo = function() {
        if ($scope.video.hasVideo) {
            console.log('显示视频'+$scope.video.path);
            var video = {};
            video.path = $scope.video.path;
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

    var getDeptsNameStr = function(deptList) {
        var deptNameList = [];
        for (var i = 0; i < deptList.length; i++) {
            var dept = deptList[i];
            deptNameList.push(dept.name);
        }
        return deptNameList.join(' ');
    }
});
