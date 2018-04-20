(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function(env) {
  'use strict';
  var KeenCore = require('./index');
  var each = require('./utils/each');
  var extend = require('./utils/extend');
  var listener = require('./utils/listener')(KeenCore);
  extend(KeenCore.prototype, require('./record-events-browser'));
  extend(KeenCore.prototype, require('./defer-events'));
  extend(KeenCore.prototype, {
    'extendEvent'      : require('./extend-events').extendEvent,
    'extendEvents'     : require('./extend-events').extendEvents
  });
  extend(KeenCore.prototype, {
    'initAutoTracking': require('./browser-auto-tracking')(KeenCore)
  });
  KeenCore.prototype.trackExternalLink = trackExternalLink;
  extend(KeenCore.helpers, {
    'getBrowserProfile'  : require('./helpers/getBrowserProfile'),
    'getDatetimeIndex'   : require('./helpers/getDatetimeIndex'),
    'getDomainName'      : require('./helpers/getDomainName'),
    'getDomNodePath'     : require('./helpers/getDomNodePath'),
    'getDomNodeProfile'  : require('./helpers/getDomNodeProfile'),
    'getScreenProfile'   : require('./helpers/getScreenProfile'),
    'getScrollState'     : require('./helpers/getScrollState'),
    'getUniqueId'        : require('./helpers/getUniqueId'),
    'getWindowProfile'   : require('./helpers/getWindowProfile')
  });
  extend(KeenCore.utils, {
    'cookie'        : require('./utils/cookie'),
    'deepExtend'    : require('./utils/deepExtend'),
    'listener'      : listener,
    'serializeForm' : require('./utils/serializeForm'),
    'timer'         : require('./utils/timer')
  });
  KeenCore.listenTo = function(listenerHash){
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
    module.exports = KeenCore;
  }
  if (typeof define !== 'undefined' && define.amd) {
    define('keen-tracking', [], function(){
      return KeenCore;
    });
  }
  env.Keen = KeenCore.extendLibrary(KeenCore);
}).call(this, typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./browser-auto-tracking":2,"./defer-events":3,"./extend-events":4,"./helpers/getBrowserProfile":5,"./helpers/getDatetimeIndex":6,"./helpers/getDomNodePath":7,"./helpers/getDomNodeProfile":8,"./helpers/getDomainName":9,"./helpers/getScreenProfile":10,"./helpers/getScrollState":11,"./helpers/getUniqueId":12,"./helpers/getWindowProfile":13,"./index":14,"./record-events-browser":15,"./utils/cookie":17,"./utils/deepExtend":18,"./utils/each":19,"./utils/extend":20,"./utils/listener":21,"./utils/serializeForm":23,"./utils/timer":24}],2:[function(require,module,exports){
var pkg = require('../package.json');
function initAutoTracking(lib) {
  return function(obj) {
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
      var domainName = helpers.getDomainName(window.location.host);
      cookie.set('uuid', uuid,
        domainName && options.shareUuidAcrossDomains ? {
          domain: '.' + domainName
        } : {});
    }
    var scrollState = {};
    if (options.recordScrollState) {
      scrollState = helpers.getScrollState();
      utils.listener('window').on('scroll', function(){
        scrollState = helpers.getScrollState(scrollState);
      });
    }
    client.extendEvents(function() {
      var browserProfile = helpers.getBrowserProfile();
      return {
        tracked_by: pkg.name + '-' + pkg.version,
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
        geo: { /* Enriched */ },
        user_agent: '${keen.user_agent}',
        tech: {
          profile: browserProfile
          /* Enriched */
        },
        url: {
          full: window ? window.location.href : '',
          info: { /* Enriched */ }
        },
        referrer: {
          full: document ? document.referrer : '',
          info: { /* Enriched */ }
        },
        time: {
          local: { /* Enriched */ },
          utc: { /* Enriched */ }
        },
        keen: {
          timestamp: new Date().toISOString(),
          addons: [
            {
              name: 'keen:ip_to_geo',
              input: {
                ip: 'ip_address'
              },
              output : 'geo'
            },
            {
              name: 'keen:ua_parser',
              input: {
                ua_string: 'user_agent'
              },
              output: 'tech'
            },
            {
              name: 'keen:url_parser',
              input: {
                url: 'url.full'
              },
              output: 'url.info'
            },
            {
              name: 'keen:url_parser',
              input: {
                url: 'referrer.full'
              },
              output: 'referrer.info'
            },
            {
              name: 'keen:date_time_parser',
              input: {
                date_time: 'keen.timestamp'
              },
              output: 'time.utc'
            },
            {
              name: 'keen:date_time_parser',
              input: {
                date_time: 'local_time_full'
              },
              output: 'time.local'
            }
          ],
        }
      };
    });
    if (options.recordClicks === true) {
      utils.listener('a, a *').on('click', function(e) {
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
      utils.listener('form').on('submit', function(e) {
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
module.exports = initAutoTracking;
},{"../package.json":33}],3:[function(require,module,exports){
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
},{"./index":14,"./utils/each":19,"./utils/queue":22}],4:[function(require,module,exports){
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
},{"./utils/deepExtend":18,"./utils/each":19}],5:[function(require,module,exports){
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
},{"./getScreenProfile":10,"./getWindowProfile":13}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
var getDomNodePath = require('./getDomNodePath');
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
module.exports = getDomNodeProfile;
},{"./getDomNodePath":7}],9:[function(require,module,exports){
function getDomainName(host){
  var domainRegex = /\w+\.\w+$/;
  return domainRegex.test(host) ? host.match(domainRegex)[0] : null;
}
module.exports = getDomainName;
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
var extend = require('../utils/extend');
function getScrollState(obj){
  var config = typeof obj === 'object' ? obj : {};
  var state = extend({
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
  return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ) || null;
}
function getScrollOffset() {
  return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}
function getWindowHeight() {
  return window.innerHeight || document.documentElement.clientHeight;
}
module.exports = getScrollState;
},{"../utils/extend":20}],12:[function(require,module,exports){
function getUniqueId(){
  var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return str.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}
module.exports = getUniqueId;
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{"./utils/each":19,"./utils/extend":20,"./utils/queue":22,"keen-core":27}],15:[function(require,module,exports){
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
},{"./extend-events":4,"./index":14,"./utils/base64":16,"./utils/each":19,"./utils/extend":20}],16:[function(require,module,exports){
module.exports = require('keen-core/lib/utils/base64');
},{"keen-core/lib/utils/base64":28}],17:[function(require,module,exports){
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
},{"./extend":20,"js-cookie":26}],18:[function(require,module,exports){
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
        else if (arguments[i][prop] !== undefined && 'function' !== typeof arguments[i][prop]) {
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
},{}],19:[function(require,module,exports){
module.exports = require('keen-core/lib/utils/each');
},{"keen-core/lib/utils/each":29}],20:[function(require,module,exports){
module.exports = require('keen-core/lib/utils/extend');
},{"keen-core/lib/utils/extend":30}],21:[function(require,module,exports){
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
    if (
      anchor.href
      && anchor.href !== '#'
      && anchor.href !== (window.location + '#')
    ) {
      setTimeout(function(){
        window.location = anchor.href;
      }, timeout);
    }
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
},{"./each":19,"component-emitter":25}],22:[function(require,module,exports){
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
},{"component-emitter":25}],23:[function(require,module,exports){
/*
  This is a modified copy of https://github.com/defunctzombie/form-serialize/ v0.7.1
  Includes a new configuration option:
    * ignoreTypes - Array, Default: [], Example: [ 'password' ]
*/
var k_r_submitter = /^(?:submit|button|image|reset|file)$/i;
var k_r_success_contrls = /^(?:input|select|textarea|keygen)/i;
var brackets = /(\[[^\[\]]*\])/g;
function serialize(form, options) {
  if (typeof options != 'object') {
    options = { hash: !!options };
  }
  else if (options.hash === undefined) {
    options.hash = true;
  }
  var result = (options.hash) ? {} : '';
  var serializer = options.serializer || ((options.hash) ? hash_serializer : str_serialize);
  var elements = form && form.elements ? form.elements : [];
  var radio_store = Object.create(null);
  for (var i=0 ; i<elements.length ; ++i) {
    var element = elements[i];
    if (options.ignoreTypes && options.ignoreTypes.indexOf(element.type) > -1) {
      continue;
    }
    if ((!options.disabled && element.disabled) || !element.name) {
      continue;
    }
    if (!k_r_success_contrls.test(element.nodeName) ||
      k_r_submitter.test(element.type)) {
      continue;
    }
    var key = element.name;
    var val = element.value;
    if ((element.type === 'checkbox' || element.type === 'radio') && !element.checked) {
      val = undefined;
    }
    if (options.empty) {
      if (element.type === 'checkbox' && !element.checked) {
        val = '';
      }
      if (element.type === 'radio') {
        if (!radio_store[element.name] && !element.checked) {
          radio_store[element.name] = false;
        }
        else if (element.checked) {
          radio_store[element.name] = true;
        }
      }
      if (val == undefined && element.type == 'radio') {
        continue;
      }
    }
    else {
      if (!val) {
        continue;
      }
    }
    if (element.type === 'select-multiple') {
      val = [];
      var selectOptions = element.options;
      var isSelectedOptions = false;
      for (var j=0 ; j<selectOptions.length ; ++j) {
        var option = selectOptions[j];
        var allowedEmpty = options.empty && !option.value;
        var hasValue = (option.value || allowedEmpty);
        if (option.selected && hasValue) {
          isSelectedOptions = true;
          if (options.hash && key.slice(key.length - 2) !== '[]') {
            result = serializer(result, key + '[]', option.value);
          }
          else {
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
    }
    else {
      result._values = result._values || [];
      result._values.push(hash_assign(null, keys, value));
    }
    return result;
  }
  if (!between) {
    result[key] = hash_assign(result[key], keys, value);
  }
  else {
    var string = between[1];
    var index = +string;
    if (isNaN(index)) {
      result = result || {};
      result[string] = hash_assign(result[string], keys, value);
    }
    else {
      result = result || [];
      result[index] = hash_assign(result[index], keys, value);
    }
  }
  return result;
}
function hash_serializer(result, key, value) {
  var matches = key.match(brackets);
  if (matches) {
    var keys = parse_keys(key);
    hash_assign(result, keys, value);
  }
  else {
    var existing = result[key];
    if (existing) {
      if (!Array.isArray(existing)) {
        result[key] = [ existing ];
      }
      result[key].push(value);
    }
    else {
      result[key] = value;
    }
  }
  return result;
}
function str_serialize(result, key, value) {
  value = value.replace(/(\r)?\n/g, '\r\n');
  value = encodeURIComponent(value);
  value = value.replace(/%20/g, '+');
  return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + value;
}
module.exports = serialize;
},{}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
/** * Expose `Emitter`. */if (typeof module !== 'undefined') {  module.exports = Emitter;}/** * Initialize a new `Emitter`. * * @api public */function Emitter(obj) {  if (obj) return mixin(obj);};/** * Mixin the emitter properties. * * @param {Object} obj * @return {Object} * @api private */function mixin(obj) {  for (var key in Emitter.prototype) {    obj[key] = Emitter.prototype[key];  }  return obj;}/** * Listen on the given `event` with `fn`. * * @param {String} event * @param {Function} fn * @return {Emitter} * @api public */Emitter.prototype.on =Emitter.prototype.addEventListener = function(event, fn){  this._callbacks = this._callbacks || {};  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])    .push(fn);  return this;};/** * Adds an `event` listener that will be invoked a single * time then automatically removed. * * @param {String} event * @param {Function} fn * @return {Emitter} * @api public */Emitter.prototype.once = function(event, fn){  function on() {    this.off(event, on);    fn.apply(this, arguments);  }  on.fn = fn;  this.on(event, on);  return this;};/** * Remove the given callback for `event` or all * registered callbacks. * * @param {String} event * @param {Function} fn * @return {Emitter} * @api public */Emitter.prototype.off =Emitter.prototype.removeListener =Emitter.prototype.removeAllListeners =Emitter.prototype.removeEventListener = function(event, fn){  this._callbacks = this._callbacks || {};  if (0 == arguments.length) {    this._callbacks = {};    return this;  }  var callbacks = this._callbacks['$' + event];  if (!callbacks) return this;  if (1 == arguments.length) {    delete this._callbacks['$' + event];    return this;  }  var cb;  for (var i = 0; i < callbacks.length; i++) {    cb = callbacks[i];    if (cb === fn || cb.fn === fn) {      callbacks.splice(i, 1);      break;    }  }  return this;};/** * Emit `event` with the given args. * * @param {String} event * @param {Mixed} ... * @return {Emitter} */Emitter.prototype.emit = function(event){  this._callbacks = this._callbacks || {};  var args = [].slice.call(arguments, 1)    , callbacks = this._callbacks['$' + event];  if (callbacks) {    callbacks = callbacks.slice(0);    for (var i = 0, len = callbacks.length; i < len; ++i) {      callbacks[i].apply(this, args);    }  }  return this;};/** * Return array of callbacks for `event`. * * @param {String} event * @return {Array} * @api public */Emitter.prototype.listeners = function(event){  this._callbacks = this._callbacks || {};  return this._callbacks['$' + event] || [];};/** * Check if this emitter has `event` handlers. * * @param {String} event * @return {Boolean} * @api public */Emitter.prototype.hasListeners = function(event){  return !! this.listeners(event).length;};},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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
    version: '1.4.0'
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
},{"./utils/each":29,"./utils/extend":30,"./utils/parse-params":31,"./utils/serialize":32,"component-emitter":25}],28:[function(require,module,exports){
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
},{}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
module.exports = extend;
function extend(target){
  for (var i = 1; i < arguments.length; i++) {
    for (var prop in arguments[i]){
      target[prop] = arguments[i][prop];
    }
  }
  return target;
};
},{}],31:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
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
},{"./each":29,"./extend":30}],33:[function(require,module,exports){
module.exports={
  "name": "keen-tracking",
  "version": "1.4.0",
  "description": "Data Collection SDK for Keen IO",
  "main": "lib/server.js",
  "browser": "lib/browser.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/keen/keen-tracking.js.git"
  },
  "scripts": {
    "start": "gulp with-tests",
    "test": "gulp test:cli"
  },
  "bugs": "https://github.com/keen/keen-tracking.js/issues",
  "author": "Dustin Larimer <dustin@keen.io> (https://keen.io/)",
  "contributors": [
    "Dustin Larimer <dustin@keen.io> (https://github.com/dustinlarimer)",
    "Eric Anderson <eric@keen.io> (https://github.com/aroc)",
    "Joe Wegner <joe@keen.io> (http://www.wegnerdesign.com)",
    "Alex Kleissner <alex@keen.io> (https://github.com/hex337)"
  ],
  "license": "MIT",
  "dependencies": {
    "component-emitter": "^1.2.0",
    "js-cookie": "2.1.0",
    "keen-core": "^0.1.3"
  },
  "devDependencies": {
    "browserify": "^9.0.8",
    "chai": "^2.3.0",
    "chai-spies": "^0.6.0",
    "del": "^1.1.1",
    "gulp": "^3.8.11",
    "gulp-awspublish": "0.0.23",
    "gulp-connect": "^2.2.0",
    "gulp-derequire": "^2.1.0",
    "gulp-mocha": "^2.0.1",
    "gulp-mocha-phantomjs": "^0.6.1",
    "gulp-remove-empty-lines": "0.0.2",
    "gulp-rename": "^1.2.2",
    "gulp-replace": "^0.5.3",
    "gulp-sourcemaps": "^1.5.2",
    "gulp-strip-comments": "^1.0.1",
    "gulp-uglify": "^1.5.2",
    "gulp-util": "^3.0.4",
    "gulp-yuicompressor": "0.0.3",
    "karma": "^1.7.1",
    "karma-chrome-launcher": "^0.1.12",
    "karma-firefox-launcher": "^0.1.6",
    "karma-mocha": "^0.2.0",
    "karma-nyan-reporter": "0.0.60",
    "karma-requirejs": "^0.2.2",
    "karma-safari-launcher": "^0.1.1",
    "karma-sauce-launcher": "^0.2.11",
    "mocha": "^2.2.5",
    "moment": "^2.10.3",
    "phantomjs": "^1.9.7-15",
    "proclaim": "^3.3.0",
    "requirejs": "^2.3.5",
    "vinyl-buffer": "^1.0.0",
    "vinyl-source-stream": "^1.1.0"
  }
}
},{}]},{},[1]);

//# sourceMappingURL=keen-tracking.js.map
