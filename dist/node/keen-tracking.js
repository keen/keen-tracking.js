(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("whatwg-fetch"), require("component-emitter"), require("keen-core"));
	else if(typeof define === 'function' && define.amd)
		define(["whatwg-fetch", "component-emitter", "keen-core"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("whatwg-fetch"), require("component-emitter"), require("keen-core")) : factory(root["whatwg-fetch"], root["component-emitter"], root["keen-core"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, function(__WEBPACK_EXTERNAL_MODULE__2__, __WEBPACK_EXTERNAL_MODULE__14__, __WEBPACK_EXTERNAL_MODULE__16__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// blank file for lighter build


/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

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
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keenCore = __webpack_require__(16);

var _keenCore2 = _interopRequireDefault(_keenCore);

var _each = __webpack_require__(4);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(3);

var _extend2 = _interopRequireDefault(_extend);

var _queue = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_keenCore2.default.helpers = _keenCore2.default.helpers || {};

// Install internal queue
_keenCore2.default.on('client', function (client) {
  client.extensions = {
    events: [],
    collections: {}
  };
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

exports.default = _keenCore2.default;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFromCache = exports.saveToCache = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

__webpack_require__(0);

__webpack_require__(2);

var _md = __webpack_require__(5);

var _md2 = _interopRequireDefault(_md);

var _configDefault = __webpack_require__(1);

var _configDefault2 = _interopRequireDefault(_configDefault);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof self === 'undefined') {
  throw 'IndexedDB is available only in Browser ENV';
}

var indexedDBAvailable = 'indexedDB' in self;
var cachingEnabled = true;

if (!indexedDBAvailable) {
  // console.log("Your browser doesn't support a stable version of IndexedDB.");
  cachingEnabled = false; // graceful degradation
}

var db = void 0;
var cacheConfig = _extends({}, _configDefault2.default.cache);

function initializeIndexedDb() {
  var requestCacheConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (db) {
    return Promise.resolve();
  }
  if (!cachingEnabled) {
    return Promise.resolve();
  }
  cacheConfig = _extends({}, cacheConfig, requestCacheConfig);
  return new Promise(function (resolve, reject) {
    var dbConnectionRequest = self.indexedDB.open(cacheConfig.dbName);
    dbConnectionRequest.onerror = function (event) {
      cachingEnabled = false;
      resolve();
    };

    dbConnectionRequest.onupgradeneeded = function (event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore(cacheConfig.dbCollectionName, { keyPath: cacheConfig.dbCollectionKey });
      objectStore.createIndex(cacheConfig.dbCollectionKey, cacheConfig.dbCollectionKey, { unique: true });
      objectStore.createIndex('expiryTime', 'expiryTime', { unique: false });
    };

    dbConnectionRequest.onsuccess = function (event) {
      db = event.target.result;
      db.onerror = function (event) {
        cachingEnabled = false; // graceful degradation
      };
      resolve(db);
    };
  });
}

var saveToCache = exports.saveToCache = function saveToCache(hash) {
  var configOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return initializeIndexedDb(configOptions).then(function () {
    var transactionSave = db.transaction(cacheConfig.dbCollectionName, "readwrite").objectStore(cacheConfig.dbCollectionName);
    var requestSave = transactionSave.add({
      hash: hash,
      expiryTime: Date.now() + cacheConfig.maxAge
    });
    requestSave.onsuccess = function (event) {};
    requestSave.onerror = function (event) {
      cachingEnabled = false;
    };
  });
};

var getFromCache = exports.getFromCache = function getFromCache(hash) {
  var configOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return initializeIndexedDb(configOptions).then(function () {
    return new Promise(function (resolve, reject) {
      if (!cachingEnabled) {
        return resolve(null);
      }

      var transactionCleanUp = db.transaction(cacheConfig.dbCollectionName, "readwrite").objectStore(cacheConfig.dbCollectionName);
      var indexCleanUp = transactionCleanUp.index('expiryTime');
      var upperBoundOpenKeyRange = IDBKeyRange.upperBound(Date.now(), true);
      indexCleanUp.openCursor(upperBoundOpenKeyRange).onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          var transactionDelete = db.transaction(cacheConfig.dbCollectionName, "readwrite").objectStore(cacheConfig.dbCollectionName).delete(event.target.result.value[cacheConfig.dbCollectionKey]);
          cursor.continue();
        }
      };

      var transactionIndex = db.transaction(cacheConfig.dbCollectionName, "readwrite").objectStore(cacheConfig.dbCollectionName);
      var index = transactionIndex.index(cacheConfig.dbCollectionKey);
      var responseFromCache = index.get(hash);
      responseFromCache.onsuccess = function (event) {
        if (!event.target.result || event.target.result.expiryTime < Date.now()) {
          if (event.target.result && event.target.result.expiryTime < Date.now()) {
            var transactionDelete = db.transaction(cacheConfig.dbCollectionName, "readwrite").objectStore(cacheConfig.dbCollectionName).delete(event.target.result[cacheConfig.dbCollectionKey]);
            transactionDelete.onsuccess = function (event) {
              resolve(getFromCache(hash, configOptions));
            };
            transactionDelete.onerror = function (event) {
              cachingEnabled = false;
              resolve(getFromCache(hash, configOptions));
            };
            return resolve(null);
          }
          return resolve(null);
        } else {
          return resolve(event.target.result);
        }
      };
      responseFromCache.onerror = function (event) {
        cachingEnabled = false;
        resolve(getFromCache(hash, configOptions));
      };
    });
  });
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUnique = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

__webpack_require__(0);

var _md = __webpack_require__(5);

var _md2 = _interopRequireDefault(_md);

var _cacheBrowser = __webpack_require__(7);

var _configDefault = __webpack_require__(1);

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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (url, options) {
  var config = _extends({}, _configDefault2.default, options.retry || {});

  var retriesLimit = config.retry.limit;
  var retryInitialDelay = config.retry.initialDelay;
  var retryOn = config.retry.retryOnResponseStatuses;
  var retriesCount = 0;

  if (retryOn && !(retryOn instanceof Array)) {
    throw {
      name: 'ArgumentError',
      message: 'retryOn property expects an array'
    };
  }

  return new Promise(function (resolve, reject) {
    var wrappedFetch = function wrappedFetch(n) {
      fetch(url, options).then(function (response) {
        if (retryOn.indexOf(response.status) === -1) {
          resolve(response);
        } else {
          if (n > 0) {
            retry();
          } else {
            reject(response);
          }
        }
      }).catch(function (error) {
        if (n > 0) {
          retry();
        } else {
          reject(error);
        }
      });
    };

    function retry() {
      retriesCount = retriesCount + 1;
      setTimeout(function () {
        wrappedFetch(retriesLimit - retriesCount);
      }, 2 ^ retriesCount * retryInitialDelay);
    }

    wrappedFetch(retriesLimit - retriesCount);
  });
};

__webpack_require__(0);

__webpack_require__(2);

var _configDefault = __webpack_require__(1);

var _configDefault2 = _interopRequireDefault(_configDefault);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/***/ }),
/* 10 */
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
          if (typeof target[prop] !== 'undefined' && _typeof(arguments[i][prop]) === 'object' && arguments[i][prop] !== null) {
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.extendEvent = extendEvent;
exports.extendEvents = extendEvents;
exports.getExtendedEventBody = getExtendedEventBody;

var _deepExtend = __webpack_require__(10);

var _each = __webpack_require__(4);

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
/* 12 */
/***/ (function(module, exports) {

module.exports = {
  map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode: function (n) {
    "use strict";
    var o = "", i = 0, m = this.map, i1, i2, i3, e1, e2, e3, e4;
    n = this.utf8.encode(n);
    while (i < n.length) {
      i1 = n.charCodeAt(i++); i2 = n.charCodeAt(i++); i3 = n.charCodeAt(i++);
      e1 = (i1 >> 2); e2 = (((i1 & 3) << 4) | (i2 >> 4)); e3 = (isNaN(i2) ? 64 : ((i2 & 15) << 2) | (i3 >> 6));
      e4 = (isNaN(i2) || isNaN(i3)) ? 64 : i3 & 63;
      o = o + m.charAt(e1) + m.charAt(e2) + m.charAt(e3) + m.charAt(e4);
    } return o;
  },
  decode: function (n) {
    "use strict";
    var o = "", i = 0, m = this.map, cc = String.fromCharCode, e1, e2, e3, e4, c1, c2, c3;
    n = n.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < n.length) {
      e1 = m.indexOf(n.charAt(i++)); e2 = m.indexOf(n.charAt(i++));
      e3 = m.indexOf(n.charAt(i++)); e4 = m.indexOf(n.charAt(i++));
      c1 = (e1 << 2) | (e2 >> 4); c2 = ((e2 & 15) << 4) | (e3 >> 2);
      c3 = ((e3 & 3) << 6) | e4;
      o = o + (cc(c1) + ((e3 != 64) ? cc(c2) : "")) + (((e4 != 64) ? cc(c3) : ""));
    } return this.utf8.decode(o);
  },
  utf8: {
    encode: function (n) {
      "use strict";
      var o = "", i = 0, cc = String.fromCharCode, c;
      while (i < n.length) {
        c = n.charCodeAt(i++); o = o + ((c < 128) ? cc(c) : ((c > 127) && (c < 2048)) ?
        (cc((c >> 6) | 192) + cc((c & 63) | 128)) : (cc((c >> 12) | 224) + cc(((c >> 6) & 63) | 128) + cc((c & 63) | 128)));
        } return o;
    },
    decode: function (n) {
      "use strict";
      var o = "", i = 0, cc = String.fromCharCode, c2, c;
      while (i < n.length) {
        c = n.charCodeAt(i);
        o = o + ((c < 128) ? [cc(c), i++][0] : ((c > 191) && (c < 224)) ?
        [cc(((c & 31) << 6) | ((c2 = n.charCodeAt(i + 1)) & 63)), (i += 2)][0] :
        [cc(((c & 15) << 12) | (((c2 = n.charCodeAt(i + 1)) & 63) << 6) | ((c3 = n.charCodeAt(i + 2)) & 63)), (i += 3)][0]);
      } return o;
    }
  }
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.recordEvent = recordEvent;
exports.recordEvents = recordEvents;

__webpack_require__(0);

__webpack_require__(2);

var _base = __webpack_require__(12);

var _base2 = _interopRequireDefault(_base);

var _each = __webpack_require__(4);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(3);

var _extend2 = _interopRequireDefault(_extend);

var _index = __webpack_require__(6);

var _index2 = _interopRequireDefault(_index);

var _extendEvents = __webpack_require__(11);

var _fetchRetry = __webpack_require__(9);

var _fetchRetry2 = _interopRequireDefault(_fetchRetry);

var _unique = __webpack_require__(8);

var _unique2 = _interopRequireDefault(_unique);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ------------------------------
// .recordEvent
// ------------------------------

function recordEvent(eventCollectionOrConfigObject, eventBody, callback) {
  var _this = this;

  var eventCollection = eventCollectionOrConfigObject;
  var useBeaconApi = false;
  var unique = void 0;
  var configObject = void 0;
  var clientConfig = this.config;

  if ((typeof eventCollectionOrConfigObject === 'undefined' ? 'undefined' : _typeof(eventCollectionOrConfigObject)) === 'object' && eventCollectionOrConfigObject) {
    // slowly but surely we migrate to one object with all args
    configObject = eventCollectionOrConfigObject;
    eventCollection = eventCollectionOrConfigObject.collection;
    eventBody = eventCollectionOrConfigObject.event;
    callback = eventCollectionOrConfigObject.callback;
    unique = eventCollectionOrConfigObject.unique;
  }

  var url = this.url('events', encodeURIComponent(eventCollection));
  var data = {};

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
  var extendedEventsHash = {};
  (0, _extendEvents.getExtendedEventBody)(extendedEventsHash, this.extensions.events);
  (0, _extendEvents.getExtendedEventBody)(extendedEventsHash, this.extensions.collections[eventCollection]);
  (0, _extendEvents.getExtendedEventBody)(extendedEventsHash, [data]);

  if (unique) {
    return (0, _unique2.default)(configObject, extendedEventsHash).then(function (isUniqueResult) {
      if (!isUniqueResult) {
        return Promise.resolve({
          created: false,
          message: '[NOT_UNIQUE] This event has already been recorded'
        });
      }
      return recordEvent.call(_this, _extends({}, eventCollectionOrConfigObject, { unique: undefined }));
    });
  }

  this.emit('recordEvent', eventCollection, extendedEventsHash);

  if (!_index2.default.enabled) {
    handleValidationError.call(this, 'Keen.enabled is set to false.', callback);
    return false;
  }

  return send.call(this, { url: url, extendedEventsHash: extendedEventsHash, callback: callback, configObject: configObject, eventCollection: eventCollection });
}

// ------------------------------
// .recordEvents
// ------------------------------

function recordEvents(eventsHash, callback) {
  var self = this;
  var url = this.url('events');

  if (!checkValidation.call(this, callback)) {
    return;
  }

  if ('object' !== (typeof eventsHash === 'undefined' ? 'undefined' : _typeof(eventsHash)) || eventsHash instanceof Array) {
    handleValidationError.call(this, 'First argument must be an object', callback);
    return;
  }

  if (arguments.length > 2) {
    handleValidationError.call(this, 'Incorrect arguments provided to #recordEvents method', callback);
    return;
  }

  // ------------------------------
  // Run extendEvent(s) transforms
  // ------------------------------
  var extendedEventsHash = {};
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

  return send.call(this, { url: url, extendedEventsHash: extendedEventsHash, callback: callback });
}

function send(_ref) {
  var url = _ref.url,
      extendedEventsHash = _ref.extendedEventsHash,
      callback = _ref.callback,
      _ref$configObject = _ref.configObject,
      configObject = _ref$configObject === undefined ? {} : _ref$configObject,
      eventCollection = _ref.eventCollection;

  var clientConfig = this.config;
  var requestType = configObject.requestType // specific method for one request
  || this.config.requestType; // global request type of client

  if (navigator && navigator.sendBeacon && requestType === 'beaconAPI'
  // so you can send specific recordEvent() using beaconAPI
  // even if your global client's config prefers Fetch
  ) {
      navigator.sendBeacon(url + '?api_key=' + this.writeKey(), JSON.stringify(extendedEventsHash));
      if (callback) {
        // Beacon API is not handling responses nor errors
        callback();
      }
      return this;
    }

  // this is IMAGE beacon, not the Beacon API. deprecated
  if (requestType === 'beacon' || requestType === 'img') {
    var getRequestUrl = this.url('events', encodeURIComponent(eventCollection), {
      api_key: this.writeKey(),
      data: encodeURIComponent(_base2.default.encode(JSON.stringify(extendedEventsHash))),
      modified: new Date().getTime()
    });
    var getRequestUrlOkLength = getRequestUrl.length < getUrlMaxLength();

    if (getRequestUrlOkLength) {
      sendBeacon.call(this, getRequestUrl, callback);
    } else {
      if (callback) {
        callback('Beacon URL length exceeds current browser limit, and XHR is not supported.', null);
      }
    }
    return this;
  }

  if (typeof fetch !== 'undefined') {
    return sendFetch.call(this, 'POST', url, extendedEventsHash, callback);
  }

  return this;
}

function sendFetch(method, url, data) {
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

  var self = this;

  return (0, _fetchRetry2.default)(url, {
    method: method,
    body: data ? JSON.stringify(data) : '',
    mode: 'cors',
    redirect: 'follow',
    referrerPolicy: self.referrerPolicy() || 'unsafe-url',
    headers: {
      'Authorization': self.writeKey(),
      'Content-Type': 'application/json'
    },
    // keepalive: true, not supported for CORS yet
    retry: self.config.retry
  }).catch(function (connectionError) {
    if (typeof callback !== 'undefined') {
      callback.call(self, connectionError, null);
    }
    self.emit('error', connectionError);
    return Promise.reject(connectionError);
  }).then(function (response) {
    if (response.ok) {
      return response.json();
    }

    return response.json().then(function (responseJSON) {
      return Promise.reject({
        error_code: responseJSON.error_code,
        body: responseJSON.message,
        status: response.status,
        ok: false,
        statusText: response.statusText
      });
    });
  }).then(function (responseJSON) {
    var eventsSavedSuccessfuly = checkEventsSavedSuccessfuly(responseJSON);
    if (eventsSavedSuccessfuly) {
      if (typeof callback !== 'undefined') {
        callback.call(self, null, responseJSON);
      }
      return Promise.resolve(responseJSON);
    } else {
      if (typeof callback !== 'undefined') {
        callback.call(self, responseJSON, null);
      }
      self.emit('error', responseJSON);
      return Promise.reject(responseJSON);
    }
  });
}

function checkEventsSavedSuccessfuly(response) {
  // single event
  if (typeof response.created !== 'undefined') {
    if (response.created) {
      return true;
    }
    return false;
  }
  // multiple events
  var responseKeys = Object.keys(response);
  var notSavedEvents = responseKeys.map(function (collection) {
    return response[collection].filter(function (event) {
      return !event.success;
    });
  }).filter(function (collection) {
    return collection.length > 0;
  });

  if (notSavedEvents.length === 0) {
    return true;
  }

  return false;
}

// Validation
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

function handleValidationError(message, callback) {
  var err = 'Event(s) not recorded: ' + message;
  this.emit('error', err);
  if (callback) {
    callback.call(this, err, null);
  }
}

function getUrlMaxLength() {
  if ('undefined' !== typeof window && navigator) {
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
      return 1900;
    }
  }
  return 16000;
}

/*
  DEPRECATED METHODS
*/

// Image Beacon Requests
// DEPRECATED
function sendBeacon(url, callback) {
  var self = this,
      img = document.createElement('img'),
      loaded = false;

  img.onload = function () {
    loaded = true;
    if ('naturalHeight' in this) {
      if (this.naturalHeight + this.naturalWidth === 0) {
        this.onerror();
        return;
      }
    } else if (this.width + this.height === 0) {
      this.onerror();
      return;
    }
    if (callback) {
      callback.call(self);
    }
  };
  img.onerror = function () {
    loaded = true;
    if (callback) {
      callback.call(self, 'An error occurred!', null);
    }
  };
  img.src = url + '&c=clv1';
}

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__14__;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.queue = queue;

var _componentEmitter = __webpack_require__(14);

var _componentEmitter2 = _interopRequireDefault(_componentEmitter);

var _configDefault = __webpack_require__(1);

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
/* 16 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__16__;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeenTrackingLite = undefined;

var _index = __webpack_require__(6);

var _index2 = _interopRequireDefault(_index);

var _extend = __webpack_require__(3);

var _extend2 = _interopRequireDefault(_extend);

var _recordEventsBrowser = __webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
import { listenerCore } from './utils/listener';
import each from 'keen-core/lib/utils/each';


import {
  deferEvent,
  deferEvents,
  queueCapacity,
  queueInterval,
  recordDeferredEvents
} from './defer-events';
import { extendEvent, extendEvents } from './extend-events';
import { initAutoTrackingCore } from './browser-auto-tracking';
import { getBrowserProfile } from './helpers/getBrowserProfile';
import { getDatetimeIndex } from './helpers/getDatetimeIndex';
import { getDomainName } from './helpers/getDomainName';
import { getDomNodePath } from './helpers/getDomNodePath';
import { getDomNodeProfile } from './helpers/getDomNodeProfile';
import { getScreenProfile } from './helpers/getScreenProfile';
import { getScrollState } from './helpers/getScrollState';
import { getUniqueId } from './helpers/getUniqueId';
import { getWindowProfile } from './helpers/getWindowProfile';
export { cookie } from './utils/cookie';
import { deepExtend } from './utils/deepExtend';
import { serializeForm } from './utils/serializeForm';
import { timer } from './utils/timer';
*/

// ------------------------
// Methods
// ------------------------
(0, _extend2.default)(_index2.default.prototype, {
  recordEvent: _recordEventsBrowser.recordEvent,
  recordEvents: _recordEventsBrowser.recordEvents
});

/*
extend(KeenCore.prototype, {
  deferEvent,
  deferEvents,
  queueCapacity,
  queueInterval,
  recordDeferredEvents
});
extend(KeenCore.prototype, {
  extendEvent,
  extendEvents
});

// ------------------------
// Auto-Tracking
// ------------------------
const initAutoTracking = initAutoTrackingCore(KeenCore);
extend(KeenCore.prototype, {
  initAutoTracking
});

// ------------------------
// Helpers
// ------------------------
extend(KeenCore.helpers, {
  getBrowserProfile,
  getDatetimeIndex,
  getDomainName,
  getDomNodePath,
  getDomNodeProfile,
  getScreenProfile,
  getScrollState,
  getUniqueId,
  getWindowProfile
});

// ------------------------
// Utils
// ------------------------
const listener = listenerCore(KeenCore);
extend(KeenCore.utils, {
  // cookie,
  deepExtend,
  listener,
  serializeForm,
  timer
});

KeenCore.listenTo = (listenerHash) => {
  each(listenerHash, (callback, key) => {
    let split = key.split(' ');
    let eventType = split[0],
    selector = split.slice(1, split.length).join(' ');
    // Create an unassigned listener
    return listener(selector).on(eventType, callback);
  });
};
*/

// only for local tests
if (typeof webpackKeenGlobals !== 'undefined') {
  _index2.default.defaultConfig = webpackKeenGlobals.demoConfig;
}

var KeenTrackingLite = exports.KeenTrackingLite = _index2.default;
exports.default = KeenTrackingLite;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _browserLight = __webpack_require__(17);

var _browserLight2 = _interopRequireDefault(_browserLight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_browserLight2.default.debug = true;

var client = new _browserLight2.default(_browserLight2.default.defaultConfig);

var x = Math.random();
console.log(x);
var eventBody = {
  x: 123456,
  page: {
    a: 1,
    b: {
      c: 1
    }
  }
};

client.recordEvent({
  collection: 'abc',
  event: {
    z: 1
  },
  callback: function callback(err, res) {
    return console.log(err, res);
  }
});

console.log(client);

/***/ })
/******/ ]);
});
//# sourceMappingURL=keen-tracking.js.map