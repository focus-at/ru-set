(function(module){
  module.directive('form', function($log, $window){
    return {
      restrict: 'E',
      link: function(scope, element, attr, controller){
        element.on('submit', function(){
          var elements = this.elements;
          if(this.className.indexOf('ng-valid') != -1 && $window.ga){
            $window.ga('send', 'event', 'Навигация', 'Отправка формы', this.className.split(' ')[0]);
          }
          for(var i = 0; i < elements.length; i++){
            if(elements[i].className.indexOf('ng-invalid') != -1 || !elements[i].checkValidity()){
              elements[i].focus();
              break;
            }
          }
        });
      }
    };
  });

  module.directive('headerInputDate', function(){
    return {
      restrict: 'C',
      link: function(scope, element, attr){
        element.on('keydown', function(e){
          if(e.keyCode != 9) e.preventDefault();
        });
      }
    };
  });

/*
  module.directive('ngPattern', function($timeout){
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, controller){
        element.on('blur', function(){
          $timeout(function(){
            controller.$setValidity('', true);
            controller.$validate();
          });
        });
        scope.$watch(function(){
          return controller.$viewValue;
        }, function(newvalue, oldvalue){
          if(newvalue != oldvalue){
            controller.$setValidity('', (newvalue && controller.$validators.pattern(newvalue) ? true : undefined));
            scope.$applyAsync();
          }
        });
      }
    };
  });
*/

  module.directive('rMap', function($document, $window, $q){
    var script = $document[0].createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1.28/?lang=ru_RU';
    $document[0].body.appendChild(script);
    //TODO FIX slow;
    return {
      restrict: 'C',
      scope: {
        data: '=',
      },
      link: function(scope, element){
        var params = scope.data.departureBusStop;
        if(!params.latitude || !params.longitude){
          scope.$destroy();
          element.remove();
          return;
        }

        var openDescribe = scope.$watch('data.open', function(newvalue){
          if(newvalue){
            ymaps.ready(function(ymaps){
              if(params.latitude && params.longitude){
                var geo = [params.latitude, params.longitude];
                new ymaps.Map(element[0], {
                  center: geo,
                  zoom: 5,
                  controls: ['zoomControl']
                }).geoObjects.add(new ymaps.Placemark(geo, {
                    balloonContentHeader: params.name,
                    balloonContentBody: params.address ? '<b>Адрес: ' + params.address + '</b>' : null,
                    balloonContentFooter: params.contact ? '<b>Контакты: ' + params.contact + '</b>' : null,
                }));

                //balloonPanelMaxMapArea: 0
                //placemark.balloon.open();

                element.on('click', function(e){
                  var target = e.target;
                  if(e.target.className.indexOf('r-clicker') != -1){
                    element.toggleClass('r-active');
                  }
                });

              }
            });
            openDescribe();
          }
        });
      }
    };
  });

  module.directive('mask', function($timeout){
    /*
      https://github.com/wender/angular-simple-input-mask/
    */
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, controller){
        var caretOffset = 0;
        var mask = attr.mask.split('');
        var placeholder = attr.placeholder.split('');
        var del;

        function caret(pos){
          var range;
      		if (pos && typeof pos.begin == 'number') {
            pos.end = (typeof pos.end === 'number') ? pos.end : pos.begin;
    				if (element[0].setSelectionRange) {
              element[0].setSelectionRange(pos.begin, pos.end);
    				} else if (element[0].createTextRange) {
    					range = element[0].createTextRange();
    					range.collapse(true);
    					range.moveEnd('character', pos.end);
    					range.moveStart('character', pos.begin);
    					range.select();
    				}
      		} else {
      			if (element[0].setSelectionRange) {
              pos = {
                begin: element[0].selectionStart,
                end: element[0].selectionEnd
              };
      			} else if (document.selection && document.selection.createRange) {
      				range = document.selection.createRange();
              pos = {
                begin: 0 - range.duplicate().moveStart('character', -100000),
                end: begin + range.text.length
              };
      			}
            //modify
            if(placeholder[pos.begin] == mask[pos.begin]){
              pos.begin += caretOffset;
              pos.end += caretOffset;
            }
            return pos;
      		}
        }

        function maskedValue(value) {
          var tmp = value.replace(/[^\d]/g, '').split('');
          var offset = 0;

          return placeholder.map(function(char, index){
            if(placeholder[index] == mask[index]){
              return mask[index];
            }else if(tmp[offset]){
              return tmp[offset++];
            }else{
              return char;
            }
          }).join('');
        }

        controller.$setViewValue = function(value){
          var pos = caret();
          var prev = pos.begin - 1;
          var next = pos.begin + 1;
          var regexp = ({9: /\d/})[mask[prev]];

          value = maskedValue(value);

          //TODO remove doubles & clear
          if(regexp && regexp.test(value.charAt(prev))){
            if(mask[pos.begin] == placeholder[pos.begin]){
              if(del < 0){
                value = maskedValue(value.substr(0, prev) + value.charAt(next) + value.substr(prev + 3));
                pos.begin--;
                pos.end--;
              }else if(del > 0){
                prev++;
                next++;
                value = maskedValue(value.substr(0, prev) + value.charAt(next) + value.substr(prev + 3));
                pos.begin++;
                pos.end++;
              }else{
                pos.begin++;
                pos.end++;
              }
            }
            this(value);
            controller.$render();
          }else if(del){
            this(value);
            controller.$render();
          }else{
            if(mask[prev] != placeholder[prev]){
              pos.begin--;
              pos.end--;
            }
            controller.$rollbackViewValue();
          }

          caret(pos);

        }.bind(controller.$setViewValue);

        element.on('keydown', function(e){
          //left, right or space move caret to delimiter
          var inc = ({37: -1, 39: 1, 32: 0})[e.keyCode];
          if(!isNaN(inc)){
            var pos = caret();
            if(!inc){
              pos.begin++;
              pos.end++;
              e.preventDefault();
            }
            if(mask[pos.begin + inc] == placeholder[pos.begin + inc]){
              pos.begin += inc < 0 ? -1 : 1;
              pos.end += inc < 0 ? -1 : 1;
            }
            caret(pos);
          }
          //detect delete or backspace
          del = ({46: 1, 8: -1})[e.keyCode];
        });

        element.on('click', function(e){
          var pos = caret();
          if(mask[pos.begin] == placeholder[pos.begin]){
            pos.begin++;
            pos.end++;
            caret(pos);
          }
        });
      }
    };
  });

})(angular.module('app.directives', []));
