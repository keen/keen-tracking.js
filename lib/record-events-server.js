import 'promise-polyfill/src/polyfill';

import Keen from './index';
import each from 'keen-core/lib/utils/each';
import extend from 'keen-core/lib/utils/extend';
import { getExtendedEventBody } from './extend-event';

import nodeRequestRetry from './utils/nodeRequestRetry';
import isUnique from './utils/unique';

// ------------------------------
// .recordEvent
// ------------------------------

export function recordEvent(eventCollectionOrConfigObject, eventBody, callback){
  let eventCollection = eventCollectionOrConfigObject;
  let unique;
  let configObject;
  let clientConfig = this.config;

  if (Array.isArray(eventCollectionOrConfigObject)) {
    return recordEvents,call(this, eventCollectionOrConfigObject, callback);
  }

  if (typeof eventCollectionOrConfigObject === 'object'
    && eventCollectionOrConfigObject) {
    // slowly but surely we migrate to one object with all args
    configObject = eventCollectionOrConfigObject;
    eventCollection = eventCollectionOrConfigObject.collection;
    eventBody = eventCollectionOrConfigObject.event;
    callback = eventCollectionOrConfigObject.callback;
    unique = eventCollectionOrConfigObject.unique;
  }

  let data = {};
  let extendedEventBody = {};

  if (!checkValidation.call(this, callback)) {
    return;
  }

  if (!eventCollection || typeof eventCollection !== 'string') {
    handleValidationError.call(this, 'Collection name must be a string.', callback);
    return;
  }

  extend(data, eventBody);

  // ------------------------------
  // Run extendEvent(s) transforms
  // ------------------------------

  getExtendedEventBody(extendedEventBody, this.extensions.events);
  getExtendedEventBody(extendedEventBody, this.extensions.collections[eventCollection]);
  getExtendedEventBody(extendedEventBody, [data]);

  if (unique) {
    return isUnique(configObject, extendedEventBody).then(isUniqueResult => {
      if (!isUniqueResult) {
        return Promise.resolve({
          created: false,
          message: '[NOT_UNIQUE] This event has already been recorded'
        });
      }
      return recordEvent.call(this, { ...eventCollectionOrConfigObject, unique: undefined });
    });
  }

  this.emit('recordEvent', eventCollection, extendedEventBody);

  if (!Keen.enabled) {
    handleValidationError.call(this, 'Keen.enabled is set to false.', callback);
    return false;
  }

  return sendEventData.call(this, encodeURIComponent(eventCollection), extendedEventBody, callback);
}



// ------------------------------
// .recordEvents
// ------------------------------

export function recordEvents(eventsHash, callback){
  const self = this;
  let extendedEventsHash = {};

  if (!checkValidation.call(this, callback)) {
    return;
  }

  // ------------------------------
  // Run extendEvent(s) transforms
  // ------------------------------
  each(eventsHash, function(event){
    // Find or create collection on new hash
    extendedEventsHash[event.collection] = extendedEventsHash[event.collection] || [];
    // Loop over each eventBody in the existing hash
      let eventBody = event.event;
      // Create a new data object
      let extendedEventBody = {};
      // Process "events" transform pipeline
      getExtendedEventBody(extendedEventBody, self.extensions.events);
      // Process "collection" transform pipeline
      getExtendedEventBody(extendedEventBody, self.extensions.collections[event.collection]);
      // Blend existing eventBody data into the result
      getExtendedEventBody(extendedEventBody, [eventBody]);
      // Push extendedEventBody into new hash
      extendedEventsHash[event.collection].push(extendedEventBody);
  });

  this.emit('recordEvents', extendedEventsHash);

  if (!Keen.enabled) {
    handleValidationError.call(this, 'Keen.enabled is set to false.', callback);
    return false;
  }

  return sendEventData.call(this, undefined, extendedEventsHash, callback);
}

// ------------------------------
// Validation
// ------------------------------

function checkValidation(callback){
  if (!this.projectId()) {
    handleValidationError.call(this, 'Keen.Client is missing a projectId property.', callback);
    return false;
  }
  if (!this.writeKey()) {
    handleValidationError.call(this, 'Keen.Client is missing a writeKey property.', callback);
    return false;
  }
  return true;
}

function handleValidationError(message, cb){
  const err = 'Event(s) not recorded: ' + message;
  this.emit('error', err);
  if (cb) {
    cb.call(this, err, null);
  }
}

function sendEventData(path, eventData, callback){
  const data = JSON.stringify(eventData);

  let urlPath = this.url('events', path)
    .replace(this.config.protocol + '://' + this.config.host, '');

  const config = {
    host: this.config.host,
    path: urlPath,
    method: 'POST',
    headers: {
      'Authorization': this.writeKey(),
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    },
    ...this.config.nodeRequestConfig
  };

  return nodeRequestRetry({
    retry: this.config.retry,
    protocol: this.config.protocol,
    config,
    data,
    callback
  });
}
