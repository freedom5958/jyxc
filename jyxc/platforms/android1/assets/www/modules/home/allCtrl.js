appMain
.controller('allCtrl', function($rootScope, $scope, $ionicModal, dateSrv, authSrv, $http, $cordovaToast, appNavibarSrv) {
	'use strict';
	var allChart = echarts.init(document.getElementById('allChart'));
    var hotChart = echarts.init(document.getElementById('hotChart'));
    var deptsChart = echarts.init(document.getElementById('deptsChart'));
    $scope.view = {};
    $scope.form = {};

    $scope.refresh = function(){
        $scope.initDate();
        $scope.loadData();
    };

    $scope.loadData = function(){
        var params = authSrv.getParams();
            params.startDate = $scope.form.startDate;
            params.endDate = $scope.form.endDate;
        $http({
            method:'JSONP',
            url:authSrv.findLeadAllAdr(),
            params:params
        }).success(function(succ) {
            if(!succ.data){
                return;
            }
            $scope.loadAllChart(succ.data.adviseNum, succ.data.adviseHandledNum, succ.data.complainNum, succ.data.complainHandledNum);
            $scope.loadHotChart(succ.data.hotspotHandledNum, succ.data.hotspotNotHandledAllNum);
            $scope.view.waitHandle = succ.data.waitHandle;
            $scope.loadDeptsChart(succ.data.dept);
            $scope.view.msgNum = {
                veryUseful:succ.data.veryUsefulNum || 0,
                useful:succ.data.usefulNum || 0,
                normal:succ.data.generalNum || 0,
                useless:succ.data.garbageNum || 0
            };
            
            // $scope.loadAllChart(33,2,44,3);
            // $scope.loadHotChart(20,12);
            // $scope.view.waitHandle = [{deptName:'交通',num:'3'},{deptName:'教育',num:'3'},{deptName:'行政',num:'4'}];
            // $scope.loadDeptsChart();
            

        });
    };

    $scope.initDate = function(){
        $scope.startDate = {
            years : dateSrv.years(),
            selected : {
                year : dateSrv.currentYear(),
                month : dateSrv.currentMonth(),
                day : dateSrv.currentMonthFirstDay()
            }
        };

        $scope.endDate = {
            years : dateSrv.years(),
            selected : {
                year : dateSrv.currentYear(),
                month : dateSrv.currentMonth(),
                day : dateSrv.currentMonthLastDay()
            }
        };

        getFormStartDate();
        getFormEndDate();
    };

    $scope.loadAllChart = function(sa,a,sb,b){
        var option = {
            tooltip: {},
            legend: {
                data:['建言献策','投诉']
            },
            xAxis: {
                data: ['总数','已处理']
            },
            yAxis: {},
            series: [{
                name: '建言献策',
                type: 'bar',
                data: [sa,a],
                label:{
                    normal:{
                        show:true,
                        position:'top',
                        formatter:'{c}'
                    }
                }
            },{
                name: '投诉',
                type: 'bar',
                data: [sb,b],
                label:{
                    normal:{
                        show:true,
                        position:'top',
                        formatter:'{c}'
                    }
                }
            }]
        };
        allChart.setOption(option);
	};

    $scope.loadHotChart = function(already,wait){
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color:['#546570', '#c4ccd3'],
            series : [
                {
                    name: '热点',
                    type: 'pie',
                    radius : '80%',
                    center: ['40%', '40%'],
                    data:[
                        {value:already, name:'已处理'},
                        {value:wait, name:'未处理'}
                    ],
                    label:{
                        normal:{
                            show:true,
                            position:'inside',
                            formatter:'{b}{c}'
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

        hotChart.setOption(option);
    };

    $scope.loadDeptsChart = function(deptDatas) {
        /*var deptNames = ['交通', '教育', '卫生', '建设', 'a', 'b', 'c', 'd', 'e', 'f'],
            totals = [20, 50, 30, 20, 50, 30, 20, 50, 30, 20],
            alreadys = [19, 33, 25, 12, 33, 25, 12, 33, 25, 12],
            waits = [1, 17, 5, 8, 17, 5, 8, 17, 5, 8];*/
        var deptNames = [],
            totals = [],
            alreadys = [],
            waits = [];
        angular.forEach(deptDatas, function(data){
            deptNames.push(data.deptName);
            totals.push(data.allNum);
            alreadys.push(data.handledNum);
            waits.push(data.allNum - data.handledNum);
        });
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['总数', '已处理'],
                top: 'bottom'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                top:'3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: deptNames
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: '总数',
                type: 'bar',
                stack: '总数',
                data: totals,
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        formatter: '{c}'
                    }
                }
            }, {
                name: '已处理',
                type: 'bar',
                stack: '总数',
                data: alreadys,
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        formatter: '{c}'
                    }
                }
            }]
        };

        deptsChart.setOption(option);
    };

    $scope.selectDate = function(){
        $ionicModal.fromTemplateUrl('modules/home/selectDate.html', {
            scope: $scope,
            animation: 'slide-in-right'
        }).then(function(modal) {
            modal.show();
            $scope.selectDateModal = modal;
        });
    };

    $scope.closeSelectDate = function(){
        $scope.selectDateModal.hide();
        $scope.selectDateModal.remove();
    };

    $scope.selectDateClear = function(){
        $scope.refresh();
        $scope.closeSelectDate();
    };

    $scope.selectDateSure = function(){
        $scope.loadData();
        $scope.closeSelectDate();
    };

    function getFormStartDate(){
        if($scope.startDate.selected && $scope.startDate.selected.year && $scope.startDate.selected.month && $scope.startDate.selected.day){
            $scope.view.startDate = $scope.startDate.selected.year + '年' + $scope.startDate.selected.month  + '月' +  $scope.startDate.selected.day + '日';
            $scope.form.startDate = appDate.newDate($scope.startDate.selected.year + '-' + $scope.startDate.selected.month  + '-' +  $scope.startDate.selected.day).format('yyyy-MM-dd');
        }
    };
    function getFormEndDate(){
        if($scope.endDate.selected && $scope.endDate.selected.year && $scope.endDate.selected.month && $scope.endDate.selected.day){
            $scope.view.endDate = $scope.endDate.selected.year + '年' + $scope.endDate.selected.month  + '月' +  $scope.endDate.selected.day + '日';
            $scope.form.endDate = appDate.newDate($scope.endDate.selected.year + '-' + $scope.endDate.selected.month  + '-' +  $scope.endDate.selected.day).format('yyyy-MM-dd');
        }
    };
    $scope.$watch('startDate',getFormStartDate,true);

    $scope.$watch('endDate',getFormEndDate,true);

    $scope.refresh();
});