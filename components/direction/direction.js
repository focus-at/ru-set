angular.module('app').directive('direction', function(){
  return {
    restrict: 'C',
    templateUrl: 'direction/direction.html',
    scope: {
      form: '=name'
    }
  };
});
