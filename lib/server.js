import KeenCore from './index';
import extend from 'keen-core/lib/utils/extend';
import {
  recordEvent,
  recordEvents,
  addEvent,
  addEvents
} from './record-events-server';
import {
  deferEvent,
  deferEvents,
  queueCapacity,
  queueInterval,
  recordDeferredEvents
} from './defer-events';
import { extendEvent, extendEvents } from './extend-events';
import { getDatetimeIndex } from './helpers/getDatetimeIndex';
import { getUniqueId } from './helpers/getUniqueId';
import { deepExtend } from './utils/deepExtend';
import { timer } from './utils/timer';
import pkg from '../package.json';

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
// Helpers
// ------------------------
extend(KeenCore.helpers, {
  getDatetimeIndex,
  getUniqueId
});

// ------------------------
// Utils
// ------------------------
extend(KeenCore.utils, {
  deepExtend,
  timer
});

KeenCore.version = pkg.version;

export const Keen = KeenCore;
module.exports = Keen;
