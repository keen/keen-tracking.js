var Keen = require('./index');
var https = require('https');

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

  sendEventData.call(self, '/' + encodeURIComponent(eventCollection), data, cb);
  cb = null;
}

function recordEvents(eventsHash, callback){
  var self = this, data, cb;

  data = eventsHash || {};
  cb = callback;
  callback = null;

  if (!checkValidation.call(self, cb)) {
    return;
  }

  if (arguments.length > 2) {
    handleValidationError.call(self, 'Incorrect arguments provided to #addEvents method', cb);
    return;
  }

  sendEventData.call(self, '', data, cb);
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

function sendEventData(path, eventData, callback){
  var data = JSON.stringify(eventData);
  var options = {
    host: this.config.host,
    path: this.writePath() + path,
    method: 'POST',
    headers: {
      'Authorization': this.writeKey(),
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  var req = https.request(options, function(response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      var res = JSON.parse(body), error;
      if (res.error_code) {
        error = new Error(res.message || 'Unknown error occurred');
        error.code = res.error_code;
        callback(error, null);
      }
      else {
        callback(null, res);
      }
    });
  });
  req.on('error', callback);
  req.write(data);
  req.end();
}
