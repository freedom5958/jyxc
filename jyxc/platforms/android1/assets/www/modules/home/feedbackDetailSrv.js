appMain.factory('feedbackDetailSrv', function($location, $http, authSrv, $filter, $q, $ionicLoading){
    'use strict';
    var feedbackDetailSrv = {};

	feedbackDetailSrv.loadData = function(selectedProjectId){
		var d = $q.defer();
		var hasMore = true;
		feedbackDetailSrv.view = {};
		feedbackDetailSrv.pages = [];
		feedbackDetailSrv.view.feedbackDetails = [];
		var params = authSrv.getParams();
        params.formId = selectedProjectId;

        $http({
            method:'JSONP',
            url:authSrv.findFeedbackDetailsAdr(),
            params:params
        }).success(function(succ) {
            console.log('获取评议内容列表:'+JSON.stringify(succ));
            if(succ.data){
            	feedbackDetailSrv.view.feedbackDetails = [];
                angular.forEach(succ.data, function(d){
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
                    feedbackDetailSrv.view.feedbackDetails.push(d);
                });

            	if(succ.data.length < 10){
		        	hasMore = false;
		        }else{
		        	feedbackDetailSrv.pages.pageNumber = 1;
		        }
            }
        }).finally(function(){
            d.resolve({status:0,hasMore:hasMore});
        });
        return d.promise;
	};

	feedbackDetailSrv.loadMore = function(selectedProjectId){
		var d = $q.defer();
		var hasMore = true;
		var params = authSrv.getParams();
        params.formId = selectedProjectId;
        params.pageNumber = feedbackDetailSrv.pages.pageNumber;
        $http({
            method:'JSONP',
            url:authSrv.findFeedbackDetailsAdr(),
            params:params
        }).success(function(succ) {
            if(succ.data){
            	angular.forEach(succ.data, function(d){
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
                    feedbackDetailSrv.view.feedbackDetails.push(d);
                });
		        if(succ.data.length < 10){
		        	hasMore = false;
		        }else{
		        	feedbackDetailSrv.pages.pageNumber++;
		        }
            }
        }).finally(function(){
            d.resolve({status:0,hasMore:hasMore});
        });
        return d.promise;
	};

	return feedbackDetailSrv;
});