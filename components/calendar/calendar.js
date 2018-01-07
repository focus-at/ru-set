angular.module('app').directive('calendar', function(ticketService){
  return {
    restrict: 'C',
    scope: {
      limit: '@',
      date: '='
    },
    templateUrl: 'calendar/calendar.html',
    link: function(scope, element, attr){

      element.on('mousedown', function(e){
        var date = e.target.getAttribute('data-date');
        if(date){
          scope.$applyAsync(function(){
            scope.date = date;
          });
        }
      });

      element.on('submit', function(e){
        scope.$emit('submit', {index: 1, append: scope.date});
      });

      var limitOfDays = attr.limit;

      function fill(date){
        var d = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
        var limit = new Date(d[0], d[1], 0).getDate() + 1;
        var item = this[d.join('-')] = [];
        var offset = date.getDay();

        for(offset  = offset ? offset - 1 : 6; offset--;){
          item.push(0);
        }

        for(; limitOfDays && (+d[2] < limit); d[2]++, limitOfDays--){
          d[1] = +d[1] < 10 ? '0' + (+d[1]) : d[1];
          d[2] = +d[2] < 10 ? '0' + (+d[2]) : d[2];
          item.push({fulldate: d.join('-'), date: +d[2]});
        }

        if(limitOfDays){
          fill.call(this, new Date(d[0], d[1]));
        }
        return this;
      }

      scope.today = new Date();
      scope.months = fill.call({}, scope.today);
    }
  };
});
