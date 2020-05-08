(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("component-emitter"), require("keen-core"));
	else if(typeof define === 'function' && define.amd)
		define(["component-emitter", "keen-core"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("component-emitter"), require("keen-core")) : factory(root["component-emitter"], root["keen-core"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, function(__WEBPACK_EXTERNAL_MODULE__22__, __WEBPACK_EXTERNAL_MODULE__23__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 24);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = each;

function each(o, cb, s){
  var n;
  if (!o){
    return 0;
  }
  s = !s ? o : s;
  if (o instanceof Array){
    // Indexed arrays, needed for Safari
    for (n=0; n<o.length; n++) {
      if (cb.call(s, o[n], n, o) === false){
        return 0;
      }
    }
  } else {
    // Hashtables
    for (n in o){
      if (o.hasOwnProperty(n)) {
        if (cb.call(s, o[n], n, o) === false){
          return 0;
        }
      }
    }
  }
  return 1;
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/promise-polyfill/src/finally.js
/* harmony default export */ var src_finally = (function(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
});

// CONCATENATED MODULE: ./node_modules/promise-polyfill/src/index.js


// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  this._state = 0;
  this._handled = false;
  this._value = undefined;
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = src_finally;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!arr || typeof arr.length === 'undefined')
      throw new TypeError('Promise.all accepts an array');
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(values) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  (typeof setImmediate === 'function' &&
    function(fn) {
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

/* harmony default export */ var src = (Promise);

// CONCATENATED MODULE: ./node_modules/promise-polyfill/src/polyfill.js



var globalNS = (function() {
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  throw new Error('unable to locate global object');
})();

if (!globalNS.Promise) {
  globalNS.Promise = src;
} else if (!globalNS.Promise.prototype['finally']) {
  globalNS.Promise.prototype['finally'] = src_finally;
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var configDefault = exports.configDefault = {

  // defer events - queue
  // https://github.com/keen/keen-tracking.js/blob/master/docs/defer-events.md
  queue: {
    capacity: 5000,
    interval: 15
  },

  // connection problems - retry request
  retry: {
    limit: 10,
    initialDelay: 200,
    retryOnResponseStatuses: [408, 500, 502, 503, 504]
  },

  unique: false, // record only unique events?
  // if so - store unique events hashes to compare
  cache: {
    /*
      storage: 'indexeddb', // uncomment for persistence
    */
    dbName: 'keenTracking', // indexedDB name
    dbCollectionName: 'events',
    dbCollectionKey: 'hash',

    /*
      hashingMethod: 'md5', // if undefined - store as stringified JSON
    */
    maxAge: 60 * 1000 // store for 1 minute
  }
};

exports.default = configDefault;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = extend;

function extend(target){
  for (var i = 1; i < arguments.length; i++) {
    for (var prop in arguments[i]){
      target[prop] = arguments[i][prop];
    }
  }
  return target;
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keenCore = __webpack_require__(23);

var _keenCore2 = _interopRequireDefault(_keenCore);

var _each = __webpack_require__(0);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(3);

var _extend2 = _interopRequireDefault(_extend);

var _queue = __webpack_require__(8);

var _optOut = __webpack_require__(21);

var _package = __webpack_require__(7);

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_keenCore2.default.helpers = _keenCore2.default.helpers || {};
_keenCore2.default.prototype.observers = _keenCore2.default.observers || {};

// Install internal queue
_keenCore2.default.on('client', function (client) {
  client.extensions = {
    events: [],
    collections: {}
  };

  if (!client.config.respectDoNotTrack) {
    this.doNotTrack = false;
  }

  if (typeof client.config.optOut !== 'undefined') {
    (0, _optOut.setOptOut)(client.config.optOut);
    this.optedOut = client.config.optOut;
  }

  client.queue = (0, _queue.queue)(client.config.queue);
  client.queue.on('flush', function () {
    client.recordDeferredEvents();
  });
});

// Accessors
_keenCore2.default.prototype.writeKey = function (str) {
  if (!arguments.length) return this.config.writeKey;
  this.config.writeKey = str ? String(str) : null;
  return this;
};

_keenCore2.default.prototype.referrerPolicy = function (str) {
  if (!arguments.length) return this.config.referrerPolicy;
  this.config.referrerPolicy = str ? String(str) : null;
  return this;
};

// DEPRECATED
_keenCore2.default.prototype.setGlobalProperties = function (props) {
  _keenCore2.default.log('This method has been removed. Check out #extendEvents: https://github.com/keen/keen-tracking.js#extend-events');
  return this;
};

_keenCore2.default.version = _package2.default.version;

exports.default = _keenCore2.default;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var deepExtend = exports.deepExtend = function deepExtend(target) {
  for (var i = 1; i < arguments.length; i++) {
    // Copy unique items from incoming array
    if (target instanceof Array && arguments[i] instanceof Array) {
      for (var j = 0; j < arguments[i].length; j++) {
        if (target.indexOf(arguments[i][j]) < 0) {
          target.push(arguments[i][j]);
        }
      }
    }
    // Blend objects
    else {
        for (var prop in arguments[i]) {
          // Recurse when both contain objects of same name
          // and incoming is not a null object
          if (typeof target[prop] !== 'undefined' && _typeof(target[prop]) === 'object' && _typeof(arguments[i][prop]) === 'object' && arguments[i][prop] !== null) {
            deepExtend(target[prop], clone(arguments[i][prop]));
          }
          // Otherwise just copy it over...
          else if (arguments[i][prop] !== undefined && typeof arguments[i][prop] !== 'function') {
              target[prop] = clone(arguments[i][prop]);
            }
        }
      }
  }
  return target;
};

function clone(input) {
  return JSON.parse(JSON.stringify(input));
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.extendEvent = extendEvent;
exports.extendEvents = extendEvents;
exports.getExtendedEventBody = getExtendedEventBody;

var _deepExtend = __webpack_require__(5);

var _each = __webpack_require__(0);

var _each2 = _interopRequireDefault(_each);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extendEvent(eventCollection, eventModifier) {
  if (arguments.length !== 2 || typeof eventCollection !== 'string' || 'object' !== (typeof eventModifier === 'undefined' ? 'undefined' : _typeof(eventModifier)) && 'function' !== typeof eventModifier) {
    handleValidationError.call(this, 'Incorrect arguments provided to #extendEvent method');
    return;
  }
  this.extensions.collections[eventCollection] = this.extensions.collections[eventCollection] || [];
  this.extensions.collections[eventCollection].push(eventModifier);
  this.emit('extendEvent', eventCollection, eventModifier);
  return this;
}

function extendEvents(eventsModifier) {
  if (arguments.length !== 1 || 'object' !== (typeof eventsModifier === 'undefined' ? 'undefined' : _typeof(eventsModifier)) && 'function' !== typeof eventsModifier) {
    handleValidationError.call(this, 'Incorrect arguments provided to #extendEvents method');
    return;
  }
  this.extensions.events.push(eventsModifier);
  this.emit('extendEvents', eventsModifier);
  return this;
}

function handleValidationError(message) {
  this.emit('error', 'Event(s) not extended: ' + message);
}

function getExtendedEventBody(result, queue) {
  if (queue && queue.length > 0) {
    (0, _each2.default)(queue, function (eventModifier, i) {
      var modifierResult = typeof eventModifier === 'function' ? eventModifier() : eventModifier;
      (0, _deepExtend.deepExtend)(result, modifierResult);
    });
  }
  return result;
}

/***/ }),
/* 7 */
/***/ (function(module) {

module.exports = {"name":"keen-tracking","version":"4.5.0","description":"Track events - custom user actions, clicks, pageviews, purchases.","main":"dist/node/keen-tracking.js","browser":"dist/keen-tracking.js","repository":{"type":"git","url":"https://github.com/keen/keen-tracking.js.git"},"scripts":{"start":"NODE_ENV=development webpack-dev-server","test":"NODE_ENV=test jest && npm run test:node","test:node":"NODE_ENV=test TEST_ENV=node jest","test:watch":"NODE_ENV=test jest --watch","test:node:watch":"NODE_ENV=test TEST_ENV=node jest --watch","build":"NODE_ENV=production webpack -p && NODE_ENV=production OPTIMIZE_MINIMIZE=1 webpack -p && npm run build:node","build:node":"TARGET=node NODE_ENV=production webpack -p","profile":"webpack --profile --json > stats.json","analyze":"webpack-bundle-analyzer stats.json /dist","preversion":"npm run build:node && npm run test","version":"npm run build && git add .","postversion":"git push && git push --tags && npm publish","demo":"node ./test/demo/index.node.js"},"bugs":"https://github.com/keen/keen-tracking.js/issues","author":"Keen IO <team@keen.io> (https://keen.io/)","homepage":"https://keen.io","keywords":["Tracking","Tracker","Event Tracker","Event tracking","Track events","Page tracking","User tracking","Analytics event tracking","Analytics events","Analytics tracking","Custom events","Analytics","Stats","Statistics","Monitoring","Metrics","Pageviews","Segmentation","Funnel","Conversion","Log","Logger","Logging","Javascript events","Universal tracking","Click analytics"],"contributors":["Dustin Larimer <dustin@keen.io> (https://github.com/dustinlarimer)","Eric Anderson <eric@keen.io> (https://github.com/aroc)","Joe Wegner <joe@keen.io> (http://www.wegnerdesign.com)","Alex Kleissner <alex@keen.io> (https://github.com/hex337)","Adam Kasprowicz <adam.kasprowicz@keen.io> (https://github.com/adamkasprowicz)","Dariusz Łacheta <dariusz.lacheta@keen.io> (https://github.com/dariuszlacheta)"],"license":"MIT","dependencies":{"component-emitter":"^1.2.0","js-cookie":"2.1.0","keen-core":"^0.1.3","promise-polyfill":"^8.0.0","whatwg-fetch":"^2.0.4"},"devDependencies":{"babel-core":"^6.26.3","babel-jest":"^23.0.1","babel-loader":"^7.1.5","babel-plugin-transform-es2015-modules-commonjs":"^6.26.2","babel-plugin-transform-object-rest-spread":"^6.26.0","babel-polyfill":"^6.26.0","babel-preset-env":"^1.7.0","babel-preset-es2015":"^6.24.1","babel-preset-stage-0":"^6.24.1","eslint":"^4.19.1","eslint-config-airbnb":"^16.1.0","eslint-loader":"^2.0.0","eslint-plugin-import":"^2.11.0","eslint-plugin-jsx-a11y":"^6.0.3","html-loader":"^0.5.5","html-webpack-plugin":"^3.2.0","jest":"^22.4.3","jest-fetch-mock":"^1.6.5","merge":"^1.2.1","nock":"^9.2.6","regenerator-runtime":"^0.11.1","replace-in-file":"^3.4.0","url-parse":"^1.4.3","webpack":"^4.5.0","webpack-bundle-analyzer":"^3.3.2","webpack-cli":"^2.0.13","webpack-dev-server":"^3.1.14","xhr-mock":"^2.3.2"}};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.queue = queue;

var _componentEmitter = __webpack_require__(22);

var _componentEmitter2 = _interopRequireDefault(_componentEmitter);

var _configDefault = __webpack_require__(2);

var _configDefault2 = _interopRequireDefault(_configDefault);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function queue() {
  var configQueue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (this instanceof queue === false) {
    return new queue(configQueue);
  }
  this.capacity = 0;
  this.config = _extends({}, _configDefault2.default.queue, configQueue);
  this.events = {
    // "collection-1": [],
    // "collection-2": []
  };
  this.interval = 0;
  this.timer = null;
  return this;
}

(0, _componentEmitter2.default)(queue.prototype);

queue.prototype.check = function () {
  if (shouldFlushQueue(this)) {
    this.flush();
  }
  if (this.config.interval === 0 || this.capacity === 0) {
    this.pause();
  }
  return this;
};

queue.prototype.flush = function () {
  this.emit('flush');
  this.interval = 0;
  return this;
};

queue.prototype.pause = function () {
  if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
  }
  return this;
};

queue.prototype.start = function () {
  var self = this;
  self.pause();
  self.timer = setInterval(function () {
    self.interval++;
    self.check();
  }, 1000);
  return self;
};

function shouldFlushQueue(props) {
  if (props.capacity > 0 && props.interval >= props.config.interval) {
    return true;
  } else if (props.capacity >= props.config.capacity) {
    return true;
  }
  return false;
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timer = timer;
function timer(num) {
  if (this instanceof timer === false) {
    return new timer(num);
  }
  this.count = num || 0;
  return this;
}

timer.prototype.start = function () {
  var self = this;
  this.pause();
  this.interval = setInterval(function () {
    self.count++;
  }, 1000);
  return this;
};

timer.prototype.pause = function () {
  clearInterval(this.interval);
  return this;
};

timer.prototype.value = function () {
  return this.count;
};

timer.prototype.clear = function () {
  this.count = 0;
  return this;
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUniqueId = getUniqueId;
function getUniqueId() {
  // uuidv4
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // browser
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
      return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
    });
  } else {
    // node & older browsers
    var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return str.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDatetimeIndex = getDatetimeIndex;
function getDatetimeIndex(input) {
  var date = input || new Date();
  return {
    'hour_of_day': date.getHours(),
    'day_of_week': parseInt(1 + date.getDay()),
    'day_of_month': date.getDate(),
    'month': parseInt(1 + date.getMonth()),
    'year': date.getFullYear()
  };
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.deferEvent = deferEvent;
exports.deferEvents = deferEvents;
exports.queueCapacity = queueCapacity;
exports.queueInterval = queueInterval;
exports.recordDeferredEvents = recordDeferredEvents;

var _index = __webpack_require__(4);

var _index2 = _interopRequireDefault(_index);

var _each = __webpack_require__(0);

var _each2 = _interopRequireDefault(_each);

var _queue = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function deferEvent(eventCollection, eventBody) {

  if (arguments.length !== 2 || typeof eventCollection !== 'string') {
    handleValidationError.call(this, 'Incorrect arguments provided to #deferEvent method');
    return;
  }

  this.queue.events[eventCollection] = this.queue.events[eventCollection] || [];
  this.queue.events[eventCollection].push(eventBody);
  this.queue.capacity++;
  if (!this.queue.timer) {
    this.queue.start();
  }
  this.emit('deferEvent', eventCollection, eventBody);
  return this;
}

function deferEvents(eventsHash) {
  var self = this;

  if (arguments.length !== 1 || (typeof eventsHash === 'undefined' ? 'undefined' : _typeof(eventsHash)) !== 'object') {
    handleValidationError.call(this, 'Incorrect arguments provided to #deferEvents method');
    return;
  }

  (0, _each2.default)(eventsHash, function (eventList, eventCollection) {
    self.queue.events[eventCollection] = self.queue.events[eventCollection] || [];
    self.queue.events[eventCollection] = self.queue.events[eventCollection].concat(eventList);
    self.queue.capacity = self.queue.capacity + eventList.length;
    if (!self.queue.timer) {
      self.queue.start();
    }
  });
  self.emit('deferEvents', eventsHash);
  return self;
}

function queueCapacity(num) {
  if (!arguments.length) return this.queue.config.capacity;
  this.queue.config.capacity = num ? Number(num) : 0;
  this.queue.check();
  return this;
}

function queueInterval(num) {
  if (!arguments.length) return this.queue.config.interval;
  this.queue.config.interval = num ? Number(num) : 0;
  this.queue.check();
  return this;
}

function recordDeferredEvents() {
  var self = this;

  if (self.queue.capacity > 0) {
    self.queue.pause();
    var clonedQueueConfig = _extends({}, self.queue.config);
    var clonedQueueEvents = _extends({}, self.queue.events);
    self.queue = (0, _queue.queue)();
    self.queue.config = clonedQueueConfig;
    self.queue.on('flush', function () {
      self.recordDeferredEvents();
    });
    self.emit('recordDeferredEvents', clonedQueueEvents);
    self.recordEvents(clonedQueueEvents, function (err, res) {
      if (err) {
        self.emit('recordDeferredEventsError', err, clonedQueueEvents);
      }
    });
  }
  return self;
}

function handleValidationError(message) {
  this.emit('error', 'Event(s) not deferred: ' + message);
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// placeholder for future implementation
module.exports = {
  getFromCache: function getFromCache() {},
  saveToCache: function saveToCache() {}
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var MD5 = exports.MD5 = function MD5(d) {
  var result = M(V(Y(X(d), 8 * d.length)));return result.toLowerCase();
};function M(d) {
  for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++) {
    _ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _);
  }return f;
}function X(d) {
  for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++) {
    _[m] = 0;
  }for (m = 0; m < 8 * d.length; m += 8) {
    _[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32;
  }return _;
}function V(d) {
  for (var _ = "", m = 0; m < 32 * d.length; m += 8) {
    _ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255);
  }return _;
}function Y(d, _) {
  d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _;for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
    var h = m,
        t = f,
        g = r,
        e = i;f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e);
  }return Array(m, f, r, i);
}function md5_cmn(d, _, m, f, r, i) {
  return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m);
}function md5_ff(d, _, m, f, r, i, n) {
  return md5_cmn(_ & m | ~_ & f, d, _, r, i, n);
}function md5_gg(d, _, m, f, r, i, n) {
  return md5_cmn(_ & f | m & ~f, d, _, r, i, n);
}function md5_hh(d, _, m, f, r, i, n) {
  return md5_cmn(_ ^ m ^ f, d, _, r, i, n);
}function md5_ii(d, _, m, f, r, i, n) {
  return md5_cmn(m ^ (_ | ~f), d, _, r, i, n);
}function safe_add(d, _) {
  var m = (65535 & d) + (65535 & _);return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m;
}function bit_rol(d, _) {
  return d << _ | d >>> 32 - _;
}

exports.default = MD5;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUnique = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

__webpack_require__(1);

var _md = __webpack_require__(14);

var _md2 = _interopRequireDefault(_md);

var _cacheBrowser = __webpack_require__(13);

var _configDefault = __webpack_require__(2);

var _configDefault2 = _interopRequireDefault(_configDefault);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uniqueIds = [];

var isUnique = exports.isUnique = function isUnique(customCacheConfig, extendedEventBody) {
  var configCache = _extends({}, _configDefault2.default.cache, customCacheConfig.cache);
  var stringifiedEvent = JSON.stringify(extendedEventBody);
  var hashingMethod = configCache.hashingMethod;

  var hash = hashingMethod && hashingMethod.toLowerCase() === 'md5' ? (0, _md2.default)(stringifiedEvent) : stringifiedEvent;
  var expiryTime = configCache.maxAge ? Date.now() + configCache.maxAge : undefined;
  var item = {
    hash: hash,
    expiryTime: expiryTime
  };
  if (expiryTime) {
    var now = Date.now();
    uniqueIds = uniqueIds.filter(function (item) {
      return item.expiryTime > now;
    });
  }

  var alreadySentEvent = uniqueIds.find(function (item) {
    return item.hash === hash;
  });
  if (alreadySentEvent) {
    if (alreadySentEvent.expiryTime && alreadySentEvent.expiryTime < Date.now()) {
      uniqueIds = uniqueIds.filter(function (item) {
        return item.hash !== hash;
      });
    } else {
      return Promise.resolve(false);
    }
  }
  uniqueIds.push(item);
  if (configCache.storage && configCache.storage.toLowerCase() === 'indexeddb') {
    return (0, _cacheBrowser.getFromCache)(hash, configCache).then(function (alreadySentEvent) {
      if (alreadySentEvent) {
        return false;
      }
      (0, _cacheBrowser.saveToCache)(hash, configCache);
      return true;
    });
  }

  return Promise.resolve(true);
};

exports.default = isUnique;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (options) {

  var configRetry = _extends({}, _configDefault2.default.retry, options.retry || {});

  var retriesLimit = configRetry.limit;
  var retryInitialDelay = configRetry.initialDelay;
  var retryOn = configRetry.retryOnResponseStatuses;
  var callback = options.callback;

  var retriesCount = 0;

  if (retryOn && !(retryOn instanceof Array)) {
    throw {
      name: 'ArgumentError',
      message: 'retryOn property expects an array'
    };
  }

  var protocol = options.protocol === 'http' ? _http2.default : _https2.default;

  var parseBody = function parseBody(responseBody) {
    return new Promise(function (resolve, reject) {
      var response = void 0;
      var error = void 0;
      try {
        response = JSON.parse(responseBody);
      } catch (e) {
        // Parsing Error
        error = e;
      }
      if (!error && response.error_code) {
        // API Error
        error = new Error(response.message || 'Unknown error occurred');
        error.code = response.error_code;
        reject(error);
      }
      resolve(response);
    });
  };

  return new Promise(function (resolve, reject) {
    var wrappedRequest = function wrappedRequest(n) {
      var req = protocol.request(options.config, function (response) {
        var body = '';
        response.on('data', function (d) {
          body += d;
        });
        response.on('end', function () {
          if (retryOn.indexOf(response.statusCode) === -1) {
            parseBody(body).then(function (parsedBody) {
              resolve(parsedBody);
              if (callback) callback(null, parsedBody);
            }).catch(function (err) {
              reject(err);
              if (callback) callback(err, null);
            });
          } else {
            if (n > 0) {
              retry();
            } else {
              if (callback) callback(body, null);
              reject(body);
            }
          }
        });
      });
      req.on('error', function (err) {
        if (n > 0) {
          retry();
        } else {
          if (callback) callback(body, null);
          reject(err);
        }
      });
      req.write(options.data);
      req.end();
    };

    function retry() {
      retriesCount = retriesCount + 1;
      setTimeout(function () {
        wrappedRequest(retriesLimit - retriesCount);
      }, 2 ^ retriesCount * retryInitialDelay);
    }

    wrappedRequest(retriesLimit - retriesCount);
  });
};

__webpack_require__(1);

var _http = __webpack_require__(17);

var _http2 = _interopRequireDefault(_http);

var _https = __webpack_require__(16);

var _https2 = _interopRequireDefault(_https);

var _configDefault = __webpack_require__(2);

var _configDefault2 = _interopRequireDefault(_configDefault);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.recordEvent = recordEvent;
exports.recordEvents = recordEvents;

__webpack_require__(1);

var _index = __webpack_require__(4);

var _index2 = _interopRequireDefault(_index);

var _package = __webpack_require__(7);

var _each = __webpack_require__(0);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(3);

var _extend2 = _interopRequireDefault(_extend);

var _extendEvents = __webpack_require__(6);

var _nodeRequestRetry = __webpack_require__(18);

var _nodeRequestRetry2 = _interopRequireDefault(_nodeRequestRetry);

var _unique = __webpack_require__(15);

var _unique2 = _interopRequireDefault(_unique);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ------------------------------
// .recordEvent
// ------------------------------

function recordEvent(eventCollectionOrConfigObject, eventBody, callback) {
  var _this = this;

  var eventCollection = eventCollectionOrConfigObject;
  var unique = void 0;
  var configObject = void 0;
  var clientConfig = this.config;

  if ((typeof eventCollectionOrConfigObject === 'undefined' ? 'undefined' : _typeof(eventCollectionOrConfigObject)) === 'object' && eventCollectionOrConfigObject) {
    // slowly but surely we migrate to one object with all args
    configObject = eventCollectionOrConfigObject;
    eventCollection = eventCollectionOrConfigObject.collection || eventCollectionOrConfigObject.event_collection;
    eventBody = eventCollectionOrConfigObject.event;
    callback = eventCollectionOrConfigObject.callback;
    unique = eventCollectionOrConfigObject.unique;
  }

  var data = {};
  var extendedEventBody = {};

  if (!checkValidation.call(this, callback)) {
    return;
  }

  if (!eventCollection || typeof eventCollection !== 'string') {
    handleValidationError.call(this, 'Collection name must be a string.', callback);
    return;
  }

  (0, _extend2.default)(data, eventBody);

  // ------------------------------
  // Run extendEvent(s) transforms
  // ------------------------------

  (0, _extendEvents.getExtendedEventBody)(extendedEventBody, this.extensions.events);
  (0, _extendEvents.getExtendedEventBody)(extendedEventBody, this.extensions.collections[eventCollection]);
  (0, _extendEvents.getExtendedEventBody)(extendedEventBody, [data]);

  if (unique) {
    return (0, _unique2.default)(configObject, extendedEventBody).then(function (isUniqueResult) {
      if (!isUniqueResult) {
        return Promise.resolve({
          created: false,
          message: '[NOT_UNIQUE] This event has already been recorded'
        });
      }
      return recordEvent.call(_this, _extends({}, eventCollectionOrConfigObject, { unique: undefined }));
    });
  }

  this.emit('recordEvent', eventCollection, extendedEventBody);

  if (!_index2.default.enabled) {
    handleValidationError.call(this, 'Keen.enabled is set to false.', callback);
    return false;
  }

  return sendEventData.call(this, encodeURIComponent(eventCollection), extendedEventBody, callback);
}

// ------------------------------
// .recordEvents
// ------------------------------

function recordEvents(eventsHash, callback) {
  var self = this;
  var extendedEventsHash = {};

  if (!checkValidation.call(this, callback)) {
    return;
  }

  if (arguments.length > 2) {
    handleValidationError.call(this, 'Incorrect arguments provided to #recordEvents method', callback);
    return;
  }

  // ------------------------------
  // Run extendEvent(s) transforms
  // ------------------------------
  (0, _each2.default)(eventsHash, function (eventList, eventCollection) {
    // Find or create collection on new hash
    extendedEventsHash[eventCollection] = extendedEventsHash[eventCollection] || [];
    // Loop over each eventBody in the existing hash
    (0, _each2.default)(eventList, function (eventBody, index) {
      // Create a new data object
      var extendedEventBody = {};
      // Process "events" transform pipeline
      (0, _extendEvents.getExtendedEventBody)(extendedEventBody, self.extensions.events);
      // Process "collection" transform pipeline
      (0, _extendEvents.getExtendedEventBody)(extendedEventBody, self.extensions.collections[eventCollection]);
      // Blend existing eventBody data into the result
      (0, _extendEvents.getExtendedEventBody)(extendedEventBody, [eventBody]);
      // Push extendedEventBody into new hash
      extendedEventsHash[eventCollection].push(extendedEventBody);
    });
  });

  this.emit('recordEvents', extendedEventsHash);

  if (!_index2.default.enabled) {
    handleValidationError.call(this, 'Keen.enabled is set to false.', callback);
    return false;
  }

  return sendEventData.call(this, undefined, extendedEventsHash, callback);
}

// ------------------------------
// Validation
// ------------------------------

function checkValidation(callback) {
  if (!this.projectId()) {
    handleValidationError.call(this, 'Keen.Client is missing a projectId property.', callback);
    return false;
  }
  if (!this.writeKey()) {
    handleValidationError.call(this, 'Keen.Client is missing a writeKey property.', callback);
    return false;
  }
  return true;
}

function handleValidationError(message, cb) {
  var err = 'Event(s) not recorded: ' + message;
  this.emit('error', err);
  if (cb) {
    cb.call(this, err, null);
  }
}

function sendEventData(path, eventData, callback) {
  var data = JSON.stringify(eventData);

  var urlPath = this.url('events', path).replace(this.config.protocol + '://' + this.config.host, '');

  var config = _extends({
    host: this.config.host,
    path: urlPath,
    method: 'POST',
    headers: {
      'Authorization': this.writeKey(),
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      'keen-sdk': 'javascript-' + _package.version
    }
  }, this.config.nodeRequestConfig);

  return (0, _nodeRequestRetry2.default)({
    retry: this.config.retry,
    protocol: this.config.protocol,
    config: config,
    data: data,
    callback: callback
  });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
function lsTest() {
    var test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

var isLocalStorageAvailable = exports.isLocalStorageAvailable = lsTest();

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setOptOut = setOptOut;

var _localStorage = __webpack_require__(20);

function setOptOut() {
    var optOut = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (!_localStorage.isLocalStorageAvailable) return;

    if (optOut) {
        localStorage.setItem('optout', optOut);
        return;
    }

    localStorage.removeItem('optout');
};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__22__;

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__23__;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeenTracking = exports.Keen = undefined;

var _index = __webpack_require__(4);

var _index2 = _interopRequireDefault(_index);

var _extend = __webpack_require__(3);

var _extend2 = _interopRequireDefault(_extend);

var _recordEventsServer = __webpack_require__(19);

var _deferEvents = __webpack_require__(12);

var _extendEvents = __webpack_require__(6);

var _getDatetimeIndex = __webpack_require__(11);

var _getUniqueId = __webpack_require__(10);

var _deepExtend = __webpack_require__(5);

var _timer = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ------------------------
// Methods
// ------------------------
(0, _extend2.default)(_index2.default.prototype, {
  recordEvent: _recordEventsServer.recordEvent,
  recordEvents: _recordEventsServer.recordEvents
});
(0, _extend2.default)(_index2.default.prototype, {
  deferEvent: _deferEvents.deferEvent,
  deferEvents: _deferEvents.deferEvents,
  queueCapacity: _deferEvents.queueCapacity,
  queueInterval: _deferEvents.queueInterval,
  recordDeferredEvents: _deferEvents.recordDeferredEvents
});
(0, _extend2.default)(_index2.default.prototype, {
  extendEvent: _extendEvents.extendEvent,
  extendEvents: _extendEvents.extendEvents
});

// ------------------------
// Helpers
// ------------------------
(0, _extend2.default)(_index2.default.helpers, {
  getDatetimeIndex: _getDatetimeIndex.getDatetimeIndex,
  getUniqueId: _getUniqueId.getUniqueId
});

// ------------------------
// Utils
// ------------------------
(0, _extend2.default)(_index2.default.utils, {
  deepExtend: _deepExtend.deepExtend,
  timer: _timer.timer
});

var Keen = exports.Keen = _index2.default; // deprecated, left for backward compatibility
var KeenTracking = exports.KeenTracking = _index2.default;
module.exports = Keen;

/***/ })
/******/ ]);
});
//# sourceMappingURL=keen-tracking.js.map