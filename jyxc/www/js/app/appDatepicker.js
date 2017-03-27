appMain
.directive('appDatepicker', function() {
  'use strict';
  return {
    restrict: 'E',
    scope:{
      datas : '=',
    },
    templateUrl:'js/app/appDatepicker.html',
    compile: function($element, $attr) {
      return function($scope, $element, $attr) {
        $scope.groupMonth = function(){
          var ms = [];
          var mm = [];
          angular.forEach($scope.datas.months, function(m){
            if(m % 7 == 0){
              ms.push(mm);
              mm = [];
            }
            mm.push(m);
          });
          if(mm){
            ms.push(mm);
          }
          $scope.datas.groupMonth = ms;
        };

        $scope.groupDay = function(){
          if(!$scope.datas.selected.year || !$scope.datas.selected.month){
            return;
          }
          var year = $scope.datas.selected.year, month = $scope.datas.selected.month;
          var ds = [];
          // 第一天 前面补多少空
          var sn = appDate.monthFirstDayWeek(year, month);
          // 共做少天
          var days = appDate.monthLastDay(year, month).getDate();
          var ddd = [];
          for(var i = 0; i < days; i++){
            ddd.push(i+1);
          }
          $scope.datas.days = ddd;
          // 最后一天 后面补多少空
          var en = 6 - appDate.monthLastDayWeek(year, month);

          var dd = [];
          for(var i = 0; i < sn; i++){
            dd.push({name:''});
          }
          for(var i = sn; i - sn < days; i++){
            if(i % 7 == 0 && dd){
              ds.push(dd);
              dd = [];
            }
            dd.push({id:(i-sn+1),name:(i-sn+1)});
          }
          if(dd){
            for(var i = 0; i < en; i++){
              dd.push({name:''});
            }
            ds.push(dd);
          }
          $scope.datas.groupDay = ds;
          $scope.selectDay($scope.datas.selected.day);
        };

        $scope.selectYear = function(year){
          angular.forEach($scope.datas.years, function(y){
            if(y == year){
              $scope.datas.selected.year = y;
            }
          });
          if(!$scope.datas.selected.year){
            $scope.datas.selected.year = $scope.datas.years[0];
          }
          $scope.groupDay();
        };

        $scope.selectMonth = function(month){
          angular.forEach($scope.datas.months, function(m){
            if(m == month){
              $scope.datas.selected.month = m;
            }
          });
          $scope.groupDay();
        };

        $scope.selectDay = function(day){
          $scope.datas.selected.day = '';
          angular.forEach($scope.datas.days, function(d){
            if(d == day){
              $scope.datas.selected.day = d;
            }
          });
          if(!$scope.datas.selected.day){
            $scope.datas.selected.day = $scope.datas.days[0];
          }
        };

        $scope.reset = function(){
          $scope.selectYear(appDate.currentYear());
          $scope.selectMonth(appDate.currentMonth());
          $scope.selectDay(appDate.currentDay());
        };

        $scope.$watch('datas',function(){
          $scope.datas.selected = $scope.datas.selected || {};
          $scope.datas.months = $scope.datas.months || ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

          $scope.groupMonth();
          $scope.groupDay();
        },true);
      };
    }
  };
});