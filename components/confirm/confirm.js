angular.module('app').directive('confirm', function($filter){
  return {
    restrict: 'C',
    templateUrl: 'confirm/confirm.html',
    scope: {
      booking: '=ngIf',
      form: '=name'
    },
    link: function(scope, element, attr, controller){
      scope.$watch('booking.paymentIndex', function(newvalue, oldvalue){
        if(angular.isNumber(newvalue)){
          var payment = scope.booking.paymentList[newvalue];
          if(payment.paymentSystemType.toLowerCase() == 'offline'){//lowercase
            scope.error = {text: payment.instruction};
          }else{
            scope.error = null;
          }
        }
      });

      scope.agree = true;
/*
      scope.timeWithTimezone = function(dateString){
        if(dateString){
          var timezone = dateString.match(/[-\+]\d{1,2}:?\d{2}?$/);
          if(timezone){
            timezone = timezone[0].replace(':', '');
            //TODO timezones list
            return $filter('date')(dateString.replace(timezone, ''), 'H:mm', timezone);// + ' ' + timezones[timezone];
          }
        }
      };
*/
    }
  };
});
