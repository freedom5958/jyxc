appMain
.controller('watchReviewListCtl', function($rootScope, $scope,$timeout,$ionicLoading,$cordovaToast,
	$http,authSrv,$ionicPopover,dateSrv,$ionicModal,$stateParams,$ionicScrollDelegate,$cordovaFileTransfer,$cordovaFile,$sce) {
   
   $rootScope.variable.allowQuit = false;
   
   	$scope.view = {
   		role:'请选择职务',
   		roleOptions:['请选择职务'],
   		roles:[],
   		searchWords:''
   	};
   	$scope.form = {};
   	$scope.form.pageNumber = 0;
   	$scope.selectedDeptsForReview = [];
   	$scope.view.feedbackDetails = [];

	// $scope.view.isSearch = false;
	// $scope.view.isDetailedSearch = false;

	$scope.backParent = function() {
        $rootScope.goBack();
    }

	$scope.startToSelect = function() {
		$scope.view.isSearch=true;
		$scope.view.searchWords = '';
	}

	$scope.cancelSearch = function() {
		$scope.view.isDetailedSearch = false;
		$scope.view.isSearch = false;
        $scope.doRefresh();
	}

	$scope.searchBykeys = function() {
        $scope.form.startDate = '';
        $scope.form.endDate = '';
        $scope.form.deptIds = '';
        $scope.form.roles = '';
        $scope.form.pageNumber = 0;

		$scope.view.feedbackDetails = [];
		$scope.form.searchWords = $scope.view.searchWords;
		$scope.loadFeedbackDetail();
	}

	$scope.startToDetailedSearch = function() {
		$scope.view.isDetailedSearch=!$scope.view.isDetailedSearch;
		$ionicScrollDelegate.scrollTop();
	}
	
	$scope.initDate = function(){
        $scope.startDate = {
            years : dateSrv.years(),
            selected : {
                year : dateSrv.currentYear(),
                month : dateSrv.currentMonth(),
                day : dateSrv.currentMonthFirstDay()
            }
        };

        $scope.endDate = {
            years : dateSrv.years(),
            selected : {
                year : dateSrv.currentYear(),
                month : dateSrv.currentMonth(),
                day : dateSrv.currentMonthLastDay()
            }
        };

        getFormStartDate();
        getFormEndDate();
    };
   
   	$scope.initDate();

    $scope.selectDate = function(){
        $ionicModal.fromTemplateUrl('modules/home/selectDate.html', {
            scope: $scope,
            animation: 'slide-in-right'
        }).then(function(modal) {
            modal.show();
            $scope.selectDateModal = modal;
        });
    };

    $scope.closeSelectDate = function(){
        $scope.selectDateModal.hide();
        $scope.selectDateModal.remove();
    };

    $scope.selectDateClear = function(){
        // $scope.refresh();
        $scope.closeSelectDate();
    };

    $scope.selectDateSure = function(){
        // $scope.loadData();
        $scope.closeSelectDate();
    };

    function getFormStartDate(){
        if($scope.startDate.selected && $scope.startDate.selected.year && $scope.startDate.selected.month && $scope.startDate.selected.day){
            $scope.view.startDate = $scope.startDate.selected.year + '年' + $scope.startDate.selected.month  + '月' +  $scope.startDate.selected.day + '日';
            $scope.form.startDate = appDate.newDate($scope.startDate.selected.year + '-' + $scope.startDate.selected.month  + '-' +  $scope.startDate.selected.day).format('yyyy-MM-dd');
        }
    };
    function getFormEndDate(){
        if($scope.endDate.selected && $scope.endDate.selected.year && $scope.endDate.selected.month && $scope.endDate.selected.day){
            $scope.view.endDate = $scope.endDate.selected.year + '年' + $scope.endDate.selected.month  + '月' +  $scope.endDate.selected.day + '日';
            $scope.form.endDate = appDate.newDate($scope.endDate.selected.year + '-' + $scope.endDate.selected.month  + '-' +  $scope.endDate.selected.day).format('yyyy-MM-dd');
        }
    };
    $scope.$watch('startDate',getFormStartDate,true);

    $scope.$watch('endDate',getFormEndDate,true);


    $scope.selectDept = function() {
    	// $rootScope.redirect('/watchReview/deptSelectorForReview/'+$stateParams.projectId || '');
    	$ionicModal.fromTemplateUrl('modules/watchReview/deptSelectorForReview.html', {
            scope: $scope,
            animation: 'none'
        }).then(function(modal) {
            modal.show();
            $scope.selectDeptModal = modal;
        });
    }



    $scope.closeSelectDeptModal = function() {
    	$scope.selectDeptModal.hide();
    	$scope.selectDeptModal.remove();
    }

    $scope.confirmSelectDept = function() {
    	$scope.selectedDeptsForReview = [];
    	for (var i = 0; i < $scope.view.depts.length; i++) {
    		var dict = $scope.view.depts[i];
    		if(dict.selected) {
    			$scope.selectedDeptsForReview.push(dict);
    		}
    	}

    	$scope.selectDeptModal.hide();
    	$scope.selectDeptModal.remove();
    }

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
            	$cordovaToast.showShortCenter('获取职务失败');
            }

        }).error(function (error) {
            $cordovaToast.showShortCenter('网络请求失败');
        })
	}

	findRoles();

	//获取部门
    var findDeptByFormId = function() {
    	$scope.view.depts = [];
    	$ionicLoading.show({
            template: '请求中...'
        });

        var url = authSrv.findDeptByFormId();
        url += '&formId='+$stateParams.projectId;
        $http.jsonp(url).success(function (data) {
            console.log("获取部门:"+ JSON.stringify(data) );
            $ionicLoading.hide();
            if (data.success) {
                for (var i = 0; i < data.data.length; i++) {
                	var deptDict = data.data[i];
                	deptDict.selected = false;
                	$scope.view.depts.push(deptDict);
                }
            }
            else {
            	$cordovaToast.showShortCenter('获取部门失败');
            }

        }).error(function (error) {
        	$ionicLoading.hide();
            $cordovaToast.showShortCenter('网络请求失败');
        })
	}

	findDeptByFormId();

	$scope.clearAllFilter = function() {
		$scope.initDate();
		$scope.selectedDeptsForReview = [];
		$scope.view.role = '';
		$scope.view.searchWords = '';

		$scope.form.searchWords = '';
    	$scope.form.startDate = '';
    	$scope.form.endDate = '';
    	$scope.form.deptIds = '';
    	$scope.form.roles = '';

    	for (var i = 0; i < $scope.view.depts.length; i++) {
            var deptDict = $scope.view.depts[i];
            deptDict.selected = false;
        }
        $scope.view.role = '请选择职务';
	}

	$scope.confirmToSelect = function() {
		$scope.view.isDetailedSearch = false;
		$scope.view.isSearch = false;

		var deptIds = [];
		for (var i = 0; i < $scope.selectedDeptsForReview.length; i++) {
			var dict = $scope.selectedDeptsForReview[i];
			deptIds.push(dict.id);
		}
		var role = '';
		for (var i = 0; i < $scope.view.roles.length; i++) {
			var dict = $scope.view.roles[i];
			if (dict.name == $scope.view.role.trim()) {
				role = dict.id;
			}
		}
		$scope.form.searchWords = $scope.view.searchWords;
    	$scope.form.startDate = $scope.form.startDate;
    	$scope.form.endDate = $scope.form.endDate;
    	$scope.form.deptIds = deptIds.join(',');
    	$scope.form.roles = role;

    	$scope.view.feedbackDetails = [];
		$scope.loadFeedbackDetail();
		$scope.clearAllFilter();
	}

	

    $scope.showView = function(did, fid){
        var dd, ff;
        angular.forEach($scope.view.feedbackDetails, function(d){
            if(d.id == did){
                dd = d;
            }
        });
        var index = 0;
        angular.forEach(dd.file, function(f, ii){
            if(f.id == fid){
                ff = f;
            }
        });
        for(var i = 0; i < dd.images.length; i++){
            if(ff.path == dd.images[i]){
                index = i;
            }
        }
        if('picture' == ff.type){
            $scope.showImageView(dd.images, index);
        }
        else if('video' == ff.type){
            $scope.showVideoView(ff);
            // downloadFile(ff.path);
        }
    };

    $scope.showVideoView = function(video){
        // video.path = 'http://192.168.100.50:5000/download?file=123.mov';
        // video.path = 'https://13-lvl3-pdl.vimeocdn.com/01/2113/3/85569724/224036863.mp4?expires=1484848799&token=0376905c7acb3804a2ace';
        // var path = $sce.trustAsResourceUrl(video.path);
        // var path = video.path;
        // console.log('path:'+path);
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
            // photos: [{
            //     html:'<video id="video-view" class="video-js vjs-default-skin" controls preload="metadata" width="300" height="300" data-setup="{}">\
            //         <source ng-src="'+path+'" type="video/mp4"/>\
            //     </video>'
            // }],
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
            // photos: ['http://192.168.100.73:8080/jyxc/download?fileId=4028e4c9598735100159873f40e80008','img/ben.png','img/max.png'],
            onClose: function(){
                
            }
        });   
        myPhotoBrowser.open();
    };

	$scope.isfirst = false;
	if($stateParams.isfirst == 'first'){
		$scope.isfirst = true;
	}



    var loadReviewData = function(selectedProjectId){
		// var hasMore = true;
		var params = authSrv.getParams();

        var jsonParam = {};
        jsonParam.formId = selectedProjectId;
        jsonParam.searchWords = $scope.form.searchWords || '';
		if(!$scope.isfirst){
			jsonParam.startDate = $scope.form.startDate || '';
			jsonParam.endDate = $scope.form.endDate || '';
		}else{
			$scope.isfirst = false;
		}
        jsonParam.deptIds = $scope.form.deptIds || '';
        jsonParam.roles = $scope.form.roles || '';
        jsonParam.pageNumber = $scope.form.pageNumber;

        params.jsonParam = JSON.stringify(jsonParam)

        console.log('高级查询条件:'+JSON.stringify(params));

        if (authSrv.DeviceType == DeviceType.DeviceTypeOfBrower) {
            var url = authSrv.findFeedbackDetails();
            url += '&jsonParam=' + JSON.stringify(jsonParam);
            $http.jsonp(url).success(function (data) {
                console.log('获取评议内容列表:'+JSON.stringify(data));
                
                if(data.success && data.data){
                
                    angular.forEach(data.data, function(d){
                        var fgs = [], fg = [], images = [];
                        for (var i = 0; i < d.file.length; i++) {
                            if (i % 3 == 0 && fg.length) {
                                fgs.push(fg);
                                fg = [];
                            }
                            fg.push(d.file[i]);
                            if(d.file[i].type == 'picture'){
                                images.push(d.file[i].path);
                            }
                        }
                        if (fg.length) {
                            var l = 3 - fg.length;
                            for (var i = 0; i < l; i++) {
                                fg.push({});
                            }
                            fgs.push(fg);
                        }
                        d.fgs = fgs;
                        d.images = images;
                        $scope.view.feedbackDetails.push(d);
                    });

                    if(data.data.length < 10){
                        $scope.hasMoreDetail = false;
                    }else{
                        $scope.hasMoreDetail = true;
                    }
                }
                else {
                    $cordovaToast.showShortCenter(data.message);
                }
                $scope.$broadcast('scroll.refreshComplete');
            }).error(function (error) {
                $cordovaToast.showShortCenter('网络请求失败');
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        else {
            $http.post(authSrv.findFeedbackDetails(),params).success(function(data) {
                
                if(data.success && data.data){
                
                    angular.forEach(data.data, function(d){
                        var fgs = [], fg = [], images = [];
                        for (var i = 0; i < d.file.length; i++) {
                            if (i % 3 == 0 && fg.length) {
                                fgs.push(fg);
                                fg = [];
                            }
                            fg.push(d.file[i]);
                            if(d.file[i].type == 'picture'){
                                images.push(d.file[i].path);
                            }
                        }
                        if (fg.length) {
                            var l = 3 - fg.length;
                            for (var i = 0; i < l; i++) {
                                fg.push({});
                            }
                            fgs.push(fg);
                        }
                        d.fgs = fgs;
                        d.images = images;
                        $scope.view.feedbackDetails.push(d);
                    });

                    if(data.data.length < 10){
                        $scope.hasMoreDetail = false;
                    }else{
                        $scope.hasMoreDetail = true;
                    }
                }
                else {
                    $cordovaToast.showShortCenter(data.message);
                }
                $scope.$broadcast('scroll.refreshComplete');
            }).error(function(err){
                $cordovaToast.showShortCenter('网络请求失败');
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        
	};

	$scope.loadFeedbackDetail = function(){
        loadReviewData($stateParams.projectId);
    };

    $scope.loadFeedbackDetail();

    $scope.loadMoreFeedbackDetail = function(){
    	$scope.form.pageNumber++;
        loadReviewData($stateParams.projectId);
    };

    //刷新
    $scope.doRefresh = function() {
    	$scope.view.feedbackDetails = [];
    	$scope.clearAllFilter();
    	$scope.form.pageNumber = 0;
        getFormStartDate();
        getFormEndDate();
    	$scope.loadFeedbackDetail();
    }


//     function createFile() {
//    var type = window.TEMPORARY;
//    var size = 5*1024*1024;

//    window.requestFileSystem(type, size, successCallback, errorCallback)

//    function successCallback(fs) {
//       fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {
//          alert('File creation successfull!')
//          console.log('fileEntry:'+JSON.stringify(fileEntry));
//       }, errorCallback);
//    }

//    function errorCallback(error) {
//       alert("ERROR: " + error.code)
//    }
    
// }


   //  var downloadFile = function(url) {  
   //  // var url = "http://your_ip_address/images/my.jpg";  
   //      // var filename = url.split("/").pop();  
   //      // alert(filename); 
   //      createFile();
   //      var filename = 'file1.mov' ;
   //      var directory = 'download';
   //      $cordovaFile.createDir(directory, false);
   //      var targetPath = cordova.file.externalRootDirectory + filename;  
   //      $cordovaFile.createFile(directory + '/' + filename, false).then(function(result) {
   //          console.log('filePath:'+JSON.stringify(result));
   //  }, function(err) {
   //    // An error occured. Show a message to the user
   //  });
   //      var trustHosts = true  
   //      var options = {};  
   // //url提交的服务器地址 targetPath提交图片的本地地址  
   //      $cordovaFileTransfer.download(url, targetPath, options, trustHosts)  
   //      .then(function(result) {  
   //          $scope.showVideoView(targetPath);
   //    }, function(error) {  
   //      // Error  
   //      alert(JSON.stringify(error));  
   //    }, function (progress) {  
   //      $timeout(function () {  
   //        // $scope.downloadProgress = (progress.loaded / progress.total) * 100;  
   //      })  
   //    });  
   //  }
});