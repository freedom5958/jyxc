/*
 * app系统相关
 */
appMain.factory('appSrv',function($rootScope, $q, dbSrv, $http, $cordovaFile,$cordovaToast){
	'use strict';
	var app = {};

	/**
	 * 初始化数据库
	 */
	app.initDb = function(){
		var d = $q.defer();
		var sqls = ['create table if not exists t_meta (key text, value text)'];
		dbSrv.transactionSqls(sqls).then(function(succ){
			d.resolve({status:0});
		}, function(err){
			d.reject({status:1, data:err});
		});
		return d.promise;
	};

	app.clearData = function(){
		var d = $q.defer();
		var sqls = [
		'delete from t_project',
		'delete from t_subproject',
		'delete from t_image',
		'delete from t_video',
		'delete from t_standard',
		'delete from t_appendix',
		"delete from a_meta where key='lastTime'",
		"insert into a_meta (key, value) values ('lastTime','1970-01-01 00:00:00')"
		];
		dbSrv.transactionSqls(sqls).then(function(succ){
			$rootScope.variable.lastTime = '1970-01-01 00:00:00';
			d.resolve({status:0});
		}, function(err){
			d.reject({status:1, data:err});
		});
		return d.promise;
	};

	/**
	 * 创建文件夹
	 */
	app.initDir = function(){
		var d = $q.defer();
		if(window.cordova){
			$cordovaFile.createDir($rootScope.constant.PLATFORM_FILE_DIR, $rootScope.constant.ROOT_DIR, false).then(function(){
				$cordovaFile.createDir($rootScope.constant.PLATFORM_FILE_DIR, $rootScope.constant.IMAGES_DIR, false);
				$cordovaFile.createDir($rootScope.constant.PLATFORM_FILE_DIR, $rootScope.constant.VIDEOS_DIR, false).then(function(){
					$cordovaFile.createDir($rootScope.constant.PLATFORM_FILE_DIR, $rootScope.constant.VIDEOS_DIR+'temp/', false);
				});
				$cordovaFile.createDir($rootScope.constant.PLATFORM_FILE_DIR, $rootScope.constant.DOCS_DIR, false).then(function(){
					d.resolve({status:0});
				});
			},function(){
				d.resolve({status:0});
			});
			/*if($rootScope.constant.PLATFORM_NAME === 'ios'){
				$cordovaFile.createDir(cordova.file.dataDirectory, 'supervision', false).then(function(){
					$cordovaFile.createDir(cordova.file.dataDirectory, 'supervision/images', false);
					$cordovaFile.createDir(cordova.file.dataDirectory, 'supervision/videos', false);
					$cordovaFile.createDir(cordova.file.dataDirectory, 'supervision/docs', false).then(function(){
						d.resolve({status:0});
					});
				},function(){
					d.resolve({status:0});
				});
			} else {
				$cordovaFile.createDir(cordova.file.externalRootDirectory, 'supervision', false).then(function(){
					$cordovaFile.createDir(cordova.file.externalRootDirectory, 'supervision/images', false);
					$cordovaFile.createDir(cordova.file.externalRootDirectory, 'supervision/videos', false);
					$cordovaFile.createDir(cordova.file.externalRootDirectory, 'supervision/docs', false).then(function(){
						d.resolve({status:0});
					});
				},function(){
					d.resolve({status:0});
				});
			}*/
		}else{
			d.resolve({status:0});
		}
		return d.promise;
	};

	/**
	 * 测试能否连接至服务器
	 */
	app.testLink = function(){
		var d = $q.defer();
		var url = 'http://'+$rootScope.constant.SERVER_ADDRESS+'/hhjl/mobile/userlogin?callback=JSON_CALLBACK';
		$http({
			method:'JSONP',
			url:url,
			params:{
				account:'',
				password:''
			},
			timeout:$rootScope.constant.TIMEOUT
		}).success(function(succ, status, headers, config){
			console.log('--succ-->'+JSON.stringify(succ)+'--status-->'+JSON.stringify(status)+'--headers-->'+JSON.stringify(headers)+'--config-->'+JSON.stringify(config));
			d.resolve({status:0});
		}).error(function(err, status, headers, config){
			console.log('--err-->'+JSON.stringify(err)+'--status-->'+JSON.stringify(status)+'--headers-->'+JSON.stringify(headers)+'--config-->'+JSON.stringify(config));
			d.reject({status:1});
		});
		return d.promise;
	};

	app.pathToCdvfile = function(path){
		var d = $q.defer();
		resolveLocalFileSystemURL(path, function(entry) {
			var cdv = entry.toInternalURL();
			d.resolve(cdv);
		}, function(err){
			d.reject(err);
		});
		/*window.addEventListener('filePluginIsReady', function(){ 
			resolveLocalFileSystemURL(path, function(entry) {
				var cdv = entry.toInternalURL();
    			d.resolve(cdv);
			});
		}, false);*/
		return d.promise;
	};

	return app;
})
.factory('LS',function($rootScope){
	var ls = {
		base : null,
		init : function(){
			this.base = localStorage;
			return this;
		},
		set : function(key,value){
			this.base.setItem(key,value);
		},
		get : function(key){
			return this.base.getItem(key);
		},
		rm : function(key) {
			return this.base.removeItem(key);
		},
		setInc : function(key){
			var v = parseInt(this.get(key));
			if(isNaN(v) || typeof v == 'undefined'){
				v = 0;
			}
			v++;
			this.set(key,v);
		},
		clear : function(){
			for(var n in this.base){
				if(n.indexOf('message_') === 0){
					this.set(n,0);
				}
			}
		},
		all : function(){
			return this.base;
		},
		allNumber : function(){
			var number = 0;
			for(var n in this.base){
				if(n.indexOf('message_user_') === 0){
					number += parseInt(this.base[n]);
				}
			}
			if(number < 1) number = '';
			return number;
		}
	};
	return ls.init();
})
.factory('dateSrv',function($rootScope){
	'use strict';
	var dateSrv = {};

	dateSrv.currentYear = function(){
		if($rootScope.variable.serverTime){
			return appDate.year($rootScope.variable.serverTime);
		} else {
			return appDate.currentYear();
		}
	};

	dateSrv.years = function(){
		var cy = dateSrv.currentYear();
		var ys = [];
        ys.push(cy - 2);
        ys.push(cy - 1);
        ys.push(cy);
        ys.push(cy + 1);
        ys.push(cy + 2);
        return ys;
	};

	dateSrv.currentMonth = function(){
		if($rootScope.variable.serverTime){
			return appDate.month($rootScope.variable.serverTime);
		} else {
			return appDate.currentMonth();
		}
	};

	dateSrv.currentMonthFirstDay = function(){
		return appDate.monthFirstDay(dateSrv.currentYear(), dateSrv.currentMonth()).getDate();
	};

	dateSrv.currentMonthLastDay = function(){
		return appDate.monthLastDay(dateSrv.currentYear(), dateSrv.currentMonth()).getDate();
	};

	return dateSrv;
})
.factory("DataFormat",function(Room,$rootScope){//服务器返回信息格式化，全部校准后可以去掉此部分的循环体，直接返回内容，避免多余的处理
	var format = {
		formatMessage:function(data){
			var datalist = [];
			for(var n in data){
				if(data[n].sendUserPhoto == '' || data[n].sendUserPhoto.indexOf('head_portrait') > -1 || data[n].sendUserPhoto.substring(data[n].sendUserPhoto.length-1) == '/'){
					data[n].sendUserPhoto = 'img/default_head.png';
				}
				datalist.push({
					userId:data[n].sendUserId,
					avatar:data[n].sendUserPhoto,
					chatText:data[n].content,
					msg_id:data[n].messgeCode,
					nickName:data[n].sendNickName
				});
			}
			return datalist;
		},
		formatSearchUser:function(data){
			//console.log('会话列表信息:' + JSON.stringify(data));
			var userlist = [];
			for(var n in data) {
				userlist.push({
					room:data[n].avatar,
					title:data[n].mobile,
					latest_chat:'fhdsjkdhfkjsdhf',
					thumbnail:data[n].avatar,
					mobile:data[n].mobile
				});
			}
			//console.log('会话列表信息:' + JSON.stringify(userlist));
			return userlist;
		},
		//格式化聊天信息列表
		formatConversations : function(data){
			var datalist = [];
			for(var n in data) {
				try{
					if(data[n].Photo == '' || data[n].Photo.indexOf('head_portrait') > -1 || data[n].Photo.substring(data[n].Photo.length-1) == '/'){
						data[n].Photo = 'img/default_head.png';
					}
				}catch(e){
					data[n].Photo = 'img/thumbnail0'+Math.floor(1 + Math.random() * (6 - 1))+'.jpg';
				}
				if(data[n].acceptid == $rootScope.variable.userId) {
					data[n].acceptid = data[n].send_user_id;
				}
				datalist.push({
					id:data[n].acceptid,
					title:data[n].Name,//头像
					thumbnail:data[n].Photo,//类型，是否有新消息
					latest_chat:data[n].content,//昵称
					activeTime:data[n].sendtime,//最后回复时间
					type:data[n].accept_type == '0' ? 'user' : 'group'
				});
			}
			return datalist;
		},
		//格式化群组信息列表
		formatGroupList:function(data) {
			var datalist = [];
			for(var n in data){
				datalist.push({
					id: data[n].groupCode,
					title: data[n].groupName,
					thumbnail: 'img/thumbnail0'+Math.floor(1 + Math.random() * (6 - 1))+'.jpg',
					activeTime: '',
					members:data[n].members
				});
			}
			return datalist;
		},
		//格式化好友信息列表
		formatFriendList:function(data) {
			var datalist = [];
			for(var n in data){
				if(data[n].userPhoto == '' || data[n].userPhoto.indexOf('head_portrait') > -1 || data[n].userPhoto.substring(data[n].userPhoto.length-1) == '/'){
					data[n].userPhoto = 'img/default_head.png';
				}
				datalist.push({
					userId: data[n].userId,
					title: data[n].nickName,
					thumbnail: data[n].userPhoto,
					friendType: 'Messenger',
					verifyMessage:'好友验证信息'
				});
			}
			return datalist;
		},
		//格式化好友验证信息列表
		formatFriendVerifyList:function(data) {
			var datalist = [];
			for(var n in data){
				if(data[n].userPhoto == '' || data[n].userPhoto.indexOf('head_portrait') > -1 || data[n].userPhoto.substring(data[n].userPhoto.length-1) == '/'){
					data[n].userPhoto = 'img/default_head.png';
				}
				datalist.push({
					title: data[n].nickName,
					thumbnail: data[n].userPhoto,
					friendType: 'Messenger',
					verifyMessage:data[n].actionType == 'request' ? '请求加对方为好友' : '好友验证信息',
					verifyId:data[n].verifyId,
					verifyStatus:data[n].status,
					verifyType:data[n].actionType == 'Requested' ? 'requested' : 'request'
				});
			}
			return datalist;
		},
		//格式化用户信息
		formatUserInfo:function(data) {
			return {
				mobile:data.phoneNumber,//手机号码
				nickName:data.nickName,
				thumbnail:data.userPhoto,
				userName:data.account,
				userId:data.userid
			};
		},
		//格式化公告、活动信息
		formatNotice:function(data) {
			var datalist = [];
			for(var n in data){
				data[n].mobileimage = data[n].mobileimage.length ? $rootScope.constant.SERVER_ADDRESS+data[n].mobileimage[0] : '';
				datalist.push({
					title: data[n].title,
					content: data[n].content,
					noticeId: data[n].id,
					mobileimage: data[n].mobileimage
				});
			}
			return datalist;
		},
		//格式化部门信息
		formatDept:function(data){
			var datalist = [];
			for(var n in data){
				datalist.push({
					deptId:data[n].deptId,
					deptName:data[n].deptName,
					deptParent:data[n].deptParent,
					deptCount:parseInt(data[n].deptcount),
					userCount:parseInt(data[n].usercount)
				});
			}
			return datalist;
		},
		formatComp:function(data,notList) {
			var datalist = [];
			if(notList){
				datalist = {
					appendUser:data.appendUser,
					appendTime:data.appendTime,
					compId:data.compId,
					content:data.content,
					isEnd:data.isEnd,
					reList:data.reList,
					canRe:data.canRe || false,
					activeList:data.activeList,
					isActive:data.isActive == 'N' ? false : true,
					fileList:typeof data.fileList == 'object' ? data.fileList : [],
					latitude:parseInt(data.latitude) == 0 || isNaN(data.latitude) ? 0 : data.latitude,
					longitude:parseInt(data.longitude) == 0 || isNaN(data.longitude) ? 0 : data.longitude
				};
			}else{
				for(var n in data){
					datalist.push({
						appendUser:data[n].appendUser,
						appendTime:data[n].appendTime,
						compId:data[n].compId,
						content:data[n].content,
						isEnd:data[n].isEnd,
						reList:data[n].reList,
						canRe:data[n].canRe || false,
						isActive:data[n].isActive == 'N' ? false : true,
						fileList:typeof data[n].fileList == 'object' ? data[n].fileList : [],
						latitude:parseInt(data[n].latitude) == 0 || isNaN(data[n].latitude) ? 0 : data[n].latitude,
						longitude:parseInt(data[n].longitude) == 0 || isNaN(data[n].longitude) ? 0 : data[n].longitude
					});
				}
			}
			console.log(datalist);
			return datalist;
		}

	};
	return format;
}
).factory("LTAction",function(NJMessage,$ionicLoading,$cordovaToast,$http,authSrv,DataFormat,Room,User,Chat,NJMessage,$rootScope){//当前为数据接口信息
	console.log('加载功能函数');
	var LTAction = {
		$rootScope:null,
		$scope:null,
		jmessage_init:false,
		init : function($rootScope,$scope){
			this.$rootScope = $rootScope;
			this.$scope = $scope;
			//聊天功能前置处理
		},
		httpError : function(error){
			$ionicLoading.hide();
		},
		//获取聊天信息列表
		getMessageList : function(callback){
			var url = authSrv.getMessageList();
			$http.jsonp(url).success(function(data){
				//格式化网络来源信息
				data.data = DataFormat.formatConversations(data.data);
				//刷新Room数据信息
				Room.setActivitiesData(data.data);
				//刷新Room数据信息 END
				callback(data);
			}).error(LTAction.httpError);	
		},
		//获取群组列表
		getGroupList : function(callback) {
			var url = authSrv.getGroupList();
			$http.jsonp(url).success(function(data){
				data.data = DataFormat.formatGroupList(data.data);
				//刷新群组数据信息
				//
				// ...
				//
				//刷新群组数据信息 END
				callback(data);
			}).error(LTAction.httpError);
		},
		//获取群组列表
		getGroupList : function(callback) {
			var url = authSrv.getGroupList();
			$http.jsonp(url).success(function(data){
				data.data = DataFormat.formatGroupList(data.data);
				//刷新群组数据信息
				//
				// ...
				//
				//刷新群组数据信息 END
				callback(data);
			}).error(LTAction.httpError);
		},
		//开通群组
		requestAddGroup : function(callback,params) {
			//先向极光添加群组信息
			NJMessage.createGroup(function(data){
				params.gid = params.groupCode = data.gid;
				NJMessage.groupAddUser(function(data){
					//向服务器传输群信息
					params.userIds += params.userIds.length > 0 ? ','+$rootScope.variable.userId : $rootScope.variable.userId;
					var url = authSrv.addGroup(params);
					$http.jsonp(url).success(function(data){
						console.log(data);
						callback(data);
						/*LTAction.sendMessage(function(){
							callback(data);
						},{
							fromUserId:$rootScope.variable.userId,
							toUserId:params.gid,
							//toUserId:'ff80808159b7af8a0159c3fa901e00ea',
							content:'',
							activeType:'1'
						});*/
					}).error(LTAction.httpError);
				},params);
			},params);
		},
		//请求加为好友
		requestAddFriend : function(callback,params){
			var url = authSrv.requestAddFriend(params);
			$http.jsonp(url).success(function(data) {//服务器返回单个用户信息
				console.log(data);
				//格式化网络来源信息
				//data.data = DataFormat.formatFriendList([data.data]);
				//刷新User数据信息
				callback(data);
			}).error(LTAction.httpError);
		},
		//初始化极光推送信息
		initNJMessage : function(callback,params){
			if(this.jmessage_init){
				callback();
			}else{
				NJMessage.init(function(){
					this.jmessage_init = true;
					NJMessage.register(params.userId,'99SDRAKCY',function(){
						NJMessage.login(params.userId,'99SDRAKCY',function(){
							NJMessage.addListen(params);
							callback();
						});
					});
				});
			}
			return this;
		},
		//获取聊天记录
		getUserMessageDataList : function(callback,params){
			var url = authSrv.getUserMessageDataList(params);
			$http.jsonp(url).success(function(data){
				data.data = DataFormat.formatMessage(data.data);
				callback(data);
			}).error(LTAction.httpError);
		},
		//获取群组聊天记录
		getGroupMessageDataList : function(callback,params){
			var url = authSrv.getGroupMessageDataList(params);
			$http.jsonp(url).success(function(data){
				data.data = DataFormat.formatMessage(data.data);
				callback(data);
			}).error(LTAction.httpError);
		},
		//好友请求通过
		requestConfirmFriend : function(callback,params){
			var url = authSrv.requestConfirmFriend(params);
			$http.jsonp(url).success(function(data){
				callback(data)
			}).error(LTAction.httpError);
		},
		//获取好友列表
		requireFriend : function(callback){
			var url = authSrv.requireFriend({});
			$http.jsonp(url).success(function(data){
				data.data = DataFormat.formatFriendList(data.data);
				callback(data)
			}).error(LTAction.httpError);
		},
		//验证信息列表
		requireVerifyFriend : function(callback,params){
			var url = authSrv.requireVerifyFriend(params);
			$http.jsonp(url).success(function(data){
				data.data = DataFormat.formatFriendVerifyList(data.data);
				callback(data)
			}).error(LTAction.httpError);
		},
		//发送聊天信息
		sendMessage : function(callback,params){
			//向极光发送消息
			NJMessage.sendMessage(params.content,params.toUserId,function(data){
				params.messgeCode = data.msg_id;
				var url = authSrv.sendMessage(params);
				console.log('向服务器推送信息');
				$http.jsonp(url).success(function(data){
					data.msg_id = params.messgeCode;
					callback(data);
				}).error(LTAction.httpError);
			});
		},
		//根据用户ID获取用户信息
		getUserInfo : function(callback,params){
			var url = authSrv.getUserInfo(params);
			$http.jsonp(url).success(function(data){
				//data.data = DataFormat.formatFriendVerifyList(data.data);
				callback(data)
			}).error(LTAction.httpError);
		},
		//发送群组消息
		sendGroupMessage:function(callback,params){
			NJMessage.sendGroupMessage(params.content,params.toUserId,$rootScope.variable.userName,function(data){
				params.messgeCode = data.msg_id;
				var url = authSrv.sendGroupMessage(params);
				console.log('向服务器推送群发信息');
				$http.jsonp(url).success(function(data){
					data.msg_id = params.messgeCode;
					callback(data);
				}).error(LTAction.httpError);
			});
		},
		//根据用户手机号码查询用户信息
		requestGetUserinfoByMobile:function(callback,params){
			var url = authSrv.requestGetUserinfoByMobile(params);
			$http.jsonp(url).success(function(data){
				if(data.success){
					data.data = DataFormat.formatUserInfo(data.data);
				}
				callback(data);
			}).error(LTAction.httpError);
		},
		getConversation:function(callback){
			NJMessage.getConversation(callback);
		},
		getUsersList : function(callback,params){
			var url = authSrv.getUsersList(params);
			$http.jsonp(url).success(function(data){
				callback(data);
			}).error(LTAction.httpError);
		},
		//公告列表
		getNoticeList : function(callback,params){
			var url = authSrv.getNoticeList(params);
			$http.jsonp(url).success(function(data){
				data.data = DataFormat.formatNotice(data.data);
				callback(data)
			}).error(LTAction.httpError);
		},
		//获取公告详情
		requestGetNotice : function(callback,params){
			var url = authSrv.requestGetNotice(params);
			$http.jsonp(url).success(function(data){
				callback(data)
			}).error(LTAction.httpError);
		},
		//活动列表
		getActivityList : function(callback,params){
			var url = authSrv.getActivityList(params);
			$http.jsonp(url).success(function(data){
				data.data = DataFormat.formatNotice(data.data);
				callback(data)
			}).error(LTAction.httpError);
		},
		//获取活动详情
		requestGetActivity : function(callback,params){
			var url = authSrv.requestGetActivity(params);
			$http.json(url).success(function(data){
				callback(data)
			}).error(LTAction.httpError);
		},
		//获取用户基本信息
		requestGetUserHandle : function(callback,params){
			var url = authSrv.requestGetUserHandle(params);
			$http.jsonp(url).success(function(data){
				callback(data)
			}).error(LTAction.httpError);
		},
		//投诉建议部分
		getDeptList : function(callback,params){
			var url = authSrv.getDeptList(params);
			$http.jsonp(url).success(function(data){
				data.data = DataFormat.formatDept(data.data);
				callback(data);
			});
		},
		//提交建议等信息
		requestComp : function(callback,params){
			var url = authSrv.requestComp(params);
			$http.jsonp(url).success(function(data) {
				callback(data);
			}).error(LTAction.httpError);
		},
		//获取建议等列表信息
		getCompList : function(callback,params){
			var url = authSrv.getCompList(params);
			$http.jsonp(url).success(function(data) {
				data.data = DataFormat.formatComp(data.data);
				callback(data);
			}).error(LTAction.httpError);
		},
		//其它
		getComp : function(callback,params){
			var url = authSrv.getComp(params);
			$http.jsonp(url).success(function(data){
				data.data = DataFormat.formatComp(data.data,true);
				console.log(data.data);
				callback(data);
			}).error(LTAction.httpError);
		},

		//获取经办人建议等列表信息
		getCompJBList : function(callback,params){
			var url = authSrv.getCompJBList(params);
			$http.jsonp(url).success(function(data) {
				//暂时使用默认列表过滤方式
				data.data = DataFormat.formatComp(data.data);
				callback(data);
			}).error(LTAction.httpError);
		},
		
		//更新部门跳转信息
		requestChangeDept : function(callback,params){
			var url = authSrv.requestChangeDept(params);
			$http.jsonp(url).success(function(data) {
				callback(data);
			}).error(LTAction.httpError);
		},

		//上传回复信息
		requestReply : function(callback,params) {
			var url = authSrv.requestReply(params);
			$http.jsonp(url).success(function(data) {
				callback(data);
			}).error(LTAction.httpError);
		},

		//获取内容
		getConversationList : function(callback,params){
			var url = authSrv.getConversationList(params);
			$http.jsonp(url).success(function(data) {
				callback(data);
			}).error(LTAction.httpError);
		},

		//获取群组成员列表
		getGroupUserList : function(callback,params){
			var url = authSrv.getGroupUserList(params);
			$http.jsonp(url).success(function(data){
				callback(data);
			}).error(LTAction.httpError);
		},
		
		alert:function(message){
			//alert(message);
			$cordovaToast.showShortCenter(message);
		},
		//重置JMessage监听事件
		setMessageReceive : function(func){
			NJMessage.addListen({
				onMsgReceive : func
			});
		},
		//更新用户应用打开状况
		requestUpdateOnline : function(callback,params){
			var url = authSrv.requestUpdateOnline(params);
			$http.jsonp(url).success(function(data){
				callback(data);
			}).error(LTAction.httpError);
		},

		init : function(){
			console.log('引入LTAction结束');
		}
	};
	return LTAction;
}).factory("NJMessage",function(Room,User,Chat,$ionicLoading,$rootScope){
	var jmessage = {
		params:{
			appkey:'',
			timestamp:'',
			master_secret:'',
			signature:'',
			random_str:''
		},
		jmobj:null,
		init:function(callback){
			this.params.appkey = 'ff3ba14acbee03289b1c21bf';
			this.params.timestamp = Date.parse(new Date());
			this.params.random_str = '022cd9fd995849b58b3ef0e943421ed9';
			this.params.master_secret = 'fa993c6eefc92a2be6808648';
			this.params.signature = this.getSignature();
			this.jmobj = new JMessage({
				debug : false,
			});
			this._init(callback);
		},
		_init:function(callback){
			this.jmobj.init({
				"appkey": this.params.appkey,
				"random_str": this.params.random_str,
				"signature": this.params.signature,
				"timestamp": this.params.timestamp
			}).onSuccess(function(data) {
				if(typeof callback == 'function') callback.call(jmessage);
				console.log('极光初始化成功');
			}).onFail(function(data) {
				console.log('error:' + JSON.stringify(data));
			});
		},
		addListen:function(params){
			//生成监听事件
			//if(typeof params.onMsgReceive == 'function'){
				/*this.jmobj.onMsgReceive(function(data){
					console.log(data);
					params.onMsgReceive(data);
				});*/
				this.jmobj.onMsgReceive(function(data){
					for(var n in $rootScope.event_jMessageOnMsgReceiveCallback){
						if(typeof $rootScope.event_jMessageOnMsgReceiveCallback[n] == 'function') $rootScope.event_jMessageOnMsgReceiveCallback[n](data);
					}
					//if(typeof $rootScope.event_jMessageOnMsgReceiveCallback == 'function') $rootScope.event_jMessageOnMsgReceiveCallback(data);
				});
			//}
		},
		getSignature:function(){
			return hex_md5('appkey='+this.params.appkey+'&timestamp='+this.params.timestamp+'&random_str='+this.params.random_str+'&key='+this.params.master_secret);
		},
		register:function(username,password,callback){
			this.jmobj.register({
				'username':username,
				'password':password,
				'is_md5':false
			}).onSuccess(function(data) {
				//console.log('注册返回信息'+JSON.stringify(data));
				callback.call(jmessage);
				return true;
			}).onFail(function(data) {
				if(data.code == 882002) {//通常为用户已经注册过了
					callback.call(jmessage);
					return true;
				}
				return false;
			});
		},
		login:function(username,password,callback){
			$ionicLoading.hide();
			this.jmobj.login({
				'username':username,
				'password':password
			}).onSuccess(function(data) {
				console.log('登录成功:' + JSON.stringify(data));
				callback.call(jmessage);
				return true;
			}).onFail(function(data) {
				console.log('登录失败:' + JSON.stringify(data));
				if(data.code == 882002) {//通常为用户已经登录过了
					callback.call(jmessage);
					return true;
				}
				return false;
			});
		},
		//发送群聊信息
		sendGroupMessage : function(content,gid,nickname,callback){
			console.log({
               target_gid : gid,
               target_gname : nickname,
               content : content,
               extras : []
            });
			this.jmobj.sendGroupMsg({
               target_gid : gid,
               target_gname : nickname,
               content : content,
               extras : []
            }).onSuccess(function(data , msg) {
			   console.log(data);
			   callback(data);
            }).onFail(function(data) {
               alert('发送信息失败');
			   console.log(data);
            });
		},
		sendMessage : function(content,toUserId,callback){
			//发送信息
			this.jmobj.sendSingleMsg({
				'target_username' : toUserId,
                'target_nickname' : 'xiudo',
                'content' : content,
                'appkey' : this.params.appkey,
                'extras' : {}
			}).onSuccess(function(data){
				console.log('推送到极光成功');
				console.log(data);
				callback(data);
			}).onFail(function(data){
				console.log('推送失败'+content+jmessage.params.appkey);
			});
			
		},
		getConversation:function(callback){
			this.jmobj.getConversation().onSuccess(function(data){
				callback(data);
			}).onFail(function(data){
				console.log('获取回话列表失败');
			});
		},
		formatConversations:function(data){//格式化会话列表信息
			//暂时直接返回列表
			return data;
		},
		createGroup:function(callback,params){
			this.jmobj.createGroup({
				group_name:params.groupName,
				group_description:'群组描述'
			}).onSuccess(function(data){
				callback(data);
			}).onFail(function(data){
				alert('创建群组失败');
			});
		},
		//添加群组成员
		groupAddUser:function(callback,params){
			var member_usernames = [];
			params.userIds = params.userIds.split('+');
			for(var n in params.userIds){
				member_usernames.push({
					username:params.userIds[n]
				});
			}
			var that = this;
			this.jmobj.addGroupMembers({
				gid:params.gid,
				member_usernames:member_usernames
			}).onSuccess(function(data){
				//that.groupGetMembers(params.gid);
				callback(data);
			}).onFail(function(data){
				console.log(data);
				alert('添加群组成员失败');
				//that.groupGetMembers(params.gid);
			});
		},
		groupGetMembers:function(gid){
			this.jmobj.getGroupMembers({
				gid:gid
			}).onSuccess(function(data){
				console.log('获取群组成员列表成功');
				console.log(data);
				alert('获取群组成员列表成功');
			}).onFail(function(data){
				alert('获取群组成员列表失败');
			});
		}
	};
	return jmessage;
}
).factory("Room", function(User, Chat) {
	var e = User,t = Chat;
    var n = [{
        id: "room_a",
        roomType: "group",
        thumbnail: "img/thumbnail01.jpg",
        title: "我爱喝咖啡",
        members: "凤姐, 马蓉, 全权",
        activeTime: "Active today",
        userList: ["213", "1", "2"]
    }, {
        id: "room_b",
        roomType: "group",
        thumbnail: "img/thumbnail02.jpg",
        title: "万达商圈",
        members: "马蓉, 苹果妞, 全权",
        activeTime: "Active today",
        userList: ["2", "3", "213"]
    }, {
        id: "room_c",
        roomType: "ms_friend",
        thumbnail: "img/user01.jpg",
        title: "凤姐",
        members: "凤姐, 全权",
        activeTime: "1个小时前",
        userList: ["213", "1"]
    }, {
        id: "room_d",
        roomType: "fb_friend",
        thumbnail: "img/user02.jpg",
        title: "马蓉",
        members: "马蓉, 全权",
        activeTime: "1个小时前",
        userList: ["213", "2"]
    }, {
        id: "room_e",
        roomType: "group",
        thumbnail: "img/thumbnail03.jpg",
        title: "Ionic",
        members: "马蓉, 苹果妞, 牛奶小姐, 全权",
        activeTime: "11:00 am",
        userList: ["2", "3", "5", "213"]
    }, {
        id: "room_f",
        roomType: "group",
        thumbnail: "img/thumbnail04.jpg",
        title: "Rockers",
        members: "凤姐, 马蓉, 全权, 牛奶小姐",
        activeTime: "12:15 am",
        userList: ["1", "2", "213", "5"]
    }];
    return {
        all: function() {
            return n
        },
        allGroups: function(e, t) {
            for (var i = [], r = [], o = 0; o < n.length; o++) {
                var a = !1;
                if (!a && n[o].userList.length > 2)
                    for (var s = 0; s < n[o].userList.length; s++)
                        n[o].userList[s] === e && (a = !0);
                a && r.push(n[o]),
                (r.length == t || o + 1 == n.length) && (i.push(r),
                r = [])
            }
            return i
        },
        userActivities: function(e) {
            for (var i = [], r = 0; r < n.length; r++) {
                var o = !1;
                if (!o)
                    for (var a = 0; a < n[r].userList.length; a++)
                        n[r].userList[a] === e && (o = !0);
                if (o) {
                    var s = t.getByRoom(n[r].id);
                    s.length > 0 && (n[r].latest_chat = s[s.length - 1].chatText,
                    i.push(n[r]))
                }
            }
            return i
        },
        get: function(t) {
            for (var i = 0; i < n.length; i++)
                if (n[i].id === t) {
                    n[i].user = [];
                    for (var r = 0; r < n[i].userList.length; r++)
                        n[i].user.push(e.get(n[i].userList[r]));
                    return n[i]
                }
            return null
        },
        newRoom: function(t) {
            var n = e.get(t)
              , i = {
                id: "",
                roomType: "fb_friend",
                thumbnail: n.face,
                title: n.name,
                members: n.name + ", 全权",
                activeTime: "Now",
                userList: ["213", n.id]
            };
            return i
        },
        newGroup: function(t, n) {
            var i = n.split("+")
              , r = {
                id: "",
                roomType: "group",
                thumbnail: "img/placeholder.png",
                title: t,
                members: "",
                activeTime: "Now",
                userList: i
            };
            r.user = [];
            for (var o = 0; o < i.length; o++)
                r.user.push(e.get(i[o]));
            return r
        },
        getByUserId: function(t) {
            for (var i = !1, r = 0; r < n.length; r++)
                if ("group" != n[r].roomType && !i)
                    for (var o = 0; o < n[r].userList.length; o++)
                        if (n[r].userList[o] === t)
                            return i = !0,
                            n[r];
            if (!i) {
                var a = e.get(t)
                  , s = {
                    id: "new/" + a.id
                };
                return s
            }
            return null
        },
		setActivitiesData:function(data){
			n = data;
		}
    }
})//即时通讯
.factory("User", function() {
    var e = [];
    return {
        all: function() {
            return e
        },
        myFriends: function(t) {
            for (var n = [], i = 0; i < e.length; i++)
                e[i].id != t && n.push(e[i]);
            return n
        },
        get: function(t) {
            for (var n = 0; n < e.length; n++)
                if (e[n].id === t)
                    return e[n];
            return null
        },
		setFriendList : function(data) {
			e = data;	
		},
		//删除列表中的指定信息
		removeFriend : function(data) {
			//此内容需根据服务器反转信息进行调整
			var datalist = [];
			for(var m in e){
				if(e[m].userId != data.userId) {
					datalist.push(e[m]);
				}
			}
			e = datalist;
		},
		//更新验证状态
		updateFriend : function(data){
			var datalist = [];
			for(var m in e){
				if(e[m].userId != data.userId) {
					datalist.push(e[m]);
				}else{
					datalist.push(data);
				}
			}
			e = datalist;
		},
		//添加用户
		addUser : function(data){
			e.push(data);
		}
    }
}
).factory("Chat", function(User) {
	var e = User;
    var t = [];
    return {
		msg_ids : {},
        all: function() {
            return t
        },
		setChatList : function(data){
			t = data;	
		},
        add: function(chatText, msg_id, userId, avatar, nickName) {
            var r = {
                userId: userId,
                chatText: chatText,
				avatar:avatar,
				msg_id:msg_id,
				nickName:nickName
            };
            t.push(r);
        },
		remove: function(e,n,i){
			alert('删除成功！');
		},
        get: function(n) {
            for (var i = 0; i < t.length; i++)
                if (t[i].id === n)
                    return t[i].user = e.get(t[i].userId),
                    t[i];
            return null
        },
        getByRoom: function(n) {
            for (var i = [], r = 0; r < t.length; r++)
                t[r].roomId === n && (t[r].user = e.get(t[r].userId),
                i.push(t[r]));
            return i
        },
		html: function(userId,roomType){

				/*
				<div class="item item-avatar-s chat-friend" ng-if="chat.userId!=213"> <img ng-src="{{chat.user.face}}" /> <span class="badge avatar-badge avatar-badge-xs" ="" ng-class="{'badge-positive':chat.user.friendType=='Messenger', 'badge-stable':chat.user.friendType=='facebook'}"> <i class="icon ion-ios-bolt" ng-if="chat.user.friendType=='Messenger'"></i> <i class="icon ion-social-facebook light" ng-if="chat.user.friendType=='facebook'"></i> </span>
        <p class="chat-text stable-bg"> {{chat.chatText}}</p>
      </div>
      <div class="item item-avatar-right-s chat-me text-right" ng-if="chat.userId==213"> <img ng-src="{{chat.user.face}}" />
        <p class="chat-text positive-bg text-left"> {{chat.chatText}}</p>
      </div>
				*/
			roomType = typeof roomType == 'undefined' ? 'user' : roomType;
			var html = '';
			for(var m in t){
				html += '<div class="list border-none" class="'+(t[m].userId == userId ? 'me' : '')+'">';
				if(t[m].userId != userId){
					html += '<div class="item item-avatar-s chat-friend">';
					//html += '<a href="/#/room/user_'+t[m].userId+'/'+t[m].nickName+'" style="display:block;position:absolute;left:0px;top:0px;height:30px;width:30px;border-radius:15px;overflow:hidden;"><img src="'+t[m].avatar+'"/></a>';
					html += '<a style="display:block;position:absolute;left:0px;top:0px;height:30px;width:30px;border-radius:15px;overflow:hidden;"><img style="width:100%;height:100%" src="'+t[m].avatar+'"/></a>';
					html += '<span style="position:absolute;font-size:12px;">'+t[m].nickName+'</span>';
					html += '<p class="chat-text stable-bg" style="margin-top:1.5rem;"> '+t[m].chatText+'</p>';
					html += '</div>';
				}else{
					html += '<div class="item item-avatar-right-s chat-me text-right"> <img style="width:100%;height:100%" src="'+t[m].avatar+'" />';
					html += '<span style="position:absolute;font-size:12px;right:60px;">'+t[m].nickName+'</span>';
					html += '<p class="chat-text positive-bg text-left" style="margin-top:1.5rem;"> '+t[m].chatText+'</p>';
					html += '</div>';
				}
				html += '</div>';
			}
			return html;
		},
		notLoad : function(msg_id){
			console.log(t);
			console.log(msg_id);
			for(var n in t){
				console.log(t[n].msg_id+'-----------'+msg_id);
				if(t[n].msg_id == msg_id) {
					return false;
				}
			}
			return true;
			//return typeof this.msg_ids[msg_id] == 'undefined' ? true : false;
		}
    }
});
