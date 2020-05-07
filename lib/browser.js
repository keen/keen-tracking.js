import KeenCore from './index';
import each from 'keen-core/lib/utils/each';
import extend from 'keen-core/lib/utils/extend';
import { listenerCore } from './utils/listener';
import {
  recordEvent,
  recordEvents
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
import { setOptOut } from './utils/optOut';
import { isLocalStorageAvailable } from './utils/localStorage';

// ------------------------
// Methods
// ------------------------
extend(KeenCore.prototype, {
  recordEvent,
  recordEvents
});

extend(KeenCore.prototype, {
  deferEvent,
  deferEvents,
  queueCapacity,
  queueInterval,
  recordDeferredEvents,
  setOptOut
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
  cookie,
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

export let keenGlobals = undefined;
if (typeof webpackKeenGlobals !== 'undefined') {
  keenGlobals = webpackKeenGlobals;
}

if (isLocalStorageAvailable && localStorage.getItem('optout')) {
  KeenCore.optedOut = true;
}

if (navigator.doNotTrack === '1'
  || navigator.doNotTrack === 'yes') {
  KeenCore.doNotTrack = true;
}

export const Keen = KeenCore.extendLibrary(KeenCore); // deprecated, left for backward compatibility
export const KeenTracking = Keen;
export default Keen;
