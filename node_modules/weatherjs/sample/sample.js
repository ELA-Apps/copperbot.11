var weather = require('../index').weather;
var weatherPromise = require('../index').weatherPromise;

weather.init(38.032024, -1.124372);

weather.query(function(error){
  console.log("Query error", error);
},function(data){
  console.log("Query ok", data);
});

weatherPromise(38.032024, -1.124372).then(function(data){
  console.log("Promise ok", data);
}, function(error){
  console.log("Promise error", error);
});

weather.on('data', function(data) {
  console.log("Event data", data);
});

weather.on('error', function(error) {
  console.log("Event error", error);
});

weather.on('close', function() {
  console.log("Event close");
});

weather.startLoop(1000);

setTimeout(weather.closeLoop.bind(weather), 15000);
