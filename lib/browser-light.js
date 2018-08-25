import KeenCore from './index';

import extend from 'keen-core/lib/utils/extend';
import each from 'keen-core/lib/utils/each';

import {
  recordEvent,
  recordEvents
} from './record-events-browser';

export { cookie } from './utils/cookie';
export { listener } from './utils/listener';

export { getBrowserProfile } from './helpers/getBrowserProfile';
export { getDatetimeIndex } from './helpers/getDatetimeIndex';
export { getDomainName } from './helpers/getDomainName';
export { getDomNodePath } from './helpers/getDomNodePath';
export { getDomNodeProfile } from './helpers/getDomNodeProfile';
export { getScreenProfile } from './helpers/getScreenProfile';
export { getScrollState } from './helpers/getScrollState';
export { getUniqueId } from './helpers/getUniqueId';
export { getWindowProfile } from './helpers/getWindowProfile';

export { deepExtend } from './utils/deepExtend';
export { serializeForm } from './utils/serializeForm';
export { timer } from './utils/timer';

/*

import each from 'keen-core/lib/utils/each';

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

import { deepExtend } from './utils/deepExtend';
import { serializeForm } from './utils/serializeForm';
import { timer } from './utils/timer';
*/

// ------------------------
// Methods
// ------------------------
extend(KeenCore.prototype, {
  recordEvent,
  recordEvents
});

/*
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
  // cookie,
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
*/

// only for local tests
if (typeof webpackKeenGlobals !== 'undefined') {
  KeenCore.defaultConfig = webpackKeenGlobals.demoConfig;
}

export const KeenTrackingLite = KeenCore;
export default KeenTrackingLite;
