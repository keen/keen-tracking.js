import Keen from './index';
import each from 'keen-core/lib/utils/each';
import extend from 'keen-core/lib/utils/extend';
import { getExtendedEventBody } from './extend-events';
import http from 'http';
import https from 'https';

// ------------------------------
// .recordEvent
// ------------------------------

export function recordEvent(eventCollection, eventBody, callback){
  var url, data, cb, extendedEventBody;

  data = {};
  cb = callback || function(){};
  callback = null;

  if (!checkValidation.call(this, cb)) {
    return;
  }

  if (!eventCollection || typeof eventCollection !== 'string') {
    handleValidationError.call(this, 'Collection name must be a string.', cb);
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
  extendedEventBody = {};
  getExtendedEventBody(extendedEventBody, this.extensions.events);
  getExtendedEventBody(extendedEventBody, this.extensions.collections[eventCollection]);
  getExtendedEventBody(extendedEventBody, [data]);

  this.emit('recordEvent', eventCollection, extendedEventBody);

  if (!Keen.enabled) {
    handleValidationError.call(this, 'Keen.enabled is set to false.', cb);
    return false;
  }

  sendEventData.call(this, encodeURIComponent(eventCollection), extendedEventBody, cb);
  cb = null;
  return this;
}



// ------------------------------
// .recordEvents
// ------------------------------

export function recordEvents(eventsHash, callback){
  var self = this, url, cb, extendedEventsHash;

  cb = callback || function(){};
  callback = null;

  if (!checkValidation.call(this, cb)) {
    return;
  }

  if (arguments.length > 2) {
    handleValidationError.call(this, 'Incorrect arguments provided to #addEvents method', cb);
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
        var modified = self.config.globalProperties(collection);
        // Apply provided properties for this event body
        eventsHash[collection][index] = extend(modified, body);
      });
    });
  }

  // ------------------------------
  // Run extendEvent(s) transforms
  // ------------------------------
  extendedEventsHash = {};
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
    handleValidationError.call(this, 'Keen.enabled is set to false.', cb);
    return false;
  }

  sendEventData.call(this, undefined, extendedEventsHash, cb);
  cb = null;
  return this;
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

function sendEventData(path, eventData, callback){
  var data = JSON.stringify(eventData),
      url;

  url = this.url('events', path);
  url = url.replace(this.config.protocol + '://' + this.config.host, '');

  var options = {
    host: this.config.host,
    path: url,
    method: 'POST',
    headers: {
      'Authorization': this.writeKey(),
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  var protocol = (this.config.protocol === 'http') ? http : https;
  var req = protocol.request(options, function(response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      var response, error;
      try {
        response = JSON.parse(body);
      }
      catch (e) {
        // Parsing Error
        error = e;
      }
      if (!error && response.error_code) {
        // API Error
        error = new Error(response.message || 'Unknown error occurred');
        error.code = response.error_code;
      }
      if (callback) {
        if (error) {
          callback(error, null);
        }
        if (response) {
          callback(null, response);
        }
      }
    });
  });
  req.on('error', callback);
  req.write(data);
  req.end();
}
