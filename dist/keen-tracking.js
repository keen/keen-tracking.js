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
  var listenTo = require('./browser-events');
  extend(Keen.Client.prototype, require('./record-events-browser'));
  extend(Keen.Client.prototype, require('./defer-events'));
  extend(Keen.Client.prototype, {
    'extendEvent': require('./extend-events').extendEvent,
    'extendEvents': require('./extend-events').extendEvents
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
    'cookie'     : require('./utils/cookie'),
    'deepExtend' : require('./utils/deepExtend'),
    'each'       : require('./utils/each'),
    'extend'     : extend,
    'parseParams': require('./utils/parseParams'),
    'timer'      : require('./utils/timer')
  });
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./":12,"./browser-events":2,"./defer-events":3,"./extend-events":4,"./helpers/getBrowserProfile":5,"./helpers/getDatetimeIndex":6,"./helpers/getDomEventProfile":7,"./helpers/getDomNodePath":8,"./helpers/getScreenProfile":9,"./helpers/getUniqueId":10,"./helpers/getWindowProfile":11,"./record-events-browser":13,"./utils/cookie":15,"./utils/deepExtend":16,"./utils/each":17,"./utils/extend":18,"./utils/parseParams":19,"./utils/timer":21}],2:[function(require,module,exports){
var Sizzle = require('sizzle');
var each = require('./utils/each');
module.exports = listenTo;
function listenTo(ctx){
  return function(listenerHash){
    ctx.domEvents = ctx.domEvents || {};
    each(listenerHash, function(callback, key){
      ctx.domEvents[key] = callback;
      setListener(key.split(' ')[0], key.split(' ').splice(1).join(' '), callback);
    });
  };
}
function setListener(action, selector, callback){
  window.addEventListener(action, handleEvent, false);
  function handleEvent(e){
    var evt, target, match, timeout;
    evt = e ? e : window.event;
    timeout = 2000;
    match = Sizzle.matches(selector, [evt.target]);
    if (match.length) {
      if ('click' === action && 'A' === evt.target.nodeName) {
        return handleClickEvent(evt, evt.target, callback);
      }
      else if ('submit' === action && 'FORM' === evt.target.nodeName) {
        return handleFormSubmit(evt, evt.target, callback);
      }
      else {
        callback(evt);
      }
    }
    else {
      if ('window' === selector && 'scroll' === action) {
        callback(evt);
        return;
      }
    }
  }
}
function handleClickEvent(evt, anchor, callback){
  var timeout = 500,
      targetAttr,
      cbResponse;
  if (anchor.getAttribute !== void 0) {
    targetAttr = anchor.getAttribute("target");
  } else if (anchor.target) {
    targetAttr = anchor.target;
  }
  cbResponse = callback(evt);
  if (cbResponse === false || evt.defaultPrevented || evt.returnValue === false) {
    evt.preventDefault();
    return false;
  }
  else if (targetAttr !== '_blank' && targetAttr !== 'blank' && !evt.metaKey) {
    evt.preventDefault();
    setTimeout(function(){
      window.location = anchor.href;
    }, timeout);
  }
  return false;
}
function handleFormSubmit(evt, form, callback){
  var timeout = 500;
  cbResponse = callback(evt);
  if (cbResponse === false || evt.defaultPrevented || evt.returnValue === false) {
    evt.preventDefault();
    return false;
  }
  else {
    evt.preventDefault();
    setTimeout(function(){
      form.submit();
    }, timeout);
  }
  return false;
}
},{"./utils/each":17,"sizzle":27}],3:[function(require,module,exports){
var Keen = require('./index');
var each = require('./utils/each');
var queue = require('./utils/queue');
module.exports = {
  'deferEvent': deferEvent,
  'deferEvents': deferEvents,
  'queueCapacity': queueCapacity,
  'queueInterval': queueInterval,
  'recordDeferredEvents': recordDeferredEvents
};
function deferEvent(eventCollection, eventBody){
  if (arguments.length !== 2 || typeof eventCollection !== 'string') {
    handleValidationError.call(this, 'Incorrect arguments provided to #deferEvent method');
    return;
  }
  this.queue.events[eventCollection] = this.queue.events[eventCollection] || [];
  this.queue.events[eventCollection].push(eventBody);
  this.queue.capacity++;
  this.emit('deferEvent', eventCollection, eventBody);
  return this;
}
function deferEvents(eventsHash){
  var self = this;
  if (arguments.length !== 1 || typeof eventsHash !== 'object') {
    handleValidationError.call(this, 'Incorrect arguments provided to #deferEvents method');
    return;
  }
  each(eventsHash, function(eventList, eventCollection){
    self.queue.events[eventCollection] = self.queue.events[eventCollection] || [];
    self.queue.events[eventCollection] = self.queue.events[eventCollection].concat(eventList);
    self.queue.capacity = self.queue.capacity + eventList.length;
  });
  self.emit('deferEvents', eventsHash);
  return self;
}
function queueCapacity(num){
  if (!arguments.length) return this.queue.config.capacity;
  this.queue.config.capacity = num ? Number(num): 0;
  return this;
}
function queueInterval(num){
  if (!arguments.length) return this.queue.config.interval;
  this.queue.config.interval = num ? Number(num): 0;
  return this;
}
function recordDeferredEvents(){
  var self = this, currentQueue;
  if (self.queue.capacity > 0) {
    currentQueue = JSON.parse(JSON.stringify(self.queue));
    self.queue = queue();
    self.queue.options = currentQueue.options;
    self.emit('recordDeferredEvents', currentQueue.events);
    self.recordEvents(currentQueue.events, function(err, res){
      if (err) {
        self.recordEvents(currentQueue.events);
      }
      else {
        currentQueue = void 0;
      }
    });
  }
  return self;
}
function handleValidationError(message){
  var err = 'Event(s) not deferred: ' + message;
  this.emit('error', err);
}
},{"./index":12,"./utils/each":17,"./utils/queue":20}],4:[function(require,module,exports){
var deepExtend = require('./utils/deepExtend');
var each = require('./utils/each');
module.exports = {
  'extendEvent': extendEvent,
  'extendEvents': extendEvents,
  'getExtendedEventBody': getExtendedEventBody
};
function extendEvent(eventCollection, eventModifier){
  if (arguments.length !== 2 || typeof eventCollection !== 'string'
    || ('object' !== typeof eventModifier && 'function' !== typeof eventModifier)) {
      handleValidationError.call(this, 'Incorrect arguments provided to #extendEvent method');
      return;
  }
  this.extensions.collections[eventCollection] = this.extensions.collections[eventCollection] || [];
  this.extensions.collections[eventCollection].push(eventModifier);
  this.emit('extendEvent', eventCollection, eventModifier);
  return this;
}
function extendEvents(eventsModifier){
  if (arguments.length !== 1 || ('object' !== typeof eventsModifier && 'function' !== typeof eventsModifier)) {
    handleValidationError.call(this, 'Incorrect arguments provided to #extendEvents method');
    return;
  }
  this.extensions.events.push(eventsModifier);
  this.emit('extendEvents', eventsModifier);
  return this;
}
function handleValidationError(message){
  var err = 'Event(s) not extended: ' + message;
  this.emit('error', err);
}
function getExtendedEventBody(result, queue){
  if (queue && queue.length > 0) {
    each(queue, function(eventModifier, i){
      var modifierResult = (typeof eventModifier === 'function') ? eventModifier() : eventModifier;
      deepExtend(result, modifierResult);
    });
  }
  return result;
}
},{"./utils/deepExtend":16,"./utils/each":17}],5:[function(require,module,exports){
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
},{"./getScreenProfile":9,"./getWindowProfile":11}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
function getDomEventProfile(e){
  if (!arguments.length) return {};
}
module.exports = getDomEventProfile;
},{}],8:[function(require,module,exports){
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
  return stack.slice(1).join(' > ');
}
module.exports = getDomNodePath;
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
function getUniqueId(){
}
module.exports = getUniqueId;
},{}],11:[function(require,module,exports){
function getWindowProfile(){
  var body, html, output;
  if ('undefined' == typeof document) return {};
  body = document.body;
  html = document.documentElement;
  output = {
    'height': ('innerHeight' in window) ? window.innerHeight : document.documentElement.offsetHeight,
    'width': ('innerWidth' in window) ? window.innerWidth : document.documentElement.offsetWidth,
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
/*
  Notes:
    document.documentElement.offsetHeight/Width is a workaround for IE8 and below, where window.innerHeight/Width is undefined
*/
},{}],12:[function(require,module,exports){
var Emitter = require('component-emitter');
var JSON2 = require('JSON2');
var each = require('./utils/each');
var queue = require('./utils/queue');
var root = this;
var previousKeen = root.Keen;
var Keen = {
  debug: false,
  enabled: true,
  loaded: false,
  helpers: {},
  utils: {},
  version: '0.0.1'
};
Keen.Client = function(cfg){
  this.configure(cfg);
  Keen.emit('client', this);
}
Keen.Client.prototype.configure = function(cfg){
  var self = this, config = cfg || {}, defaultProtocol;
  if (config['host']) {
    config['host'].replace(/.*?:\/\//g, '');
  }
  defaultProtocol = 'https';
  if ('undefined' !== typeof document && document.all) {
    config['protocol'] = (document.location.protocol !== 'https:') ? 'http' : defaultProtocol;
  }
  self.config = {
    projectId   : config.projectId,
    writeKey    : config.writeKey,
    host        : config['host']     || 'api.keen.io',
    protocol    : config['protocol'] || defaultProtocol,
    requestType : config.requestType || 'jsonp',
    writePath   : config.writePath,
  };
  self.queue = queue();
  self.queue.on('flush', function(){
    self.recordDeferredEvents();
  });
  self.extensions = {
    events: [],
    collections: {}
  };
  if (Keen.debug) {
    self.on('error', Keen.log);
  }
  self.emit('ready');
  return self;
};
Keen.Client.prototype.projectId = function(str){
  if (!arguments.length) return this.config.projectId;
  this.config.projectId = (str ? String(str) : null);
  return this;
};
Keen.Client.prototype.writeKey = function(str){
  if (!arguments.length) return this.config.writeKey;
  this.config.writeKey = (str ? String(str) : null);
  return this;
};
Keen.Client.prototype.writePath = function(str){
  if (!arguments.length) {
    if (!this.projectId()) {
      this.emit('error', 'Keen.Client is missing a projectId property');
      return;
    }
    return this.config.writePath ? this.config.writePath : ('/3.0/projects/' + this.projectId() + '/events');
  }
  this.config.writePath = (str ? String(str) : null);
  return this;
};
Keen.Client.prototype.url = function(path, data){
  var url;
  if (!this.projectId()) {
    this.emit('error', 'Keen.Client is missing a projectId property');
    return;
  }
  url = this.config.protocol + '://' + this.config.host + '/3.0/projects/' + this.projectId();
  if (path) {
    url += path;
  }
  if (data) {
    url += '?' + serialize(data);
  }
  return url;
};
function serialize(data){
  var query = [];
  each(data, function(value, key){
    if ('string' !== typeof value) {
      value = JSON2.stringify(value);
    }
    query.push(key + '=' + encodeURIComponent(value));
  });
  return query.join('&');
}
Emitter(Keen);
Emitter(Keen.Client.prototype);
Keen.log = function(message) {
  if (Keen.debug && typeof console == 'object') {
    console.log('[Keen IO]', message);
  }
};
module.exports = Keen;
},{"./utils/each":17,"./utils/queue":20,"JSON2":23,"component-emitter":25}],13:[function(require,module,exports){
var Keen = require('./index');
var base64 = require('./utils/base64');
var each = require('./utils/each');
var extendEvents = require('./extend-events');
var JSON2 = require('JSON2');
module.exports = {
  'recordEvent': recordEvent,
  'recordEvents': recordEvents
};
function recordEvent(eventCollection, eventBody, callback){
  var url, data, cb, getRequestUrl, extendedEventBody;
  url = this.url('/events/' + encodeURIComponent(eventCollection));
  data = eventBody || {};
  cb = callback;
  if (!checkValidation.call(this, cb)) {
    return;
  }
  if (!eventCollection || typeof eventCollection !== 'string') {
    handleValidationError.call(this, 'Collection name must be a string.', cb);
    return;
  }
  extendedEventBody = {};
  extendEvents.getExtendedEventBody(extendedEventBody, this.extensions.events);
  extendEvents.getExtendedEventBody(extendedEventBody, this.extensions.collections[eventCollection]);
  extendEvents.getExtendedEventBody(extendedEventBody, [data]);
  this.emit('recordEvent', eventCollection, extendedEventBody);
  if (!Keen.enabled) {
    handleValidationError.call(this, 'Keen.enabled is set to false.', cb);
    return false;
  }
  getRequestUrl = this.url('/events/' + encodeURIComponent(eventCollection), {
    api_key  : this.writeKey(),
    data     : base64.encode(JSON2.stringify(extendedEventBody)),
    modified : new Date().getTime()
  });
  if (getRequestUrl.length < getUrlMaxLength()) {
    switch (this.config.requestType) {
      case 'xhr':
        sendXhr.call(this, 'GET', getRequestUrl, null, null, cb);
        break;
      case 'beacon':
        sendBeacon.call(this, getRequestUrl, cb);
        break;
      default:
        sendJSONp.call(this, getRequestUrl, cb);
        break;
    }
  }
  else if (getXhr()) {
    sendXhr.call(this, 'POST', url, extendedEventBody, cb);
  }
  else {
    handleValidationError.call(this, 'URL length exceeds current browser limit, and XHR is not supported.');
  }
  callback = cb = null;
  return this;
}
function recordEvents(eventsHash, callback){
  var self = this, url, cb, extendedEventsHash;
  url = this.url('/events');
  cb = callback;
  callback = null;
  if (!checkValidation.call(this, cb)) {
    return;
  }
  if ('object' !== typeof eventsHash || eventsHash instanceof Array) {
    handleValidationError.call(this, 'First argument must be an object', cb);
    return;
  }
  if (arguments.length > 2) {
    handleValidationError.call(this, 'Incorrect arguments provided to #recordEvents method', cb);
    return;
  }
  extendedEventsHash = {};
  each(eventsHash, function(eventList, eventCollection){
    extendedEventsHash[eventCollection] = extendedEventsHash[eventCollection] || [];
    each(eventList, function(eventBody, index){
      var extendedEventBody = {};
      extendEvents.getExtendedEventBody(extendedEventBody, self.extensions.events);
      extendEvents.getExtendedEventBody(extendedEventBody, self.extensions.collections[eventCollection]);
      extendEvents.getExtendedEventBody(extendedEventBody, [eventBody]);
      extendedEventsHash[eventCollection].push(extendedEventBody);
    });
  });
  this.emit('recordEvents', extendedEventsHash);
  if (!Keen.enabled) {
    handleValidationError.call(this, 'Keen.enabled is set to false.', cb);
    return false;
  }
  if (getXhr()) {
    sendXhr.call(this, 'POST', url, extendedEventsHash, cb);
  }
  else {
  }
  callback = cb = null;
  return this;
}
function checkValidation(callback){
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
function handleValidationError(message, cb){
  var err = 'Event(s) not recorded: ' + message;
  this.emit('error', err);
  if (cb) {
    cb.call(this, err, null);
    cb = null;
  }
}
function getUrlMaxLength(){
  if ('undefined' !== typeof window) {
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
      return 2000;
    }
  }
  return 16000;
}
function sendXhr(method, url, data, callback){
  var self = this;
  var payload;
  var xhr = getXhr();
  var cb = callback;
  callback = null;
  xhr.onreadystatechange = function() {
    var response;
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          response = JSON2.parse(xhr.responseText);
        } catch (e) {
          Keen.emit('error', 'Could not parse HTTP response: ' + xhr.responseText);
          if (cb) {
            cb.call(self, xhr, null);
          }
        }
        if (cb && response) {
          cb.call(self, null, response);
        }
      }
      else {
        Keen.emit('error', 'HTTP request failed.');
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
    payload = JSON2.stringify(data);
  }
  if (method.toUpperCase() === 'GET') {
    xhr.send();
  }
  if (method.toUpperCase() === 'POST') {
    xhr.send(payload);
  }
}
function getXhr() {
  var root = 'undefined' == typeof window ? this : window;
  if (root.XMLHttpRequest && ('file:' != root.location.protocol || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
};
function sendJSONp(url, callback){
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
  window[callbackName] = function(response) {
    if (loaded === true) return;
    loaded = true;
    if (cb) {
      cb.call(self, null, response);
    }
    cleanup();
  };
  script.src = url + '&jsonp=' + callbackName;
  parent.appendChild(script);
  script.onreadystatechange = function() {
    if (loaded === false && this.readyState === 'loaded') {
      loaded = true;
      handleError();
      cleanup();
    }
  };
  script.onerror = function() {
    if (loaded === false) {
      loaded = true;
      handleError();
      cleanup();
    }
  };
  function handleError(){
    if (cb) {
      cb.call(self, 'An error occurred!', null);
    }
  }
  function cleanup(){
    window[callbackName] = undefined;
    try {
      delete window[callbackName];
    } catch(e){};
    parent.removeChild(script);
  }
}
function sendBeacon(url, callback){
  var self = this,
      cb = callback,
      img = document.createElement('img'),
      loaded = false;
  callback = null;
  img.onload = function() {
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
  img.onerror = function() {
    loaded = true;
    if (cb) {
      cb.call(self, 'An error occurred!', null);
    }
  };
  img.src = url + '&c=clv1';
}
},{"./extend-events":4,"./index":12,"./utils/base64":14,"./utils/each":17,"JSON2":23}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
var Cookies = require('cookies-js');
var JSON2 = require('JSON2');
var extend = require('./extend');
module.exports = cookie;
function cookie(str){
  if (!arguments.length) return;
  if (this instanceof cookie === false) {
    return new cookie(str);
  }
  this.config = {
    key: str,
    options: {}
  };
  this.data = this.get();
  return this;
}
cookie.prototype.get = function(str){
  var data = Cookies.get(this.config.key) ? JSON2.parse( decodeURIComponent(Cookies.get(this.config.key)) ) : {};
  return (str && typeof data[str] !== 'undefined') ? data[str] : data;
};
cookie.prototype.set = function(str, value){
  if (!arguments.length) return this;
  if ('string' === typeof str && arguments.length === 2) {
    this.data[str] = value ? value : null;
  }
  else if ('object' === typeof str && arguments.length === 1) {
    extend(this.data, str);
  }
  Cookies.set(this.config.key, encodeURIComponent( JSON2.stringify(this.data) ), this.config.options);
  return this;
};
cookie.prototype.expire = function(){
  Cookies.expire(this.config.key);
  this.data = {};
  return this;
};
cookie.prototype.options = function(obj){
  if (!arguments.length) return this.config.options;
  this.config.options = (typeof obj === 'object') ? obj : {};
  return this;
};
},{"./extend":18,"JSON2":23,"cookies-js":26}],16:[function(require,module,exports){
var JSON2 = require('JSON2');
module.exports = deepExtend;
function deepExtend(target){
  for (var i = 1; i < arguments.length; i++) {
    if (target instanceof Array && arguments[i] instanceof Array) {
      for (var j = 0; j < arguments[i].length; j++) {
        if (target.indexOf(arguments[i][j]) < 0) {
          target.push(arguments[i][j]);
        }
      }
    }
    else {
      for (var prop in arguments[i]){
        if ('undefined' !== typeof target[prop] && 'object' === typeof arguments[i][prop] && arguments[i][prop] !== null) {
          deepExtend(target[prop], clone(arguments[i][prop]));
        }
        else {
          target[prop] = clone(arguments[i][prop]);
        }
      }
    }
  }
  return target;
}
function clone(input){
  return JSON2.parse(JSON2.stringify(input))
}
},{"JSON2":23}],17:[function(require,module,exports){
module.exports = each;
function each(o, cb, s){
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
}
},{}],18:[function(require,module,exports){
module.exports = function(target){
  for (var i = 1; i < arguments.length; i++) {
    for (var prop in arguments[i]){
      target[prop] = arguments[i][prop];
    }
  }
  return target;
};
},{}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
var Emitter = require('component-emitter');
module.exports = queue;
function queue(){
  var self = this;
  if (this instanceof queue === false) {
    return new queue();
  }
  self.capacity = 0;
  self.interval = 0;
  self.config = {
    capacity: 5000,
    interval: 15
  };
  self.events = {
  };
  setInterval(function(){
    self.interval++;
    checkQueue.call(self);
  }, 1000);
  return self;
}
function checkQueue(){
  if ((this.capacity > 0 && this.interval >= this.config.interval)
    || this.capacity >= this.config.capacity) {
      this.emit('flush');
      this.interval = 0;
  }
}
Emitter(queue.prototype);
},{"component-emitter":25}],21:[function(require,module,exports){
module.exports = timer;
function timer(num){
  if (this instanceof timer === false) {
    return new timer(num);
  }
  this.count = num || 0;
  return this;
}
timer.prototype.start = function(){
  var self = this;
  this.pause();
  this.interval = setInterval(function(){
    self.count++;
  }, 1000);
  return this;
};
timer.prototype.pause = function(){
  clearInterval(this.interval);
  return this;
};
timer.prototype.value = function(){
  return this.count;
};
timer.prototype.clear = function(){
  this.count = 0;
  return this;
};
},{}],22:[function(require,module,exports){
/*jslint evil: true, regexp: true */
/*members $ref, apply, call, decycle, hasOwnProperty, length, prototype, push,
    retrocycle, stringify, test, toString
*/
(function (exports) {
if (typeof exports.decycle !== 'function') {
    exports.decycle = function decycle(object) {
        'use strict';
        var objects = [],  
            paths = [];    
        return (function derez(value, path) {
            var i,         
                name,      
                nu;        
            switch (typeof value) {
            case 'object':
                if (!value) {
                    return null;
                }
                for (i = 0; i < objects.length; i += 1) {
                    if (objects[i] === value) {
                        return {$ref: paths[i]};
                    }
                }
                objects.push(value);
                paths.push(path);
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    nu = [];
                    for (i = 0; i < value.length; i += 1) {
                        nu[i] = derez(value[i], path + '[' + i + ']');
                    }
                } else {
                    nu = {};
                    for (name in value) {
                        if (Object.prototype.hasOwnProperty.call(value, name)) {
                            nu[name] = derez(value[name],
                                path + '[' + JSON.stringify(name) + ']');
                        }
                    }
                }
                return nu;
            case 'number':
            case 'string':
            case 'boolean':
                return value;
            }
        }(object, '$'));
    };
}
if (typeof exports.retrocycle !== 'function') {
    exports.retrocycle = function retrocycle($) {
        'use strict';
        var px =
            /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;
        (function rez(value) {
            var i, item, name, path;
            if (value && typeof value === 'object') {
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    for (i = 0; i < value.length; i += 1) {
                        item = value[i];
                        if (item && typeof item === 'object') {
                            path = item.$ref;
                            if (typeof path === 'string' && px.test(path)) {
                                value[i] = eval(path);
                            } else {
                                rez(item);
                            }
                        }
                    }
                } else {
                    for (name in value) {
                        if (typeof value[name] === 'object') {
                            item = value[name];
                            if (item) {
                                path = item.$ref;
                                if (typeof path === 'string' && px.test(path)) {
                                    value[name] = eval(path);
                                } else {
                                    rez(item);
                                }
                            }
                        }
                    }
                }
            }
        }($));
        return $;
    };
}
}) (
  (typeof exports !== 'undefined') ? 
    exports : 
    (window.JSON ? 
      (window.JSON) :
      (window.JSON = {})
    )
);
},{}],23:[function(require,module,exports){
var JSON2 = require('./json2');
var cycle = require('./cycle');
JSON2.decycle = cycle.decycle;
JSON2.retrocycle = cycle.retrocycle;
module.exports = JSON2;
},{"./cycle":22,"./json2":24}],24:[function(require,module,exports){
/*
    json2.js
    2011-10-19
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    See http://www.JSON.org/js.html
    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html
    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
    This file creates a global JSON object containing two methods: stringify
    and parse.
        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.
            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.
            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.
            This method produces a JSON text from a JavaScript value.
            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value
            For example, this would serialize Dates as ISO strings.
                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        return n < 10 ? '0' + n : n;
                    }
                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };
            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.
            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.
            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.
            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.
            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.
            Example:
            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.
            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.
            Example:
            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });
            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });
    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/
/*jslint evil: true, regexp: true */
/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/
(function (JSON) {
    'use strict';
    function f(n) {
        return n < 10 ? '0' + n : n;
    }
    /* DDOPSON-2012-04-16 - mutating global prototypes is NOT allowed for a well-behaved module.  
     * It's also unneeded, since Date already defines toJSON() to the same ISOwhatever format below
     * Thus, we skip this logic for the CommonJS case where 'exports' is defined
     */
    if (typeof exports === 'undefined') {
      if (typeof Date.prototype.toJSON !== 'function') {
          Date.prototype.toJSON = function (key) {
              return isFinite(this.valueOf())
                  ? this.getUTCFullYear()     + '-' +
                      f(this.getUTCMonth() + 1) + '-' +
                      f(this.getUTCDate())      + 'T' +
                      f(this.getUTCHours())     + ':' +
                      f(this.getUTCMinutes())   + ':' +
                      f(this.getUTCSeconds())   + 'Z'
                  : null;
          };
      }
      if (typeof String.prototype.toJSON !== 'function') {
        String.prototype.toJSON = function (key) { return this.valueOf(); };
      }
      if (typeof Number.prototype.toJSON !== 'function') {
        Number.prototype.toJSON = function (key) { return this.valueOf(); };
      }
      if (typeof Boolean.prototype.toJSON !== 'function') {
        Boolean.prototype.toJSON = function (key) { return this.valueOf(); };
      }
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {   
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
        var i,         
            k,         
            v,         
            length,
            mind = gap,
            partial,
            value = holder[key];
        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
        case 'string':
            return quote(value);
        case 'number':
            return isFinite(value) ? String(value) : 'null';
        case 'boolean':
        case 'null':
            return String(value);
        case 'object':
            if (!value) {
                return 'null';
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }
                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }
    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {'': value});
        };
    }
    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }
            throw new SyntaxError('JSON.parse');
        };
    }
})(
  (typeof exports !== 'undefined') ? 
    exports : 
    (window.JSON ? 
      (window.JSON) :
      (window.JSON = {})
    )
);
},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
/* * Cookies.js - 1.2.1 * https://github.com/ScottHamper/Cookies * * This is free and unencumbered software released into the public domain. */(function (global, undefined) {    'use strict';    var factory = function (window) {        if (typeof window.document !== 'object') {            throw new Error('Cookies.js requires a `window` with a `document` object');        }        var Cookies = function (key, value, options) {            return arguments.length === 1 ?                Cookies.get(key) : Cookies.set(key, value, options);        };        Cookies._document = window.document;        Cookies._cacheKeyPrefix = 'cookey.';        Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');        Cookies.defaults = {            path: '/',            secure: false        };        Cookies.get = function (key) {            if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {                Cookies._renewCache();            }            return Cookies._cache[Cookies._cacheKeyPrefix + key];        };        Cookies.set = function (key, value, options) {            options = Cookies._getExtendedOptions(options);            options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);            Cookies._document.cookie = Cookies._generateCookieString(key, value, options);            return Cookies;        };        Cookies.expire = function (key, options) {            return Cookies.set(key, undefined, options);        };        Cookies._getExtendedOptions = function (options) {            return {                path: options && options.path || Cookies.defaults.path,                domain: options && options.domain || Cookies.defaults.domain,                expires: options && options.expires || Cookies.defaults.expires,                secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure            };        };        Cookies._isValidDate = function (date) {            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());        };        Cookies._getExpiresDate = function (expires, now) {            now = now || new Date();            if (typeof expires === 'number') {                expires = expires === Infinity ?                    Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);            } else if (typeof expires === 'string') {                expires = new Date(expires);            }            if (expires && !Cookies._isValidDate(expires)) {                throw new Error('`expires` parameter cannot be converted to a valid Date instance');            }            return expires;        };        Cookies._generateCookieString = function (key, value, options) {            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);            options = options || {};            var cookieString = key + '=' + value;            cookieString += options.path ? ';path=' + options.path : '';            cookieString += options.domain ? ';domain=' + options.domain : '';            cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';            cookieString += options.secure ? ';secure' : '';            return cookieString;        };        Cookies._getCacheFromString = function (documentCookie) {            var cookieCache = {};            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];            for (var i = 0; i < cookiesArray.length; i++) {                var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);                if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {                    cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;                }            }            return cookieCache;        };        Cookies._getKeyValuePairFromCookieString = function (cookieString) {            var separatorIndex = cookieString.indexOf('=');            separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;            return {                key: decodeURIComponent(cookieString.substr(0, separatorIndex)),                value: decodeURIComponent(cookieString.substr(separatorIndex + 1))            };        };        Cookies._renewCache = function () {            Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);            Cookies._cachedDocumentCookie = Cookies._document.cookie;        };        Cookies._areEnabled = function () {            var testKey = 'cookies.js';            var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';            Cookies.expire(testKey);            return areEnabled;        };        Cookies.enabled = Cookies._areEnabled();        return Cookies;    };    var cookiesExport = typeof global.document === 'object' ? factory(global) : factory;    if (typeof define === 'function' && define.amd) {        define(function () { return cookiesExport; });    } else if (typeof exports === 'object') {        if (typeof module === 'object' && typeof module.exports === 'object') {            exports = module.exports = cookiesExport;        }        exports.Cookies = cookiesExport;    } else {        global.Cookies = cookiesExport;    }})(typeof window === 'undefined' ? this : window);
},{}],27:[function(require,module,exports){
/*!
 * Sizzle CSS Selector Engine v2.2.0
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-04-10
 */
(function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},
	MAX_NEGATIVE = 1 << 31,
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},
	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
	whitespace = "[\\x20\\t\\r\\n\\f]",
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		"*([*^$|!~]?=)" + whitespace +
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",
	pseudos = ":(" + identifier + ")(?:\\((" +
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		".*" +
		")\\)|)",
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),
	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,
	rnative = /^[^{]+\{\s*\[native \w/,
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	rsibling = /[+~]/,
	rescape = /'|\\/g,
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},
	unloadHandler = function() {
		setDocument();
	};
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :
		function( target, els ) {
			var j = target.length,
				i = 0;
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}
function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,
		nodeType = context ? context.nodeType : 9;
	results = results || [];
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
		return results;
	}
	if ( !seed ) {
		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;
		if ( documentIsHTML ) {
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
				if ( (m = match[1]) ) {
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}
					} else {
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {
							results.push( elem );
							return results;
						}
					}
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {
					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;
				} else if ( context.nodeName.toLowerCase() !== "object" ) {
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "[id='" + nid + "'] " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}
				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}
/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];
	function cache( key, value ) {
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}
/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}
/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");
	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		div = null;
	}
}
/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;
	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}
