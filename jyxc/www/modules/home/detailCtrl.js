appMain
.controller('detailCtrl', function($rootScope, $scope, $ionicActionSheet, $timeout, $location, $stateParams, dateSrv, $ionicModal, authSrv, $http, $cordovaToast, appNavibarSrv, $ionicHistory) {
	'use strict';
	$scope.view = {};
    $scope.form = {
        id : $stateParams.id
    };

    // $scope.view = {
    //     "flowTrace": [
    //         {
    //             "assigneeId": "40288132506fc09201506fc2a5360007",
    //             "assigneeName": "系统管理员",
    //             "processDate": "2016年11月30日  18:00",
    //             "stepName": "提交建言或投诉了建议"
    //         }
    //     ],
    //     "taskId": "112739",
    //     "recordId": "4028e4b558b3eccc0158b4add04900c0",
    //     "desc": "此建言由系统管理进行处理",
    //     "location": "",
    //     "supportNum": 0,
    //     "id": "4028e4b558b3eccc0158b4add0f100c7",
    //     "content": "为了使用框架你必须学会框架里所有的内容，花精力去把所有的内容对应到传统的UI原生适配，甚至于是原生代码的辅助改写！为了使用框架你必须学会框架里所有的内容，花精力去把所有的内容对应到传统的UI原生适配，甚至于是原生代码的辅助改写！为了使用框架你必须学会框架里所有的内容，花精力去把所有的内容对应到传统的UI原生适配，甚至于是原生代码的辅助改写！",
    //     "title": "系统管理员啦啊",
    //     "processInstanceId": "112729",
    //     "file": [],
    //     "claimOrTranspondUserId": "",
    //     "userName": "系统管理员",
    //     "longitude": "",
    //     "latitude": "",
    //     "isHandle": false,
    //     "comment": [],
    //     "createDate": "2016年11月30日  18:00",
    //     "processDefinitionId": "BhDKAnUcU:14:82518"
    // };

    $scope.loadData = function(){
        var params = authSrv.getParams();
        params.id = $scope.form.id;
        $http({
            method:'JSONP',
            url:authSrv.getRecordDetailsAdr(),
            params:params
        }).success(function(succ) {
            if(!succ.data){
                return;
            }
            $scope.view = succ.data
        });
    };

	$scope.backParent = function(){
		$ionicHistory.goBack();
	};

	$scope.showMapPosition = function() {
		$location.path('/mapPosition');
	}

	$scope.showImageView = function(){
        var myApp = new Framework7();
        var myPhotoBrowser = myApp.photoBrowser({
		    swipeToClose: false,
		    theme:'dark',
		    toolbar:false,
		    backLinkText:'',
		    ofText:' / ',
		    // photos: ['http://192.168.100.70:8100/a.jpg','http://192.168.100.70:8100/b.jpg','http://192.168.100.70:8100/c.jpg']
		    photos: [{
				url: 'img/adam.jpg'
			}, {
				url: 'img/ben.png'
			}, {
				url: 'img/max.png'
			}]
			/*photos: [{
				url: 'http://192.168.100.70:8100/a.jpg'
			}, {
				url: 'http://192.168.100.70:8100/b.jpg'
			}, {
				url: 'http://192.168.100.70:8100/c.jpg'
			}]*/
		});   
		myPhotoBrowser.open();
	};

	$scope.closeImageView = function(){
		$scope.imageModal.hide();
	};

	$scope.loadData();
});