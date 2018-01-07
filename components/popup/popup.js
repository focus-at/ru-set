angular.module('app').directive('rOverlay', function($document, Passengers){
  return {
    restrict: 'C',
    template: '<div class="r-popup" ng-class="{\'popup--offer\': popup.type == \'offer\'}"><span class="r-close"></span><div class="popup__scroll" ng-include="\'popup/popup--\'+(popup.type || \'place\')+\'.html\'"></div></div>',
    link: function(scope, element, attr){
      function close(){
        if(scope.popup.input){
          var fields = scope.popup.input.form.elements;
          var len = fields.length;

          while(len--){
            if(fields[len] === scope.popup.input){
              if(fields[len + 1]){
                fields[len + 1].focus();
                break;
              }
            }
          }
        }
        scope.$emit('popup');
      }

      scope.$on('popup', function(e, params){
        if(!params){
          return scope.$applyAsync(function(){
            scope.popup = null;
          });
        }
        scope.popup = {type: params.type};
        if(params.type == 'place'){
          setTimeout(function(){
            (scope.popup.input = params.event.target).blur();
          });
          /*TODO min extend*/
          angular.extend(scope.popup, Passengers.params, {
            current: e.targetScope.item,
            select: function(value){
              if(!this.seats[value]){
                this.current.seatNumber = Passengers.freeSeat(value, this.current.seatNumber);
              }
              close();
            }
          });
        }
      });

      $document.on('keydown', function(e){
        if(scope.popup && {9: 1, 13: 1}[e.keyCode]){
          e.preventDefault();
          close();
        }
      });

      element.on('click', function(e){
        var cls = e.target.className;
        if(cls.indexOf('r-close') != -1 || cls.indexOf('r-overlay') != -1){
          close();
        }
      });
    }
  };
});
