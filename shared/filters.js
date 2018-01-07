(function(module){

  module.filter('dateFromString', function($filter) {
    return function(input, params) {
      //Date.apply(null, ['2015', '05', '08'])
      return $filter('date')(new Date(input.replace(/-/g, '/')), params);
    };
  });

  module.filter('onNextDay', function(){
    return function(curr, prev){
      if(curr && prev && curr != prev){
        return (new Date(curr.split('T')[0]) - new Date(prev.split('T')[0])) / 1000 / 60 / 60 / 24;
      }
    };
  });

  module.filter('expire', function(){
    function pad(val){
      return val > 9 ? val : '0' + val;
    }
    return function(input){
      return pad(parseInt(input/60, 10)) + ':' + pad(input%60);
    };
  });

  module.filter('highlight', function($sce){
    return function(input, value){
      return $sce.trustAsHtml(input.replace(new RegExp(value, 'ig'), '<b>$&</b>'));
    };
  });

  module.filter('monthEnding', function(){
      return function(input){
        return input.replace(/ая|ря|ля|ня|та/g, function(p){
         return ({"ая": "ай", 'та': 'т'})[p] || p.slice(0, -1) + 'ь';
       });
      };
  });

  module.filter('translate', function(){
    var translate = {
      adults: 'Взрослые',
      childs: 'Дети',
      adult: 'Взрослый',
      child: 'Детский',
      from: 'Откуда',
      to: 'Куда',
      free: 'Рейсы с местами',
      all: 'Все рейсы',
      'undefined': 'Любое',
      'null': 'Любое*'
    };
    return function(input){
      return translate[input] || input;
    };
  });

  module.filter('timeInWay', function(){
    return function(input){
      var d = new Date((new Date(1970,0,1)).setMinutes(input));
      var tmp = [d.getDate() - 1, d.getHours(), d.getMinutes()];
      tmp[0] = tmp[0] ? tmp[0] + 'д' : '';
      tmp[1] = tmp[1] ? tmp[1] + 'ч' : '';
      tmp[2] = tmp[2] ? tmp[2] + 'м' : '';
      return tmp.join(' ');
    };
  });
})(angular.module('app.filters', []));
