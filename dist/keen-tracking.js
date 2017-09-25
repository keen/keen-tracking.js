(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function(env) {
  'use strict';
  var KeenLibrary = require('./');
  var each = require('./utils/each');
  var extend = require('./utils/extend');
  var listener = require('./utils/listener')(KeenLibrary);
  extend(KeenLibrary.prototype, require('./record-events-browser'));
  extend(KeenLibrary.prototype, require('./defer-events'));
  extend(KeenLibrary.prototype, {
    'extendEvent': require('./extend-events').extendEvent,
    'extendEvents': require('./extend-events').extendEvents
  });
  KeenLibrary.prototype.trackExternalLink = trackExternalLink;
  extend(KeenLibrary.helpers, {
    'getBrowserProfile'  : require('./helpers/getBrowserProfile'),
    'getDatetimeIndex'   : require('./helpers/getDatetimeIndex'),
    'getDomNodePath'     : require('./helpers/getDomNodePath'),
    'getDomNodeProfile'  : require('./helpers/getDomNodeProfile'),
    'getScreenProfile'   : require('./helpers/getScreenProfile'),
    'getUniqueId'        : require('./helpers/getUniqueId'),
    'getWindowProfile'   : require('./helpers/getWindowProfile')
  });
  extend(KeenLibrary.utils, {
    'cookie'     : require('./utils/cookie'),
    'deepExtend' : require('./utils/deepExtend'),
    'listener'   : listener,
    'timer'      : require('./utils/timer')
  });
  KeenLibrary.listenTo = function(listenerHash){
    each(listenerHash, function(callback, key){
      var split = key.split(' ');
      var eventType = split[0],
          selector = split.slice(1, split.length).join(' ');
      return listener(selector).on(eventType, callback);
    });
  };
  function trackExternalLink(jsEvent, eventCollection, payload, timeout, timeoutCallback){
    this.emit('error', 'This method has been deprecated. Check out DOM listeners: https://github.com/keen/keen-tracking.js#listeners');
    var evt = jsEvent,
      target = (evt.currentTarget) ? evt.currentTarget : (evt.srcElement || evt.target),
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
      callback = function(){
        if(!triggered && !evt.metaKey && (targetAttr !== '_blank' && targetAttr !== 'blank')){
          triggered = true;
          window.location = target.href;
        }
      };
    }
    else if (target.nodeName === 'FORM') {
      callback = function(){
        if(!triggered){
          triggered = true;
          target.submit();
        }
      };
    }
    else {
      this.trigger('error', '#trackExternalLink method not attached to an <a> or <form> DOM element');
    }
    if (timeoutCallback) {
      callback = function(){
        if(!triggered){
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
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KeenLibrary;
  }
  if (typeof define !== 'undefined' && define.amd) {
    define('keen-tracking', [], function(){
      return KeenLibrary;
    });
  }
  env.Keen = KeenLibrary.extendLibrary(KeenLibrary);
}).call(this, typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./":11,"./defer-events":2,"./extend-events":3,"./helpers/getBrowserProfile":4,"./helpers/getDatetimeIndex":5,"./helpers/getDomNodePath":6,"./helpers/getDomNodeProfile":7,"./helpers/getScreenProfile":8,"./helpers/getUniqueId":9,"./helpers/getWindowProfile":10,"./record-events-browser":12,"./utils/cookie":14,"./utils/deepExtend":15,"./utils/each":16,"./utils/extend":17,"./utils/listener":18,"./utils/timer":20}],2:[function(require,module,exports){
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
  if (!this.queue.timer) {
    this.queue.start();
  }
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
    if (!self.queue.timer) {
      self.queue.start();
    }
  });
  self.emit('deferEvents', eventsHash);
  return self;
}
function queueCapacity(num){
  if (!arguments.length) return this.queue.config.capacity;
  this.queue.config.capacity = num ? Number(num): 0;
  this.queue.check();
  return this;
}
function queueInterval(num){
  if (!arguments.length) return this.queue.config.interval;
  this.queue.config.interval = num ? Number(num): 0;
  this.queue.check();
  return this;
}
function recordDeferredEvents(){
  var self = this,
      clonedQueueConfig,
      clonedQueueEvents;
  if (self.queue.capacity > 0) {
    self.queue.pause();
    clonedQueueConfig = JSON.parse(JSON.stringify(self.queue.config));
    clonedQueueEvents = JSON.parse(JSON.stringify(self.queue.events));
    self.queue = queue();
    self.queue.config = clonedQueueConfig;
    self.emit('recordDeferredEvents', clonedQueueEvents);
    self.recordEvents(clonedQueueEvents, function(err, res){
      if (err) {
        self.recordEvents(clonedQueueEvents);
      }
      else {
        clonedQueueEvents = undefined;
      }
    });
  }
  return self;
}
function handleValidationError(message){
  var err = 'Event(s) not deferred: ' + message;
  this.emit('error', err);
}
},{"./index":11,"./utils/each":16,"./utils/queue":19}],3:[function(require,module,exports){
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
},{"./utils/deepExtend":15,"./utils/each":16}],4:[function(require,module,exports){
var getScreenProfile = require('./getScreenProfile'),
    getWindowProfile = require('./getWindowProfile');
function getBrowserProfile() {
  return {
    'cookies'    : ('undefined' !== typeof navigator.cookieEnabled) ? navigator.cookieEnabled : false,
    'codeName'   : navigator.appCodeName,
    'description': getDocumentDescription(),
    'language'   : navigator.language,
    'name'       : navigator.appName,
    'online'     : navigator.onLine,
    'platform'   : navigator.platform,
    'useragent'  : navigator.userAgent,
    'version'    : navigator.appVersion,
    'screen'     : getScreenProfile(),
    'window'     : getWindowProfile()
  }
}
function getDocumentDescription() {
  var el;
  if (document && typeof document.querySelector === 'function') {
    el = document.querySelector('meta[name="description"]');
  }
  return el ? el.content : '';
}
module.exports = getBrowserProfile;
},{"./getScreenProfile":8,"./getWindowProfile":10}],5:[function(require,module,exports){
function getDateTimeIndex(input){
  var date = input || new Date();
  return {
    'hour_of_day'  : date.getHours(),
    'day_of_week'  : parseInt( 1 + date.getDay() ),
    'day_of_month' : date.getDate(),
    'month'        : parseInt( 1 + date.getMonth() ),
    'year'         : date.getFullYear()
  };
}
module.exports = getDateTimeIndex;
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
var getDomNodePath = require('./getDomNodePath');
function getDomNodeProfile(el) {
  return {
    action: el.action,
    class: el.className,
    href: el.href,
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
module.exports = getDomNodeProfile;
},{"./getDomNodePath":6}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
function getUniqueId(){
  var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return str.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}
module.exports = getUniqueId;
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
var KeenCore = require('keen-core');
var each = require('./utils/each'),
    extend = require('./utils/extend'),
    queue = require('./utils/queue');
KeenCore.helpers = KeenCore.helpers || {};
KeenCore.on('client', function(client){
  client.extensions = {
    events: [],
    collections: {}
  };
  client.queue = queue();
  client.queue.on('flush', function(){
    client.recordDeferredEvents();
  });
});
KeenCore.prototype.writeKey = function(str){
  if (!arguments.length) return this.config.writeKey;
  this.config.writeKey = (str ? String(str) : null);
  return this;
};
KeenCore.prototype.setGlobalProperties = function(props){
  KeenCore.log('This method has been deprecated. Check out #extendEvents: https://github.com/keen/keen-tracking.js#extend-events');
  if (!props || typeof props !== 'function') {
    this.emit('error', 'Invalid value for global properties: ' + props);
    return;
  }
  this.config.globalProperties = props;
  return this;
};
module.exports = KeenCore;
},{"./utils/each":16,"./utils/extend":17,"./utils/queue":19,"keen-core":23}],12:[function(require,module,exports){
var Keen = require('./index');
var base64 = require('./utils/base64');
var each = require('./utils/each');
var extend = require('./utils/extend');
var extendEvents = require('./extend-events');
module.exports = {
  'recordEvent': recordEvent,
  'recordEvents': recordEvents,
  'addEvent': addEvent,
  'addEvents': addEvents
};
function recordEvent(eventCollection, eventBody, callback, async){
  var url, data, cb, getRequestUrl, getRequestUrlOkLength, extendedEventBody, isAsync;
  url = this.url('events', encodeURIComponent(eventCollection));
  data = {};
  cb = callback;
  isAsync = ('boolean' === typeof async) ? async : true;
  if (!checkValidation.call(this, cb)) {
    return;
  }
  if (!eventCollection || typeof eventCollection !== 'string') {
    handleValidationError.call(this, 'Collection name must be a string.', cb);
    return;
  }
  if (this.config.globalProperties) {
    data = this.config.globalProperties(eventCollection);
  }
  extend(data, eventBody);
  extendedEventBody = {};
  extendEvents.getExtendedEventBody(extendedEventBody, this.extensions.events);
  extendEvents.getExtendedEventBody(extendedEventBody, this.extensions.collections[eventCollection]);
  extendEvents.getExtendedEventBody(extendedEventBody, [data]);
  this.emit('recordEvent', eventCollection, extendedEventBody);
  if (!Keen.enabled) {
    handleValidationError.call(this, 'Keen.enabled is set to false.', cb);
    return false;
  }
  getRequestUrl = this.url('events', encodeURIComponent(eventCollection), {
    api_key  : this.writeKey(),
    data     : encodeURIComponent( base64.encode( JSON.stringify(extendedEventBody) ) ),
    modified : new Date().getTime()
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
        }
        else {
          attemptPostXhr.call(this, url, extendedEventBody,
              'Beacon URL length exceeds current browser limit, and XHR is not supported.', cb)
        }
        break;
      default:
        if (getRequestUrlOkLength) {
          sendJSONp.call(this, getRequestUrl, cb);
        }
        else {
          attemptPostXhr.call(this, url, extendedEventBody,
              'JSONp URL length exceeds current browser limit, and XHR is not supported.', cb)
        }
        break;
    }
  }
  else {
    if (getRequestUrlOkLength) {
      sendSynchronousXhr(getRequestUrl);
    }
  }
  callback = cb = null;
  return this;
}
function recordEvents(eventsHash, callback){
  var self = this, url, cb, extendedEventsHash;
  url = this.url('events');
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
  if (this.config.globalProperties) {
    each(eventsHash, function(events, collection){
      each(events, function(body, index){
        var modified = self.config.globalProperties(collection);
        eventsHash[collection][index] = extend(modified, body);
      });
    });
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
function addEvent(){
  this.emit('error', 'This method has been deprecated. Check out #recordEvent: https://github.com/keen/keen-tracking.js#record-a-single-event');
  recordEvent.apply(this, arguments);
}
function addEvents(){
  this.emit('error', 'This method has been deprecated. Check out #recordEvents: https://github.com/keen/keen-tracking.js#record-multiple-events');
  recordEvents.apply(this, arguments);
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
  if ('undefined' !== typeof window && navigator) {
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
      return 2000;
    }
  }
  return 16000;
}
function attemptPostXhr(url, data, noXhrError, callback) {
  if (getXhr()) {
    sendXhr.call(this, 'POST', url, data, callback);
  }
  else {
    handleValidationError.call(this, noXhrError);
  }
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
          response = JSON.parse( xhr.responseText );
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
    payload = JSON.stringify(data);
  }
  if (method.toUpperCase() === 'GET') {
    xhr.send();
  }
  if (method.toUpperCase() === 'POST') {
    xhr.send(payload);
  }
}
function sendSynchronousXhr(url){
  var xhr = getXhr();
  if (xhr) {
    xhr.open('GET', url, false);
    xhr.send(null);
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
},{"./extend-events":3,"./index":11,"./utils/base64":13,"./utils/each":16,"./utils/extend":17}],13:[function(require,module,exports){
module.exports = require('keen-core/lib/utils/base64');
},{"keen-core/lib/utils/base64":24}],14:[function(require,module,exports){
var Cookies = require('js-cookie');
var extend = require('./extend');
module.exports = cookie;
function cookie(str){
  if (!arguments.length) return;
  if (this instanceof cookie === false) {
    return new cookie(str);
  }
  this.config = {
    key: str,
    options: {
      expires: 365
    }
  };
  this.data = this.get();
  return this;
}
cookie.prototype.get = function(str){
  var data = {};
  if (Cookies.get(this.config.key)) {
    data = Cookies.getJSON(this.config.key);
  }
  if (str && typeof data === 'object' && typeof data !== null) {
    return (typeof data[str] !== 'undefined') ? data[str] : null;
  }
  else {
    return data;
  }
};
cookie.prototype.set = function(str, value){
  if (!arguments.length || !this.enabled()) return this;
  if (typeof str === 'string'  && arguments.length === 2) {
    this.data[str] = value ? value : null;
  }
  else if (typeof str === 'object' && arguments.length === 1) {
    extend(this.data, str);
  }
  Cookies.set(this.config.key, this.data, this.config.options);
  return this;
};
cookie.prototype.expire = function(daysUntilExpire){
  if (daysUntilExpire) {
    Cookies.set(this.config.key, this.data, extend(this.config.options, { expires: daysUntilExpire }));
  } else {
    Cookies.remove(this.config.key);
    this.data = {};
  }
  return this;
};
cookie.prototype.options = function(obj){
  if (!arguments.length) return this.config.options;
  this.config.options = (typeof obj === 'object') ? obj : {};
  return this;
};
cookie.prototype.enabled = function(){
  return navigator.cookieEnabled;
};
},{"./extend":17,"js-cookie":22}],15:[function(require,module,exports){
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
        else if (arguments[i][prop] !== undefined) {
          target[prop] = clone(arguments[i][prop]);
        }
      }
    }
  }
  return target;
}
function clone(input){
  return JSON.parse( JSON.stringify(input) );
}
},{}],16:[function(require,module,exports){
module.exports = require('keen-core/lib/utils/each');
},{"keen-core/lib/utils/each":25}],17:[function(require,module,exports){
module.exports = require('keen-core/lib/utils/extend');
},{"keen-core/lib/utils/extend":26}],18:[function(require,module,exports){
var Emitter = require('component-emitter');
var each = require('./each');
/*
  var myClickerCatcher = Keen.utils.listener(".nav li > a");
  myClicker.on("click", function(e){
  });
  myClicker.once("click", function(e){ });
  myClicker.off("click");
  myClicker.off();
*/
module.exports = function(ctx){
  ctx.domListeners = ctx.domListeners || {
    /*
    'click': {
      '.nav li > a': [fn, fn, fn]
    }
    */
  };
  function listener(str){
    if (!str) return;
    if (this instanceof listener === false) {
      return new listener(str);
    }
    this.selector = str;
    return this;
  }
  listener.prototype.on = function(str, fn){
    var self = this;
    if (arguments.length !== 2 || 'string' !== typeof str || 'function' !== typeof fn) return this;
    if ('undefined' === typeof ctx.domListeners[str]) {
      addListener(str, eventHandler(str));
      ctx.domListeners[str] = {};
    }
    ctx.domListeners[str][self.selector] = ctx.domListeners[str][self.selector] || [];
    ctx.domListeners[str][self.selector].push(fn);
    return self;
  };
  listener.prototype.once = function(str, fn){
    var self = this;
    function on() {
      self.off(str, on);
      return fn.apply(self, arguments);
    }
    on.fn = fn;
    self.on(str, on);
    return self;
  };
  listener.prototype.off = function(str, fn){
    var self = this, survivors = [];
    if (arguments.length === 2) {
      each(ctx.domListeners[str][self.selector], function(handler, i){
        if (handler === fn || handler.fn === fn) return;
        survivors.push(handler);
      });
      ctx.domListeners[str][self.selector] = survivors;
    }
    else if (arguments.length === 1) {
      try {
        delete ctx.domListeners[str][self.selector];
      }
      catch(e){
        ctx.domListeners[str][self.selector] = [];
      }
    }
    else {
      each(ctx.domListeners, function(hash, eventType){
        try {
          delete ctx.domListeners[eventType][self.selector];
        }
        catch(e){
          ctx.domListeners[eventType][self.selector] = function(){};
        }
      });
    }
    return self;
  };
  function eventHandler(eventType){
    return function(e){
      var evt, target;
      evt = e || window.event;
      target = evt.target || evt.srcElement;
      if ('undefined' === ctx.domListeners[eventType]) return;
      each(ctx.domListeners[eventType], function(handlers, key){
        if (matches(target, key)) {
          each(handlers, function(fn, i){
            if ('click' === eventType && 'A' === target.nodeName) {
              deferClickEvent(evt, target, fn);
            }
            else if ('submit' === eventType && 'FORM' === target.nodeName) {
              deferFormSubmit(evt, target, fn);
            }
            else {
              fn(evt);
            }
          });
        }
        else if ('window' === key) {
          each(handlers, function(fn, i){
            fn(evt);
          });
        }
        return;
      });
    };
  }
  return listener;
}
function addListener(eventType, fn){
  if (document.addEventListener) {
    document.addEventListener(eventType, fn, false);
  } else {
    document.attachEvent("on" + eventType, fn);
  }
}
function matches(elem, selector) {
  var nodeList = ( elem.parentNode || document ).querySelectorAll( selector ) || [],
      i = nodeList.length;
  while ( i-- ) {
    if ( nodeList[i] == elem ) { return true; }
  }
  return false;
}
function deferClickEvent(evt, anchor, callback){
  var timeout = 500,
      targetAttr,
      cbResponse;
  if (anchor.getAttribute !== void 0) {
    targetAttr = anchor.getAttribute("target");
  } else if (anchor.target) {
    targetAttr = anchor.target;
  }
  cbResponse = callback(evt);
  if (('boolean' === typeof cbResponse && cbResponse === false) || evt.defaultPrevented || evt.returnValue === false) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    evt.returnValue = false;
    return false;
  }
  else if (targetAttr !== '_blank' && targetAttr !== 'blank' && !evt.metaKey) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    evt.returnValue = false;
    setTimeout(function(){
      window.location = anchor.href;
    }, timeout);
  }
  return false;
}
function deferFormSubmit(evt, form, callback){
  var timeout = 500;
  var cbResponse = callback(evt);
  if (('boolean' === typeof cbResponse && cbResponse === false) || evt.defaultPrevented || evt.returnValue === false) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    evt.returnValue = false;
    return false;
  }
  else {
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    evt.returnValue = false;
    setTimeout(function(){
      form.submit();
    }, timeout);
  }
  return false;
}
},{"./each":16,"component-emitter":21}],19:[function(require,module,exports){
var Emitter = require('component-emitter');
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
  };
  this.interval = 0;
  this.timer = null;
  return this;
}
Emitter(queue.prototype);
queue.prototype.check = function() {
  if (shouldFlushQueue(this)) {
    this.flush();
  }
  if (this.config.interval === 0 || this.capacity === 0) {
    this.pause();
  }
  return this;
};
queue.prototype.flush = function() {
  this.emit('flush');
  this.interval = 0;
  return this;
};
queue.prototype.pause = function() {
  if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
  }
  return this;
};
queue.prototype.start = function() {
  var self = this;
  self.pause();
  self.timer = setInterval(function() {
    self.interval++;
    self.check();
  }, 1000);
  return self;
};
function shouldFlushQueue(props) {
  if (props.capacity > 0 && props.interval >= props.config.interval) {
    return true;
  }
  else if (props.capacity >= props.config.capacity) {
    return true;
  }
  return false;
}
module.exports = queue;
},{"component-emitter":21}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
/** * Expose `Emitter`. */if (typeof module !== 'undefined') {  module.exports = Emitter;}/** * Initialize a new `Emitter`. * * @api public */function Emitter(obj) {  if (obj) return mixin(obj);};/** * Mixin the emitter properties. * * @param {Object} obj * @return {Object} * @api private */function mixin(obj) {  for (var key in Emitter.prototype) {    obj[key] = Emitter.prototype[key];  }  return obj;}/** * Listen on the given `event` with `fn`. * * @param {String} event * @param {Function} fn * @return {Emitter} * @api public */Emitter.prototype.on =Emitter.prototype.addEventListener = function(event, fn){  this._callbacks = this._callbacks || {};  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])    .push(fn);  return this;};/** * Adds an `event` listener that will be invoked a single * time then automatically removed. * * @param {String} event * @param {Function} fn * @return {Emitter} * @api public */Emitter.prototype.once = function(event, fn){  function on() {    this.off(event, on);    fn.apply(this, arguments);  }  on.fn = fn;  this.on(event, on);  return this;};/** * Remove the given callback for `event` or all * registered callbacks. * * @param {String} event * @param {Function} fn * @return {Emitter} * @api public */Emitter.prototype.off =Emitter.prototype.removeListener =Emitter.prototype.removeAllListeners =Emitter.prototype.removeEventListener = function(event, fn){  this._callbacks = this._callbacks || {};  if (0 == arguments.length) {    this._callbacks = {};    return this;  }  var callbacks = this._callbacks['$' + event];  if (!callbacks) return this;  if (1 == arguments.length) {    delete this._callbacks['$' + event];    return this;  }  var cb;  for (var i = 0; i < callbacks.length; i++) {    cb = callbacks[i];    if (cb === fn || cb.fn === fn) {      callbacks.splice(i, 1);      break;    }  }  return this;};/** * Emit `event` with the given args. * * @param {String} event * @param {Mixed} ... * @return {Emitter} */Emitter.prototype.emit = function(event){  this._callbacks = this._callbacks || {};  var args = [].slice.call(arguments, 1)    , callbacks = this._callbacks['$' + event];  if (callbacks) {    callbacks = callbacks.slice(0);    for (var i = 0, len = callbacks.length; i < len; ++i) {      callbacks[i].apply(this, args);    }  }  return this;};/** * Return array of callbacks for `event`. * * @param {String} event * @return {Array} * @api public */Emitter.prototype.listeners = function(event){  this._callbacks = this._callbacks || {};  return this._callbacks['$' + event] || [];};/** * Check if this emitter has `event` handlers. * * @param {String} event * @return {Boolean} * @api public */Emitter.prototype.hasListeners = function(event){  return !! this.listeners(event).length;};},{}],22:[function(require,module,exports){
/*!
 * JavaScript Cookie v2.1.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
(function (factory) {
	if (false) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		var _OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = _OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}
	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);
				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}
				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}
				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}
				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);
				return (document.cookie = [
					key, '=', value,
					attributes.expires && '; expires=' + attributes.expires.toUTCString(),
					attributes.path    && '; path=' + attributes.path,
					attributes.domain  && '; domain=' + attributes.domain,
					attributes.secure ? '; secure' : ''
				].join(''));
			}
			if (!key) {
				result = {};
			}
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;
			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var name = parts[0].replace(rdecode, decodeURIComponent);
				var cookie = parts.slice(1).join('=');
				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}
				try {
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);
					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}
					if (key === name) {
						result = cookie;
						break;
					}
					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}
			return result;
		}
		api.get = api.set = api;
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};
		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};
		api.withConverter = init;
		return api;
	}
	return init(function () {});
}));
},{}],23:[function(require,module,exports){
(function (global){
(function(env){
  var previousKeen = env.Keen || undefined;
  var each = require('./utils/each'),
      extend = require('./utils/extend'),
      parseParams = require('./utils/parse-params'),
      serialize = require('./utils/serialize');
  var Emitter = require('component-emitter');
  function Client(props){
    if (this instanceof Client === false) {
      return new Client(props);
    }
    this.configure(props);
    if (Client.debug) {
      this.on('error', Client.log);
    }
    this.emit('ready');
    Client.emit('client', this);
  }
  if (previousKeen && typeof previousKeen.resources === 'undefined') {
    Client.legacyVersion = previousKeen;
  }
  Emitter(Client);
  Emitter(Client.prototype);
  extend(Client, {
    debug: false,
    enabled: true,
    loaded: false,
    version: '1.2.1'
  });
  Client.helpers = Client.helpers || {};
  Client.resources = Client.resources || {};
  extend(Client.resources, {
    'base'      : '{protocol}://{host}',
    'version'   : '{protocol}://{host}/3.0',
    'projects'  : '{protocol}://{host}/3.0/projects',
    'projectId' : '{protocol}://{host}/3.0/projects/{projectId}',
    'events'    : '{protocol}://{host}/3.0/projects/{projectId}/events',
    'queries'   : '{protocol}://{host}/3.0/projects/{projectId}/queries'
  });
  Client.utils = Client.utils || {};
  extend(Client.utils, {
    'each'        : each,
    'extend'      : extend,
    'parseParams' : parseParams,
    'serialize'   : serialize
  });
  Client.extendLibrary = function(target, source) {
    var previous = previousKeen || source;
    if (isDefined(previous) && isDefined(previous.resources)) {
      each(previous, function(value, key) {
        if (typeof value === 'object') {
          target[key] = target[key] || {};
          extend(target[key], value);
        }
        else {
          target[key] = target[key] || value;
        }
      });
      extend(target.prototype, previous.prototype);
    }
    return target;
  };
  Client.log = function(str){
    if (Client.debug && typeof console === 'object') {
      console.log('[Keen]', str);
    }
  };
  Client.noConflict = function(){
    if (typeof env.Keen !== 'undefined') {
      env.Keen = Client.legacyVersion || previousKeen;
    }
    return Client;
  };
  Client.ready = function(fn){
    if (Client.loaded) {
      fn();
    }
    else {
      Client.once('ready', fn);
    }
  };
  Client.prototype.configure = function(obj){
    var config = obj || {};
    this.config = this.config || {
      projectId    : undefined,
      writeKey     : undefined,
      host         : 'api.keen.io',
      protocol     : 'https',
      requestType  : 'jsonp',
      resources    : extend({}, Client.resources)
    };
    if (typeof window !== 'undefined' && window.navigator && window.navigator.userAgent && window.navigator.userAgent.indexOf('MSIE') > -1) {
      config.protocol = document.location.protocol.replace(':', '');
    }
    if (config.host) {
      config.host.replace(/.*?:\/\//g, '');
    }
    extend(this.config, config);
    return this;
  };
  Client.prototype.masterKey = function(str){
    if (!arguments.length) return this.config.masterKey;
    this.config.masterKey = str ? String(str) : null;
    return this;
  };
  Client.prototype.projectId = function(str){
    if (!arguments.length) return this.config.projectId;
    this.config.projectId = (str ? String(str) : null);
    return this;
  };
  Client.prototype.resources = function(obj){
    if (!arguments.length) return this.config.resources;
    var self = this;
    if (typeof obj === 'object') {
      each(obj, function(value, key){
        self.config.resources[key] = (value ? value : null);
      });
    }
    return self;
  };
  Client.prototype.url = function(name){
    var args = Array.prototype.slice.call(arguments, 1),
        baseUrl = this.config.resources.base || '{protocol}://{host}',
        path;
    if (name && typeof name === 'string') {
      if (this.config.resources[name]) {
        path = this.config.resources[name];
      }
      else {
        path = baseUrl + name;
      }
    }
    else {
      path = baseUrl;
    }
    each(this.config, function(value, key){
      if (typeof value !== 'object') {
        path = path.replace('{' + key + '}', value);
      }
    });
    each(args, function(arg, i){
      if (typeof arg === 'string') {
        path += '/' + arg;
      }
      else if (typeof arg === 'object') {
        path += '?';
        each(arg, function(value, key){
          path += key + '=' + value + '&';
        });
        path = path.slice(0, -1);
      }
    });
    return path;
  };
  domReady(function(){
    Client.loaded = true;
    Client.emit('ready');
  });
  function domReady(fn){
    if (Client.loaded || typeof document === 'undefined') {
      fn();
      return;
    }
    if(document.readyState == null && document.addEventListener){
      document.addEventListener('DOMContentLoaded', function DOMContentLoaded(){
        document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
        document.readyState = 'complete';
      }, false);
      document.readyState = 'loading';
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
  }
  function isDefined(target) {
    return typeof target !== 'undefined';
  }
  function isUndefined(target) {
    return typeof target === 'undefined';
  }
  module.exports = Client;
}).call(this, typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils/each":25,"./utils/extend":26,"./utils/parse-params":27,"./utils/serialize":28,"component-emitter":21}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
module.exports = extend;
function extend(target){
  for (var i = 1; i < arguments.length; i++) {
    for (var prop in arguments[i]){
      target[prop] = arguments[i][prop];
    }
  }
  return target;
};
},{}],27:[function(require,module,exports){
module.exports = parseParams;
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
},{}],28:[function(require,module,exports){
var each = require('./each'),
    extend = require('./extend');
module.exports = serialize;
function serialize(data){
  var query = [];
  each(data, function(value, key){
    if ('string' !== typeof value) {
      value = JSON.stringify(value);
    }
    query.push(key + '=' + encodeURIComponent(value));
  });
  return query.join('&');
}
},{"./each":25,"./extend":26}]},{},[1]);

//# sourceMappingURL=keen-tracking.js.map
