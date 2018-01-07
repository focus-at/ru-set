angular.module('app').directive('directionInputWr', function($q, ticketService, $timeout){
  return {
    restrict:'C',
    transclude: true,
    scope: true,
    templateUrl: 'autocomplete/autocomplete.html',
    link:function(scope, element, attr, controller, transclude){

      transclude(scope, function(el){
        element.prepend(el);
      });

      element.ready(function(){
        if(element[0].parentNode.querySelector('.stations__popup')){
          return;
        }

        var input = element.find('input');
        var focusedIndex = 0;
        var promise;
        var item;
        var len;

        controller = input.controller('ngModel');
        if(!controller) return;

        function setFocused(index){
          if(!len) return;
          var old = scope.autocomplete.items[focusedIndex];
          if(old){
            old.focused = false;
          }
          focusedIndex = index;
          scope.autocomplete.items[focusedIndex].focused = true;
          scope.$applyAsync();
        }

        function select(){
          item = (scope.autocomplete || {items: []}).items[focusedIndex];
          if(item){
            item.toString = function(){
              return this.name;
            };
            controller.$setValidity('id', true);
            controller.$setViewValue(item);
            controller.$render();
            scope.$applyAsync();
          }
        }

        function selectFocused(){
          if(promise){
            if(promise.$$state.status == 1){
              select();
            }else{
              promise.then(select);
            }
          }
        }

        controller.$validators.required = function(a,b){
          if(!a){
            len = 0;
            scope.autocomplete = null;
          }
          return this(a,b);
        }.bind(controller.$validators.required);

        controller.$asyncValidators.id = function(modelValue, viewValue){
          var value = modelValue || viewValue;
          if(typeof(value) == 'object' && item && item.busStopId == value.busStopId){
            return $q.resolve();
          }
          promise = ticketService.getBusStops({name: value.toString()}).then(function(data){
            setTimeout(function(){
              input.removeClass('ng-valid ng-pending');
            });
            len = data.items.length;
            scope.autocomplete = data;
            if(len){
              setFocused(0);
            }else{
              return $q.reject();
            }
          });
          return promise;
        };

        input.on('focus', function(e){
          setTimeout(function(){
            e.target.select();
          }, 50);
        });

        input.on('keydown', function(e){
          if(({38:1, 40:1, 13:1})[e.keyCode]){
            e.preventDefault();
            e.stopPropagation();
            if(e.keyCode == 13){
              /*move focus on next .ng-invalid*/
              setTimeout(function(){
                var target = e.target.form.querySelectorAll('.ng-invalid, :invalid')[0];
                if(target) target.focus();
              }, 100);
            }
          }
        });

        input.on('keyup', function(e){
          var direction = ({38: -1, 40: 1})[e.keyCode];
          if(direction && len){
            var tmp = direction + focusedIndex;
            setFocused((tmp < 0) ? len - 1 : (tmp == len) ? 0 : tmp);
          }else if(e.keyCode == 13){
            selectFocused();
            e.preventDefault();
          }
        });

        element.on('mousedown', function(e){
          var el = angular.element(e.target);
          if(el.hasClass('validate-icon')){
            controller.$setViewValue('');
            controller.$commitViewValue();
            controller.$render();
            setTimeout(function(){
              input[0].focus();
            });
          }
        });

        element.on('mousemove', function(e){
          var index = e.target.getAttribute('data-index');
          if(index && index != focusedIndex){
            setFocused(+index);
          }
        });

        input.on('blur', selectFocused);
      });
    }
  };
});
