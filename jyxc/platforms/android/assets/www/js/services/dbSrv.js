/*
 * 数据库
 */
appMain.factory('dbSrv', function($q, $cordovaSQLite, $rootScope){
	'use strict';
	var dbs = {};

	dbs.executeQuery = function(sql, params){
		var d = $q.defer();
		var p = params || [];
		if(window.cordova){
			$rootScope.constant.DB.executeSql(sql,p,function(res){
				d.resolve(res.rows);
			}, function(err){
				d.reject({status:1,data:err});
			});
		}else{
			$cordovaSQLite.execute($rootScope.constant.DB, sql, p).then(function(res) {
				d.resolve(res.rows);
			}, function (err) {
				d.reject({status:1,data:err});
			});
		}
		
		return d.promise;
	};

	dbs.executeUpdate = function(sql, params){
		var d = $q.defer();
		var p = params || [];
		if(window.cordova){
			$rootScope.constant.DB.executeSql(sql,p,function(r){
				d.resolve({status:0,data:r});
			}, function(err){
				d.reject({status:1,data:err});
			});
		}else{
			$cordovaSQLite.execute($rootScope.constant.DB, sql, p).then(function(r) {
				d.resolve({status:0,data:r});
			}, function (err) {
				d.reject({status:1,data:err});
			});
		}
		return d.promise;
	};

	/**
	 * 事务执行批量sql
	 * @params sqls:['','','']
	 */
	dbs.transactionSqls = function(sqls){
		var d = $q.defer();
		sqls =  sqls || [];
		$rootScope.constant.DB.transaction(function(tx) {
			angular.forEach(sqls, function(sql){
				tx.executeSql(sql);
			});
		}, function(err){
			console.log(err.message);
			d.reject({status:1,msg:err.message});
		}, function(succ){
			d.resolve({status:0});
		});
		return d.promise;
	};

	/**
	 * 事务执行批量sql
	 * @params sqls:[{sql:''},{sql:'',params:['']},{sql:'',params:['','']}]
	 */
	dbs.transactionSqlsWithParams = function(sqls){
		var d = $q.defer();
		sqls =  sqls || [];
		$rootScope.constant.DB.transaction(function(tx) {
			angular.forEach(sqls, function(sql){
				var q = sql.sql || '',
					p = sql.params || [];
				tx.executeSql(q, p);
			});
		}, function(err){
			console.log(err.message);
			d.reject({status:1,msg:err.message});
		}, function(succ){
			d.resolve({status:0});
		});
		return d.promise;
	};

	return dbs;
});
