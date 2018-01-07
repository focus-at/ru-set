angular.module('app').directive('rTopBar', function($window, $document){
  return {
    restrict: 'C',
    link: function(scope, element){
      var top = element[0].offsetTop;
      $document.on('scroll', function(){
        if($window.scrollY > top){
          element.css({position: 'fixed'});
        }else{
          element.css({position: 'static'});
        }
      });
    }
  };
});
