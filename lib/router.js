var microtime = require('microtime');

var router = exports;

/**
 * Returns a profiled Router that can be used to replace
 * Express's router
 *
 * @public
 * @param {Object} expressRouter - The original Router object
 *                                 from Express
 * @return {Object} a profiled router
 */
router.override = function(expressRouter) {
    function Router(options) {
    options = options || {};
    var self = this;
    this.map = {};
    this.params = {};
    this._params = [];
    this.caseSensitive = options.caseSensitive;
    this.strict = options.strict;
    this.middleware = function router(req, res, next){
      self._profiledDispatch(req, res, next);
    };
  }

  Router.prototype = expressRouter;
  Router.prototype._profiledDispatch = router._profiledDispatch;

  return new Router();
};

/**
 * This function is the same as the dispatch function
 * in express's router
 *
 * We replace the send function of response
 * in order to track the request to response
 * time.
 *
 * @public
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Object} next - The next object
 * @return {Object} The wrapped dispatch function
 */
router._profiledDispatch = function(req, res, next){
  var self = this;

  // replacing the send function
  var originalSend = res.send;
  var trackedSend = doWrap(trackAfter(req.url), originalSend);
  res.send = trackedSend;

  return self._dispatch(req, res, next);
};


/**
 * Performs the alias method chain for the original function
 *
 * @private
 * @param {function} afterFunc - The tracker function
 * @param {function} func - The original function
 * @return {function} wrapped function
 */
function doWrap(afterFunc, func) {
  var beforeTimestamp = microtime.now();
  return function() {
    var result = func.apply(this, arguments);
    afterFunc(beforeTimestamp);
    return result;
  };
}

/**
 * Returns a function that runs when the original function ends
 * sends out a request to the server with the event data
 *
 * @private
 * @param {string} url
 * @return {function} track function
 */
function trackAfter(url) {
  return function(beforeTimestamp) {
    var timeSpan = (microtime.now() - beforeTimestamp) / 1000;
    console.log('url: ' + url + ' time taken: ' + timeSpan + 'ms');
  };
}
