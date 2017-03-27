appMain
.directive('appNavibar', function(appNavibarSrv, $ionicScrollDelegate, $ionicModal) {
  'use strict';
  return {
    restrict: 'E',
    templateUrl:'js/app/appNavibar.html',
    compile: function($element, $attr) {
      return function($scope, $element, $attr) {
        $scope.editStatus = {
          text:'编辑',
          editing:false
        };
        $scope.goPage = function(id){
          var fitem = $scope.findItem(id);
          if(fitem){
            appNavibarSrv.goPage(fitem);
            var d = $ionicScrollDelegate.$getByHandle('appNavibar');
            var p = d.getScrollPosition();
            if(p && d.scrollTo){
             d.scrollTo(p.left, p.top, false);
            }
          }
        };

        $scope.findItem = function(id){
          var fed;
          angular.forEach($scope.config.items, function(item){
            if(item.id && item.id == id){
              fed = item;
            }
          });
          return fed;
        };

        $scope.initData = function(){
          
          $scope.config = appNavibarSrv.config;
          $scope.groupItem();
        };

        $scope.edit = function(){
          $scope.groupItem();
          $ionicModal.fromTemplateUrl('js/app/appNavibarEditor.html', {
            scope: $scope,
            animation: 'slide-in-down'
          }).then(function(modal) {
            modal.show();
            $scope.editModal = modal;
          });
        };
        $scope.groupItem = function(){
          var g = [], gs = [];
          angular.forEach(appNavibarSrv.config.items, function(item, index){
            if(index % 3 == 0 && g.length){
              gs.push(g);
              g = [];
            }
            g.push(item);
          });
          if(g.length){
            var y = 3 - g.length;
            for(var i = 0; i < y; i++){
              g.push({name:'',placeholder:true});
            }
            gs.push(g);
          }
          $scope.items = gs;

          var r = [], rs = [];
          angular.forEach(appNavibarSrv.config.recommendItems, function(item, index){
            if(index % 3 == 0 && r.length){
              rs.push(r);
              r = [];
            }
            r.push(item);
          });
          if(r.length){
            var y = 3 - r.length;
            for(var i = 0; i < y; i++){
              r.push({name:'',placeholder:true});
            }
            rs.push(r);
          }
          $scope.recommendItems = rs;
        };
        $scope.closeEditor = function(){
          $scope.editStatus = {
            text:'编辑',
            editing:false
          };
          $scope.editModal.hide();
        };
        $scope.toggleEdit = function(id){
          if($scope.editStatus.editing){
            $scope.closeEditor();
          }else{
            $scope.editStatus = {
              text:'完成',
              editing:true
            };
          }
        };
        $scope.minius = function(id){
          if($scope.editStatus.editing && id){
            appNavibarSrv.deleteAttention(id).then(function(){
              appNavibarSrv.loadAttentions().then(function(){
                $scope.initData();
              });
            });
          }
        };
        $scope.plus = function(id){
          if($scope.editStatus.editing && id){
            appNavibarSrv.saveAttention(id).then(function(){
              appNavibarSrv.loadAttentions().then(function(){
                $scope.initData();
              });
            });
          }
        };
        $scope.initData();
      };
    }
  };
});


appMain.directive('textareaAuto', function ($timeout) {
    return {
     restrict: 'A',
     link: function(scope, element, attr) {
         console.log(element[0].nodeName)
             //判断是否是    TEXTAREA
       if("TEXTAREA"==element[0].nodeName&&attr.textareaAuto){
         //自适应高度
                 $(element).autoTextarea()
           }
         }
    };
});

(function($){
    $.fn.autoTextarea = function(options) {
        var defaults={
            maxHeight:null,
            minHeight:$(this).height()
        };
        var opts = $.extend({},defaults,options);
        return $(this).each(function() {
            $(this).bind("paste cut keydown keyup focus blur",function(){
                var height,style=this.style;
                this.style.height =  opts.minHeight + 'px';
                if (this.scrollHeight > opts.minHeight) {
                    if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
                        height = opts.maxHeight;
                        style.overflowY = 'scroll';
                    } else {
                        height = this.scrollHeight;
                        style.overflowY = 'hidden';
                    }
                    style.height = height  + 'px';
                }
            });
        });
    };
})(jQuery);