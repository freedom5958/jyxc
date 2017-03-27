appMain
.controller('myReviewCtl', function($ionicPlatform, $rootScope, $scope, $ionicActionSheet, $timeout, $location, $stateParams, dateSrv, $ionicModal, authSrv, $http, $cordovaToast, appNavibarSrv, $ionicHistory, $ionicLoading, appSrv, feedbackDetailSrv, reviewSrv) {
	'use strict';

    $scope.backParent = function() {
        $rootScope.goBack();
    }

    $rootScope.variable.allowQuit = false;
    var chartAge = echarts.init(document.getElementById('chartAge'));
    var chartSex = echarts.init(document.getElementById('chartSex'));
    var chartEdu = echarts.init(document.getElementById('chartEdu'));
    var chartCrowd = echarts.init(document.getElementById('chartCrowd'));
    var chartSatis = echarts.init(document.getElementById('chartSatis'));
    $scope.view = {
        loading : false,
        hasData : false
    };
    $scope.form = {};
	
    $scope.loadData = function(){
        $scope.view.loading = true;
        $scope.view.hasData = false;
        var params = authSrv.getParams();
        params.formId = $scope.form.selectedProjectId || '';
        $http({
            method:'JSONP',
            // url:authSrv.findLeadEvaHomeAdr(),
            url:authSrv.findDeptEvaHomeAdr(),
            params:params
        }).success(function(succ) {
            if(!succ.data){
                return;
            }
            var data = succ.data;
            $scope.view.datas = data;
            if(data.educationSta.length || data.sexSta.length || data.satisficingSta.length || data.ageSta.length || data.evaCrowdsSta.length){
                $scope.view.hasData = true;
            }
            $scope.view.projects = data.project;
            if(!$scope.form.selectedProjectId && $scope.view.projects.length){
                $scope.form.selectedProjectId = $scope.view.projects[0].formId;
                $scope.view.selectedProjectName = $scope.view.projects[0].name;
                $scope.view.projects[0].selected = true;
            } else {
                angular.forEach($scope.view.projects, function(p){
                    if(p.formId == $scope.form.selectedProjectId){
                        p.selected = true;
                    }
                });
            }
            $scope.loadChartAge(data.ageSta);
            $scope.loadChartSex(data.sexSta);
            $scope.loadChartEdu(data.educationSta);
            $scope.loadChartCrowd(data.evaCrowdsSta);
            $scope.loadChartSatis(data.satisficingSta);
        }).finally(function(){
            $scope.view.loading = false;
        });
        // $scope.view.projects = [{formId:'dc',name:'滇池环境治理'},{formId:'fp',name:'扶贫'},{formId:'jd',name:'街道环境'}];
        // $scope.form.selectedProjectId = $scope.view.projects[0].formId;
        // $scope.view.selectedProjectName = $scope.view.projects[0].name;
        // $scope.loadChartAge([{"title":"60岁","value":40},{"title":"60岁及以上","value":60}]);
        // $scope.loadChartSex([{"title": "男", "value": 20}, {"title": "女", "value": 40} ]);
        // $scope.loadChartEdu([{"title": "初中", "value": 12}, {"title": "高中", "value": 33} ]);
        // $scope.loadChartCrowd([{"title": "政府内部", "value": 24}, {"title": "社会群众", "value": 55} ]);
        // $scope.loadChartSatis([{"title": "社会群众", "good": 30, "bad": 20, "medium": 50}, {"title": "政府内部", "good": 30, "bad": 40, "medium": 30} ]);
    };

    $scope.loadChartAge = function(vs){
        var dd = [],ll = [];
        angular.forEach(vs, function(v){
            dd.push({value:v.value,name:v.title});
            ll.push(v.title);
        });
        var option = {
            /*tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
            },*/
            legend: {
                top:'top',
                data: ll
            },
            series : [
                {
                    name: '年龄结构',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:dd,
                    label:{
                        normal:{
                            show:true,
                            position:'outside',
                            formatter:'{b} {d}%'
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        chartAge.setOption(option);
    };
    $scope.loadChartSex = function(vs){
        var dd = [],ll = [];
        angular.forEach(vs, function(v){
            dd.push({value:v.value,name:v.title});
            ll.push(v.title);
        });
        var option = {
            /*tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
            },*/
            legend: {
                top:'top',
                data: ll
            },
            series : [
                {
                    name: '性别结构',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:dd,
                    label:{
                        normal:{
                            show:true,
                            position:'outside',
                            formatter:'{b} {d}%'
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        chartSex.setOption(option);
    };
    $scope.loadChartEdu = function(vs){
        var dd = [],ll = [];
        angular.forEach(vs, function(v){
            dd.push({value:v.value,name:v.title});
            ll.push(v.title);
        });
        var option = {
            /*tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
            },*/
            legend: {
                top:'top',
                data: ll
            },
            series : [
                {
                    name: '学历结构',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:dd,
                    label:{
                        normal:{
                            show:true,
                            position:'outside',
                            formatter:'{b} {d}%'
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        chartEdu.setOption(option);
    };

    $scope.loadChartCrowd = function(vs){
        var dd = [],ll = [];
        angular.forEach(vs, function(v){
            dd.push({value:v.value,name:v.title});
            ll.push(v.title);
        });
        var option = {
            /*tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
            },*/
            legend: {
                top:'top',
                data: ll
            },
            series : [
                {
                    name: '评议人群',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:dd,
                    label:{
                        normal:{
                            show:true,
                            position:'outside',
                            formatter:'{b} {d}%'
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        chartCrowd.setOption(option);
    };

    $scope.loadChartSatis = function(datas) {
        var gs = [],
            goods = [],
            bads = [],
            mediums = [];
        angular.forEach(datas, function(data){
            gs.push(data.title);
            goods.push(data.good);
            bads.push(data.bad);
            mediums.push(data.medium);
        });
        var option = {
            /*tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },*/
            legend: {
                data: ['好', '中', '差'],
                top: 'top'
            },
            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                top:'13%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: gs
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: '好',
                type: 'bar',
                data: goods,
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        formatter: '{c}'
                    }
                }
            }, {
                name: '中',
                type: 'bar',
                data: mediums,
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        formatter: '{c}'
                    }
                }
            }, {
                name: '差',
                type: 'bar',
                data: bads,
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        formatter: '{c}'
                    }
                }
            }]
        };

        chartSatis.setOption(option);
    };

    $scope.goSelectProject = function(){
        $ionicModal.fromTemplateUrl('modules/home/selectProject.html', {
            scope: $scope,
            animation: 'slide-in-right'
        }).then(function(modal) {
            modal.show();
            $scope.selectProjectModal = modal;
        });
    };

    $scope.selectProject = function(did){
        angular.forEach($scope.view.projects, function(d){
            d.selected = false;
            if(d.formId == did){
                d.selected = true;
                $scope.form.selectedProjectId = d.formId;
                $scope.view.selectedProjectName = d.name;
            }
        });
        $scope.loadData();
        $scope.selectProjectModal.hide();
        $scope.selectProjectModal.remove();
    };

    $scope.selectProjectSure = function(){
        $scope.selectProjectModal.hide();
        $scope.selectProjectModal.remove();
    };

    $scope.feedback = {
        loading : false
    };
    $scope.goFeedbackDetail = function(){
        $rootScope.redirect('/watchReview/watchReviewList/' + $scope.form.selectedProjectId || '');
        return;

        $ionicModal.fromTemplateUrl('modules/home/feedbackDetail.html', {
            scope: $scope,
            animation: 'none'
        }).then(function(modal) {
            modal.show();
            $scope.feedbackDetailModal = modal;
            /*$scope.feedbackDetails = [{
                content:'“My wet nurse said the same thing, Will,” Royce replied. “Never believe anything you hear at a woman’s tit. There are things to be learned even from the dead.” His voice echoed, too loud in the twilit forest.',
                file:[{id:'a',name:'a'}],
                createDate:'20160911'
            }];*/
            $scope.loadFeedbackDetail();
        });

        
        /*
        if($scope.form.selectedProjectId){
            $location.path('/feedbackDetail/'+$scope.form.selectedProjectId);
        }*/
    };

    $scope.loadFeedbackDetail = function(){
        $scope.hasMoreDetail = true;
        feedbackDetailSrv.loadData($scope.form.selectedProjectId).then(function(succ){
            $scope.feedbackDetails = feedbackDetailSrv.view.feedbackDetails;
            if(!succ.hasMore){
                $scope.hasMoreDetail = false;
            }
        });
        /*$scope.feedbackDetails = [];
        $scope.feedback.loading = true;
        var params = authSrv.getParams();
        params.formId = $scope.form.selectedProjectId;
        $http({
            method:'JSONP',
            url:authSrv.findFeedbackDetailsAdr(),
            params:params
        }).success(function(succ) {
            if(!succ.data){
                return;
            }
            $scope.feedbackDetails = succ.data;
        }).finally(function(){
            $scope.feedback.loading = false;
        });*/
    };

    $scope.loadMoreFeedbackDetail = function(){
        feedbackDetailSrv.loadMore($scope.form.selectedProjectId).then(function(succ){
            $scope.feedbackDetails = feedbackDetailSrv.view.feedbackDetails;
            if(!succ.hasMore){
                $scope.hasMoreDetail = false;
            }
        });
    };

    $scope.closeFeedbackDetailModal = function(){
        $scope.feedbackDetailModal.hide();
        $scope.feedbackDetailModal.remove();
    };

    $scope.loadData();

    $scope.showMyReviewList = function() {
        reviewSrv.waitEvaProjec = $scope.view.datas.waitEvaProject;
        $rootScope.redirect('/review/myReviewList')
    }


    $scope.showView = function(did, fid){
        var dd, ff;
        angular.forEach($scope.feedbackDetails, function(d){
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
        }
    };

    $scope.showVideoView = function(video){
        $scope.feedbackDetailModal.hide();
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
            onClose: function(){
                $scope.feedbackDetailModal.show();
            }
        });   
        myPhotoBrowser.open();
    };

    $scope.showImageView = function(images, index){
        $scope.feedbackDetailModal.hide();
        var myApp = new Framework7();
        var myPhotoBrowser = myApp.photoBrowser({
            swipeToClose: false,
            initialSlide:index,
            theme:'dark',
            toolbar:false,
            backLinkText:'',
            ofText:' / ',
            photos: images,
            // photos: ['img/adam.jpg','img/ben.png','img/max.png'],
            onClose: function(){
                $scope.feedbackDetailModal.show();
            }
        });   
        myPhotoBrowser.open();
    };
});