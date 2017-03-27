appMain
.controller('categoryCtrl', function($rootScope, $scope, $ionicActionSheet, $timeout, $location, $stateParams, dateSrv, $ionicModal, authSrv, $http, $cordovaToast, appNavibarSrv, categorySrv) {
	'use strict';
    $scope.view = {};
    $scope.view2 = {};
    $scope.form = {
        type : $stateParams.id
    };
    $scope.refresh = function(){
        $scope.initDate();
        $scope.loadData();
    };

    $scope.loadData = function(){
        var others = {
            startDate : $scope.form.startDate,
            endDate : $scope.form.endDate,
            type : $scope.form.type
        };
        var params = authSrv.getParams(others);
        $http({
            method:'JSONP',
            url:authSrv.findLeadRecordByTypeAdr(),
            params:params
        }).success(function(succ) {
            if(!succ.data){
                return;
            }
            $scope.loadChart(succ.data.handledNum, succ.data.notHandledNum);
            categorySrv.loadData(succ.data);
            $scope.view = categorySrv.view;
        });
    };

    $scope.loadMore = function(deptId){
        var others = {
            startDate : $scope.form.startDate,
            endDate : $scope.form.endDate,
            type : $scope.form.type,
            deptId : deptId,
            pageNumber:categorySrv.nextPageNumber(deptId),
            recordMarkIds:categorySrv.recordMarkIds(deptId)
        };
        var params = authSrv.getParams(others);
        $http({
            method:'JSONP',
            url:authSrv.findNotHandledByPageAdr(),
            params:params
        }).success(function(succ) {
            if(!succ.data){
                return;
            }
            categorySrv.loadMore(succ.data, deptId);
            $scope.view = categorySrv.view;
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
            $scope.view2.startDate = $scope.startDate.selected.year + '年' + $scope.startDate.selected.month  + '月' +  $scope.startDate.selected.day + '日';
            $scope.form.startDate = appDate.newDate($scope.startDate.selected.year + '-' + $scope.startDate.selected.month  + '-' +  $scope.startDate.selected.day).format('yyyy-MM-dd');
        }
    };
    function getFormEndDate(){
        if($scope.endDate.selected && $scope.endDate.selected.year && $scope.endDate.selected.month && $scope.endDate.selected.day){
            $scope.view2.endDate = $scope.endDate.selected.year + '年' + $scope.endDate.selected.month  + '月' +  $scope.endDate.selected.day + '日';
            $scope.form.endDate = appDate.newDate($scope.endDate.selected.year + '-' + $scope.endDate.selected.month  + '-' +  $scope.endDate.selected.day).format('yyyy-MM-dd');
        }
    };
    $scope.$watch('startDate',getFormStartDate,true);

    $scope.$watch('endDate',getFormEndDate,true);

	/*$scope.$apply(function(){
		$('.app-item-title').pin();
	});*/
	$scope.more = function(){
		$ionicActionSheet.show({
			buttons: [{ text: 'test' }],
			cancelText: '取消',
			cancel: function() {
			},
			buttonClicked: function(index) {
				if(index == 0){
					$scope.deleteDuty();
				}
				return true;
			}
		});
	};

	$scope.deleteDuty = function(){
		
	};

	$scope.goDetail = function(id){
        if(id){
    		$location.path('/detail/'+id);
        }
	};

    $scope.loadChart = function(already,wait){
        var chart = echarts.init(document.getElementById('chart'));
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

        chart.setOption(option);
    };

	/*$timeout(function(){
		$scope.loadData();
	}, 500);*/

    $scope.refresh();
});