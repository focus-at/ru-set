(function(module){
  module.factory('timestampMarker', function() {
      var timestampMarker = {
          request: function(config) {
              config.requestTimestamp = new Date().getTime();
              //console.log('req !', config)
              return config;
          },
          response: function(response) {
              response.config.responseTimestamp = new Date().getTime();
              //console.log('response !', response)
              return response;
          }
      };
      return timestampMarker;
  });

//TODO при канц"timeout":{"$$state":{"status":1,"processScheduled":false}}

  module.factory('Passengers', function($window, ticketService){
    var storage = 'localStorage';
    var data = JSON.parse($window[storage].getItem('passengers')) || {
      passengers: {adult: [], child: []},
      info: {count: 0, price: 0},
      recipientList: []
    };

    return {
      init: function(params){
        this.params = params;
        var _this = this;
        return angular.extend(this.params, data.info.count ? this.get(function(item, index, type, info){
          var tariffs = _this.params.tariffs[type];
          if(!tariffs || _this.checkCount(info.count)) return;
          //!tariffCode
          if(!tariffs.list[item.tariffCode]){
            item.tariffCode = tariffs.default.tariffCode;
          }
          //!documentTypeCode
          if(!_this.params.docType.list[item.documentTypeCode]){
            item.documentTypeCode = _this.params.docType.default.docTypeCode;
          }
          //update seatNumber
          item.seatNumber = _this.freeSeat();
          //update price
          info.count++;
          info.price += +tariffs.list[item.tariffCode].price.value;
          return true;
        }) : this.add('adult'));
      },
      checkCount: function(count){
        if((this.params.seatNumbers && this.params.seatNumbers.length == count) || (this.params.freeSeatsCount && this.params.freeSeatsCount - count <= 0)){
          return 'Не осталось свободных мест';
        }else if(count == this.params.maxPassengers){
          return 'На этот рейс не допускается больше ' + count + ' пассажиров в одном заказе';
        }
      },
      freeSeat: function(value, oldvalue){
        if(!value && !oldvalue){
          for(value in this.params.seats){
            if(this.params.seats[value] === false){
              this.params.seats[value] = true;
              return value;
            }
          }
        }else{
          if(value){
            this.params.seats[value] = true;
          }
          if(oldvalue){
            this.params.seats[oldvalue] = false;
          }
          return value;
        }
      },
      get: function(filter){
        if(filter){
          var info = {count: 0, price: 0};
          var type;
          for(type in data.passengers){
            data.passengers[type] = data.passengers[type].filter(function(item, index){
              return filter(item, index, type, info);
            });
          }
          //TODO MOVE TO INIT?
          angular.extend(data.info, info);
        }
        return data;
      },
      add: function(type, callback){
        var error = this.checkCount(data.info.count);
        if(error && callback) return callback(error);
        data.passengers[type].push({
          gender: 'm', // default
          birthdate: null,
          birthPlace: null,
          documentTypeCode: this.params.docType.default.docTypeCode || null,
          tariffCode: this.params.tariffs[type].default.tariffCode || null,
          seatNumber: this.freeSeat(), /*или null, +при выборе из попапа тоже null*/
          documentNumber: null,
          countryCode: 'RU'
        });
        data.info.count++;
        data.info.price += +this.params.tariffs[type].default.price.value;
        return data;
      },
      delete: function(type, index){
        if(this.params.passengers[type].length > {adult: 1, child: 0}[type]){
          var deleted = index !== undefined ? data.passengers[type].splice(index, 1)[0] : data.passengers[type].pop();
          data.info.count--;
          data.info.price -= +this.params.tariffs[type].list[deleted.tariffCode].price.value;//update price
          this.params.seats[deleted.seatNumber] = false;  //update free seat
        }
      },
      save: function(){
        $window[storage].setItem('passengers', JSON.stringify(data));
        //TODO return data winhout info
        return {passengers: data.passengers, recipientList: data.recipientList};
      }
    };
  });

  module.factory('ticketService', function($http, $filter, $q, $timeout, countries, config, $log){
    var APIURL = config.apiHost;//move to provider ?
    var tickerTimeout;
    var api = {
      run: null,
      book: {booking: null},
      cancelers: {},
      canceler: function(key){
        if(this.cancelers[key]){
          this.cancelers[key].resolve();
        }
        this.cancelers[key] = $q.defer();
        return this.cancelers[key].promise;
      },
      resolve: function(res){
        if(res.data.error || !res.data.data){
          return $q.reject(res.data);
        }else{
          return res.data.data;
        }
      },
      reject: function(res){
        var config = res.config;
        if(config && config.timeout && !config.timeout.$$state.status){
          $log.error('api-http-error', JSON.stringify(res));
        }
        return $q.reject(res);
      },
      getBusStops: function(params){
        params.name = params.name.toLowerCase();
        //@name, token
        //canceler?
        return $http.get(APIURL + '/places/suggest-bus-stops', {params: params, cache: true}).then(this.resolve).then(function(data){
          var res = {
            value: params.name,
            items: []
          };

          function add(item){
            item.geo = [];
            if(item.geoPoint) item.geo.push(item.geoPoint);
            if(item.region) item.geo.push(item.region);
            if(item.country) item.geo.push(item.country);
            res.items.push(item);
          }

          data.forEach(function(item, index){
            add(item);
            item.childList.forEach(function(item, index){
              item.child = true;
              add(item);
            });
            delete item.childList;
          });

          return res;
        }, this.reject);
      },
      getBusStopsById: function(params){
        //@busStopId, token
        return $http.get(APIURL + '/places/get-bus-stop-by-id', {params: params, cache: true}).then(this.resolve, this.reject).then(function(station){
          station.toString = function(){
            return this.name;
          };
          return station;
        });
      },
      getDepartures: function(){
        return $http.get(APIURL + '/places/get-departures', {cache: true}).then(this.resolve, this.reject).then(function(stations){
          return stations;
        });
      },
      getArrivals: function(params){
        //@id
        return $http.get(APIURL + '/places/get-arrivals', {params: params, cache: true}).then(this.resolve, this.reject).then(function(stations){
          return stations;
        });
      },
      getRuns: function(params, cache){
        //@params{departure:id, arrival:id, date:'yyyy-mm-dd'}
        return $http.get(APIURL + '/booking/get-runs', {params: params, timeout: this.canceler('runs'), cache: cache}).then(this.resolve).then(function(data){
          if(!data.runs){
            $log.info(JSON.stringify({'Нет рейсов reject': params}));
            return $q.reject({error: {description: 'Нет рейсов'}});
          }else if(!data.runs.length){
            $log.info(JSON.stringify({'Нет рейсов': params}));
          }

          data.counts = {
            free: {
              value: true,
              count: 0
            },
            all: {
              value: false,
              count: data.runs.length
            }
          };

          data.runs.forEach(function(run, index){
            var parts = {
              tariff: 0,
              commission: 0
            };
            if(run.freeSeatsCount){
              data.counts.free.count++;
            }
            run.price.parts.forEach(function(part){
              parts[({Tariff: 'tariff'})[part.type] || 'commission'] += part.value;
            });
            run.price.parts = parts;
          });

          return data;
        }, this.reject);
      },
      getRunRoute: function(params){
        return $http.get(APIURL + '/booking/get-run-route', {params: params, cache: true}).then(this.resolve, this.reject).then(function(route){
          if(route.points){
            var filter = $filter('onNextDay');
            route.points.forEach(function(item, index){
              var prev = route.points[index - 1];
              /*TODO remove split if backend FIXED*/
              if(item.departureDate){
                item.departureDate = item.departureDate.split('.').reverse().join('-');
              }
              if(item.arrivalDate){
                item.arrivalDate = item.arrivalDate.split('.').reverse().join('-');
              }
              if(prev){
                if(prev.departureDate){
                  prev.departureDate = prev.departureDate.split('.').reverse().join('-');
                }
                if(prev.arrivalDate){
                  prev.arrivalDate = prev.arrivalDate.split('.').reverse().join('-');
                }
              }
              //delimiters for mobile
              item.onNextDay = filter(item.departureDate || item.arrivalDate, (prev && (prev.departureDate || prev.arrivalDate)));
            });
          }
          return route;
        });
      },
      getBookParams: function(params){
        //@params{departure:id, arrival:id, date:'yyyy-mm-dd', id}
        return $http.get(APIURL + '/booking/get-book-params', {params: params, timeout: this.canceler('params')}).then(this.resolve).then(function(data){

          if(!data.seatNumbers && !data.autoSeatSelection){
            return $q.reject({error: {description: 'Нет свободных мест'}});
          }

          data.countries = countries;
          data.tariffs = {};
          data.seats = {};

          //noop
          data.documentType = $filter('orderBy')(data.documentType, function(item){
            return {'PR': -3, 'SR': -2, 'ZP': -1}[item.docTypeCode] || 0;
          });

          data.docType = {
            default: data.documentType[0],
            list: {}
          };

          data.documentType.forEach(function(item, index){
            data.docType.list[item.docTypeCode] = item;
          });

          data.tariff.forEach(function(item, index){
            var type = item.type.toLowerCase();
            if(!data.tariffs[type]){
              data.tariffs[type] = {
                default: item,
                list: {}
              };
            }
            data.tariffs[type].list[item.tariffCode] = item;
          });

          delete data.tariff;
          delete data.documentType;

          (data.seatNumbers || []).forEach(function(item){
            data.seats[item] = false;
          });

          return data;
        }, this.reject);
      },
      bookOrder: function(params, callback){
        //TODO CANCELER
        angular.copy(params.recipientList).forEach(function(item, index){
          item.phone = item.phone.replace(/[^0-9]/g, '');
        });

        params.passengerList = [];
        angular.forEach(angular.copy(params.passengers), function(item, index){
          item.forEach(function(item, index){
            item.birthdate = item.birthdate.split('.').reverse().join('-');
            if(item.documentTypeCode != 'IP'){
              item.countryCode = 'RU';
            }
            if(!item.seatNumber){
              item.seatNumber = null;
            }
            params.passengerList.push(item);
          });
        });

        delete params.passengers;

        this.book.booking = null;
        return $http.post(APIURL + '/booking/book-order', params, {timeout: this.canceler('book-order')}).then(this.resolve, this.reject).then(function(booking){
          if(booking){
            var parts = {tariff: 0, commission: 0};

            booking.orders[0].data.orderPrice.pricePart.forEach(function(part){
              parts[({Tariff: 'tariff'})[part.type] || 'commission'] += part.value;
            });

            booking.orders[0].data.orderPrice.pricePart = parts;

            booking.seatChanged = 0;
            booking.orders[0].data.tickets.forEach(function(item){
              if(item.seatChanged) booking.seatChanged++;
              for(var i = 0; i < item.ticketPrice.pricePart.length; i++){
                if(item.ticketPrice.pricePart[i].type == 'Tariff'){
                  item.price = item.ticketPrice.pricePart[i].value;
                  break;
                }
              }
            });
          }
          return booking;
        });
      },
      ticker: function(booking, callback){
        var time = booking ? new Date().valueOf() + booking.expireSeconds * 1000 : 0;
        $timeout.cancel(tickerTimeout);
        (function tick(){
          if(booking){
            if(booking.expireSeconds > 0){
              booking.expireSeconds = Math.floor((time - new Date()) /  1000);
              tickerTimeout = $timeout(tick, 1000);
            }else if(callback && api.book.booking && api.book.booking.bookingId == booking.bookingId){
              callback();
            }
          }
        })();
        return $q.when(booking);
      },
      getPaymentList: function(id){
        return $http.get(APIURL + '/booking/get-payment-list', {params: {id: id}, timeout: this.canceler('payment-list')}).then(this.resolve, this.reject).then(function(data){
          return {paymentList: data, paymentIndex: 0};
        });
      },
      initPayment: function(){
        var params = {
          bookingId: this.book.booking.bookingId,
          paymentSystemId: this.book.booking.paymentList[this.book.booking.paymentIndex].paymentSystemId
        };
        if(config.baseUrl){
          params.baseUrl = decodeURIComponent(config.baseUrl);
        }
        return $http.get(APIURL + '/booking/init-payment', {params: params, timeout: this.canceler('payment-init')}).then(this.resolve, this.reject);
      },
      getBooking: function(params){
        return $http.post(APIURL + '/cabinet/get-booking', params, {timeout: this.canceler('get-booking')}).then(this.resolve, this.reject).then(function(booking){
          if(booking){
            var parts = {
              tariff: 0,
              commission: 0
            };

            booking.orders[0].data.orderPrice.pricePart.forEach(function(part){
              parts[({Tariff: 'tariff'})[part.type] || 'commission'] += part.value;
            });

            booking.orders[0].data.orderPrice.pricePart = parts;

            booking.orders[0].data.tickets.forEach(function(item){
              for(var i = 0; i < item.ticketPrice.pricePart.length; i++){
                if(item.ticketPrice.pricePart[i].type == 'Tariff'){
                  item.price = item.ticketPrice.pricePart[i].value;
                  break;
                }
              }
            });
          }
          return booking;
        });
      },
      getPaymentStatus: function(params){
        return $http.get(APIURL + '/cabinet/get-payment-status', {params: params}).then(this.resolve, this.reject).then(function(data){
          return data.description;
        });
      }
    };
    return api;
  });
})(angular.module('app.services', ['app.values']));
