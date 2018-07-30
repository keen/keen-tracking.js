import KeenCore from './index';
import each from 'keen-core/lib/utils/each';
import extend from 'keen-core/lib/utils/extend';
import { listenerCore } from './utils/listener';
import {
  recordEvent,
  recordEvents,
  addEvent,
  addEvents
} from './record-events-browser';
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
import { cookie } from './utils/cookie';
import { deepExtend } from './utils/deepExtend';
import { serializeForm } from './utils/serializeForm';
import { timer } from './utils/timer';

  // ------------------------
  // Methods
  // ------------------------
  extend(KeenCore.prototype, {
    recordEvent,
    recordEvents,
    addEvent,
    addEvents
  });
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
  // Deprecated
  // ------------------------
  KeenCore.prototype.trackExternalLink = trackExternalLink;

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
    cookie,
    deepExtend,
    listener,
    serializeForm,
    timer
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

export let keenGlobals = undefined;
if (typeof webpackKeenGlobals !== 'undefined') {
  keenGlobals = webpackKeenGlobals;
}

export const Keen = KeenCore.extendLibrary(KeenCore); // deprecated, left for backward compatibility
export const KeenTracking = Keen;
export default Keen;
