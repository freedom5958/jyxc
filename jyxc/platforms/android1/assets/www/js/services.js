appMain
.factory('emptySrv',function($q){
	'use strict';
	var empty = {};

	empty.succ = function(){
		var d = $q.defer();
		d.resolve({status:0});
		return d.promise;
	};

	empty.err = function(){
		var d = $q.defer();
		d.reject({status:1});
		return d.promise;
	};

	return empty;
})

.factory('tempSrv',function($rootScope){
	'use strict';
	var temp = {};
	return temp;
})

.factory('tempSrv2',function($rootScope, $q, $timeout){
	'use strict';
	var temp = {};

	temp.succ = function(){
		var d = $q.defer();
		$timeout(function(){
			console.log('tempSrv2 succ');
			d.resolve({status:0});
		},1000);
		return d.promise;
	};

	temp.err = function(){
		var d = $q.defer();
		$timeout(function(){
			console.log('tempSrv2 err');
			d.reject({status:1});
		},1000);
		return d.promise;
	};

	return temp;
})

.factory('tempSrv3',function($rootScope, $q, $timeout){
	'use strict';
	var temp = {};

	temp.succ = function(){
		var d = $q.defer();
		$timeout(function(){
			console.log('tempSrv3 succ');
			d.resolve({status:0});
		},1000);
		return d.promise;
	};

	temp.err = function(){
		var d = $q.defer();
		$timeout(function(){
			console.log('tempSrv3 err');
			d.reject({status:1});
		},1000);
		return d.promise;
	};

	return temp;
})

.factory('tempSrv4',function($rootScope, $q){
	'use strict';
	var temp = {};

	temp.succ = function(){
		var d = $q.defer();
		console.log('tempSrv4 succ');
		d.resolve({status:0});
		return d.promise;
	};

	temp.err = function(){
		var d = $q.defer();
		console.log('tempSrv4 err');
		d.reject({status:1});
		return d.promise;
	};

	return temp;
})


;
