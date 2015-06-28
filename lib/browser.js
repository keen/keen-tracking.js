;(function (f) {
  // RequireJS
  if (typeof define === 'function' && define.amd) {
    define('keen', [], function(){ return f(); });
  }
  // CommonJS
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = f();
  }
  // Global
  var g = null;
  if (typeof window !== 'undefined') {
    g = window;
  } else if (typeof global !== 'undefined') {
    g = global;
  } else if (typeof self !== 'undefined') {
    g = self;
  }
  if (g) {
    g.Keen = f();
  }
})(function() {
  'use strict';

  var Keen = require('./');
  var extend = require('./utils/extend');

  // ------------------------
  // Methods
  // ------------------------
  extend(Keen.Client.prototype, require('./record-events-browser'));
  extend(Keen.Client.prototype, require('./defer-events'));
  extend(Keen.Client.prototype, require('./extend-events'));

  // ------------------------
  // Helpers
  // ------------------------
  extend(Keen.helpers, {
    'getBrowserProfile'  : require('./helpers/getBrowserProfile'),
    'getDatetimeIndex'   : require('./helpers/getDatetimeIndex'),
    'getDomEventProfile' : require('./helpers/getDomEventProfile'),
    'getDomNodePath'     : require('./helpers/getDomNodePath'),
    'getScreenProfile'   : require('./helpers/getScreenProfile'),
    'getUniqueId'        : require('./helpers/getUniqueId'),
    'getWindowProfile'   : require('./helpers/getWindowProfile')
  });

  // ------------------------
  // Utils
  // ------------------------
  extend(Keen.utils, {
    'cookie'     : require('./utils/cookie'),
    'deepExtend' : require('./utils/deepExtend'),
    'each'       : require('./utils/each'),
    'extend'     : extend,
    'parseParams': require('./utils/parseParams'),
    'timer'      : require('./utils/timer')
  });

  // ------------------------
  // Process async queue
  // ------------------------
  // ...

  Keen.noConflict = function(){
    root.Keen = previousKeen;
    return Keen;
  };

  Keen.ready = function(fn){
    if (Keen.loaded) {
      fn();
    }
    else {
      Keen.once('ready', fn);
    }
  };

  domReady(function(){
    Keen.loaded = true;
    Keen.emit('ready');
  });

  function domReady(fn){
    if (Keen.loaded || 'undefined' === typeof document) {
      fn();
      return;
    }
    // Firefox 3.5 shim
    if(document.readyState == null && document.addEventListener){
      document.addEventListener("DOMContentLoaded", function DOMContentLoaded(){
        document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
        document.readyState = "complete";
      }, false);
      document.readyState = "loading";
    }
    testDom(fn);
  }

  function testDom(fn){
    if (/in/.test(document.readyState)) {
      setTimeout(function(){
        testDom(fn);
      }, 9);
    }
    else {
      fn();
    }
  };

  module.exports = Keen;
  return Keen;
});
