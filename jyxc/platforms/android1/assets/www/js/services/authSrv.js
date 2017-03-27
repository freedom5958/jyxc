if (typeof DeviceType == "undefined") {
		var DeviceType = {
			DeviceTypeOfBrower:1,
			DeviceTypeOfRealMachine:2
		}
}

/*
 * 系统、用户认证授权相关
 */
appMain.factory('authSrv',function($rootScope, dbSrv, $q, $http, appSrv){
	'use strict';
	var AUTH_KEY = CryptoJS.enc.Utf8.parse('ddtech2015ddtech');
	var AUTH_IV  = CryptoJS.enc.Utf8.parse('0102030405060708');
	var auth = {};

	/*
	 * 加密
	 */
	auth.encry = function(str){
		var srcs = CryptoJS.enc.Utf8.parse(str);
		var encrypted = CryptoJS.AES.encrypt(srcs, AUTH_KEY, { iv: AUTH_IV,mode:CryptoJS.mode.CBC});  
		return encrypted.toString();
	};

	/**
	 * 获取账户信息
	 */
	auth.getAuthInfo = function(){
		var d = $q.defer();
		var querySql = 'select value from t_meta where key=?';
		dbSrv.executeQuery(querySql, ['account']).then(function(succ){
			if(succ.length){
				$rootScope.variable.account = succ.item(0).value;
			}
		}).then(function(){
			return dbSrv.executeQuery(querySql, ['password']).then(function(succ){
				if(succ.length){
					$rootScope.variable.password = succ.item(0).value;
				}
			})
		}).finally(function(){
			if($rootScope.variable.account && $rootScope.variable.password){
				d.resolve({status:0});
			}else{
				d.reject({status:1});
			}
		});
		return d.promise;
	};

	/**
	 * 保存账户信息
	 */
	auth.setAuthInfo = function(){
		var deleteSql = 'delete from t_meta where key=?',
			insertSql = 'insert into t_meta (key, value) values (?,?)',
			sqls = [];

		sqls.push({sql:deleteSql,params:['account']});
		sqls.push({sql:deleteSql,params:['password']});
		sqls.push({sql:insertSql,params:['account', $rootScope.variable.account]});
		sqls.push({sql:insertSql,params:['password', $rootScope.variable.password]});

		return dbSrv.transactionSqlsWithParams(sqls);
	};

	/**
	 * 登录
	 */
	auth.login = function(isLogined){
		var d = $q.defer();
		var url = auth.getLoginAdr();

			// var postUrl = $rootScope.constant.SERVER_ADDRESS+'mobile/user/login';
			// var param = {
			// 		account:$rootScope.variable.account,
			// 		password:auth.encry($rootScope.variable.password),
			// 		versions:'dept'
			// 	};
			// $http.post(postUrl,param).success(function(succ) {
   //              console.log(JSON.stringify(succ));
			// 	if(succ.success){
			// 		var user = succ.data;
			// 		$rootScope.variable.token = user.token;
			// 		$rootScope.variable.userId = user.userId;
			// 		$rootScope.variable.userName = user.nickName;
			// 		$rootScope.variable.userPhoto = user.userPhoto;
			// 		auth.setAuthInfo().then(function(){
			// 			$rootScope.variable.isLogined = true;
			// 		});
			// 		d.resolve({status:0});
			// 	} else {
			// 		$rootScope.variable.isLogined = false;
			// 		d.reject({status:1, msg:succ.message || ''});
			// 	}
   //          }).error(function(err){
   //              d.reject({status:1, msg:'登录失败', data:err});
   //              $rootScope.variable.loginErr = 'error:' + JSON.stringify(err);
   //          });

			$http({
				method:'JSONP',
				url:url,
				params:{
					account:$rootScope.variable.account,
					password:auth.encry($rootScope.variable.password),
					versions:'dept'
				},
				timeout:$rootScope.constant.TIMEOUT
			}).success(function(succ){
				if(succ.success){
					var user = succ.data;
					$rootScope.variable.token = user.token;
					$rootScope.variable.userId = user.userId;
					$rootScope.variable.userName = user.nickName;
					$rootScope.variable.userPhoto = user.userPhoto;
					var script = document.createElement('script');
					script.setAttribute('src',"http://bbs.isundo.net/api/uc.php?action=synlogin&username="+user.nickName+'&mobile='+user.account+'pic='+encodeURI(user.userPhoto));
					//设置设备别名
					$rootScope.updateOnline();
					try{
						//绑定设备标识
						window.plugins.jPushPlugin.setTagsWithAlias(null,$rootScope.variable.userId);
					}catch(e){
						//alert('jPush set alias error：'+e);	
					}
					document.body.appendChild(script);
					auth.setAuthInfo();
					// auth.setAuthInfo().then(function(){
						$rootScope.variable.isLogined = true;
					// });
					d.resolve({status:0});
				} else {
					$rootScope.variable.isLogined = false;
					d.reject({status:1, msg:succ.message || ''});
				}
			}).error(function(err){
				d.reject({status:1, msg:'登录失败', data:err});
			});
		return d.promise;
	};

	/**
	 * 退出登录
	 */
	auth.logout = function(){
		$rootScope.variable.password = '';
		$rootScope.variable.userId = '';
		auth.setAuthInfo().then(function(){
			window.plugins.jPushPlugin.setTagsWithAlias(null,null);
			$rootScope.variable.isLogined = false;
		});
	};

	auth.getParams = function(others){
		var params = {
			userId:$rootScope.variable.userId,
			token:$rootScope.variable.token
		};
		if(others){
			params.jsonParam = others;
		}
		return params;
	};

	// 登陆
	auth.getLoginAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/user/login?callback=JSON_CALLBACK';
	};

	// 注册
	auth.getRegisterAddr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/user/register';
	};

	// 修改密码
	auth.getUpdateUserPassWordAddr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/user/updateUserPassWord';
	};

	// 用户信息
	auth.getUserInfoAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/user/findUserById?callback=JSON_CALLBACK';
	};

	// 上传用户头像
	auth.getUserPhotoUploadAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/file/headUpload';
	};

	// 领导端获取全部功能的数据
	auth.findLeadAllAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/home/findLeadAll?callback=JSON_CALLBACK';
	};

	// 领导端获取建言献策、投诉或热点信息
	auth.findLeadRecordByTypeAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/home/findLeadRecordByType?callback=JSON_CALLBACK';
	};

	// 领导端分页获取未处理的建言献策、投诉或热点信息
	auth.findNotHandledByPageAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/home/findNotHandledByPage?callback=JSON_CALLBACK';
	};

	// 获取单条建议或投诉的详细信息
	auth.getRecordDetailsAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/home/getRecordDetails?callback=JSON_CALLBACK';
	};

	// 保存常用语
	auth.saveUsefulExpressionAdr = function(isJsonp){
		if(isJsonp){
			return $rootScope.constant.SERVER_ADDRESS+'mobile/se/saveUsefulExpressions?callback=JSON_CALLBACK';
		} else {
			return $rootScope.constant.SERVER_ADDRESS+'mobile/se/saveUsefulExpressions';
		}
	};

	// 获取常用语
	auth.loadUsefulExpressionAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/se/findUsefulExpressions?callback=JSON_CALLBACK';
	};

	// 删除常用语
	auth.delUsefulExpressionAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/se/deleteUsefulExpressions?callback=JSON_CALLBACK';
	};

	// 部门
	auth.deptsAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/dept/findAllDept?callback=JSON_CALLBACK';
	};

	// 获取问责列表
	auth.loadAccsAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/acc/findLeadAcc?callback=JSON_CALLBACK';
	};

	// 获取问责详情
	auth.loadAccDetailAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/acc/findAccDetails?callback=JSON_CALLBACK';
	};

	// 保存问责
	auth.saveAccountabilityAdr = function(isJsonp){
		if(isJsonp){
			return $rootScope.constant.SERVER_ADDRESS+'mobile/acc/saveAccountability?callback=JSON_CALLBACK';
		} else {
			return $rootScope.constant.SERVER_ADDRESS+'mobile/acc/saveAccountability';
		}
	};

	// 催促责任部门回复
	auth.urgeReplyAdr = function(isJsonp){
		if(isJsonp){
			return $rootScope.constant.SERVER_ADDRESS+'mobile/acc/urgeReply?callback=JSON_CALLBACK';
		} else {
			return $rootScope.constant.SERVER_ADDRESS+'mobile/acc/urgeReply';
		}
		
	};

	// 删除问责
	auth.delAccAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/acc/deleteAccountability?callback=JSON_CALLBACK';
	};

	// 获取关注信息
	auth.findLoginAttentionsAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/attention/findLoginAttentions?callback=JSON_CALLBACK';
	};

	// 保存关注信息
	auth.saveAttentionAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/attention/saveAttention?callback=JSON_CALLBACK';
	};

	// 取消关注信息
	auth.deleteAttentionAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/attention/deleteAttention?callback=JSON_CALLBACK';
	};

	// 评议主页信息
	auth.findLeadEvaHomeAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/evaRecord/findLeadEvaHome?callback=JSON_CALLBACK';
	};

	// 评议反馈详情
	auth.findFeedbackDetailsAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/evaRecord/findFeedbackDetails?callback=JSON_CALLBACK';
	};


	auth.findDeptEvaHomeAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/evaRecord/findDeptEvaHome?callback=JSON_CALLBACK';
	};



	auth.getServerAdr = function(){
		return $rootScope.constant.SERVER_ADDRESS;
		// return 'http://'+$rootScope.constant.SERVER_ADDRESS + '/jyxc';
	};


	auth.getParams = function() {
		var params = {
			userId:$rootScope.variable.userId,
			token:$rootScope.variable.token,
		}
		return params;
	}

	

	// auth.DeviceType = DeviceType.DeviceTypeOfBrower;
	auth.DeviceType = DeviceType.DeviceTypeOfRealMachine;

	var options = function() {
		if (auth.DeviceType == DeviceType.DeviceTypeOfBrower) {
			var op = '?userId=' + $rootScope.variable.userId + '&token='+$rootScope.variable.token;
			op +=  '&callback=JSON_CALLBACK';
			return op;
		}
		return '';
	}

	var optionsOfJSONP = function() {
		var op = '?userId=' + ($rootScope.variable.userId || '') + '&token='+ ($rootScope.variable.token || '');
		op +=  '&callback=JSON_CALLBACK';
		return op;
	}
	 
	//
	//获取首页全部信息
	auth.getDeptAllInfo = function() {
		var url = auth.getServerAdr() + 'mobile/home/findDeptAll';
		return url + options();
	}

	//获取单条建言或投诉的详情
	auth.getSingleSuggestOrComplaintDetails = function() {
		var url = auth.getServerAdr() + 'mobile/home/getRecordDetails';
		return url + options();
	}

	//获取问责详情
	auth.getDutyDetails = function() {
		var url = auth.getServerAdr() + 'mobile/acc/findAccDetails';
		return url + options();
	}

	//回复问责
	auth.replyDuty = function() {
// 		return auth.getServerAdr() + 'mobile/acc/updateAccReply' + options();
		return auth.getServerAdr() + 'mobile/reply/saveAccReply' + options();
	}

	//获取热点、建言、投诉信息
	auth.getHotOrSuggOrCompInfo = function() {
		return auth.getServerAdr() + 'mobile/home/findDeptRecordByType' + options();
	}

	//获取下一步流程步骤
	auth.getSugesstNextFlowSteps = function() {
		return auth.getServerAdr() + 'mobile/flow/findNextNodesInfo' + options();
	}

	//执行流程步骤
	auth.saveFlowStep = function() {
		return auth.getServerAdr() + 'mobile/flow/saveFlowStep' + options();
	}

	//签收建言和投诉
	auth.signForSuggestOrComplaint = function() {
		return auth.getServerAdr() + 'mobile/flow/claim' + options();
	}

	//标记建言和投诉
	auth.updateMarkOfSuggestOrComplaint = function() {
		return auth.getServerAdr() + 'mobile/home/updateMark' + options();
	}

	//转发建言
	auth.forwardSuggest = function() {
		return auth.getServerAdr() + 'mobile/flow/saveTranspondFlowStep' + options();
	}

	//添加常用语
	auth.saveUsefulExpressions = function() {
		return auth.getServerAdr() + 'mobile/se/saveUsefulExpressions' + options();
	}

	//删除常用语
	auth.deleteUsefulExpressions = function() {
		return auth.getServerAdr() + 'mobile/se/deleteUsefulExpressions' + options();
	}

	//获取常用语
	auth.findUsefulExpressions = function() {
		return auth.getServerAdr() + 'mobile/se/findUsefulExpressions' + options();
	}

	//修改
	auth.updateUsefulExpressions = function() {
		return auth.getServerAdr() + 'mobile/se/updateUsefulExpressions' + options();
	}

	//获取部门信息
	auth.getDepartmentInfo = function() {
		return auth.getServerAdr() + 'mobile/dept/findAllDept' + options();
	}

	//部门端分页获取用户已回复的问责信息
	auth.findAlreadyReplyAcc = function() {
		return auth.getServerAdr() + 'mobile/acc/findAlreadyReplyAcc'+options();
	}

	auth.saveClaimOrTranspond = function() {
		return auth.getServerAdr() + 'mobile/flow/saveClaimOrTranspond'+options();
	}

	auth.findDeptEvaHome = function() {
		return auth.getServerAdr() + 'mobile/evaRecord/findDeptEvaHome' + options();
	}


	auth.findEmptyForm = function() {
		return auth.getServerAdr() + 'mobile/evaForm/findEmptyForm' + options();
	}

	//保存表单数据
	auth.saveFormRecord = function() {
		return auth.getServerAdr() + 'mobile/evaRecord/saveFormRecord' + options();
	}

	// 评议反馈详情
	auth.findFeedbackDetails = function(){
		return $rootScope.constant.SERVER_ADDRESS+'mobile/evaRecord/findFeedbackDetails' + options();
	};


	//账号是否已经注册
	auth.isRegister = function() {
		return auth.getServerAdr() + 'mobile/user/isRegister' + optionsOfJSONP();
	}

	//获取短信验证码
	auth.getPhoneCodeAddr = function() {
		return auth.getServerAdr() + 'mobile/batchSend/getNoteCode' + optionsOfJSONP();
	}

	//判断验证码是否正确
	auth.checkVerificationCode = function() {
		return auth.getServerAdr() + 'mobile/batchSend/checkVerificationCode' + options();
	}

	auth.registerForDept = function() {
		return auth.getServerAdr() + 'mobile/user/register' + options();
	}

	auth.getNewVersions = function() {
		return auth.getServerAdr() + 'mobile/version/getNewVersions' + optionsOfJSONP();
	}

	//获取部门信息
	auth.getDepartmentInfoJSONP = function() {
		return auth.getServerAdr() + 'mobile/dept/findAllDept' + optionsOfJSONP();
	}

	auth.findDeptByFormId = function() {
		return auth.getServerAdr() + 'mobile/dept/findDeptByFormId' + optionsOfJSONP();
	}

	auth.findRoles= function() {
		return auth.getServerAdr() + 'mobile/dic/findRoles' + optionsOfJSONP();
	}

	auth.findDeptForm = function() {
		return auth.getServerAdr() + 'mobile/evaForm/findDeptForm' + optionsOfJSONP();
	}

	auth.findRecordDetails = function() {
		return auth.getServerAdr() + 'mobile/evaRecord/findRecordDetails' + optionsOfJSONP();
	}

	auth.saveUserInfo = function() {
		return auth.getServerAdr() + 'mobile/userInfo/saveUserInfo' + options();
	}

	auth.findRelevantForm = function() {
		return auth.getServerAdr() + 'mobile/evaForm/findRelevantForm' + optionsOfJSONP();
	}

	auth.findEvaStatistics = function() {
		return auth.getServerAdr() + 'mobile/evaRecord/findEvaStatistics' + optionsOfJSONP();
	}

	auth.searchUserList = function() {
		//return auth.getServerAdr() + 'mobile/evaRecord/findEvaStatistics' + optionsOfJSONP();
		return 'http://bbs.isundo.net/searchUser.php' + optionsOfJSONP();
	}

	auth.getMessageList = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/messge/findNewMessagesByUserid' + optionsOfJSONP(),params);
	}

	auth.addFriend = function() {
		//return auth.getServerAdr() + 'mobile/evaRecord/findEvaStatistics' + optionsOfJSONP();
		return 'http://bbs.isundo.net/addFriend.php';
	}

	auth.requestConfirmFriend = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/ImContactsValidate/changeImContactsValidate' + optionsOfJSONP(),params);
	}

	auth.requestAddFriend = function(params){
		//return 'http://127.0.0.1:8080/mobile/ImContactsValidate/saveImContactsValidate?userId=4028e4a25988468b0159889fca3d0105&toUserId=4028e4b5598630e20159868ec62d0057';
		return auth.formatParams(auth.getServerAdr() + 'mobile/ImContactsValidate/saveImContactsValidate' + optionsOfJSONP(),params);
	}

	auth.requireVerifyFriend = function(params){
		//return 'http://127.0.0.1:8080/mobile/ImContactsValidate/findImContactsValidateByUserId?userId=4028e4b5598630e20159868ec62d0057';
		return auth.formatParams(auth.getServerAdr() + 'mobile/ImContactsValidate/findImContactsValidateByUserId' + optionsOfJSONP(),params);
	}

	auth.requireFriend = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/Contacts/findImContactsByUserid' + optionsOfJSONP(),params);
	}

	auth.getUserMessageDataList = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/messge/findImMessageByUser' + optionsOfJSONP(),params);
	}

	auth.getGroupMessageDataList = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/messge/findImMessageByGurop' + optionsOfJSONP(),params);
	}

	auth.sendMessage = function(params){
		//return 'http://bbs.isundo.net/searchUser.php' + optionsOfJSONP();
		//return auth.getServerAdr() + '/im/messge/saveMesage';
		return auth.formatParams(auth.getServerAdr() + 'mobile/messge/saveMesage' + optionsOfJSONP(),params);
	}

	auth.sendGroupMessage = function(params){
		//return 'http://bbs.isundo.net/searchUser.php' + optionsOfJSONP();
		//return auth.getServerAdr() + '/im/messge/saveMesage';
		return auth.formatParams(auth.getServerAdr() + 'mobile/messge/saveMesage' + optionsOfJSONP(),params);
	}

	//添加群组信息
	auth.addGroup = function(params) {
		//return 'http://bbs.isundo.net/searchUser.php' + optionsOfJSONP();
		return auth.formatParams(auth.getServerAdr() + 'mobile/imGroup/saveGroupInfo' + optionsOfJSONP(),params);
	}

	auth.getUsersList = function(params) {
		return auth.formatParams(auth.getServerAdr() + 'mobile/user/findUsersInfo' + optionsOfJSONP(),params);
	}

	auth.getGroupList = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/imGroup/findImGroupByUserid' + optionsOfJSONP(),params);
		//return 'http://bbs.isundo.net/searchUser.php' + optionsOfJSONP();
	}

	//根据用户手机号码查询用户信息
	auth.requestGetUserinfoByMobile = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/user/findUserByAccount' + optionsOfJSONP(),params)
	}

	auth.requestGetUserHandle = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/user/findUserRoleByUserId' + optionsOfJSONP(),params);
	}

	auth.requestGetActivity = function(params){
		return auth.formatParams('http://localhost/index.php?action=requestGetActivity' + optionsOfJSONP(),params);
	}

	auth.requestGetNotice = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/noticeInfo/findNoticeById' + optionsOfJSONP(),params);
	}

	auth.getNoticeList = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/noticeInfo/findNoticeByUserId' + optionsOfJSONP(),params);
	}

	auth.getActivityList = function(params){
		return auth.formatParams('http://localhost/index.php?action=getActivityList' + optionsOfJSONP(),params);
	}

	auth.getDeptList = function(params){
		params.deptParentId = params.deptParent;
		return auth.formatParams(auth.getServerAdr() + 'mobile/dept/findDeptByParentid' + optionsOfJSONP(),params);
	}

	auth.requestComp = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/compPcr/saveCompPcr' + optionsOfJSONP(),params);
	}

	auth.getCompList = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/compPcr/findCompPcrByUserIdAndPage' + optionsOfJSONP(),params);
	}

	auth.getCompJBList = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/compPcr/findCompPcrByCompActiveUserIdAndPage' + optionsOfJSONP(),params);
	}

	auth.getComp = function(params) {
		return auth.formatParams(auth.getServerAdr() + 'mobile/compPcr/findCompPrcById' + optionsOfJSONP(),params);
	}

	auth.requestChangeDept = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/compPcr/saveCompPcrToDept' + optionsOfJSONP(),params);
	}

	auth.requestReply = function(params) {
		return auth.formatParams(auth.getServerAdr() + 'mobile/compreply/saveCompReply' + optionsOfJSONP(),params);
	}

	auth.getConversationList = function(params) {
		return auth.formatParams(auth.getServerAdr() + 'mobile/compreply/saveCompReply' + optionsOfJSONP(),params);
	}

	auth.getPicUploadAdr = function(params) {
		return auth.formatParams(auth.getServerAdr() + 'mobile/file/saveFile',params);
	}

	auth.getGroupUserList = function(params) {
		return auth.formatParams(auth.getServerAdr() + 'mobile/imGroup/findUserByGroupCode' + optionsOfJSONP(),params);
	}

	auth.getFillReview = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/evaForm/findEmptyForm' + optionsOfJSONP(),params);
	}

	var optionsOfJSONP_nouser = function() {
		var op = '?token='+ ($rootScope.variable.token || '');
		op +=  '&callback=JSON_CALLBACK';
		return op;
	}

	auth.getUserInfo = function(params) {
		return auth.formatParams(auth.getServerAdr() + 'mobile/user/findUserById' + optionsOfJSONP_nouser(),params)+'&userId='+params.userId;
	}

	auth.requestUpdateOnline = function(params){
		return auth.formatParams(auth.getServerAdr() + 'mobile/appStatus/saveStatus' + optionsOfJSONP(),params);
	}

	auth.formatParams = function(url,params){
		for(var n in params){
			if(n == 'userId') continue;
			if(url.indexOf('?')>-1){
				url += '&'+n+"="+encodeURI(encodeURI(params[n]));
			}else{
				url += '?'+n+"="+encodeURI(encodeURI(params[n]));
			}
		}
		return url;
	}

	

	auth.getNParams = function(params){
		var _params = auth.getParams();
		for(var n in params){
			_params[n] = params[n];
		}
		return _params;
	}

	return auth;
})

;
