(function(module){
  module.directive('header', function($log){
    return {
      restrict: 'C',
      link: function(scope, element){
        scope.$$childHead.form = element.controller('form');
      }
    };
  });
})(angular.module('app'));
