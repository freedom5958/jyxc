appMain
.factory('categorySrv',function($rootScope){
	'use strict';
	var categorySrv = {};

	categorySrv.loadData = function(data){
		categorySrv.view = {};
		categorySrv.pages = [];
		categorySrv.view.waitHandle = data.waitHandle;
        categorySrv.view.handled = data.handled;
        categorySrv.view.notHandled = data.notHandled;
        angular.forEach(categorySrv.view.notHandled, function(nh){
        	var p = {deptId:nh.deptId,pageNumber:-1};
        	var rs = [];
        	angular.forEach(nh.notHandledRecords, function(nhr){
        		rs.push(nhr.id);
        	});
        	p.recordMarkIds = rs.join(',');
        	categorySrv.pages.push(p);
        });
	};

	categorySrv.loadMore = function(data, deptId){
		angular.forEach(categorySrv.view.notHandled, function(nh){
        	if(nh.deptId == deptId){
        		angular.forEach(data, function(d){
        			nh.notHandledRecords.push(d);
        		});
        		categorySrv.updatePageNumber(deptId);
        	}
        });
	};

	categorySrv.recordMarkIds = function(deptId){
		var pp;
        angular.forEach(categorySrv.pages, function(p){
        	if(p.deptId == deptId){
        		pp = p;
        	}
        });
        return pp.recordMarkIds;
	};

	categorySrv.nextPageNumber = function(deptId){
		var pp;
        angular.forEach(categorySrv.pages, function(p){
        	if(p.deptId == deptId){
        		pp = p;
        	}
        });
        return pp.pageNumber + 1;
	};

	categorySrv.updatePageNumber = function(deptId){
        angular.forEach(categorySrv.pages, function(p){
        	if(p.deptId == deptId){
        		p.pageNumber = p.pageNumber + 1;
        	}
        });
	};

	return categorySrv;
});
