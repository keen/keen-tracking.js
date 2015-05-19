var Keen = require('./index');
var request = require('superagent');

module.exports = {
  'recordEvent': recordEvent,
  'recordEvents': recordEvents
};

function recordEvent(eventCollection, eventBody, callback){
  var self = this, url, data, cb;

  url = self.url('/events/' + encodeURIComponent(eventCollection));
  data = eventBody || {};
  cb = callback;
  callback = null;

  if (!checkValidation.call(self, cb)) {
    return;
  }

  if (!eventCollection || typeof eventCollection !== 'string') {
    handleValidationError.call(self, 'Collection name must be a string.', cb);
    return;
  }

  // process extendEvent(s) transforms

  sendEventData.call(self, url, data, cb);
  cb = null;
}

function recordEvents(eventsHash, callback){
  var self = this, url, cb;

  url = self.url('/events');
  cb = callback;
  callback = null;

  if (!checkValidation.call(self, cb)) {
    return;
  }

  if (arguments.length > 2) {
    handleValidationError.call(self, 'Incorrect arguments provided to #addEvents method', cb);
    return;
  }

  sendEventData.call(self, url, data, cb);
  cb = null;
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

function handleResponse(callback) {
  var cb = callback || function(){};
  callback = null;
  return function(err, res){
    if (res && !res.ok) {
      var is_err = res.body && res.body.error_code;
      err = new Error(is_err ? res.body.message : 'Unknown error occurred');
      err.code = is_err ? res.body.error_code : 'UnknownError';
    }
    if (err) {
      cb(err, null);
    }
    else {
      cb(null, res.body);
    }
    return;
  }
}

function sendEventData(url, data, callback){
  var cb = callback;
  callback = null;
  request
    .post(url)
    .set('Content-Type', 'application/json')
    .set('Authorization', self.writeKey())
    .send(data)
    .end(handleResponse(cb));
}
