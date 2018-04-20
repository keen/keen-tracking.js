(function(env) {
  'use strict';

  var KeenCore = require('./index');
  var each = require('./utils/each');
  var extend = require('./utils/extend');
  var listener = require('./utils/listener')(KeenCore);

  // ------------------------
  // Methods
  // ------------------------
  extend(KeenCore.prototype, require('./record-events-browser'));
  extend(KeenCore.prototype, require('./defer-events'));
  extend(KeenCore.prototype, {
    'extendEvent'      : require('./extend-events').extendEvent,
    'extendEvents'     : require('./extend-events').extendEvents
  });

  // ------------------------
  // Auto-Tracking
  // ------------------------
  extend(KeenCore.prototype, {
    'initAutoTracking': require('./browser-auto-tracking')(KeenCore)
  });

  // ------------------------
  // Deprecated
  // ------------------------
  KeenCore.prototype.trackExternalLink = trackExternalLink;

  // ------------------------
  // Helpers
  // ------------------------
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

  // ------------------------
  // Utils
  // ------------------------
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
      // Create an unassigned listener
      return listener(selector).on(eventType, callback);
    });
  };

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


  // Module Definitions
  // --------------------

  // CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KeenCore;
  }

  // RequireJS
  if (typeof define !== 'undefined' && define.amd) {
    define('keen-tracking', [], function(){
      return KeenCore;
    });
  }
  env.Keen = KeenCore.extendLibrary(KeenCore);

}).call(this, typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {});