/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );
	if ( diff ) {
		return diff;
	}
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}
	return a ? 1 : -1;
}
/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}
/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}
/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}
/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}
support = Sizzle.support = {};
/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};
/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );
	if ( document.documentMode && (parent = document.defaultView) && parent.top !== parent ) {
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}
	/* Attributes
	---------------------------------------------------------------------- */
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});
	/* getElement(s)By*
	---------------------------------------------------------------------- */
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		delete Expr.find["ID"];
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}
				return tmp;
			}
			return results;
		};
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};
	/* QSA/matchesSelector
	---------------------------------------------------------------------- */
	rbuggyMatches = [];
	rbuggyQSA = [];
	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		assert(function( div ) {
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});
		assert(function( div ) {
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}
	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {
		assert(function( div ) {
			support.disconnectedMatch = matches.call( div, "div" );
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}
	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );
	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};
	/* Sorting
	---------------------------------------------------------------------- */
	sortOrder = hasCompare ?
	function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :
			1;
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}
		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}
		while ( ap[i] === bp[i] ) {
			i++;
		}
		return i ?
			siblingCheck( ap[i], bp[i] ) :
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};
	return document;
};
Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};
Sizzle.matchesSelector = function( elem, expr ) {
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}
	expr = expr.replace( rattributeQuotes, "='$1']" );
	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {
		try {
			var ret = matches.call( elem, expr );
			if ( ret || support.disconnectedMatch ||
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}
	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};
Sizzle.contains = function( context, elem ) {
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};
Sizzle.attr = function( elem, name ) {
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}
	var fn = Expr.attrHandle[ name.toLowerCase() ],
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;
	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};
Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};
/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );
	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}
	sortInput = null;
	return results;
};
/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;
	if ( !nodeType ) {
		while ( (node = elem[i++]) ) {
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	return ret;
};
Expr = Sizzle.selectors = {
	cacheLength: 50,
	createPseudo: markFunction,
	match: matchExpr,
	attrHandle: {},
	find: {},
	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},
	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );
			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}
			return match.slice( 0, 4 );
		},
		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();
			if ( match[1].slice( 0, 3 ) === "nth" ) {
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}
			return match;
		},
		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];
			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				(excess = tokenize( unquoted, true )) &&
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}
			return match.slice( 0, 3 );
		}
	},
	filter: {
		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},
		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];
			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},
		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );
				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}
				result += "";
				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},
		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";
			return first === 1 && last === 0 ?
				function( elem ) {
					return !!elem.parentNode;
				} :
				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;
					if ( parent ) {
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {
										return false;
									}
								}
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}
						start = [ forward ? parent.firstChild : parent.lastChild ];
						if ( forward && useCache ) {
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});
							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}
						} else {
							if ( useCache ) {
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});
								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}
							if ( diff === false ) {
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {
									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});
											uniqueCache[ type ] = [ dirruns, diff ];
										}
										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},
		"PSEUDO": function( pseudo, argument ) {
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );
			if ( fn[ expando ] ) {
				return fn( argument );
			}
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}
			return fn;
		}
	},
	pseudos: {
		"not": markFunction(function( selector ) {
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );
			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					input[0] = null;
					return !results.pop();
				};
		}),
		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),
		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),
		"lang": markFunction( function( lang ) {
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {
						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},
		"root": function( elem ) {
			return elem === docElem;
		},
		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},
		"enabled": function( elem ) {
			return elem.disabled === false;
		},
		"disabled": function( elem ) {
			return elem.disabled === true;
		},
		"checked": function( elem ) {
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},
		"selected": function( elem ) {
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			return elem.selected === true;
		},
		"empty": function( elem ) {
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},
		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},
		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},
		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},
		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),
		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),
		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),
		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),
		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),
		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),
		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};
