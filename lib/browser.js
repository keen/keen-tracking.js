;(function (f) {
  // RequireJS
  if ('undefined' !== typeof define && define.amd && typeof define === 'function') {
    define('keen-tracking', [], function(){ return f(); });
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
  var each = require('./utils/each');
  var extend = require('./utils/extend');
  var listener = require('./utils/listener')(Keen);

  // ------------------------
  // Methods
  // ------------------------
  extend(Keen.prototype, require('./record-events-browser'));
  extend(Keen.prototype, require('./defer-events'));
  extend(Keen.prototype, {
    'extendEvent': require('./extend-events').extendEvent,
    'extendEvents': require('./extend-events').extendEvents
  });

  // ------------------------
  // Deprecated
  // ------------------------
  Keen.prototype.trackExternalLink = trackExternalLink;

  // ------------------------
  // Helpers
  // ------------------------
  extend(Keen.helpers, {
    'getBrowserProfile'  : require('./helpers/getBrowserProfile'),
    'getDatetimeIndex'   : require('./helpers/getDatetimeIndex'),
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
    'each'       : each,
    'extend'     : extend,
    'listener'   : listener,
    'parseParams': require('./utils/parseParams'),
    'timer'      : require('./utils/timer')
  });

  Keen.listenTo = function(listenerHash){
    each(listenerHash, function(callback, key){
      var split = key.split(' ');
      var eventType = split[0],
          selector = split.slice(1, split.length).join(' ');
      // Create an unassigned listener
      return listener(selector).on(eventType, callback);
    });
  };

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

  // ------------------------------
  // DEPRECATED
  // Apply client.globalProperties
  // ------------------------------
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
