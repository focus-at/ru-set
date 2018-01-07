angular.module('app').directive('payment', function(ticketService, $timeout, $location, config){
  return {
    restrict: 'C',
    scope: {
      state: '=ngIf',
      id: '=',
      phone: '='
    },
    template: '<div ng-include="\'payment/\'+state+\'.html\'"></div>',
    link: function(scope, element, attr){
      scope.$emit('loader', 'Ожидание подтверждения платежа...');
      var params = {bookingId: scope.id, phone: scope.phone};
      function close(text){
        scope.$emit('notification');
        ticketService.book.booking = null;
        scope.text = text || 'Ошибка платежа. Время бронирования истекло';
      }
      (function status(){
        ticketService.getBooking(params).then(function(booking){
          angular.extend(booking, {
            status: booking.status.toLowerCase(),
            noedit: true
          });

          if(scope.state == 'fail'){// фейл
            if(!config.baseUrl){
              angular.extend(params, $location.search());//$location.search() ?
            }else{
              decodeURIComponent(location.search).split('?')[2].split('&').forEach(function(item){
                var kv = item.split('=');
                params[kv[0]] = kv[1];
              });
            }

            return ticketService.getPaymentStatus(params).then(function(text){
              scope.$emit('loader');
              if(booking.status == 'reserved'){
                scope.$emit('notification', {type: 'error', text: text || 'Ошибка, платеж не подтвержден. Попробуйте еще раз'});
                return ticketService.ticker(booking, function(){
                  close(text);
                }).then(function(booking){
                  ticketService.getPaymentList(booking.bookingId).then(function(paymentList){
                    if(!booking) return;
                    ticketService.book.booking = angular.extend(booking, paymentList);
                  });
                });
              }else{// other statused
                close(text);
              }
            }, function(){
              scope.$emit('notification', {type: 'error'});
            });
          }

          switch (booking.status) {// успех
            case 'reserved': // продолжаем крутиться и ждать изменения статуса
              setTimeout(status, 3000);
              break;
            case 'sold': // успешная покупка билета
              ticketService.book.booking = booking;
              scope.$emit('loader');
              break;
            default: //closed или refund - отображаем шаблон ошибки
            scope.state = 'fail';
            scope.text = 'К сожалению, выкупить билеты не удалось. Обратитесь в службу поддержки и сообщите код заказа ' + booking.bookingId;
          }
        });
      })();
    }
  };
});
