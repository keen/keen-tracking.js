import Keen from './index';
import each from 'keen-core/lib/utils/each';
import extend from 'keen-core/lib/utils/extend';
import { getExtendedEventBody } from './extend-events';

import nodeRequestRetry from './utils/nodeRequestRetry';

// ------------------------------
// .recordEvent
// ------------------------------

export function recordEvent(eventCollection, eventBody, callback){
  let data = {};
  let extendedEventBody = {};

  if (!checkValidation.call(this, callback)) {
    return;
  }

  if (!eventCollection || typeof eventCollection !== 'string') {
    handleValidationError.call(this, 'Collection name must be a string.', callback);
    return;
  }

  // ------------------------------
  // DEPRECATED
  // Apply client.globalProperties
  // ------------------------------
  if (this.config.globalProperties) {
    data = this.config.globalProperties(eventCollection);
  }
  extend(data, eventBody);

  // ------------------------------
  // Run extendEvent(s) transforms
  // ------------------------------

  getExtendedEventBody(extendedEventBody, this.extensions.events);
  getExtendedEventBody(extendedEventBody, this.extensions.collections[eventCollection]);
  getExtendedEventBody(extendedEventBody, [data]);

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

  if (arguments.length > 2) {
    handleValidationError.call(this, 'Incorrect arguments provided to #addEvents method', callback);
    return;
  }

  // ------------------------------
  // DEPRECATED
  // Apply client.globalProperties
  // ------------------------------
  if (this.config.globalProperties) {
    // Loop over each set of events
    each(eventsHash, function(events, collection){
      // Loop over each individual event
      each(events, function(body, index){
        // Start with global properties for this collection
        let modified = self.config.globalProperties(collection);
        // Apply provided properties for this event body
        eventsHash[collection][index] = extend(modified, body);
      });
    });
  }

  // ------------------------------
  // Run extendEvent(s) transforms
  // ------------------------------
  each(eventsHash, function(eventList, eventCollection){
    // Find or create collection on new hash
    extendedEventsHash[eventCollection] = extendedEventsHash[eventCollection] || [];
    // Loop over each eventBody in the existing hash
    each(eventList, function(eventBody, index){
      // Create a new data object
      var extendedEventBody = {};
      // Process "events" transform pipeline
      getExtendedEventBody(extendedEventBody, self.extensions.events);
      // Process "collection" transform pipeline
      getExtendedEventBody(extendedEventBody, self.extensions.collections[eventCollection]);
      // Blend existing eventBody data into the result
      getExtendedEventBody(extendedEventBody, [eventBody]);
      // Push extendedEventBody into new hash
      extendedEventsHash[eventCollection].push(extendedEventBody);
    });
  });

  this.emit('recordEvents', extendedEventsHash);

  if (!Keen.enabled) {
    handleValidationError.call(this, 'Keen.enabled is set to false.', callback);
    return false;
  }

  return sendEventData.call(this, undefined, extendedEventsHash, callback);
}


// ----------------------
// DEPRECATED
// ----------------------

export function addEvent(){
  this.emit('error', 'This method has been deprecated. Check out #recordEvent: https://github.com/keen/keen-tracking.js#record-a-single-event');
  recordEvent.apply(this, arguments);
}

export function addEvents(){
  this.emit('error', 'This method has been deprecated. Check out #recordEvents: https://github.com/keen/keen-tracking.js#record-multiple-events');
  recordEvents.apply(this, arguments);
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
