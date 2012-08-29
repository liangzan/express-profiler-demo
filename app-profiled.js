var express = require('express')
  , profiledRouter = require('./lib/router');

var app = express();
app._router = profiledRouter.override(app._router);

var response = function(req, res) {
  setTimeout(function() {
    res.send('this response took 1.5 seconds');
  }, 1500);
};

app.get('/', response);

app.listen(3000);
console.log('Server started at port 3000');