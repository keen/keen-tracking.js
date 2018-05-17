(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("keen-core"), require("js-cookie"), require("component-emitter"));
	else if(typeof define === 'function' && define.amd)
		define(["keen-core", "js-cookie", "component-emitter"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("keen-core"), require("js-cookie"), require("component-emitter")) : factory(root["keen-core"], root["js-cookie"], root["component-emitter"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, function(__WEBPACK_EXTERNAL_MODULE__2__, __WEBPACK_EXTERNAL_MODULE__3__, __WEBPACK_EXTERNAL_MODULE__4__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
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
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__4__;

/***/ }),
/* 5 */
/***/ (function(module) {

module.exports = {"name":"keen-tracking","version":"1.4.2","description":"Data Collection SDK for Keen IO","main":"dist/node/keen-tracking.js","browser":"dist/keen-tracking.js","repository":{"type":"git","url":"https://github.com/keen/keen-tracking.js.git"},"scripts":{"start":"webpack-dev-server","test":"gulp test:cli","build":"ENV=production webpack -p && ENV=production OPTIMIZE_MINIMIZE=1 webpack -p","build:node":"TARGET=node ENV=production webpack -p","profile":"webpack --profile --json > stats.json","analyze":"webpack-bundle-analyzer stats.json /dist","preversion":"npm run build && npm run test","version":"git add .","postversion":"git push && git push --tags"},"bugs":"https://github.com/keen/keen-tracking.js/issues","author":"Keen IO <team@keen.io> (https://keen.io/)","contributors":["Dustin Larimer <dustin@keen.io> (https://github.com/dustinlarimer)","Eric Anderson <eric@keen.io> (https://github.com/aroc)","Joe Wegner <joe@keen.io> (http://www.wegnerdesign.com)","Alex Kleissner <alex@keen.io> (https://github.com/hex337)","Adam Kasprowicz <adam.kasprowicz@keen.io> (https://github.com/adamkasprowicz)"],"license":"MIT","dependencies":{"component-emitter":"^1.2.0","js-cookie":"2.1.0","keen-core":"^0.1.3"},"devDependencies":{"babel-loader":"^7.1.4","babel-plugin-transform-object-rest-spread":"^6.26.0","babel-preset-env":"^1.7.0","browserify":"^9.0.8","chai":"^2.3.0","chai-spies":"^0.6.0","del":"^1.1.1","eslint":"^4.19.1","eslint-config-airbnb":"^16.1.0","eslint-loader":"^2.0.0","eslint-plugin-import":"^2.11.0","eslint-plugin-jsx-a11y":"^6.0.3","gulp":"^3.8.11","gulp-awspublish":"0.0.23","gulp-derequire":"^2.1.0","gulp-mocha":"^2.0.1","gulp-mocha-phantomjs":"^0.6.1","gulp-remove-empty-lines":"0.0.2","gulp-rename":"^1.2.2","gulp-replace":"^0.5.3","gulp-sourcemaps":"^1.5.2","gulp-strip-comments":"^1.0.1","gulp-util":"^3.0.4","gulp-yuicompressor":"0.0.3","html-loader":"^0.5.5","html-webpack-plugin":"^3.2.0","karma":"^1.7.1","karma-chrome-launcher":"^0.1.12","karma-firefox-launcher":"^0.1.6","karma-mocha":"^0.2.0","karma-nyan-reporter":"0.0.60","karma-requirejs":"^0.2.2","karma-safari-launcher":"^0.1.1","karma-sauce-launcher":"^0.2.11","mocha":"^2.2.5","moment":"^2.10.3","phantomjs":"^1.9.7-15","proclaim":"^3.3.0","requirejs":"^2.3.5","webpack":"^4.5.0","webpack-bundle-analyzer":"^2.11.1","webpack-cli":"^2.0.13","webpack-dev-server":"^3.1.1","vinyl-buffer":"^1.0.0","vinyl-source-stream":"^1.1.0"}};

/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "keen-core"
var external_keen_core_ = __webpack_require__(2);
var external_keen_core_default = /*#__PURE__*/__webpack_require__.n(external_keen_core_);

// EXTERNAL MODULE: ./node_modules/keen-core/lib/utils/each.js
var each = __webpack_require__(0);
var each_default = /*#__PURE__*/__webpack_require__.n(each);

// EXTERNAL MODULE: ./node_modules/keen-core/lib/utils/extend.js
var extend = __webpack_require__(1);
var extend_default = /*#__PURE__*/__webpack_require__.n(extend);

// EXTERNAL MODULE: external "component-emitter"
var external_component_emitter_ = __webpack_require__(4);
var external_component_emitter_default = /*#__PURE__*/__webpack_require__.n(external_component_emitter_);

// CONCATENATED MODULE: ./lib/utils/queue.js


function queue_queue() {
  if (this instanceof queue_queue === false) {
    return new queue_queue();
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

external_component_emitter_default()(queue_queue.prototype);

queue_queue.prototype.check = function () {
  if (shouldFlushQueue(this)) {
    this.flush();
  }
  if (this.config.interval === 0 || this.capacity === 0) {
    this.pause();
  }
  return this;
};

queue_queue.prototype.flush = function () {
  this.emit('flush');
  this.interval = 0;
  return this;
};

queue_queue.prototype.pause = function () {
  if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
  }
  return this;
};

queue_queue.prototype.start = function () {
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
// CONCATENATED MODULE: ./lib/index.js





external_keen_core_default.a.helpers = external_keen_core_default.a.helpers || {};

// Install internal queue
external_keen_core_default.a.on('client', function (client) {
  client.extensions = {
    events: [],
    collections: {}
  };
  client.queue = queue_queue();
  client.queue.on('flush', function () {
    client.recordDeferredEvents();
  });
});

// Accessors
external_keen_core_default.a.prototype.writeKey = function (str) {
  if (!arguments.length) return this.config.writeKey;
  this.config.writeKey = str ? String(str) : null;
  return this;
};

// DEPRECATED
external_keen_core_default.a.prototype.setGlobalProperties = function (props) {
  external_keen_core_default.a.log('This method has been deprecated. Check out #extendEvents: https://github.com/keen/keen-tracking.js#extend-events');
  if (!props || typeof props !== 'function') {
    this.emit('error', 'Invalid value for global properties: ' + props);
    return;
  }
  this.config.globalProperties = props;
  return this;
};

/* harmony default export */ var lib_0 = (external_keen_core_default.a);
// CONCATENATED MODULE: ./lib/utils/listener.js


/*

  // Create a new element listner
  var myClickerCatcher = Keen.utils.listener(".nav li > a");

  // Listen for a given event
  myClicker.on("click", function(e){
    // do stuff!
  });

  // Listen for event once
  myClicker.once("click", function(e){ });

  // Cancel a given event listener
  myClicker.off("click");

  // Cancel all event listners
  myClicker.off();

*/

const listenerCore = function (ctx) {

  // Make sure this object exists
  ctx.domListeners = ctx.domListeners || {
    /*
    'click': {
      '.nav li > a': [fn, fn, fn]
    }
    */
  };

  function listener(str) {
    if (!str) return;
    if (this instanceof listener === false) {
      return new listener(str);
    }
    this.selector = str;
    return this;
  }

  listener.prototype.on = function (str, fn) {
    var self = this;

    if (arguments.length !== 2 || 'string' !== typeof str || 'function' !== typeof fn) return this;

    // Set each listener on a parent dictionary, indexed by event:
    if ('undefined' === typeof ctx.domListeners[str]) {
      addListener(str, eventHandler(str));
      ctx.domListeners[str] = {};
    }
    ctx.domListeners[str][self.selector] = ctx.domListeners[str][self.selector] || [];
    ctx.domListeners[str][self.selector].push(fn);
    return self;
  };

  listener.prototype.once = function (str, fn) {
    var self = this;
    function on() {
      self.off(str, on);
      return fn.apply(self, arguments);
    }
    on.fn = fn;
    self.on(str, on);
    return self;
  };

  listener.prototype.off = function (str, fn) {
    var self = this,
        survivors = [];
    if (arguments.length === 2) {
      each_default()(ctx.domListeners[str][self.selector], function (handler, i) {
        if (handler === fn || handler.fn === fn) return;
        survivors.push(handler);
      });
      ctx.domListeners[str][self.selector] = survivors;
    } else if (arguments.length === 1) {
      try {
        delete ctx.domListeners[str][self.selector];
      } catch (e) {
        ctx.domListeners[str][self.selector] = [];
      }
    } else {
      // loop over every eventType and delete handlers
      each_default()(ctx.domListeners, function (hash, eventType) {
        // if ('undefined' === typeof hash[str]) return;
        try {
          delete ctx.domListeners[eventType][self.selector];
        } catch (e) {
          ctx.domListeners[eventType][self.selector] = function () {};
        }
      });
    }
    return self;
  };

  function eventHandler(eventType) {
    return function (e) {
      var evt, target;

      evt = e || window.event;
      target = evt.target || evt.srcElement;

      // If nothing assigned to this event type, let it go
      if ('undefined' === ctx.domListeners[eventType]) return;

      each_default()(ctx.domListeners[eventType], function (handlers, key) {

        if (matches(target, key)) {
          // Call all handlers for this eventType + node
          each_default()(handlers, function (fn, i) {
            if ('click' === eventType && 'A' === target.nodeName) {
              deferClickEvent(evt, target, fn);
            } else if ('submit' === eventType && 'FORM' === target.nodeName) {
              deferFormSubmit(evt, target, fn);
            } else {
              fn(evt);
            }
          });
        } else if ('window' === key) {
          // Call all handlers
          each_default()(handlers, function (fn, i) {
            fn(evt);
          });
        }
        return;
      });
    };
  }

  return listener;
};

// ------------------------------
// Attach global event listener
// ------------------------------

function addListener(eventType, fn) {
  if (document.addEventListener) {
    document.addEventListener(eventType, fn, false);
  } else {
    document.attachEvent("on" + eventType, fn);
  }
}

// ------------------------------
// Match DOM element to selector
// ------------------------------

function matches(elem, selector) {
  // We'll use querySelectorAll to find all element matching the selector,
  // then check if the given element is included in that list.
  // Executing the query on the parentNode reduces the resulting nodeList,
  // document doesn't have a parentNode, though.
  var nodeList = (elem.parentNode || document).querySelectorAll(selector) || [],
      i = nodeList.length;

  // loop on the nodeList
  while (i--) {
    if (nodeList[i] == elem) {
      return true;
    }
  }
  return false;
}

// ------------------------------
// Handle 'click' events (A)
// ------------------------------

function deferClickEvent(evt, anchor, callback) {
  var timeout = 500,
      targetAttr,
      cbResponse;

  // Get 'target' attribute from anchor
  if (anchor.getAttribute !== void 0) {
    targetAttr = anchor.getAttribute("target");
  } else if (anchor.target) {
    targetAttr = anchor.target;
  }

  // Fire listener and catch possible response (return false)
  cbResponse = callback(evt);

  // If prevented within callback, bail:
  if ('boolean' === typeof cbResponse && cbResponse === false || evt.defaultPrevented || evt.returnValue === false) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    evt.returnValue = false;
    return false;
  }
  // Else if anchor doesn't kick off a new window or tab.. defer and replay the event:
  else if (targetAttr !== '_blank' && targetAttr !== 'blank' && !evt.metaKey) {
      if (evt.preventDefault) {
        evt.preventDefault();
      }
      evt.returnValue = false;
      if (anchor.href && anchor.href !== '#' && anchor.href !== window.location + '#') {
        setTimeout(function () {
          window.location = anchor.href;
        }, timeout);
      }
    }

  return false;
}

// ------------------------------
// Handle 'submit' events (FORM)
// ------------------------------

function deferFormSubmit(evt, form, callback) {
  var timeout = 500;

  // Fire listener and catch possible response (return false)
  var cbResponse = callback(evt);

  // If prevented within callback, bail
  if ('boolean' === typeof cbResponse && cbResponse === false || evt.defaultPrevented || evt.returnValue === false) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    evt.returnValue = false;
    return false;
  }
  // Defer and replay event
  else {
      if (evt.preventDefault) {
        evt.preventDefault();
      }
      evt.returnValue = false;
      setTimeout(function () {
        form.submit();
      }, timeout);
    }

  return false;
}
// EXTERNAL MODULE: ./node_modules/keen-core/lib/utils/base64.js
var base64 = __webpack_require__(6);
var base64_default = /*#__PURE__*/__webpack_require__.n(base64);

// CONCATENATED MODULE: ./lib/utils/deepExtend.js
const deepExtend = function (target) {
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
          if (typeof target[prop] !== 'undefined' && typeof arguments[i][prop] === 'object' && arguments[i][prop] !== null) {
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
// CONCATENATED MODULE: ./lib/extend-events.js



function extendEvent(eventCollection, eventModifier) {
  if (arguments.length !== 2 || typeof eventCollection !== 'string' || 'object' !== typeof eventModifier && 'function' !== typeof eventModifier) {
    handleValidationError.call(this, 'Incorrect arguments provided to #extendEvent method');
    return;
  }
  this.extensions.collections[eventCollection] = this.extensions.collections[eventCollection] || [];
  this.extensions.collections[eventCollection].push(eventModifier);
  this.emit('extendEvent', eventCollection, eventModifier);
  return this;
}

function extendEvents(eventsModifier) {
  if (arguments.length !== 1 || 'object' !== typeof eventsModifier && 'function' !== typeof eventsModifier) {
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
    each_default()(queue, function (eventModifier, i) {
      var modifierResult = typeof eventModifier === 'function' ? eventModifier() : eventModifier;
      deepExtend(result, modifierResult);
    });
  }
  return result;
}
// CONCATENATED MODULE: ./lib/record-events-browser.js






// ------------------------------
// .recordEvent
// ------------------------------

function recordEvent(eventCollection, eventBody, callback, asyncMode) {
  var url, data, cb, getRequestUrl, getRequestUrlOkLength, extendedEventBody, isAsync;

  url = this.url('events', encodeURIComponent(eventCollection));
  data = {};
  cb = callback;

  // Requests are asynchronous by default
  isAsync = 'boolean' === typeof asyncMode ? asyncMode : true;

  if (!checkValidation.call(this, cb)) {
    return;
  }

  if (!eventCollection || typeof eventCollection !== 'string') {
    record_events_browser_handleValidationError.call(this, 'Collection name must be a string.', cb);
    return;
  }

  // ------------------------------
  // DEPRECATED
  // Apply client.globalProperties
  // ------------------------------
  if (this.config.globalProperties) {
    data = this.config.globalProperties(eventCollection);
  }
  extend_default()(data, eventBody);

  // ------------------------------
  // Run extendEvent(s) transforms
  // ------------------------------
  extendedEventBody = {};
  getExtendedEventBody(extendedEventBody, this.extensions.events);
  getExtendedEventBody(extendedEventBody, this.extensions.collections[eventCollection]);
  getExtendedEventBody(extendedEventBody, [data]);

  this.emit('recordEvent', eventCollection, extendedEventBody);

  if (!lib_0.enabled) {
    record_events_browser_handleValidationError.call(this, 'Keen.enabled is set to false.', cb);
    return false;
  }

  // ------------------------------
  // Send event
  // ------------------------------

  getRequestUrl = this.url('events', encodeURIComponent(eventCollection), {
    api_key: this.writeKey(),
    data: encodeURIComponent(base64_default.a.encode(JSON.stringify(extendedEventBody))),
    modified: new Date().getTime()
  });
  getRequestUrlOkLength = getRequestUrl.length < getUrlMaxLength();

  if (isAsync) {
    switch (this.config.requestType) {
      case 'xhr':
        sendXhr.call(this, 'POST', url, extendedEventBody, cb);
        break;
      case 'beacon':
        if (getRequestUrlOkLength) {
          sendBeacon.call(this, getRequestUrl, cb);
        } else {
          attemptPostXhr.call(this, url, extendedEventBody, 'Beacon URL length exceeds current browser limit, and XHR is not supported.', cb);
        }
        break;
      default:
        if (getRequestUrlOkLength) {
          sendJSONp.call(this, getRequestUrl, cb);
        } else {
          attemptPostXhr.call(this, url, extendedEventBody, 'JSONp URL length exceeds current browser limit, and XHR is not supported.', cb);
        }
        break;
    }
  } else {
    // Send synchronous request
    if (getRequestUrlOkLength) {
      sendSynchronousXhr(getRequestUrl);
    }
  }

  callback = cb = null;
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

  url = this.url('events');
  cb = callback;
  callback = null;

  if (!checkValidation.call(this, cb)) {
    return;
  }

  if ('object' !== typeof eventsHash || eventsHash instanceof Array) {
    record_events_browser_handleValidationError.call(this, 'First argument must be an object', cb);
    return;
  }

  if (arguments.length > 2) {
    record_events_browser_handleValidationError.call(this, 'Incorrect arguments provided to #recordEvents method', cb);
    return;
  }

  // ------------------------------
  // DEPRECATED
  // Apply client.globalProperties
  // ------------------------------
  if (this.config.globalProperties) {
    // Loop over each set of events
    each_default()(eventsHash, function (events, collection) {
      // Loop over each individual event
      each_default()(events, function (body, index) {
        // Start with global properties for this collection
        var modified = self.config.globalProperties(collection);
        // Apply provided properties for this event body
        eventsHash[collection][index] = extend_default()(modified, body);
      });
    });
  }

  // ------------------------------
  // Run extendEvent(s) transforms
  // ------------------------------
  extendedEventsHash = {};
  each_default()(eventsHash, function (eventList, eventCollection) {
    // Find or create collection on new hash
    extendedEventsHash[eventCollection] = extendedEventsHash[eventCollection] || [];
    // Loop over each eventBody in the existing hash
    each_default()(eventList, function (eventBody, index) {
      // Create a new data object
      var extendedEventBody = {};
      // Process "events" transform pipeline
      getExtendedEventBody(extendedEventBody, self.extensions.events);
      // Process "collection" transform pipeline
      getExtendedEventBody(extendedEventBody, self.extensions.collections[eventCollection]);
      // Blend existing eventBody data into the result
      getExtendedEventBody(extendedEventBody, [eventBody]);
      // Push extendedEventBody into new hash
      extendedEventsHash[eventCollection].push(extendedEventBody);
    });
  });

  this.emit('recordEvents', extendedEventsHash);

  if (!lib_0.enabled) {
    record_events_browser_handleValidationError.call(this, 'Keen.enabled is set to false.', cb);
    return false;
  }

  if (getXhr()) {
    sendXhr.call(this, 'POST', url, extendedEventsHash, cb);
  } else {
    // each(eventsHash, function(eventArray, eventCollection){
    //    ... send each individually?
    // });
  }

  callback = cb = null;
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
    record_events_browser_handleValidationError.call(this, 'Keen.Client is missing a projectId property.', cb);
    return false;
  }
  if (!this.writeKey()) {
    record_events_browser_handleValidationError.call(this, 'Keen.Client is missing a writeKey property.', cb);
    return false;
  }
  return true;
}

function record_events_browser_handleValidationError(message, cb) {
  var err = 'Event(s) not recorded: ' + message;
  this.emit('error', err);
  if (cb) {
    cb.call(this, err, null);
    cb = null;
  }
}

function getUrlMaxLength() {
  if ('undefined' !== typeof window && navigator) {
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
      return 2000;
    }
  }
  return 16000;
}

// ------------------------------
// XHR Requests
// ------------------------------

function attemptPostXhr(url, data, noXhrError, callback) {
  if (getXhr()) {
    sendXhr.call(this, 'POST', url, data, callback);
  } else {
    record_events_browser_handleValidationError.call(this, noXhrError);
  }
}

function sendXhr(method, url, data, callback) {
  var self = this;
  var payload;
  var xhr = getXhr();
  var cb = callback;
  callback = null;

  xhr.onreadystatechange = function () {
    var response;
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          response = JSON.parse(xhr.responseText);
        } catch (e) {
          lib_0.emit('error', 'Could not parse HTTP response: ' + xhr.responseText);
          if (cb) {
            cb.call(self, xhr, null);
          }
        }
        if (cb && response) {
          cb.call(self, null, response);
        }
      } else {
        lib_0.emit('error', 'HTTP request failed.');
        if (cb) {
          cb.call(self, xhr, null);
        }
      }
    }
  };

  xhr.open(method, url, true);
  xhr.setRequestHeader('Authorization', self.writeKey());
  xhr.setRequestHeader('Content-Type', 'application/json');

  if (data) {
    payload = JSON.stringify(data);
  }

  if (method.toUpperCase() === 'GET') {
    xhr.send();
  }
  if (method.toUpperCase() === 'POST') {
    xhr.send(payload);
  }
}

function sendSynchronousXhr(url) {
  var xhr = getXhr();
  if (xhr) {
    xhr.open('GET', url, false);
    xhr.send(null);
  }
}

function getXhr() {
  // yay, superagent!
  var root = 'undefined' == typeof window ? this : window;
  if (root.XMLHttpRequest && ('file:' != root.location.protocol || !root.ActiveXObject)) {
    return new XMLHttpRequest();
  } else {
    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP.6.0');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP.3.0');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {}
  }
  return false;
};

