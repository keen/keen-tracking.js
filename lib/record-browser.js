var Keen = require('./index');
var base64 = require('./utils/base64');
var each = require('./utils/each');

module.exports = {
  'recordEvent': recordEvent,
  'recordEvents': recordEvents
};

function recordEvent(eventCollection, eventBody, callback){
  var self = this, url, data, cb, getRequestUrl;

  url = self.url('/events/' + encodeURIComponent(eventCollection));
  data = eventBody || {};
  cb = callback;
  // callback = null;

  if (!checkValidation.call(self, cb)) {
    return;
  }

  if (!eventCollection || typeof eventCollection !== 'string') {
    handleValidationError.call(self, 'Collection name must be a string.', cb);
    return;
  }

  // process extendEvent(s) transforms

  // if (!sendEventData.call(this, url, data, cb)) {
  //   handleValidationError.call(self, 'URL length exceeds current browser limit, and XHR is not supported.');
  // }

  getRequestUrl = makeGetRequestUrl.call(this, url, data);
  if (getRequestUrl) {
    switch (this.config.requestType) {
      case 'xhr':
        sendXhr.call(this, 'GET', getRequestUrl, null, null, cb);
        break;
      case 'beacon':
        sendBeacon.call(this, getRequestUrl, cb);
        break;
      default:
        sendJsonp.call(this, getRequestUrl, cb);
        break;
    }
  }
  else if (getXhr()) {
    sendXhr.call(this, 'POST', url, data, cb);
  }
  else {
    handleValidationError.call(self, 'URL length exceeds current browser limit, and XHR is not supported.');
  }

  callback = cb = null;
}

function recordEvents(eventsHash, callback){
  var self = this, url, cb;

  url = self.url('/events');
  cb = callback;
  callback = null;

  if (!checkValidation.call(self, cb)) {
    return;
  }

  if ('object' !== typeof eventsHash || eventsHash instanceof Array) {
    handleValidationError.call(self, 'First argument must be an object', cb);
    return;
  }

  if (arguments.length > 2) {
    handleValidationError.call(self, 'Incorrect arguments provided to #addEvents method', cb);
    return;
  }

  if (getXhr()) {
    sendXhr.call(this, 'POST', url, eventsHash, cb);
  }
  else {
    // each(eventsHash, function(eventArray, eventCollection){
    //    ... send each individually?
    // });
  }

  callback = cb = null;
}


// ------------------------------
// Validation
// ------------------------------

function checkValidation(callback){
  var cb = callback;
  callback = null;

  if (!Keen.enabled) {
    handleValidationError.call(this, 'Keen.enabled is set to false.', cb);
    return false;
  }
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

function getUrlMaxLength(){
  if ('undefined' !== typeof window) {
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
      return 2000;
    }
  }
  return 16000;
}

function makeGetRequestUrl(url, data){
  url += '?';
  url += serializeParams({
    api_key  : this.writeKey(),
    data     : base64.encode( JSON.stringify(data) ),
    modified : new Date().getTime()
  });
  return ( url.length < getUrlMaxLength() ) ? url : false;
}

function serializeParams(object){
  var query = [];
  each(object, function(value, key){
    if ('string' !== typeof value) {
      value = JSON.stringify(value);
    }
    query.push(key + '=' + encodeURIComponent(value));
  });
  return query.join('&');
}


// ------------------------------
// XHR Requests
// ------------------------------

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
          response = JSON.parse(xhr.responseText);
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

  // each(headers, function(value, key){
  //   xhr.setRequestHeader(key, value);
  // });

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

function sendJsonp(url, callback){
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
