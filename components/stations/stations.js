angular.module('app').directive('direction', function(ticketService, $q){
  return {
    restrict: 'C',
    //templateUrl: 'stations/stations.html',
    link: function(scope, element, attrs){
      var data = {};
      var stations = element[0].querySelector('.stations');
      var direction;
      if(!stations){
        return;
      }
      (element[0].querySelector('.direction__switcher') || {style: {visibility: 0}}).style.visibility = 'hidden';

      scope.$root.stations = {
        title: null,
        loading: null
      };

      function sort(a,b){
        a = (typeof(a) == 'string' ? a : a.name).toLowerCase();
        b = (typeof(b) == 'string' ? b : b.name).toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
      }

      function idValidator(modelValue, viewValue){
        var value = modelValue || viewValue || '';
        var strVal = value.toString();
        var item = data[strVal] || data[strVal.charAt(0).toUpperCase() + strVal.slice(1)];

        if(value.busStopId){
          if(item && item.busStopId == value.busStopId){
            return $q.resolve();
          }else{
            return ticketService.getBusStopsById({busStopId: value.busStopId}).then(function(result){
              if(result.busStopId != value.busStopId){
                //console.log('rejectt');
              }
            });
          }
        }else if(item){
          setTimeout(function(){
            switch (direction) {
              case 'departure':
                scope.$root.direction[0] = item;
                scope.$root.direction[1] = null;
                //inputs[1].focus();
                break;
              case 'arrival':
                scope.$root.direction[1] = item;
            }
          });
          return $q.resolve();
        }//Если полностью совпадает с найденым в списке?

        return $q.reject();
      }

      var blurTimer;
      var inputs = Array.prototype.filter.call(element[0].elements, function(item){
        if(item.placeholder){

          var input = angular.element(item);
          var model = input.controller('ngModel');

          model.$asyncValidators.id = idValidator;

          item.addEventListener('focus', function(){
            clearTimeout(blurTimer);
            angular.element(this.parentNode).addClass('focused');
            direction = this.name;
            getStations();
          });

          item.addEventListener('blur', function(){
            var el = angular.element(this.parentNode);
            el.removeClass('focused');
          });

          item.addEventListener('input', function(){
            filter(this.value.toLowerCase());
          });

          return 1;
        }
      });

      function filter(value){
        var tmp = [];
        for(var i in data){
          if(~i.toLowerCase().indexOf(value)){
            tmp.push('<div class="stations__item">' + data[i] + '</div>');
          }
        }

        stations.style.cssText = 'display: inline-block;';
        stations.innerHTML = tmp.sort(sort).join('');

        var width = stations.offsetWidth + 40;//(40) scrollbar width

        stations.style.cssText = ['-webkit-columns:', width, 'px auto;', '-moz-columns:', width, 'px auto;', 'columns:', width, 'px auto;'].join('');
      }

      var promise;
      var timeout;

      function getStations(){
        if(direction == 'arrival'){
          if(!scope.$root.direction[0]){
            return inputs[0].focus();
          }
          promise = ticketService.getArrivals({busStopId: scope.$root.direction[0].busStopId});
          scope.$root.stations.title = 'Станции прибытия для ' + scope.$root.direction[0].name;
        }else{
          promise = ticketService.getDepartures();
          scope.$root.stations.title = 'Станции отправления';
        }

        scope.$root.stations.loading = true;
        scope.$applyAsync();

        timeout = setTimeout(function(){
          stations.innerHTML = '';
        }, 100);

        promise.then(function(result){
          data = {};
          clearTimeout(timeout);
          scope.$root.stations.loading = false;
          result.forEach(function(item){
            if(item.name && item.id){
              item.busStopId = item.id;
              item.toString = function(){
                return this.name;
              };
              data[item.name] = item;
            }
          });
          filter('');
        });
      }

      angular.element(stations).on('mousedown', function(e){
        var item = data[e.target.innerText];
        if(!item) return;

        scope.$applyAsync(function(){
          switch (direction) {
            case 'departure':
              scope.$root.direction[0] = item;
              scope.$root.direction[1] = null;
              //inputs[1].focus();
              break;
            case 'arrival':
              scope.$root.direction[1] = item;
          }
        });
      });

    }
  };
});