// ------------------------------
// JSON-P Requests
// ------------------------------

function sendJSONp(url, callback) {
  var self = this,
      cb = callback,
      timestamp = new Date().getTime(),
      script = document.createElement('script'),
      parent = document.getElementsByTagName('head')[0],
      callbackName = 'keenJSONPCallback',
      loaded = false;

  callback = null;

  callbackName += timestamp;
  while (callbackName in window) {
    callbackName += 'a';
  }
  window[callbackName] = function (response) {
    if (loaded === true) return;
    loaded = true;
    if (cb) {
      cb.call(self, null, response);
    }
    cleanup();
  };
  script.src = url + '&jsonp=' + callbackName;
  parent.appendChild(script);

  // for early IE w/ no onerror event
  script.onreadystatechange = function () {
    if (loaded === false && this.readyState === 'loaded') {
      loaded = true;
      handleError();
      cleanup();
    }
  };
  // non-ie, etc
  script.onerror = function () {
    // on IE9 both onerror and onreadystatechange are called
    if (loaded === false) {
      loaded = true;
      handleError();
      cleanup();
    }
  };

  function handleError() {
    if (cb) {
      cb.call(self, 'An error occurred!', null);
    }
  }

  function cleanup() {
    window[callbackName] = undefined;
    try {
      delete window[callbackName];
    } catch (e) {};
    parent.removeChild(script);
  }
}

