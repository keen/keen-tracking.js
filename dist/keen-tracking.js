(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
;(function (f) {
  if (typeof define === 'function' && define.amd) {
    define('keen', [], function(){ return f(); });
  }
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = f();
  }
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
  extend(Keen.Client.prototype, {
    'recordEvent'  : require('./recordEvent'),
    'recordEvents' : require('./recordEvents')
  });
  extend(Keen.helpers, {
    'getBrowserProfile'  : require('./helpers/getBrowserProfile'),
    'getDatetimeIndex'   : require('./helpers/getDatetimeIndex'),
    'getDomEventProfile' : require('./helpers/getDomEventProfile'),
    'getDomNodePath'     : require('./helpers/getDomNodePath'),
    'getScreenProfile'   : require('./helpers/getScreenProfile'),
    'getUniqueId'        : require('./helpers/getUniqueId'),
    'getWindowProfile'   : require('./helpers/getWindowProfile')
  });
  extend(Keen.utils, {
    'each'       : require('./utils/each'),
    'extend'     : extend,
    'parseParams': require('./utils/parseParams')
  });
  module.exports = Keen;
  return Keen;
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./":9,"./helpers/getBrowserProfile":2,"./helpers/getDatetimeIndex":3,"./helpers/getDomEventProfile":4,"./helpers/getDomNodePath":5,"./helpers/getScreenProfile":6,"./helpers/getUniqueId":7,"./helpers/getWindowProfile":8,"./recordEvent":10,"./recordEvents":11,"./utils/each":12,"./utils/extend":13,"./utils/parseParams":14}],2:[function(require,module,exports){
var getScreenProfile = require('./getScreenProfile'),
    getWindowProfile = require('./getWindowProfile');
function getBrowserProfile(){
  return {
    'cookies'  : ('undefined' !== typeof navigator.cookieEnabled) ? navigator.cookieEnabled : false,
    'codeName' : navigator.appCodeName,
    'language' : navigator.language,
    'name'     : navigator.appName,
    'online'   : navigator.onLine,
    'platform' : navigator.platform,
    'useragent': navigator.userAgent,
    'version'  : navigator.appVersion,
    'screen'   : getScreenProfile(),
    'window'   : getWindowProfile()
  }
}
module.exports = getBrowserProfile;
},{"./getScreenProfile":6,"./getWindowProfile":8}],3:[function(require,module,exports){
function getDateTimeIndex(input){
  var date = input || new Date();
  return {
    'hour-of-day'  : date.getHours(),
    'day-of-week'  : parseInt( 1 + date.getDay() ),
    'day-of-month' : date.getDate(),
    'month'        : parseInt( 1 + date.getMonth() ),
    'year'         : date.getFullYear()
  };
}
module.exports = getDateTimeIndex;
},{}],4:[function(require,module,exports){
function getDomEventProfile(e){
  if (!arguments.length) return {};
  return {
    'innerText': e.target.innerText,
    'path': Keen.helpers.getDomPath(e.target).join(' > '),
    'tagName': e.target.tagName,
    'title': e.target.title
  };
}
module.exports = getDomEventProfile;
},{}],5:[function(require,module,exports){
/*!
  via: http://stackoverflow.com/a/16742828/2511985
  */
function getDomNodePath(el){
  if (!el.nodeName) return '';
  var stack = [];
  while ( el.parentNode != null ) {
    var sibCount = 0;
    var sibIndex = 0;
    for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
      var sib = el.parentNode.childNodes[i];
      if ( sib.nodeName == el.nodeName ) {
        if ( sib === el ) {
          sibIndex = sibCount;
        }
        sibCount++;
      }
    }
    if ( el.hasAttribute('id') && el.id != '' ) {
      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
    } else if ( sibCount > 1 ) {
      stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
    } else {
      stack.unshift(el.nodeName.toLowerCase());
    }
    el = el.parentNode;
  }
  return stack.slice(1);
}
module.exports = getDomNodePath;
},{}],6:[function(require,module,exports){
function getScreenProfile(){
  var keys, output;
  if ('undefined' == typeof window || !window.screen) return {};
  keys = ['height', 'width', 'colorDepth', 'pixelDepth', 'availHeight', 'availWidth'];
  output = {};
  for (var i = 0; i < keys.length; i++) {
    output[keys[i]] = window.screen[keys[i]] ? window.screen[keys[i]] : null;
  }
  output.orientation = {
    'angle' : window.screen.orientation ? window.screen.orientation['angle'] : 0,
    'type'  : window.innerWidth > window.innerHeight ? 'landscape': 'portrait'
  };
  return output;
}
module.exports = getScreenProfile;
},{}],7:[function(require,module,exports){
function getUniqueId(){
}
module.exports = getUniqueId;
},{}],8:[function(require,module,exports){
function getWindowProfile(){
  var body, html, output;
  if ('undefined' == typeof document) return {};
  body = document.body;
  html = document.documentElement;
  output = {
    'height': window.innerHeight || null,
    'width': window.innerWidth || null,
    'scrollHeight': Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ) || null
  };
  if (window.screen) {
    output.ratio = {
      'height': (window.screen.availHeight) ? parseFloat( (window.innerHeight/window.screen.availHeight).toFixed(2) ) : null,
      'width': (window.screen.availWidth) ? parseFloat( (window.innerWidth/window.screen.availWidth).toFixed(2) ) : null
    };
  }
  return output;
}
module.exports = getWindowProfile;
},{}],9:[function(require,module,exports){
var Emitter = require('component-emitter');
var root = this;
var previousKeen = root.Keen;
var Keen = {
  debug: false,
  enabled: true,
  helpers: {},
  utils: {},
  version: '0.0.0'
};
Keen.Client = function(cfg){
  this.configure(cfg);
  Keen.emit('client', this);
}
Keen.Client.prototype.configure = function(cfg){
  var config = cfg || {};
  if (config['host']) {
    config['host'].replace(/.*?:\/\//g, '');
  }
  if (config.protocol && config.protocol === 'auto') {
    config['protocol'] = location.protocol.replace(/:/g, '');
  }
  this.config = {
    projectId   : config.projectId,
    writeKey    : config.writeKey,
    requestType : config.requestType || 'jsonp',
    host        : config['host']     || 'api.keen.io/3.0',
    protocol    : config['protocol'] || 'https'
  };
  if (Keen.debug) {
    this.on('error', Keen.log);
  }
  this.emit('ready');
};
Keen.Client.prototype.projectId = function(str){
  if (!arguments.length) return this.config.projectId;
  this.config.projectId = (str ? String(str) : null);
  return this;
};
Keen.Client.prototype.masterKey = function(str){
  if (!arguments.length) return this.config.masterKey;
  this.config.masterKey = (str ? String(str) : null);
  return this;
};
Keen.Client.prototype.readKey = function(str){
  if (!arguments.length) return this.config.readKey;
  this.config.readKey = (str ? String(str) : null);
  return this;
};
Keen.Client.prototype.writeKey = function(str){
  if (!arguments.length) return this.config.writeKey;
  this.config.writeKey = (str ? String(str) : null);
  return this;
};
Keen.Client.prototype.url = function(path){
  if (!this.projectId()) {
    this.emit('error', 'Keen.Client is missing a projectId property');
    return;
  }
  return this.config.protocol + '://' + this.config.host + '/projects/' + this.projectId() + path;
};
Emitter(Keen);
Emitter(Keen.Client.prototype);
Keen.log = function(message) {
  if (Keen.debug && typeof console == 'object') {
    console.log('[Keen IO]', message);
  }
};
Keen.noConflict = function(){
  root.Keen = previousKeen;
  return Keen;
};
module.exports = Keen;
},{"component-emitter":15}],10:[function(require,module,exports){
function recordEvent(eventCollection, eventBody, callback){
}
module.exports = recordEvent;
},{}],11:[function(require,module,exports){
function recordEvents(events, callback){
}
module.exports = recordEvents;
},{}],12:[function(require,module,exports){
module.exports = function(o, cb, s){
  var n;
  if (!o){
    return 0;
  }
  s = !s ? o : s;
  if (o instanceof Array){
    for (n=0; n<o.length; n++) {
      if (cb.call(s, o[n], n, o) === false){
        return 0;
      }
    }
  } else {
    for (n in o){
      if (o.hasOwnProperty(n)) {
        if (cb.call(s, o[n], n, o) === false){
          return 0;
        }
      }
    }
  }
  return 1;
};
},{}],13:[function(require,module,exports){
module.exports = function(target){
  for (var i = 1; i < arguments.length; i++) {
    for (var prop in arguments[i]){
      target[prop] = arguments[i][prop];
    }
  }
  return target;
};
},{}],14:[function(require,module,exports){
function parseParams(str){
  var urlParams = {},
      match,
      pl     = /\+/g, 
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query  = str.split("?")[1];
  while (!!(match=search.exec(query))) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
  return urlParams;
};
module.exports = parseParams;
},{}],15:[function(require,module,exports){
/**
 * Expose `Emitter`.
 */
module.exports = Emitter;
/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */
function Emitter(obj) {
  if (obj) return mixin(obj);
};
/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */
function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}
/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */
Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};
/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */
Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }
  on.fn = fn;
  this.on(event, on);
  return this;
};
/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */
Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};
/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */
Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];
  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }
  return this;
};
/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */
Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};
/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */
Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};
},{}]},{},[1]);

//# sourceMappingURL=keen-tracking.js.map