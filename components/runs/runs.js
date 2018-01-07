angular.module('app').directive('runs', function(ticketService, $filter, $timeout){
  return {
    restrict: 'C',
    scope: {
      runs: '=ngIf',
      id: '='
    },
    templateUrl: 'runs/runs.html',
    link: function(scope, element, attr){
      element.on('click', function(e){
        var id = e.target.getAttribute('data-item-id') || e.target.parentNode.getAttribute('data-item-id');
        if(id){
          scope.$applyAsync(function(){
            scope.id = id;
          });
        }
      });

      element.on('submit', function(){
        scope.$emit('submit', {index: 2, append: scope.id});
      });

      scope.sort = 'departureDateTime';
      scope.changeSort = function(value){
        if(scope.sort.indexOf(value) != -1){
          scope.sort = (scope.sort.charAt(0) == '-') ? value : '-' + value;
        }else{
          scope.sort = value;
        }
      };
      scope.sorter = function(item){
        var value;
        if(scope.sort.indexOf('price') != -1){
          value = item.price.value;//.replace('.', '');
        }else{
          value = item[scope.sort.replace('-', '')];
          if(scope.sort.indexOf('DateTime') != -1){
            value = value ? new Date(value).getTime() : null;
          }
        }
        return !value ? Infinity : parseInt((scope.sort.charAt(0) == '-' ? '-' : '') + value);
      };

      scope.filter = {free: false};
      scope.applyFilters = function() {
        var counts = {cheapest: 0, fastest: 0};
        var data = $filter('filter')(scope.runs.runs, function(item){
          var time = item.timeInWay;
          var price = +item.price.value;

          //fastest
          if(time && time <= scope.isFastest){
            counts.fastest++;
            if(time < scope.isFastest){
              scope.isFastest = time;
            }
          }

          //cheapest
          if(price <= scope.isCheapest){
            counts.cheapest++;
            if(price < scope.isCheapest){
              scope.isCheapest = price;
            }
          }

          return scope.filter.free ? !!item.freeSeatsCount : true;
        });

        var len = data.length;

        if(counts.fastest == len){
          scope.isFastest = 0;
        }
        if(counts.cheapest == len){
          scope.isCheapest = 0;
        }

        scope.filteredData = data;
      };

      scope.open = function(item){
        item.open = !item.open;
      };

      scope.loadRoute = function(item){
        if(!item.route){
          item.route = {loading: true};
          ticketService.getRunRoute({runId: item.runId, date: item.departureDateTime}).then(function(route){
            item.route = route;
          }, function(){
            item.route = null;
          });
        }
      };

      scope.isFastest = Infinity;
      scope.isCheapest = Infinity;
      scope.isOptimal = [scope.isFastest, scope.isCheapest];

      scope.$watch('runs', scope.applyFilters);
      scope.$watch('id', function(newvalue, oldvalue){
        //при каждой загрузке если есть id ставить флаги
        scope.runs.runs.forEach(function(item, index){
          if(item.open){
            item.open = null;
          }
          if(oldvalue == item.runId){
            item.active = null;
          }
          if(newvalue == item.runId){
            scope.open(item);
            item.active = true;
            ticketService.run = item;
          }
        });
      });
/*
      !! try this
      scope.$on('$destroy', function(e, param){
        //if param > value clear
        scope.$destroy();
      });
      */
    }
  };
});