// ------------------------------
// Image Beacon Requests
// ------------------------------

function sendBeacon(url, callback) {
  var self = this,
      cb = callback,
      img = document.createElement('img'),
      loaded = false;

  callback = null;

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
    if (cb) {
      cb.call(self);
    }
  };
  img.onerror = function () {
    loaded = true;
    if (cb) {
      cb.call(self, 'An error occurred!', null);
    }
  };
  img.src = url + '&c=clv1';
}
// CONCATENATED MODULE: ./lib/defer-events.js




function deferEvent(eventCollection, eventBody) {

  if (arguments.length !== 2 || typeof eventCollection !== 'string') {
    defer_events_handleValidationError.call(this, 'Incorrect arguments provided to #deferEvent method');
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

  if (arguments.length !== 1 || typeof eventsHash !== 'object') {
    defer_events_handleValidationError.call(this, 'Incorrect arguments provided to #deferEvents method');
    return;
  }

  each_default()(eventsHash, function (eventList, eventCollection) {
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
    self.queue = queue_queue();
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

function defer_events_handleValidationError(message) {
  var err = 'Event(s) not deferred: ' + message;
  this.emit('error', err);
}
// EXTERNAL MODULE: ./package.json
var package_0 = __webpack_require__(5);

// CONCATENATED MODULE: ./lib/browser-auto-tracking.js


function initAutoTrackingCore(lib) {
  return function (obj) {
    var client = this;
    var helpers = lib.helpers;
    var utils = lib.utils;

    var options = utils.extend({
      ignoreDisabledFormFields: false,
      ignoreFormFieldTypes: ['password'],
      recordClicks: true,
      recordFormSubmits: true,
      recordPageViews: true,
      recordScrollState: true,
      shareUuidAcrossDomains: false
    }, obj);

    var now = new Date();

    var cookie = new utils.cookie('keen');
    var uuid = cookie.get('uuid');
    if (!uuid) {
      uuid = helpers.getUniqueId();
      var domainName = helpers.getDomainName(window.location.hostname);
      var cookieDomain = domainName && options.shareUuidAcrossDomains ? {
        domain: '.' + domainName
      } : {};
      cookie.set('uuid', uuid, cookieDomain);
    }

    var scrollState = {};
    if (options.recordScrollState) {
      scrollState = helpers.getScrollState();
      utils.listener('window').on('scroll', function () {
        scrollState = helpers.getScrollState(scrollState);
      });
    }

    client.extendEvents(function () {
      var browserProfile = helpers.getBrowserProfile();
      return {
        tracked_by: package_0.name + '-' + package_0.version,
        local_time_full: new Date(),
        user: {
          uuid: uuid
        },
        page: {
          title: document ? document.title : null,
          description: browserProfile.description,
          time_on_page: getSecondsSinceDate(now)
        },

        ip_address: '${keen.ip}',
        geo: {/* Enriched */},

        user_agent: '${keen.user_agent}',
        tech: {
          profile: browserProfile
          /* Enriched */
        },

        url: {
          full: window ? window.location.href : '',
          info: {/* Enriched */}
        },

        referrer: {
          full: document ? document.referrer : '',
          info: {/* Enriched */}
        },

        time: {
          local: {/* Enriched */},
          utc: {/* Enriched */}
        },

        keen: {
          timestamp: new Date().toISOString(),
          addons: [{
            name: 'keen:ip_to_geo',
            input: {
              ip: 'ip_address'
            },
            output: 'geo'
          }, {
            name: 'keen:ua_parser',
            input: {
              ua_string: 'user_agent'
            },
            output: 'tech'
          }, {
            name: 'keen:url_parser',
            input: {
              url: 'url.full'
            },
            output: 'url.info'
          }, {
            name: 'keen:url_parser',
            input: {
              url: 'referrer.full'
            },
            output: 'referrer.info'
          }, {
            name: 'keen:date_time_parser',
            input: {
              date_time: 'keen.timestamp'
            },
            output: 'time.utc'
          }, {
            name: 'keen:date_time_parser',
            input: {
              date_time: 'local_time_full'
            },
            output: 'time.local'
          }]
        }
      };
    });

    if (options.recordClicks === true) {
      utils.listener('a, a *').on('click', function (e) {
        var el = e.target;
        var props = {
          element: helpers.getDomNodeProfile(el),
          local_time_full: new Date(),
          page: {
            scroll_state: scrollState
          }
        };
        client.recordEvent('clicks', props);
      });
    }

    if (options.recordFormSubmits === true) {
      utils.listener('form').on('submit', function (e) {
        var el = e.target;
        var serializerOptions = {
          disabled: options.ignoreDisabledFormFields,
          ignoreTypes: options.ignoreFormFieldTypes
        };
        var props = {
          form: {
            action: el.action,
            fields: utils.serializeForm(el, serializerOptions),
            method: el.method
          },
          element: helpers.getDomNodeProfile(el),
          local_time_full: new Date(),
          page: {
            scroll_state: scrollState
          }
        };
        client.recordEvent('form_submissions', props);
      });
    }

    if (options.recordPageViews === true) {
      client.recordEvent('pageviews');
    }

    return client;
  };
}

function getSecondsSinceDate(date) {
  var diff = new Date().getTime() - date.getTime();
  return Math.round(diff / 1000);
}
// CONCATENATED MODULE: ./lib/helpers/getScreenProfile.js
function getScreenProfile() {
  var keys, output;

  if ('undefined' == typeof window || !window.screen) return {};

  keys = ['height', 'width', 'colorDepth', 'pixelDepth', 'availHeight', 'availWidth'];
  output = {};

  for (var i = 0; i < keys.length; i++) {
    output[keys[i]] = window.screen[keys[i]] ? window.screen[keys[i]] : null;
  }

  output.orientation = {
    'angle': window.screen.orientation ? window.screen.orientation['angle'] : 0,
    'type': window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  };

  return output;
}
// CONCATENATED MODULE: ./lib/helpers/getWindowProfile.js
function getWindowProfile() {
  var body, html, output;

  if ('undefined' == typeof document) return {};

  body = document.body;
  html = document.documentElement;

  output = {
    'height': 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight,
    'width': 'innerWidth' in window ? window.innerWidth : document.documentElement.offsetWidth,
    'scrollHeight': Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) || null
  };

  if (window.screen) {
    output.ratio = {
      'height': window.screen.availHeight ? parseFloat((window.innerHeight / window.screen.availHeight).toFixed(2)) : null,
      'width': window.screen.availWidth ? parseFloat((window.innerWidth / window.screen.availWidth).toFixed(2)) : null
    };
  }

  return output;
}

/*
  Notes:
    document.documentElement.offsetHeight/Width is a workaround for IE8 and below, where window.innerHeight/Width is undefined
*/
// CONCATENATED MODULE: ./lib/helpers/getBrowserProfile.js



function getBrowserProfile() {
  return {
    'cookies': 'undefined' !== typeof navigator.cookieEnabled ? navigator.cookieEnabled : false,
    'codeName': navigator.appCodeName,
    'description': getDocumentDescription(),
    'language': navigator.language,
    'name': navigator.appName,
    'online': navigator.onLine,
    'platform': navigator.platform,
    'useragent': navigator.userAgent,
    'version': navigator.appVersion,
    'screen': getScreenProfile(),
    'window': getWindowProfile()
  };
}

function getDocumentDescription() {
  var el;
  if (document && typeof document.querySelector === 'function') {
    el = document.querySelector('meta[name="description"]');
  }
  return el ? el.content : '';
}
// CONCATENATED MODULE: ./lib/helpers/getDatetimeIndex.js
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
// CONCATENATED MODULE: ./lib/helpers/getDomainName.js
function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

// To address those who want the "root domain," use this function:
function getDomainName(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}
// CONCATENATED MODULE: ./lib/helpers/getDomNodePath.js
function getDomNodePath(el) {
  if (!el.nodeName) return '';

  var stack = [];
  while (el.parentNode != null) {
    // console.log(el.nodeName);
    var sibCount = 0;
    var sibIndex = 0;
    for (var i = 0; i < el.parentNode.childNodes.length; i++) {
      var sib = el.parentNode.childNodes[i];
      if (sib.nodeName == el.nodeName) {
        if (sib === el) {
          sibIndex = sibCount;
        }
        sibCount++;
      }
    }
    if (el.hasAttribute('id') && el.id != '') {
      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
    } else if (sibCount > 1) {
      stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
    } else {
      stack.unshift(el.nodeName.toLowerCase());
    }
    el = el.parentNode;
  }

  return stack.slice(1).join(' > ');
}

// via: http://stackoverflow.com/a/16742828/2511985
// CONCATENATED MODULE: ./lib/helpers/getDomNodeProfile.js


function getDomNodeProfile(el) {
  return {
    action: el.action,
    class: el.className,
    href: el.href || null,
    id: el.id,
    method: el.method,
    name: el.name,
    node_name: el.nodeName,
    selector: getDomNodePath(el),
    text: el.text,
    title: el.title,
    type: el.type,
    x_position: el.offsetLeft || el.clientLeft || null,
    y_position: el.offsetTop || el.clientTop || null
  };
}
// CONCATENATED MODULE: ./lib/helpers/getScrollState.js


function getScrollState(obj) {
  var config = typeof obj === 'object' ? obj : {};
  var state = extend_default()({
    pixel: 0,
    pixel_max: 0,
    ratio: null,
    ratio_max: null
  }, config);

  if (typeof window !== undefined || typeof document !== undefined) {
    state.pixel = getScrollOffset() + getWindowHeight();
    if (state.pixel > state.pixel_max) {
      state.pixel_max = state.pixel;
    }
    state.ratio = parseFloat(Number(state.pixel / getScrollableArea()).toFixed(2));
    state.ratio_max = parseFloat(Number(state.pixel_max / getScrollableArea()).toFixed(2));
  }

  return state;
}

function getScrollableArea() {
  var body = document.body;
  var html = document.documentElement;
  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) || null;
}

function getScrollOffset() {
  return window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

function getWindowHeight() {
  return window.innerHeight || document.documentElement.clientHeight;
}
// CONCATENATED MODULE: ./lib/helpers/getUniqueId.js
// via: http://stackoverflow.com/a/2117523/2511985

function getUniqueId() {
  var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return str.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
// EXTERNAL MODULE: external "js-cookie"
var external_js_cookie_ = __webpack_require__(3);
var external_js_cookie_default = /*#__PURE__*/__webpack_require__.n(external_js_cookie_);

// CONCATENATED MODULE: ./lib/utils/cookie.js



const cookie_cookie = function (str) {
  if (!arguments.length) return;
  if (this instanceof cookie_cookie === false) {
    return new cookie_cookie(str);
  }

  this.config = {
    key: str,
    options: {
      expires: 365
    }
  };
  this.data = this.get();
  return this;
};

cookie_cookie.prototype.get = function (str) {
  var data = {};

  if (external_js_cookie_default.a.get(this.config.key)) {
    data = external_js_cookie_default.a.getJSON(this.config.key);
  }
  if (str && typeof data === 'object' && typeof data !== null) {
    return typeof data[str] !== 'undefined' ? data[str] : null;
  } else {
    return data;
  }
};

cookie_cookie.prototype.set = function (str, value, options) {
  if (!arguments.length || !this.enabled()) return this;
  if (typeof str === 'string' && arguments.length >= 2) {
    this.data[str] = value ? value : null;
  } else if (typeof str === 'object' && arguments.length === 1) {
    extend_default()(this.data, str);
  }
  external_js_cookie_default.a.set(this.config.key, this.data, extend_default()(this.config.options, options || {}));
  return this;
};

cookie_cookie.prototype.expire = function (daysUntilExpire) {
  if (daysUntilExpire) {
    external_js_cookie_default.a.set(this.config.key, this.data, extend_default()(this.config.options, { expires: daysUntilExpire }));
  } else {
    external_js_cookie_default.a.remove(this.config.key);
    this.data = {};
  }
  return this;
};

cookie_cookie.prototype.options = function (obj) {
  if (!arguments.length) return this.config.options;
  this.config.options = typeof obj === 'object' ? obj : {};
  return this;
};

cookie_cookie.prototype.enabled = function () {
  return navigator.cookieEnabled;
};
// CONCATENATED MODULE: ./lib/utils/serializeForm.js
/*
  This is a modified copy of https://github.com/defunctzombie/form-serialize/ v0.7.1
  Includes a new configuration option:
    * ignoreTypes - Array, Default: [], Example: [ 'password' ]
*/

// types which indicate a submit action and are not successful controls
// these will be ignored
var k_r_submitter = /^(?:submit|button|image|reset|file)$/i;

// node names which could be successful controls
var k_r_success_contrls = /^(?:input|select|textarea|keygen)/i;

// Matches bracket notation.
var brackets = /(\[[^\[\]]*\])/g;

// serializes form fields
// @param form MUST be an HTMLForm element
// @param options is an optional argument to configure the serialization. Default output
// with no options specified is a url encoded string
//    - hash: [true | false] Configure the output type. If true, the output will
//    be a js object.
//    - serializer: [function] Optional serializer function to override the default one.
//    The function takes 3 arguments (result, key, value) and should return new result
//    hash and url encoded str serializers are provided with this module
//    - disabled: [true | false]. If true serialize disabled fields.
//    - empty: [true | false]. If true serialize empty fields
function serializeForm(form, options) {
  if (typeof options != 'object') {
    options = { hash: !!options };
  } else if (options.hash === undefined) {
    options.hash = true;
  }

  var result = options.hash ? {} : '';
  var serializer = options.serializer || (options.hash ? hash_serializer : str_serialize);

  var elements = form && form.elements ? form.elements : [];

  // Object store each radio and set if it's empty or not
  var radio_store = Object.create(null);

  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];

    // NEW: Skip ignored field types
    if (options.ignoreTypes && options.ignoreTypes.indexOf(element.type) > -1) {
      continue;
    }
    // ingore disabled fields
    if (!options.disabled && element.disabled || !element.name) {
      continue;
    }
    // ignore anyhting that is not considered a success field
    if (!k_r_success_contrls.test(element.nodeName) || k_r_submitter.test(element.type)) {
      continue;
    }

    var key = element.name;
    var val = element.value;

    // we can't just use element.value for checkboxes cause some browsers lie to us
    // they say "on" for value when the box isn't checked
    if ((element.type === 'checkbox' || element.type === 'radio') && !element.checked) {
      val = undefined;
    }

    // If we want empty elements
    if (options.empty) {
      if (element.type === 'checkbox' && !element.checked) {
        val = '';
      }

      // for radio
      if (element.type === 'radio') {
        if (!radio_store[element.name] && !element.checked) {
          radio_store[element.name] = false;
        } else if (element.checked) {
          radio_store[element.name] = true;
        }
      }

      // if options empty is true, continue only if its radio
      if (val == undefined && element.type == 'radio') {
        continue;
      }
    } else {
      // value-less fields are ignored unless options.empty is true
      if (!val) {
        continue;
      }
    }

    // multi select boxes
    if (element.type === 'select-multiple') {
      val = [];

      var selectOptions = element.options;
      var isSelectedOptions = false;
      for (var j = 0; j < selectOptions.length; ++j) {
        var option = selectOptions[j];
        var allowedEmpty = options.empty && !option.value;
        var hasValue = option.value || allowedEmpty;
        if (option.selected && hasValue) {
          isSelectedOptions = true;

          // If using a hash serializer be sure to add the
          // correct notation for an array in the multi-select
          // context. Here the name attribute on the select element
          // might be missing the trailing bracket pair. Both names
          // "foo" and "foo[]" should be arrays.
          if (options.hash && key.slice(key.length - 2) !== '[]') {
            result = serializer(result, key + '[]', option.value);
          } else {
            result = serializer(result, key, option.value);
          }
        }
      }

      if (!isSelectedOptions && options.empty) {
        result = serializer(result, key, '');
      }
      continue;
    }

    result = serializer(result, key, val);
  }

  if (options.empty) {
    for (var key in radio_store) {
      if (!radio_store[key]) {
        result = serializer(result, key, '');
      }
    }
  }

  return result;
}

function parse_keys(string) {
  var keys = [];
  var prefix = /^([^\[\]]*)/;
  var children = new RegExp(brackets);
  var match = prefix.exec(string);

  if (match[1]) {
    keys.push(match[1]);
  }

  while ((match = children.exec(string)) !== null) {
    keys.push(match[1]);
  }

  return keys;
}

function hash_assign(result, keys, value) {
  if (keys.length === 0) {
    result = value;
    return result;
  }

  var key = keys.shift();
  var between = key.match(/^\[(.+?)\]$/);

  if (key === '[]') {
    result = result || [];

    if (Array.isArray(result)) {
      result.push(hash_assign(null, keys, value));
    } else {
      // This might be the result of bad name attributes like "[][foo]",
      // in this case the original `result` object will already be
      // assigned to an object literal. Rather than coerce the object to
      // an array, or cause an exception the attribute "_values" is
      // assigned as an array.
      result._values = result._values || [];
      result._values.push(hash_assign(null, keys, value));
    }

    return result;
  }

  // Key is an attribute name and can be assigned directly.
  if (!between) {
    result[key] = hash_assign(result[key], keys, value);
  } else {
    var string = between[1];
    // +var converts the variable into a number
    // better than parseInt because it doesn't truncate away trailing
    // letters and actually fails if whole thing is not a number
    var index = +string;

    // If the characters between the brackets is not a number it is an
    // attribute name and can be assigned directly.
    if (isNaN(index)) {
      result = result || {};
      result[string] = hash_assign(result[string], keys, value);
    } else {
      result = result || [];
      result[index] = hash_assign(result[index], keys, value);
    }
  }

  return result;
}

// Object/hash encoding serializer.
function hash_serializer(result, key, value) {
  var matches = key.match(brackets);

  // Has brackets? Use the recursive assignment function to walk the keys,
  // construct any missing objects in the result tree and make the assignment
  // at the end of the chain.
  if (matches) {
    var keys = parse_keys(key);
    hash_assign(result, keys, value);
  } else {
    // Non bracket notation can make assignments directly.
    var existing = result[key];

    // If the value has been assigned already (for instance when a radio and
    // a checkbox have the same name attribute) convert the previous value
    // into an array before pushing into it.
    //
    // NOTE: If this requirement were removed all hash creation and
    // assignment could go through `hash_assign`.
    if (existing) {
      if (!Array.isArray(existing)) {
        result[key] = [existing];
      }

      result[key].push(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

// urlform encoding serializer
function str_serialize(result, key, value) {
  // encode newlines as \r\n cause the html spec says so
  value = value.replace(/(\r)?\n/g, '\r\n');
  value = encodeURIComponent(value);

  // spaces should be '+' rather than '%20'.
  value = value.replace(/%20/g, '+');
  return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + value;
}
// CONCATENATED MODULE: ./lib/utils/timer.js
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
// CONCATENATED MODULE: ./lib/browser.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Keen", function() { return Keen; });



 // (KeenCore)


















// ------------------------
// Methods
// ------------------------
extend_default()(lib_0.prototype, {
  recordEvent: recordEvent,
  recordEvents: recordEvents,
  addEvent: addEvent,
  addEvents: addEvents
});
extend_default()(lib_0.prototype, {
  deferEvent: deferEvent,
  deferEvents: deferEvents,
  queueCapacity: queueCapacity,
  queueInterval: queueInterval,
  recordDeferredEvents: recordDeferredEvents
});
extend_default()(lib_0.prototype, {
  extendEvent: extendEvent,
  extendEvents: extendEvents
});

// ------------------------
// Auto-Tracking
// ------------------------
const initAutoTracking = initAutoTrackingCore(lib_0);
extend_default()(lib_0.prototype, {
  initAutoTracking
});

// ------------------------
// Deprecated
// ------------------------
lib_0.prototype.trackExternalLink = trackExternalLink;

// ------------------------
// Helpers
// ------------------------
extend_default()(lib_0.helpers, {
  getBrowserProfile: getBrowserProfile,
  getDatetimeIndex: getDatetimeIndex,
  getDomainName: getDomainName,
  getDomNodePath: getDomNodePath,
  getDomNodeProfile: getDomNodeProfile,
  getScreenProfile: getScreenProfile,
  getScrollState: getScrollState,
  getUniqueId: getUniqueId,
  getWindowProfile: getWindowProfile
});

// ------------------------
// Utils
// ------------------------
const browser_listener = listenerCore(lib_0);
extend_default()(lib_0.utils, {
  cookie: cookie_cookie,
  deepExtend: deepExtend,
  listener: browser_listener,
  serializeForm: serializeForm,
  timer: timer
});

lib_0.listenTo = function (listenerHash) {
  each_default()(listenerHash, function (callback, key) {
    var split = key.split(' ');
    var eventType = split[0],
        selector = split.slice(1, split.length).join(' ');
    // Create an unassigned listener
    return browser_listener(selector).on(eventType, callback);
  });
};

// ------------------------------
// DEPRECATED
// Apply client.globalProperties
// ------------------------------
function trackExternalLink(jsEvent, eventCollection, payload, timeout, timeoutCallback) {
  this.emit('error', 'This method has been deprecated. Check out DOM listeners: https://github.com/keen/keen-tracking.js#listeners');
  var evt = jsEvent,
      target = evt.currentTarget ? evt.currentTarget : evt.srcElement || evt.target,
      timer = timeout || 500,
      triggered = false,
      targetAttr = '',
      callback,
      win;
  if (target.getAttribute !== void 0) {
    targetAttr = target.getAttribute('target');
  } else if (target.target) {
    targetAttr = target.target;
  }
  if ((targetAttr == '_blank' || targetAttr == 'blank') && !evt.metaKey) {
    win = window.open('about:blank');
    win.document.location = target.href;
  }
  if (target.nodeName === 'A') {
    callback = function () {
      if (!triggered && !evt.metaKey && targetAttr !== '_blank' && targetAttr !== 'blank') {
        triggered = true;
        window.location = target.href;
      }
    };
  } else if (target.nodeName === 'FORM') {
    callback = function () {
      if (!triggered) {
        triggered = true;
        target.submit();
      }
    };
  } else {
    this.trigger('error', '#trackExternalLink method not attached to an <a> or <form> DOM element');
  }
  if (timeoutCallback) {
    callback = function () {
      if (!triggered) {
        triggered = true;
        timeoutCallback();
      }
    };
  }
  this.recordEvent(eventCollection, payload, callback);
  setTimeout(callback, timer);
  if (!evt.metaKey) {
    return false;
  }
}

// IE-specific polyfills, yay!
// -----------------------------
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (elt /*, from*/) {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = from < 0 ? Math.ceil(from) : Math.floor(from);
    if (from < 0) from += len;

    for (; from < len; from++) {
      if (from in this && this[from] === elt) return from;
    }
    return -1;
  };
}

const Keen = lib_0.extendLibrary(lib_0);
/* harmony default export */ var browser = __webpack_exports__["default"] = (Keen);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ })
/******/ ]);
});
//# sourceMappingURL=keen-tracking.js.map