appMain
.controller('reviewCtl', function($rootScope, $scope,$timeout,$ionicLoading,$cordovaToast,$http,authSrv,reviewSrv) {
    
    $scope.view = {

    };

    $scope.selectedProject = reviewSrv.selectedProject

    $scope.showMyReviewList = function() {
        reviewSrv.waitEvaProjec = $scope.view.waitEvaProject;
        $rootScope.redirect('/review/myReviewList')
    }


    $scope.loadAgeChart = function() {
        var chart = echarts.init(document.getElementById('ageChart')); 
        var option = {
            title : {
            },
            tooltip : {
            },
            legend: {
                left : 'center',
                data: ['20岁以下','20-29岁','30-39岁','40-49岁','50-59岁','60岁及以上']
            },
            calculable : true,
            series : [
            {
                name:'人数比例',
                type:'pie',
                radius : '50%',
                center: ['50%', '75%'],
                data:[
                    {
                        value:getValueByTitle('20岁以下',$scope.view.ageSta), 
                        name:'20岁以下',
                        itemStyle:{
                            normal:{
                                color:'#FF7F50'
                            }
                        }
                    },
                    {
                        value:getValueByTitle('20-29岁',$scope.view.ageSta), 
                        name:'20-29岁',
                        itemStyle:{
                            normal:{
                                color:'#63B8FF'
                            }
                        }
                    },
                    {
                        value:getValueByTitle('30-39岁',$scope.view.ageSta), 
                        name:'30-39岁',
                        itemStyle:{
                            normal:{
                                color:'#FF75F0'
                            }
                        }
                    },
                    {
                        value:getValueByTitle('40-49岁',$scope.view.ageSta), 
                        name:'40-49岁',
                        itemStyle:{
                            normal:{
                                color:'#638BFF'
                            }
                        }
                    },
                    {
                        value:getValueByTitle('50-59岁',$scope.view.ageSta), 
                        name:'50-59岁',
                        itemStyle:{
                            normal:{
                                color:'#027F50'
                            }
                        }
                    },
                    {
                        value:getValueByTitle('60岁及以上',$scope.view.ageSta), 
                        name:'60岁及以上',
                        itemStyle:{
                            normal:{
                                color:'#FFC125'
                            }
                        }
                    }
                ]
            }
            ]
        };
        chart.setOption(option); 
    } 

    $scope.loadSexChart = function() {
        var chart = echarts.init(document.getElementById('sexChart'));
        var option = {
            title : {
            },
            tooltip : {
            },
            legend: {
                left : 'center',
                data: ['男','女']
            },
            calculable : true,
            series : [
            {
                name:'人数比例',
                type:'pie',
                radius : '60%',
                center: ['50%', '55%'],
                data:[
                    {
                        value:getValueByTitle('男',$scope.view.sexSta), 
                        name:'男',
                        itemStyle:{
                            normal:{
                                color:'#FF4040'
                            }
                        }
                    },
                    {
                        value:getValueByTitle('女',$scope.view.sexSta), 
                        name:'女',
                        itemStyle:{
                            normal:{
                                color:'#5B5B5B'
                            }
                        }
                    }
                ]
            }
            ]
        };
        chart.setOption(option);
    }

    $scope.loadEduChart = function() {
        var chart = echarts.init(document.getElementById('eduChart'));
        var option = {
            title : {
            },
            tooltip : {
            },
            legend: {
                left : 'center',
                data: ['小学及以下','初中','高中','大专','大学','研究生及以上']
            },
            calculable : true,
            series : [
            {
                name:'人数比例',
                type:'pie',
                radius : '50%',
                center: ['50%', '75%'],
                data:[
                    {
                        value:getValueByTitle('小学及以下',$scope.view.educationSta), 
                        name:'小学及以下',
                        itemStyle:{
                            normal:{
                                color:'#CDCD00'
                            }
                        }
                    },
                    {
                        value:getValueByTitle('初中',$scope.view.educationSta), 
                        name:'初中',
                        itemStyle:{
                            normal:{
                                color:'#CD00CD'
                            }
                        }
                    },
                    {
                        value:getValueByTitle('高中',$scope.view.educationSta), 
                        name:'高中',
                        itemStyle:{
                            normal:{
                                color:'#8470FF'
                            }
                        }
                    },
                    {
                        value:getValueByTitle('大专',$scope.view.educationSta), 
                        name:'大专',
                        itemStyle:{
                            normal:{
                                color:'#68838B'
                            }
                        }
                    },
                    {
                        value:getValueByTitle('大学',$scope.view.educationSta), 
                        name:'大学',
                        itemStyle:{
                            normal:{
                                color:'#00CD66'
                            }
                        }
                    },
                    {
                        value:getValueByTitle('研究生及以上',$scope.view.educationSta), 
                        name:'研究生及以上',
                        itemStyle:{
                            normal:{
                                color:'#00B2EE'
                            }
                        }
                    }
                ]
            }
            ]
        };
        chart.setOption(option);
    }

    $scope.loadCommentatorChart = function() {
        var chart = echarts.init(document.getElementById('commentatorChart'));
        var option = {
            title : {
            },
            tooltip : {
            },
            legend: {
                left : 'center',
                data: ['社会民众','政府内部']
            },
            calculable : true,
            series : [
            {
                name:'人数比例',
                type:'pie',
                radius : '60%',
                center: ['50%', '55%'],
                data:[
                    {
                        value:getValueByTitle('社会民众',$scope.view.evaCrowdsSta), 
                        name:'社会民众',
                        itemStyle:{
                            normal:{
                                color:'#EE4000'
                            }
                        }
                    },
                    {
                        value:getValueByTitle('政府内部',$scope.view.evaCrowdsSta), 
                        name:'政府内部',
                        itemStyle:{
                            normal:{
                                color:'#FFD700'
                            }
                        }
                    }
                ]
            }
            ]
        };
        chart.setOption(option);
    }

    $scope.loadSatisfactionChart = function() {
        var chart = echarts.init(document.getElementById('satisfactionChart'));
        var option = {
            tooltip: {},
            legend: {
                data:['好','中', '差']
            },
            xAxis: {
                data: ['总数','xx']
            },
            yAxis: {},
            series: [{
                name: '好',
                type: 'bar',
                data: [getSatisficingItemByTitle('总数',$scope.view.satisficingSta).good, getSatisficingItemByTitle('总数',$scope.view.satisficingSta).good]
            },{
                name: '中',
                type: 'bar',
                data: [getSatisficingItemByTitle('总数',$scope.view.satisficingSta).medium, getSatisficingItemByTitle('总数',$scope.view.satisficingSta).medium]
            },{
                name: '差',
                type: 'bar',
                data: [getSatisficingItemByTitle('总数',$scope.view.satisficingSta).bad, getSatisficingItemByTitle('总数',$scope.view.satisficingSta).bad]
            }]
        };

        chart.setOption(option);
    }


    var getValueByTitle = function(title, array) {
        if (array instanceof Array) {
            for (var i = 0; i < array.length; ++i) {
                var item = array[i];
                if (item.title == title) {
                    return parseFloat(item.value);
                }
            }
        }
        return 0;
    }

    var getSatisficingItemByTitle = function(title, array) {
        if (array instanceof Array) {
            for (var i = 0; i < array.length; ++i) {
                var item = array[i];
                if (item.title == title) {
                    return item;
                }
            }
        }
        
        return { "title": "","good": 0, "medium": 0, "bad": 0};
    }


    function loadChartData() {
        $timeout(function(){
            $scope.loadAgeChart();
            $scope.loadSexChart();
            $scope.loadEduChart();
            $scope.loadCommentatorChart();
            $scope.loadSatisfactionChart();
        },1000);
    }
    
    

    function findDeptEvaHome() {
        $ionicLoading.show({
            template: '请求中...'
        });

        var formId = $scope.selectedProject != undefined ? $scope.selectedProject.formId : '';

        if (authSrv.DeviceType == DeviceType.DeviceTypeOfBrower) {
            var url = authSrv.findDeptEvaHome();
            url += '&formId=' + formId;
            $http.jsonp(url).success(function (data) {
                console.log("获取部门端评议统计信息:"+ JSON.stringify(data) );
                $ionicLoading.hide();
                if (data.success) {
                    $scope.view = data.data;
                    loadChartData();
                    reviewSrv.waitEvaProject = data.waitEvaProject;
                    reviewSrv.project = data.project;
                }
                else {
                    loadChartData();
                    $cordovaToast.showShortCenter(data.message);
                }

            }).error(function (error) {
                $ionicLoading.hide();
                loadChartData();
                $cordovaToast.showShortCenter('网络请求失败');
            })
        }
        else {
            var param = authSrv.getParams();
            param.formId = formId;

            console.log('url:'+authSrv.findDeptEvaHome()+' params:'+JSON.stringify(param));

            $http.post(authSrv.findDeptEvaHome(),param).success(function(data) {
                $ionicLoading.hide();
                if (data.success) {
                    $scope.view = data.data;
                    loadChartData();
                    reviewSrv.waitEvaProject = data.waitEvaProject;
                    reviewSrv.project = data.project;
                }
                else {
                    loadChartData();
                    $cordovaToast.showShortCenter(data.message);
                }
            }).error(function(err){
                $ionicLoading.hide();
                loadChartData();
                $cordovaToast.showShortCenter('网络请求失败');
            });
        }
    }

    findDeptEvaHome();


    $scope.selectProjectOfReview = function() {
        reviewSrv.projects = $scope.view.project;
        // reviewSrv.selectedProject = undefined;
        $rootScope.redirect('/projectOfReviewSelector/projectOfReviewSelector');
    }
});