appMain.factory('appNavibarSrv', function($location, $http, authSrv, $filter, $q, $ionicLoading){
	'use strict';
	var appNavibarSrv = {};

	var urls = [{type:'all',url:'/tab/all'},{type:'category',url:'/tab/category'},{type:'dept',url:'/tab/dept'}];

    appNavibarSrv.initData = function(){
        appNavibarSrv.config = {};
        appNavibarSrv.config.items = [{
            id:'all',
            classId:'all',
            name:'全部',
            closable:false,
            type:'all',
            active:true
        },{
            id:'hotspot',
            classId:'hotspot',
            name:'热点',
            closable:false,
            type:'category'
        },{
            id:'advise',
            classId:'advise',
            name:'建言献策',
            closable:false,
            type:'category'
        },{
            id:'complain',
            classId:'complain',
            name:'投诉',
            closable:false,
            type:'category'
        }];
        appNavibarSrv.config.recommendItems = [];
    };

	appNavibarSrv.goPage = function(item){
		if(!item){return};
        angular.forEach(appNavibarSrv.config.items, function(im){
            im.active = false;
            if(im.id == item.id){
                im.active = true;
            }
        });

		var url = '';
		angular.forEach(urls, function(u){
			if(item.type == u.type){
				url = u.url + '/' +item.classId;
			}
		});
        console.log(JSON.stringify(url));
		$location.path(url);
	};

    appNavibarSrv.loadAttentions = function(){
        var d = $q.defer();
        $http({
            method:'JSONP',
            url:authSrv.findLoginAttentionsAdr(),
            params:authSrv.getParams()
        }).success(function(succ) {
            appNavibarSrv.initData();
            if(succ && succ.data && succ.data.already && succ.data.already.length){
                angular.forEach(succ.data.already, function(a){
                    appNavibarSrv.config.items.push({
                        id:a.id,
                        classId:a.classId,
                        name:$filter('lengthFilter')(a.className, 5),
                        type:'dept'
                    });
                });
            }
            if(succ && succ.data && succ.data.wait && succ.data.wait.length){
                angular.forEach(succ.data.wait, function(a){
                    appNavibarSrv.config.recommendItems.push({
                        id:a.id,
                        name:$filter('lengthFilter')(a.name, 5),
                        type:'dept'
                    });
                });
            }
            d.resolve();
        }).error(function(){
            appNavibarSrv.initData();
            d.reject();
        });
        return d.promise;
    };

    appNavibarSrv.saveAttention = function(classId){
        var d = $q.defer();
        var params = authSrv.getParams();
            params.classId = classId;
        $http({
            method:'JSONP',
            url:authSrv.saveAttentionAdr(),
            params:params
        }).success(function(succ) {
            d.resolve();
        }).error(function(){
            d.reject();
        });
        return d.promise;
    };

    appNavibarSrv.deleteAttention = function(id){
        var d = $q.defer();
        var params = authSrv.getParams();
            params.id = id;
        $http({
            method:'JSONP',
            url:authSrv.deleteAttentionAdr(),
            params:params
        }).success(function(succ) {
            d.resolve();
        }).error(function(){
            d.reject();
        });
        return d.promise;
    };


	return appNavibarSrv;
});
