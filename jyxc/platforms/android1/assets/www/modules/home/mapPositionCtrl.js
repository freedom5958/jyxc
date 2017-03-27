

appMain
.controller('mapPositionCtrl', function($rootScope, $scope,$timeout, $ionicHistory) {

    $scope.backParent = function() {
        $ionicHistory.goBack();
    }
	
    $scope.address="昆明";

    $scope.load = function() {  
        var map = new BMap.Map('map');
        var point = new BMap.Point(116.307852,40.057031);
        map.centerAndZoom(point, 16);
        map.enableScrollWheelZoom(); ;  

        var marker = new BMap.Marker(point);
	    var label = new BMap.Label("欢迎使用百度地图");  // 创建文本标注对象
		label.setStyle({
			 color : "red",
			 fontSize : "17px",
			 height : "24px",
			 lineHeight : "24px",
			 fontFamily:"微软雅黑"
		 });
		 label.setOffset(new BMap.Size(0, -25));
        marker.setLabel(label);
        map.addOverlay(marker);
    };  

});