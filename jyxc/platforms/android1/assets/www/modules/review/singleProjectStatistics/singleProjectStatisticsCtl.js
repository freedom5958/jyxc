appMain
.controller('singleProjectStatisticsCtl', function($ionicPlatform, $rootScope, $scope, $timeout, $location, $stateParams, dateSrv, $ionicModal, authSrv, $http, $cordovaToast, $ionicLoading, appSrv) {
    'use strict';
    $rootScope.variable.allowQuit = false;

    $scope.backParent = function() {
        $rootScope.goBack();
    }
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

    $scope.view.title = $stateParams.projectName || '统计数据';
    
    $scope.loadData = function(){
        $scope.view.loading = true;
        $scope.view.hasData = false;
        var params = authSrv.getParams();
        params.formId = $stateParams.formId || '';
        $http({
            method:'JSONP',
            // url:authSrv.findLeadEvaHomeAdr(),
            url:authSrv.findEvaStatistics(),
            params:params
        }).success(function(succ) {
            console.log('获取统计数据:'+JSON.stringify(succ));
            if(!succ.data){
                return;
            }
            var data = succ.data;
            $scope.view.datas = data;
            if(data.educationSta.length || data.sexSta.length || data.satisficingSta.length || data.ageSta.length || data.evaCrowdsSta.length){
                $scope.view.hasData = true;
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

    $scope.loadData();

    
    $scope.goFeedbackDetail = function() {
        $rootScope.redirect('/watchReview/watchReviewList/' + $stateParams.formId || '');
    }

});