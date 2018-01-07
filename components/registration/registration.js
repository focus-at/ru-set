angular.module('app').directive('registration', function(validationPatterns, Passengers){
  return {
    restrict: 'C',
    scope: {
      bookParams: '=ngIf',
      form: '=name'
    },
    templateUrl: 'registration/registration.html',
    link: function(scope, element, attr, controller){
      scope.agree = true;
      scope.patterns = validationPatterns;
      scope.add = function(type){
        Passengers.add(type, function(error){
          scope.error = {type: 'info', text: error};
        });
      };
      scope.delete = Passengers.delete.bind(Passengers);
      scope.tariffChanged = function(type, newCode, oldCode){
        var tariffs = scope.bookParams.tariffs[type].list;
        scope.bookParams.info.price += (tariffs[newCode].price.value - tariffs[oldCode].price.value);
      };
    }
  };
});
