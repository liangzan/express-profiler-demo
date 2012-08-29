var express = require('express')
  , microtime = require('microtime');

var app = express();

var response = function(req, res) {
  var startTime = microtime.now();

  setTimeout(function() {
    var endTime = microtime.now();
    var timeDifference = (endTime - startTime) / 1000;
    res.send('this response took about ' + timeDifference + ' milliseconds');
  }, 1000);
};

app.get('/', response);

app.listen(3000);
console.log('Server started at port 3000');