Expr.pseudos["nth"] = Expr.pseudos["eq"];
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();
tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];
	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}
	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;
	while ( soFar ) {
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}
		matched = false;
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}
		if ( !matched ) {
			break;
		}
	}
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			tokenCache( selector, groups ).slice( 0 );
};
function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}
function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;
	return combinator.first ?
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});
						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							uniqueCache[ dir ] = newCache;
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}
function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}
function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}
function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;
	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}
	return newUnmatched;
}
function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,
			matcherOut = matcher ?
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
					[] :
					results :
				matcherIn;
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}
		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {
						seed[temp] = !(results[temp] = elem);
					}
				}
			}
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}
function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			checkContext = null;
			return ret;
		} ];
	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
			if ( matcher[ expando ] ) {
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}
	return elementMatcher( matchers );
}
function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;
			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}
				if ( bySet ) {
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}
				if ( seed ) {
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}
					setMatched = condense( setMatched );
				}
				push.apply( results, setMatched );
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {
					Sizzle.uniqueSort( results );
				}
			}
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}
			return unmatched;
		};
	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}
compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];
	if ( !cached ) {
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
		cached.selector = selector;
	}
	return cached;
};
/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );
	results = results || [];
	if ( match.length === 1 ) {
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {
			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;
			} else if ( compiled ) {
				context = context.parentNode;
			}
			selector = selector.slice( tokens.shift().value.length );
		}
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}
					break;
				}
			}
		}
	}
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;
support.detectDuplicates = !!hasDuplicate;
setDocument();
support.sortDetached = assert(function( div1 ) {
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}
if ( typeof define === "function" && define.amd ) {
	define(function() { return Sizzle; });
} else if ( typeof module !== "undefined" && module.exports ) {
	module.exports = Sizzle;
} else {
	window.Sizzle = Sizzle;
}
})( window );
},{}]},{},[1])

//# sourceMappingURL=keen-tracking.js.map