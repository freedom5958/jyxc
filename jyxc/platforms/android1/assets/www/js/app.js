// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var appMain = angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $ionicHistory, $cordovaToast, $timeout, $location,$ionicHistory,$window,LTAction) {
  // 定义全局常量
    $rootScope.constant = {
      // 系统名称(数据库名称等，非中文字符)
      appName:'jyxcDept',
      APP_VERSION:'1.0.0',
      // 平台 [android | ios]
      PLATFORM_NAME: '',
      // 版本
      PLATFORM_VERSION: '',
      // 服务器地址
      // SERVER_ADDRESS: 'https://192.168.100.33:443/', //姜任友
      // SERVER_ADDRESS: 'http://192.168.100.48:8080/', //姜任友
      // SERVER_ADDRESS: 'http://192.168.100.73:8080/', //施清福
      // SERVER_ADDRESS: 'http://192.168.100.10:8081/jyxc',
      // SERVER_ADDRESS: 'http://116.52.6.51:9080/',
      // SERVER_ADDRESS: 'https://116.52.6.51:9443/',
      // SERVER_ADDRESS: 'https://www.baixinghusheng.com:9443/',
       SERVER_ADDRESS: 'https://www.yuander.cn/',
	  // SERVER_ADDRESS: 'http://192.168.1.111:8080/',
      // 访问超时时间(ms)
      TIMEOUT_SHORT: 5000,
      TIMEOUT: 10000,
      TIMEOUT_LONG: 15000,
      // 信息显示时长 short | normal | long
      SHOWTIME_S: 1000,
      SHOWTIME_N: 2000,
      SHOWTIME_L: 3000,
      // 每页加载数量
      PAGE_SIZE: 10
    };

    // 定义全局变量
    $rootScope.variable = {
      // userId:'4028e4b55899663f01589a2c3a4a007d', //交通部
      // serverTime : '2016-11-21 19:58:00',
      isLogined : true,//,
	  userId:'40288132506fc09201506fc2a5360007',
	  userName:'de_admin'
    };

    /*
   * 导航
   */
  $rootScope.redirect = function(url){
    if(url){
      $location.path(url);
    }
  };

  /*
   * 返回
   */
  $rootScope.goBack = function() {
    $ionicHistory.goBack();
  };
	$rootScope.HBack = function() {
    $ionicHistory.goBack();
  };

  $rootScope.$on('modal.hidden', function() {
	if($rootScope.loginboxShow === true){
		ionic.Platform.exitApp();
	}
  });

  $rootScope.$on('modal.show', function() {

  });

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      // cordova.plugins.Keyboard.disableScroll(true);
      if(navigator.screenOrientation){
        navigator.screenOrientation.set('portrait');
      }
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    if($window.MobileAccessibility){
            $window.MobileAccessibility.usePreferredTextZoom(false);
    }

    // 定义全局常量
    $rootScope.constant.PLATFORM_NAME = ionic.Platform.platform();
    $rootScope.constant.PLATFORM_VERSION = ionic.Platform.version();
  });

  $ionicPlatform.registerBackButtonAction(function (e) {

    e.preventDefault();
	
    console.log('$location.path():'+$location.path());
    /*if($rootScope.loginboxShow === true){
		ionic.Platform.exitApp();
		return false;
	}*/
	if (($rootScope.loginModal && $rootScope.loginModal.isShown()) || $location.path() == '/init') {
        ionic.Platform.exitApp();
    }
    else if($rootScope.variable.quitReady){
      ionic.Platform.exitApp();
    }else if($rootScope.variable.allowQuit){
      $cordovaToast.showShortCenter('再按一次退出程序');
      $rootScope.variable.quitReady = true;
      $timeout(function(){
        $rootScope.variable.quitReady = false;
      },2000);
    }else if ($ionicHistory.backView()) {
      $ionicHistory.goBack();
    }

    return false;
  }, 101);
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.backButton.text('');
  $ionicConfigProvider.backButton.icon('ion-ios-arrow-back');
  $ionicConfigProvider.form.toggle('large');
  $ionicConfigProvider.views.maxCache(0);
  $ionicConfigProvider.views.transition('none');

  $httpProvider.interceptors.push(function($q) {
    return {
      'request': function (config) {
        // console.log('request...'+JSON.stringify(config));

        // console.log('config...'+JSON.stringify(config));
        return config;
      },
      'responseError': function(response) {
        console.log('responseError-->'+JSON.stringify(response));
        if(response.status === 0) {
          console.log('网络错误');
        }else if(response.status === 401 || response.status === 403) {
          console.log('未授权');
        }else if(response.status === 404) {
          console.log('连接失败');
        }
        return $q.reject(response);
      }
    };
  });

  $httpProvider.defaults.headers.post["Content-Type"] ="application/x-www-form-urlencoded";
  $httpProvider.defaults.transformRequest.unshift(function(data,headersGetter) {
    var key, result = [];
    for (key in data) {
      if (data.hasOwnProperty(key)) {
        result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
      }
    }
    return result.join("&");
  });


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('init', {
    url: '/init',
    templateUrl: 'modules/init/init.html',
    controller: 'initCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'modules/tabs.html',
    controller: 'mainCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'modules/home/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('tab.all', {
    url: '/all',
    views: {
      'tab-home': {
        templateUrl: 'modules/home/all.html',
        controller: 'allCtrl'
      }
    }
  })

  .state('tab.category', {
    url: '/category/:id',
    views: {
      'tab-home': {
        templateUrl: 'modules/home/category.html',
        controller: 'categoryCtrl'
      }
    }
  })

  .state('tab.dept', {
    url: '/dept/:id',
    views: {
      'tab-home': {
        templateUrl: 'modules/home/dept.html',
        controller: 'deptCtrl'
      }
    }
  })

  .state('detail', {
    url: '/detail/:id',
    templateUrl: 'modules/home/detail.html',
    controller: 'detailCtrl'
  })

  .state('feedbackDetail', {
    url: '/feedbackDetail/:id',
    templateUrl: 'modules/home/feedbackDetail.html',
    controller: 'feedbackDetailCtrl'
  })

  .state('mapPosition', {
    url: '/mapPosition',
    templateUrl: 'modules/home/mapPosition.html',
    controller: 'mapPositionCtrl'
  })

  .state('tab.duty', {
    url: '/duty',
    views: {
      'tab-duty': {
        templateUrl: 'modules/duty/duty.html',
        controller: 'dutyCtrl'
      }
    }
  })

  .state('dutyCheck', {
    url: '/dutyCheck/:id',
    templateUrl: 'modules/duty/dutyCheck.html',
    controller: 'dutyCheckCtrl'
  })

  .state('tab.user', {
    url: '/user',
    views: {
      'tab-user': {
        templateUrl: 'modules/user/user.html',
        controller: 'userCtrl'
      }
    }
  })

  .state('userInfo', {
    url: '/userInfo',
    templateUrl: 'modules/user/userInfo.html',
    controller: 'userInfoCtrl'
  })

  .state('register', {
    url: '/register',
    templateUrl: 'modules/register/register.html',
    controller: 'registerCtrl'
  })

  .state('updatePwd', {
    url: '/updatePwd',
    templateUrl: 'modules/updatePwd/updatePwd.html',
    controller: 'updatePwdCtrl'
  })


  .state('myReviewList',{
    url:'/review/myReviewList',
    templateUrl:'modules/review/myReviewList/myReviewList.html',
    controller:'myReviewListCtl'
  })

  .state('fillReview',{
    url:'/review/fillReview/:formId',
    templateUrl:'modules/review/fillReview/fillReview.html',
    controller:'fillReviewCtl'
  })
  .state('fillReviewName',{
    url:'/review/fillReview/:formId/:formName',
    templateUrl:'modules/review/fillReview/fillReview.html',
    controller:'fillReviewCtl'
  })

  .state('singleProjectStatistics',{
    url:'/singleProjectStatistics/singleProjectStatistics/:formId/:projectName',
    templateUrl:'modules/review/singleProjectStatistics/singleProjectStatistics.html',
    controller:'singleProjectStatisticsCtl'
  })

  .state('projectOfReviewSelector',{
    url:'/projectOfReviewSelector/projectOfReviewSelector',
    templateUrl:'modules/review/projectOfReviewSelector/projectOfReviewSelector.html',
    controller:'projectOfReviewSelectorCtl'
  })


  .state('setting', {
    url: '/setting',
    templateUrl: 'modules/user/setting.html',
    controller: 'settingCtrl'
  })

  .state('messageSetting', {
    url: '/messageSetting',
    templateUrl: 'modules/user/messageSetting.html',
    controller: 'messageSettingCtrl'
  })


  .state('registerForDept', {
    url: '/registerForDept',
    templateUrl: 'modules/registerForDept/registerForDept.html',
    controller: 'registerForDeptCtl'
  })

  .state('selectDeptOfRegister', {
    url: '/selectDeptOfRegister',
    templateUrl: 'modules/registerForDept/selectDeptOfRegister.html',
    controller: 'selectDeptOfRegisterCtl'
  })

  .state('watchReviewList_first', {
    url: '/watchReview/watchReviewList/:projectId/:isfirst',
    templateUrl: 'modules/watchReview/watchReviewList.html',
    controller: 'watchReviewListCtl'
  })

  .state('watchReviewList', {
    url: '/watchReview/watchReviewList/:projectId',
    templateUrl: 'modules/watchReview/watchReviewList.html',
    controller: 'watchReviewListCtl'
  })

  .state('deptSelectorForReview', {
    url: '/watchReview/deptSelectorForReview/:formId',
    templateUrl: 'modules/watchReview/deptSelectorForReview.html',
    controller: 'deptSelectorForReviewCtl'
  })



  .state('tab.governmentAffairs', {
    url: '/governmentAffairs',
    views: {
      'tab-governmentAffairs': {
        templateUrl: 'modules/governmentAffairs/governmentAffairs.html',
        controller: 'governmentAffairsCtl'
      }
    }
  })
  //government 修改为 works
  //works开始
  .state('tab.works',{
    url:'/works',
    views:{
      'tab-works':{
        templateUrl:'modules/works/index.html',
        controller:'indexCtl'
      }
    }
  })
  .state('infoList', {
    url: '/review/infoList',
    templateUrl: 'modules/review/infoList/infoList.html',
    controller: 'infoListCtl'
  })
  .state('infoView',{
    url:'/review/infoList/view/:noticeId',
    templateUrl:'modules/review/infoList/infoView.html',
    controller:'infoViewCtl'
  })
  .state('activityList', {
    url: '/review/activityList',
    templateUrl: 'modules/review/activityList/activityList.html',
    controller: 'activityListCtl'
  })
  .state('activityView',{
    url:'/review/activityList/view/:activityId',
    templateUrl:'modules/review/activityList/activityView.html',
    controller:'activityViewCtl'
  })
  .state('formsList', {
    url: '/review/formsList',
    templateUrl: 'modules/review/formsList/formsList.html',
    controller: 'formsListCtl'
  })
  .state('formsView',{
    url:'/review/formsList/view/:compId/:compType',
    templateUrl:'modules/review/formsList/formsView.html',
    controller:'formsViewCtl'
  })
  .state('formsJBList', {
    url: '/review/forms2List',
    templateUrl: 'modules/review/formsJBList/formsJBList.html',
    controller: 'formsJBListCtl'
  })
  .state('formsJBView',{
    url:'/review/forms2List/view/:compId/:compType',
    templateUrl:'modules/review/formsJBList/formsJBView.html',
    controller:'formsJBViewCtl'
  })
  .state('goforms',{
    url:'/review/formsList/goforms',
    templateUrl:'modules/review/formsList/goforms.html',
    controller:'goformsCtl'
  })
  .state('_formsList', {
    url: '/review/formsList/:compType',
    templateUrl: 'modules/review/formsList/formsList.html',
    controller: 'formsListCtl'
  })
  .state('_forms2List', {
    url: '/review/forms2List/:compType',
    templateUrl: 'modules/review/formsJBList/formsJBList.html',
    controller: 'formsJBListCtl'
  })
 //works结束
  .state('tab.counsel', {
    url: '/counsel',
    views: {
      'tab-counsel': {
        templateUrl: 'modules/counsel/counsel.html',
        controller: 'counselCtl'
      }
    }
  })

  .state('tab.shopping', {
    url: '/shopping',
    views: {
      'tab-shopping': {
        templateUrl: 'modules/shopping/shopping.html',
        controller: 'shoppingCtl'
      }
    }
  })
  //即时通讯
  .state('tab.messages', {
    url: '/messages',
    views: {
      'tab-messages': {
        templateUrl: 'modules/messages/messages.html',
        controller: 'messagesCtl'
      }
    }
  })
  .state("room", {
        url: "/room/:roomId/:nickname",
        templateUrl: "modules/messages/room.html",
        controller: "roomCtl"
    })
  .state("tab.friends", {
        url: "/friends",
        views: {
          'tab-messages': {
            templateUrl: "modules/messages/friends.html",
            controller: "friendsCtl"
          }
        }
    })
  .state("tab.factive", {
        url: "/factive",
        views: {
          'tab-messages': {
            templateUrl: "modules/messages/factive.html",
            controller: "factiveCtl"
          }
        }
    })

	.state("tab.groups", {
        url: "/groups",
        views: {
          'tab-messages': {
            templateUrl: "modules/messages/groups.html",
            controller: "groupsCtl"
          }
        }
    })

  .state('tab.discovery', {
    url: '/discovery',
    views: {
      'tab-discovery': {
        templateUrl: 'modules/discovery/discovery.html',
        controller: 'discoveryCtl'
      }
    }
  })

  .state('myReview', {
    url: '/governmentAffairs/myReview',
    templateUrl: 'modules/governmentAffairs/myReview.html',
    controller: 'myReviewCtl'
  })

  .state('distributeInfo', {
    url: '/governmentAffairs/distributeInfo/:title',
    templateUrl: 'modules/governmentAffairs/distributeInfo.html',
    controller: 'distributeInfoCtl'
  })

  .state('showFilledReview', {
    url: '/governmentAffairs/showFilledReview/:recordId',
    templateUrl: 'modules/governmentAffairs/showFilledReview.html',
    controller: 'showFilledReviewCtl'
  })
  ;

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/init');
  $urlRouterProvider.otherwise('/init');

});
