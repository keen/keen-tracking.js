(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("component-emitter"), require("keen-core"));
	else if(typeof define === 'function' && define.amd)
		define(["component-emitter", "keen-core"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("component-emitter"), require("keen-core")) : factory(root["component-emitter"], root["keen-core"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, function(__WEBPACK_EXTERNAL_MODULE__14__, __WEBPACK_EXTERNAL_MODULE__15__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keenCore = __webpack_require__(15);

var _keenCore2 = _interopRequireDefault(_keenCore);

var _each = __webpack_require__(0);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(1);

var _extend2 = _interopRequireDefault(_extend);

var _queue = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_keenCore2.default.helpers = _keenCore2.default.helpers || {};

// Install internal queue
_keenCore2.default.on('client', function (client) {
  client.extensions = {
    events: [],
    collections: {}
  };
  client.queue = (0, _queue.queue)();
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
  _keenCore2.default.log('This method has been deprecated. Check out #extendEvents: https://github.com/keen/keen-tracking.js#extend-events');
  if (!props || typeof props !== 'function') {
    this.emit('error', 'Invalid value for global properties: ' + props);
    return;
  }
  this.config.globalProperties = props;
  return this;
};

exports.default = _keenCore2.default;

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.extendEvent = extendEvent;
exports.extendEvents = extendEvents;
exports.getExtendedEventBody = getExtendedEventBody;

var _deepExtend = __webpack_require__(3);

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
  var err = 'Event(s) not extended: ' + message;
  this.emit('error', err);
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queue = queue;

var _componentEmitter = __webpack_require__(14);

var _componentEmitter2 = _interopRequireDefault(_componentEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function queue() {
  if (this instanceof queue === false) {
    return new queue();
  }
  this.capacity = 0;
  this.config = {
    capacity: 5000,
    interval: 15
  };
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
/* 6 */
/***/ (function(module) {

module.exports = {"name":"keen-tracking","version":"2.0.8","description":"Data Collection SDK for Keen IO","main":"dist/node/keen-tracking.js","browser":"dist/keen-tracking.js","repository":{"type":"git","url":"https://github.com/keen/keen-tracking.js.git"},"scripts":{"start":"NODE_ENV=development webpack-dev-server","test":"NODE_ENV=test jest && NODE_ENV=test TEST_ENV=node jest","test:watch":"NODE_ENV=test jest --watch","test:node:watch":"NODE_ENV=test TEST_ENV=node jest --watch","build":"NODE_ENV=production webpack -p && NODE_ENV=production OPTIMIZE_MINIMIZE=1 webpack -p && npm run build:node","build:node":"TARGET=node NODE_ENV=production webpack -p","profile":"webpack --profile --json > stats.json","analyze":"webpack-bundle-analyzer stats.json /dist","preversion":"npm run build && npm run test","version":"npm run update_docs && git add .","postversion":"git push && git push --tags","demo":"node ./test/demo/index.node.js","update_docs":"node ./node_modules/replace-in-file/bin/cli.js --configFile=replace-config.js"},"bugs":"https://github.com/keen/keen-tracking.js/issues","author":"Keen IO <team@keen.io> (https://keen.io/)","contributors":["Dustin Larimer <dustin@keen.io> (https://github.com/dustinlarimer)","Eric Anderson <eric@keen.io> (https://github.com/aroc)","Joe Wegner <joe@keen.io> (http://www.wegnerdesign.com)","Alex Kleissner <alex@keen.io> (https://github.com/hex337)","Adam Kasprowicz <adam.kasprowicz@keen.io> (https://github.com/adamkasprowicz)"],"license":"MIT","dependencies":{"component-emitter":"^1.2.0","js-cookie":"2.1.0","keen-core":"^0.1.3","promise-polyfill":"^8.0.0","whatwg-fetch":"^2.0.4"},"devDependencies":{"babel-jest":"^23.0.1","babel-loader":"^7.1.4","babel-plugin-transform-es2015-modules-commonjs":"^6.26.2","babel-plugin-transform-object-rest-spread":"^6.26.0","babel-preset-env":"^1.7.0","eslint":"^4.19.1","eslint-config-airbnb":"^16.1.0","eslint-loader":"^2.0.0","eslint-plugin-import":"^2.11.0","eslint-plugin-jsx-a11y":"^6.0.3","gulp":"^3.8.11","gulp-awspublish":"0.0.23","gulp-rename":"^1.2.2","gulp-replace":"^0.5.3","html-loader":"^0.5.5","html-webpack-plugin":"^3.2.0","jest":"^22.4.3","nock":"^9.2.6","regenerator-runtime":"^0.11.1","replace-in-file":"^3.4.0","webpack":"^4.5.0","webpack-bundle-analyzer":"^2.11.1","webpack-cli":"^2.0.13","webpack-dev-server":"^3.1.1","xhr-mock":"^2.3.2"}};

/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUniqueId = getUniqueId;
// via: http://stackoverflow.com/a/2117523/2511985

function getUniqueId() {
  var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return str.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.deferEvent = deferEvent;
exports.deferEvents = deferEvents;
exports.queueCapacity = queueCapacity;
exports.queueInterval = queueInterval;
exports.recordDeferredEvents = recordDeferredEvents;

var _index = __webpack_require__(2);

var _index2 = _interopRequireDefault(_index);

var _each = __webpack_require__(0);

var _each2 = _interopRequireDefault(_each);

var _queue = __webpack_require__(5);

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
  var self = this,
      clonedQueueConfig,
      clonedQueueEvents;

  if (self.queue.capacity > 0) {
    self.queue.pause();
    clonedQueueConfig = JSON.parse(JSON.stringify(self.queue.config));
    clonedQueueEvents = JSON.parse(JSON.stringify(self.queue.events));
    self.queue = (0, _queue.queue)();
    self.queue.config = clonedQueueConfig;
    self.queue.on('flush', function () {
      self.recordDeferredEvents();
    });
    self.emit('recordDeferredEvents', clonedQueueEvents);
    self.recordEvents(clonedQueueEvents, function (err, res) {
      if (err) {
        // Retry once
        self.recordEvents(clonedQueueEvents);
      } else {
        clonedQueueEvents = undefined;
      }
    });
  }
  return self;
}

function handleValidationError(message) {
  var err = 'Event(s) not deferred: ' + message;
  this.emit('error', err);
}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recordEvent = recordEvent;
exports.recordEvents = recordEvents;
exports.addEvent = addEvent;
exports.addEvents = addEvents;

var _index = __webpack_require__(2);

var _index2 = _interopRequireDefault(_index);

var _each = __webpack_require__(0);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(1);

var _extend2 = _interopRequireDefault(_extend);

var _extendEvents = __webpack_require__(4);

var _http = __webpack_require__(12);

var _http2 = _interopRequireDefault(_http);

var _https = __webpack_require__(11);

var _https2 = _interopRequireDefault(_https);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ------------------------------
// .recordEvent
// ------------------------------

function recordEvent(eventCollection, eventBody, callback) {
  var url, data, cb, extendedEventBody;

  data = {};
  cb = callback || function () {};
  callback = null;

  if (!checkValidation.call(this, cb)) {
    return;
  }

  if (!eventCollection || typeof eventCollection !== 'string') {
    handleValidationError.call(this, 'Collection name must be a string.', cb);
    return;
  }

  // ------------------------------
  // DEPRECATED
  // Apply client.globalProperties
  // ------------------------------
  if (this.config.globalProperties) {
    data = this.config.globalProperties(eventCollection);
  }
  (0, _extend2.default)(data, eventBody);

  // ------------------------------
  // Run extendEvent(s) transforms
  // ------------------------------
  extendedEventBody = {};
  (0, _extendEvents.getExtendedEventBody)(extendedEventBody, this.extensions.events);
  (0, _extendEvents.getExtendedEventBody)(extendedEventBody, this.extensions.collections[eventCollection]);
  (0, _extendEvents.getExtendedEventBody)(extendedEventBody, [data]);

  this.emit('recordEvent', eventCollection, extendedEventBody);

  if (!_index2.default.enabled) {
    handleValidationError.call(this, 'Keen.enabled is set to false.', cb);
    return false;
  }

  sendEventData.call(this, encodeURIComponent(eventCollection), extendedEventBody, cb);
  cb = null;
  return this;
}

// ------------------------------
// .recordEvents
// ------------------------------

function recordEvents(eventsHash, callback) {
  var self = this,
      url,
      cb,
      extendedEventsHash;

  cb = callback || function () {};
  callback = null;

  if (!checkValidation.call(this, cb)) {
    return;
  }

  if (arguments.length > 2) {
    handleValidationError.call(this, 'Incorrect arguments provided to #addEvents method', cb);
    return;
  }

  // ------------------------------
  // DEPRECATED
  // Apply client.globalProperties
  // ------------------------------
  if (this.config.globalProperties) {
    // Loop over each set of events
    (0, _each2.default)(eventsHash, function (events, collection) {
      // Loop over each individual event
      (0, _each2.default)(events, function (body, index) {
        // Start with global properties for this collection
        var modified = self.config.globalProperties(collection);
        // Apply provided properties for this event body
        eventsHash[collection][index] = (0, _extend2.default)(modified, body);
      });
    });
  }

  // ------------------------------
  // Run extendEvent(s) transforms
  // ------------------------------
  extendedEventsHash = {};
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
    handleValidationError.call(this, 'Keen.enabled is set to false.', cb);
    return false;
  }

  sendEventData.call(this, undefined, extendedEventsHash, cb);
  cb = null;
  return this;
}

// ----------------------
// DEPRECATED
// ----------------------

function addEvent() {
  this.emit('error', 'This method has been deprecated. Check out #recordEvent: https://github.com/keen/keen-tracking.js#record-a-single-event');
  recordEvent.apply(this, arguments);
}

function addEvents() {
  this.emit('error', 'This method has been deprecated. Check out #recordEvents: https://github.com/keen/keen-tracking.js#record-multiple-events');
  recordEvents.apply(this, arguments);
}

// ------------------------------
// Validation
// ------------------------------

function checkValidation(callback) {
  var cb = callback;
  callback = null;

  if (!this.projectId()) {
    handleValidationError.call(this, 'Keen.Client is missing a projectId property.', cb);
    return false;
  }
  if (!this.writeKey()) {
    handleValidationError.call(this, 'Keen.Client is missing a writeKey property.', cb);
    return false;
  }
  return true;
}

function handleValidationError(message, cb) {
  var err = 'Event(s) not recorded: ' + message;
  this.emit('error', err);
  if (cb) {
    cb.call(this, err, null);
    cb = null;
  }
}

function sendEventData(path, eventData, callback) {
  var data = JSON.stringify(eventData),
      url;

  url = this.url('events', path);
  url = url.replace(this.config.protocol + '://' + this.config.host, '');

  var options = {
    host: this.config.host,
    path: url,
    method: 'POST',
    headers: {
      'Authorization': this.writeKey(),
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  var protocol = this.config.protocol === 'http' ? _http2.default : _https2.default;
  var req = protocol.request(options, function (response) {
    var body = '';
    response.on('data', function (d) {
      body += d;
    });
    response.on('end', function () {
      var response, error;
      try {
        response = JSON.parse(body);
      } catch (e) {
        // Parsing Error
        error = e;
      }
      if (!error && response.error_code) {
        // API Error
        error = new Error(response.message || 'Unknown error occurred');
        error.code = response.error_code;
      }
      if (callback) {
        if (error) {
          callback(error, null);
        }
        if (response) {
          callback(null, response);
        }
      }
    });
  });
  req.on('error', callback);
  req.write(data);
  req.end();
}

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__14__;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__15__;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Keen = undefined;

var _index = __webpack_require__(2);

var _index2 = _interopRequireDefault(_index);

var _extend = __webpack_require__(1);

var _extend2 = _interopRequireDefault(_extend);

var _recordEventsServer = __webpack_require__(13);

var _deferEvents = __webpack_require__(10);

var _extendEvents = __webpack_require__(4);

var _getDatetimeIndex = __webpack_require__(9);

var _getUniqueId = __webpack_require__(8);

var _deepExtend = __webpack_require__(3);

var _timer = __webpack_require__(7);

var _package = __webpack_require__(6);

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ------------------------
// Methods
// ------------------------
(0, _extend2.default)(_index2.default.prototype, {
  recordEvent: _recordEventsServer.recordEvent,
  recordEvents: _recordEventsServer.recordEvents,
  addEvent: _recordEventsServer.addEvent,
  addEvents: _recordEventsServer.addEvents
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

_index2.default.version = _package2.default.version;

var Keen = exports.Keen = _index2.default;
module.exports = Keen;

/***/ })
/******/ ]);
});
//# sourceMappingURL=keen-tracking.js.map