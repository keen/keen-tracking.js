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
  extend(Keen.Client.prototype, {
    // 'deferEvent'   : require('./deferEvent'),
    // 'deferEvents'  : require('./deferEvents'),
    // 'extendEvent'  : require('./extendEvent'),
    // 'extendEvents' : require('./extendEvents'),
    'recordEvent'  : require('./recordEvent'),
    'recordEvents' : require('./recordEvents')
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
    'each'       : require('./utils/each'),
    'extend'     : extend,
    'parseParams': require('./utils/parseParams')
  });

  // ------------------------
  // Process async queue
  // ------------------------
  // ...

  module.exports = Keen;
  return Keen;
});
