(function(angular){
  var app = angular.module('app', ['app.services', 'app.filters', 'app.directives', 'app.config', 'smoothScroll']);

  app.value('$anchorScroll', angular.noop);

  app.config(function($locationProvider, $compileProvider, $httpProvider, $logProvider, $provide, config){
    $logProvider.debugEnabled(!!config.debug);
    $compileProvider.debugInfoEnabled(true);//!config.debug
    $locationProvider.html5Mode(!config.baseUrl).hashPrefix('!');
    $httpProvider.useApplyAsync(true);
    //$httpProvider.interceptors.push('timestampMarker');//test
    $httpProvider.defaults.headers.common.Authorization = 'Bearer ' + config.token;
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  });

  app.controller('MainCtrl', function($rootScope, $location, $timeout, $q, $window, $log, $sce, $document, ticketService, config, Passengers, smoothScroll){

    var _this = $rootScope;

    var pageView = (function(){
      var timeout;
      return {
        set: function(title){
          timeout = setTimeout(function(){
            document.title = title;
            if($window.ga){
              $window.ga('send', 'pageview', {
                'page': document.referrer ? document.location.hash : document.location.pathname,
                'title': title
              });
            }
          }, 300);
          return title;
        },
        clear: function(){
          clearTimeout(timeout);
          return this;
        }
      };
    })();

    //_this.ab = 'header';
    _this.logo = config.siteLogo;
    _this.direction = [null, null];
    _this.runs = null;
    _this.bookParams = null;
    _this.app = ticketService.book;

    function errorHandler(res, noback){
      if(res.config && res.config.timeout && res.config.timeout.$$state.status) return;
      _this.$emit('notification', {type: 'error', text: res.status === 0 ? null : res.error && res.error.description || 'Ошибка загрузки данных'});
      loader();
      if(!noback){
        _this.$emit('submit', {index: -1});
      }
    }

    function resetData(index){
      var key = ['direction', 'runs', 'bookParams', 'booking'][index];
      if(key){
        if(key == 'direction'){
          _this.direction = [null, null];
        }else{
          if(key == 'bookParams' && _this.bookParams){
            Passengers.save();
            _this.bookParams = null;
          }else if(key == 'booking'){
            ticketService.book.booking = null;
          }else{
            _this[key] = null;
          }
        }
        resetData(index + 1);
      }
    }

    function loader(html){
      _this.loader = html ? $sce.trustAsHtml(html) : 0;
    }

    _this.$on('loader', function(e, params){
      loader(params);
    });

    var route;
    _this.$on('$locationChangeStart', function(e, newvalue, oldvalue){
      var oldroute = (route || []).slice();

      route = ($location.path() || '/').split('/');
      route = route.slice(!route[1] ? 2 : 1);

      _this.query = {
        departure: null,
        arrival: null,
        date: route[1],
        runId: route[2]
      };

      pageView.set('Маршрут поездки');

      if(route[0] == 'payment'){
        _this.phone = route[3];
        _this.query.payment = route[1];
        return pageView.clear().set({success: 'Успешная покупка', fail: 'Ошибка покупки'}[_this.query.payment]);
      }else if(route.join('#') == oldroute.join('#')){
        return false;
      }else if(route.length <= oldroute.length){
        var i;
        for(i in ticketService.cancelers){
          ticketService.cancelers[i].resolve();
        }
        for(i = 0; i < oldroute.length; i++){
          if(route[i] != oldroute[i]){
            resetData(i);
            break;
          }
        }
      }

      //TODO перенести loader:hide в скролл
      var directions = ['departure', 'arrival'];
      var calendarEl;

      $q.all((route[0] || '+').split('+').map(function(id, index){
        if(!id) return $q.reject();
        pageView.clear().set('Маршрут поездки');
        return ticketService.getBusStopsById({busStopId: id}).then(function(station){
          _this.direction[index] = station;
          return (_this.query[directions[index]] = station.busStopId);
        });
      }))
      .then(function(query){
        //LOAD RUNS
        loader();
        if(query.length == 2){
          pageView.clear().set('Выбор даты');
          _this.header = {
            departure: _this.direction[0].name,
            arrival: _this.direction[1].name
          };
          if(!calendarEl){
            calendarEl = document.getElementById('calendar');
            if(calendarEl){
              smoothScroll(calendarEl, {offset: 100});
            }
          }
          if(_this.query.date == oldroute[1] && route[0] == oldroute[0]) return _this.query;
          if(_this.query.date){
            pageView.clear();
            loader('Ищем рейсы<br/>Это может занять до 1 минуты<br/>Пожалуйста, подождите...');
            return ticketService.getRuns(_this.query).then(function(data){
              pageView.set('Список рейсов');
              loader();
              _this.runs = data;
              return _this.query;
            }, errorHandler);
          }
        }
      })
      .then(function(query){
        //LOAD RUN PARAMS
        if(query && query.runId){
          pageView.clear();
          loader('Загружаем свободные места и тарифы...');
          return ticketService.getBookParams(query)
          .then(function(bookParams){
            pageView.set('Регистрация пассажиров');
            _this.bookParams = Passengers.init(angular.extend(bookParams, {freeSeatsCount: ticketService.run.freeSeatsCount, maxPassengers: ticketService.run.maxPassengers}));
            loader();
          }, errorHandler);
        }
      });
    });

    _this.$on('submit', function(e, params){
      $timeout(function(){
        var form = e.targetScope.$$childHead && e.targetScope.$$childHead.form || {$invalid: false, $name: 'unknown'};
        var name = form.$name;
        if(!form.$invalid){
          form.loader = true;//TODO update unknown forms for loader ?
          switch(name){
            case 'header':
              if(_this.query.date){
                $location.path([_this.direction[0].busStopId, _this.direction[1].busStopId].join('+') + '/' + _this.query.date);
              }
              break;
            case 'direction':
              if(_this.direction[0] && _this.direction[1]){
                $location.path([_this.direction[0].busStopId, _this.direction[1].busStopId].join('+'));
              }else{
                $log.error('busStopId: ', _this.direction[0], _this.direction[1]);
              }
              break;
            case 'registration':
              loader('Бронирование<br/>Это может занять до 1 минуты<br/>Пожалуйста, подождите...');
              ticketService.bookOrder(angular.extend(_this.query, Passengers.save()))
              .then(function(booking){
                return ticketService.ticker(booking, function(){
                  if(!form.loader){
                    _this.$emit('notification', {type: 'error', text: 'Время резервирования истекло, попробуйте забронировать билеты снова'});
                    ticketService.book.booking = null;
                  }
                });
              })
              .then(function(booking){
                if(!booking) return;
                return ticketService.getPaymentList(booking.bookingId).then(function(paymentList){
                  pageView.set('Подтверждение');
                  form.loader = false;
                  loader();
                  ticketService.book.booking = angular.extend(booking, paymentList);
                  if(booking.seatChanged) _this.$emit('notification', {type: '', text: 'Обратите внимание, ' + booking.seatChanged == 1 ? 'номер места изменился!' : 'номера мест изменились!'});
                });
              }).catch(function(res){
                errorHandler(res, true);
              });
              break;
            case 'confirm':
              ticketService.initPayment().then(function(data){
                _this.$emit('redirect', data.url);
              }, function(res){
                form.loader = false;
                ticketService.book.booking = null;//бронь не найдена(вышло время)
                errorHandler(res, true);
              });
              break;
            default:
              var newRoute = [];
              if(params){
                newRoute = route.slice(0, params.index);
                if(params.append){
                  newRoute.push(params.append);
                }
              }
              $location.path(newRoute.join('/'));
          }
        }
      });
    });

    _this.$on('redirect', function(e, params){
      $window.location = params;
    });

    _this.$on('notification', function(e, params){
      _this.error = params;
    });

    $document.on('click', function(e){
      if(e.target.className.indexOf('r-getBackLink') != -1){
        _this.$emit('submit', {index: -1});
      }
    });

    /*frame*/
    if(config.isFrame){
      var oldheight;
      var postChanges = true;
      var parent = $window.parent;
      var body = $document[0].body;

      var post = function(e, value, delay){
        $timeout(function(){
          parent.postMessage({event: e, value: value}, '*');// * to parentLocation
        });
      };
      var events = {
        path: function(value){
          $window.location.hash = '!' + value;
        },
        history: function(value){
          postChanges = false;
          $window.history.go(value);
        },
        emit: function(obj){
          _this.$emit(obj.e, obj.params);
        }
      };

      //subscribe postMessage
      $window.addEventListener('message', function(e){
        if(config.baseUrl.indexOf(e.origin) != -1 && events[e.data.event]){
          events[e.data.event](e.data.value);
        }
      }, false);

      _this.$on('$locationChangeSuccess', function(){
        if(postChanges){
          post('hash', $location.path());
        }else{
          postChanges = true;
        }
      });

      _this.$on('notification', function(e, params){
        $timeout(function(){
          post('notification', params ? $document[0].getElementById('notification').outerHTML : '');
        }, 100, false);
      });

      _this.$on('popup', function(e, params){
        post('overlay', params ? 'block' : 'none');
      });

      _this.$on('popup:offset', function(e, top){
        $document[0].querySelector('.r-popup').style.cssText = 'top:' + top + 'px; -webkit-transform: translate(-50%, 0); transform: translate(-50%, 0); box-sizing: border-box; max-height: ' + $window.screen.availHeight + 'px';
      });

      _this.$watchCollection('header.departure + header.arrival', function(newvalue, oldvalue){
        if(newvalue != oldvalue){
          $timeout(function(){
            post('header', $document[0].querySelector('.r-topBar').outerHTML);
          }, 100, false);
        }
      });

      _this.$on('back', function(){
        _this.$emit('submit', {index: -1});
      });

      _this.$on('redirect', function(e, params){
        parent.location = params;
      });

      setInterval(function(){
        var height = body.scrollHeight;
        if(oldheight != height){
          oldheight = height;
          post('resize', height);
        }else if(height != (body.scrollTop + body.clientHeight)){
          post('resize', $document[0].documentElement.scrollHeight);
        }
      }, 32);
    }

  });
})(angular);
