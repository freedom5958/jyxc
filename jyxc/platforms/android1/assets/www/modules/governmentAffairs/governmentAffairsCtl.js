appMain
.controller('governmentAffairsCtl', function($rootScope, $scope,$timeout,$ionicLoading,$cordovaToast,$http) {
 
 	$rootScope.variable.allowQuit = true;

 	$scope.showMyReview = function() {
 		// $rootScope.redirect('/governmentAffairs/myReview');
 		$rootScope.redirect('/review/myReviewList');
 	}

 	$scope.showGeneralInfo = function(str) {
 		$rootScope.redirect('/governmentAffairs/distributeInfo/'+str);
 	}
 });