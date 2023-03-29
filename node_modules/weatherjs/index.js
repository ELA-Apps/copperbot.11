
  /**
  * Get the weather from lat an lng http://api.openweathermap.org/data/2.5/find?lat=55.5&lon=37.5&cnt=10
  */
var Promisenode = require('promise');
var http = require('http');
var sys = require('sys');
var events = require('events');

module.exports.weather = (function() {

  var Weather = Object.create(events.EventEmitter.prototype);

  Weather.init = function init(lat, lng) {
    this.options = {
      host: 'api.openweathermap.org',
      path: '/data/2.5/find?cnt=1&units=metric' + '&lat='+lat+'&lon='+lng,
    };

    events.EventEmitter.call(this);
  };

  function callback(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      //console.log(str);
      // Process response
      try{
        var data = JSON.parse(str);
        var info = data.list[0];
        var result = {
          name: info.name,
          ts: Date.now(),
          position: info.coord,
          temperature: {
            current: info.main.temp,
            max: info.main.temp_max,
            min: info.main.temp_min
          },
          wind: info.wind,
          pressure: info.main.pressure,
          humidity: info.main.humidity
        };
        this.success(result);
      }catch(ex){
        console.log("Weather Json Error", ex);
        this.error(ex);
      }
    }.bind(this));
  }

  function runQuery() {
    var req = http.request(this.options, callback.bind(this));
    req.on('error', function(e){
      console.log('Error weather', e);
      this.error(e);
    }.bind(this));
    req.end();
  }

  Weather.query = function query(error, success) {
    this.error = error;
    this.success = success;
    runQuery.call(this);
  };

  function emitData(data) {
    this.emit('data', data);
    console.log("emiting data", data);
  }

  function emitError(error) {
    this.emit('error', error);
    console.log("emiting error", error);
    this.closeLoop();
  }

  Weather.startLoop = function startLoop(delay){
    this.error = emitError;
    this.success = emitData;
    this.__isRunning__ = true;

    this.__loop__ = setInterval(runQuery.bind(this), delay);
  };

  Weather.closeLoop = function closeLoop() {
    if(this.__loop__)
      clearInterval(this.__loop__);
    this.emit('close');
    console.log("emiting close");
    this.__isRunning__ = false;
    this.removeAllListeners('data');
    this.removeAllListeners('error');
    this.removeAllListeners('close');
  };

  Weather.isRunning = function () {
    return this.__isRunning__ || false;
  };

  return Object.create(Weather);
}());

module.exports.weatherPromise = function(lat, lng){

  var options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/find?cnt=1&units=metric',
  };

  return new Promisenode(function(fulfill, reject){
    options.path = options.path + '&lat='+lat+'&lon='+lng;

    var callback = function(response){
      var str = '';

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        //console.log(str);
        // Process response
        try{
          var data = JSON.parse(str);
          var info = data.list[0];
          var result = {
            name: info.name,
            ts: Date.now(),
            position: info.coord,
            temperature: {
              current: info.main.temp,
              max: info.main.temp_max,
              min: info.main.temp_min
            },
            wind: info.wind,
            pressure: info.main.pressure,
            humidity: info.main.humidity
          };
          fulfill(result);
        }catch(ex){
          console.log("Weather Json Error", ex);
          reject(ex);
        }
      });
    };
    var req = http.request(options, callback);
    req.on('error', function(e){
      console.log('Error weather', e);
      reject(e);
    });
    req.end();
  });
};
