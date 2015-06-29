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
  var listenTo = require('./browser-events');

  // ------------------------
  // Methods
  // ------------------------
  extend(Keen.Client.prototype, require('./record-events-browser'));
  extend(Keen.Client.prototype, require('./defer-events'));
  extend(Keen.Client.prototype, {
    'extendEvent': require('./extend-events').extendEvent,
    'extendEvents': require('./extend-events').extendEvents
  });

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
  // DOM Event Listener
  // ------------------------
  Keen.listenTo = listenTo(Keen);

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


  // IE-specific polyfills, yay!
  // -----------------------------
  if (!Array.prototype.indexOf){
    Array.prototype.indexOf = function(elt /*, from*/) {
      var len = this.length >>> 0;

      var from = Number(arguments[1]) || 0;
      from = (from < 0)
           ? Math.ceil(from)
           : Math.floor(from);
      if (from < 0)
        from += len;

      for (; from < len; from++) {
        if (from in this &&
            this[from] === elt)
          return from;
      }
      return -1;
    };
  }

  module.exports = Keen;
  return Keen;
});
