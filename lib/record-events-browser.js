import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

import base64 from 'keen-core/lib/utils/base64';
import each from 'keen-core/lib/utils/each';
import extend from 'keen-core/lib/utils/extend';

import Keen from './index';
import { getExtendedEventBody } from './extend-events';
import fetchRetry from './utils/fetchRetry';
import isUnique from './utils/unique';

// ------------------------------
// .recordEvent
// ------------------------------
let uniqueIds = [];
export function recordEvent(eventCollectionOrConfigObject, eventBody, callback, asyncMode){
  let eventCollection = eventCollectionOrConfigObject;
  let useBeaconApi = false;
  let unique;
  let configObject;
  let clientConfig = this.config;

  if (typeof eventCollectionOrConfigObject === 'object'
    && eventCollectionOrConfigObject) {
    // slowly but surely we migrate to one object with all args
    configObject = eventCollectionOrConfigObject;
    eventCollection = eventCollectionOrConfigObject.collection;
    eventBody = eventCollectionOrConfigObject.event;
    callback = eventCollectionOrConfigObject.callback;
    asyncMode = eventCollectionOrConfigObject.asyncMode;
    unique = eventCollectionOrConfigObject.unique;
  }

  var url, data, cb, getRequestUrl, getRequestUrlOkLength, extendedEventBody, isAsync;

  url = this.url('events', encodeURIComponent(eventCollection));
  data = {};
  cb = callback || function(){};

  // Requests are asynchronous by default
  isAsync = ('boolean' === typeof asyncMode) ? asyncMode : true;

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
    console.log('config.globalProperties are deprecated')
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

  // ------------------------------
  // Send event
  // ------------------------------

  getRequestUrl = this.url('events', encodeURIComponent(eventCollection), {
    api_key  : this.writeKey(),
    data     : encodeURIComponent( base64.encode( JSON.stringify(extendedEventBody) ) ),
    modified : new Date().getTime()
  });
  getRequestUrlOkLength = getRequestUrl.length < getUrlMaxLength();

  if (
    navigator && navigator.sendBeacon &&
    (
      clientConfig.requestType === 'beaconAPI' ||
      (configObject && configObject.requestType === 'beaconAPI')
      // so you can send specific recordEvent() using beaconAPI
      // even if your global client's config prefers Fetch
  )) {
    navigator.sendBeacon(
      `${url}?api_key=${this.writeKey()}`,
      JSON.stringify(extendedEventBody)
    );
    return this;
  }

  if (isAsync) {
    switch (this.config.requestType) {
      case 'xhr':
        sendXhr.call(this, 'POST', url, extendedEventBody, cb);
        break;
      case 'beacon':
        // this is IMAGE beacon, not the Beacon API. deprecated
        if (getRequestUrlOkLength) {
          sendBeacon.call(this, getRequestUrl, cb);
        }
        else {
          attemptPostXhr.call(this, url, extendedEventBody,
              'Beacon URL length exceeds current browser limit, and XHR is not supported.', cb)
        }
        break;
      default:
        if (typeof fetch !== 'undefined') {
          return sendFetch.call(this, 'POST', url, extendedEventBody, cb);
        }
        else if (getRequestUrlOkLength) {
          // deprecated, will be removed
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
    // Send synchronous request
    if (getRequestUrlOkLength) {
      sendSynchronousXhr(getRequestUrl);
    }
  }

  callback = cb = null;
  return this;
}

// ------------------------------
// .recordEvents
// ------------------------------

export function recordEvents(eventsHash, callback){
  var self = this, url, extendedEventsHash;

  url = this.url('events');

  if (!checkValidation.call(this, callback)) {
    return;
  }

  if ('object' !== typeof eventsHash || eventsHash instanceof Array) {
    handleValidationError.call(this, 'First argument must be an object', callback );
    return;
  }

  if (arguments.length > 2) {
    handleValidationError.call(this, 'Incorrect arguments provided to #recordEvents method', callback);
    return;
  }

  // ------------------------------
  // DEPRECATED
  // Apply client.globalProperties
  // ------------------------------
  if (this.config.globalProperties) {
    console.log('config.globalProperties are deprecated')
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
    handleValidationError.call(this, 'Keen.enabled is set to false.', callback);
    return false;
  }

  if ((!this.config.requestType || this.config.requestType !== 'xhr')
    && typeof fetch !== 'undefined') {
      return sendFetch.call(this, 'POST', url, extendedEventsHash, callback);
  } else if (getXhr()) {
    sendXhr.call(this, 'POST', url, extendedEventsHash, callback);
  }
  return this;
}


// ----------------------
// DEPRECATED
// ----------------------

export function addEvent(){
  console.log('addEvent method is depracated. Check out #recordEvent: https://github.com/keen/keen-tracking.js#record-a-single-event');
  this.emit('error', 'This method has been deprecated. Check out #recordEvent: https://github.com/keen/keen-tracking.js#record-a-single-event');
  recordEvent.apply(this, arguments);
}

export function addEvents(){
  console.log('addEvents method is depracated. Check out #recordEvents: https://github.com/keen/keen-tracking.js#record-multiple-events');
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
  var err = 'Event(s) not recorded: ' + message;
  this.emit('error', err);
  if (cb) {
    cb.call(this, err, null);
  }
}

function getUrlMaxLength(){
  if ('undefined' !== typeof window && navigator) {
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
      return 1900;
    }
  }
  return 16000;
}


// ------------------------------
// XHR Requests
// ------------------------------

function attemptPostXhr(url, data, noXhrError, callback) {
  if (getXhr()) {
    sendXhr.call(this, 'POST', url, data, callback);
  }
  else {
    handleValidationError.call(this, noXhrError);
  }
}

function sendFetch(method, url, data, callback = undefined){
  const self = this;

  return fetchRetry(url, {
      method,
      body: data ? JSON.stringify(data) : '',
      mode: 'cors',
      redirect: 'follow',
      referrerPolicy: self.referrerPolicy() || 'unsafe-url',
      headers: {
        'Authorization': self.writeKey(),
        'Content-Type': 'application/json'
      },
      // keepalive: true, not supported for CORS yet
      retry: self.config.retry
    })
    .catch(connectionError => {
      if (typeof callback !== 'undefined') {
        callback.call(self, connectionError, null);
      }
      self.emit('error', connectionError);
      return Promise.reject(connectionError);
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }

      return response.json().then(responseJSON => {
        return Promise.reject({
          error_code: responseJSON.error_code,
          body: responseJSON.message,
          status: response.status,
          ok: false,
          statusText: response.statusText
        });
      });
    }).then(responseJSON => {
      const eventsSavedSuccessfuly = checkEventsSavedSuccessfuly(responseJSON);
      if (eventsSavedSuccessfuly) {
        if (typeof callback !== 'undefined') {
          callback.call(self, null, responseJSON);
        }
        return Promise.resolve(responseJSON);
      } else {
        if (typeof callback !== 'undefined') {
          callback.call(self, responseJSON, null);
        }
        self.emit('error', responseJSON);
        return Promise.reject(responseJSON);
      }
    });
}

function checkEventsSavedSuccessfuly(response){
  // single event
  if (typeof response.created !== 'undefined') {
    if (response.created) {
      return true;
    }
    return false;
  }
  // multiple events
  const responseKeys = Object.keys(response);
  const notSavedEvents = responseKeys
    .map(collection => {
      return response[collection].filter(event => !event.success);
    })
    .filter(collection => collection.length > 0);

  if (notSavedEvents.length === 0) {
    return true;
  }

  return false;
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
  // yay, superagent!
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


// ------------------------------
// JSON-P Requests
// ------------------------------

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

  // for early IE w/ no onerror event
  script.onreadystatechange = function() {
    if (loaded === false && this.readyState === 'loaded') {
      loaded = true;
      handleError();
      cleanup();
    }
  };
  // non-ie, etc
  script.onerror = function() {
    // on IE9 both onerror and onreadystatechange are called
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


// ------------------------------
// Image Beacon Requests
// ------------------------------

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
