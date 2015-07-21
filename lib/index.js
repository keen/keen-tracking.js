var Emitter = require('component-emitter');
var JSON2 = require('JSON2');

var each = require('./utils/each');
var extend = require('./utils/extend');
var queue = require('./utils/queue');

var root = this;
var previousKeen = root.Keen;

var Keen = function(config){
  this.configure(config);
  Keen.emit('client', this);
};

Keen.prototype.configure = function(config){
  var self = this, defaultProtocol;

  if (config['host']) {
    config['host'].replace(/.*?:\/\//g, '');
  }

  defaultProtocol = 'https';
  // IE<10 request shim
  if ('undefined' !== typeof document && document.all) {
    config['protocol'] = (document.location.protocol !== 'https:') ? 'http' : defaultProtocol;
  }

  self.config = self.config || {
    // projectId
    // writeKey
    host: 'api.keen.io',
    protocol: defaultProtocol,
    requestType: 'jsonp'
    // writePath (generated)
  };

  extend(self.config, config || {});

  self.queue = queue();
  self.queue.on('flush', function(){
    self.recordDeferredEvents();
  });

  self.extensions = {
    events: [],
    collections: {}
  };

  if (Keen.debug) {
    self.on('error', Keen.log);
  }
  self.emit('ready');
  return self;
};

Keen.prototype.projectId = function(str){
  if (!arguments.length) return this.config.projectId;
  this.config.projectId = (str ? String(str) : null);
  return this;
};

Keen.prototype.writeKey = function(str){
  if (!arguments.length) return this.config.writeKey;
  this.config.writeKey = (str ? String(str) : null);
  return this;
};

Keen.prototype.writePath = function(str){
  if (!arguments.length) {
    if (!this.projectId()) {
      this.emit('error', 'Keen is missing a projectId property');
      return;
    }
    return this.config.writePath ? this.config.writePath : ('/3.0/projects/' + this.projectId() + '/events');
  }
  this.config.writePath = (str ? String(str) : null);
  return this;
};

Keen.prototype.url = function(path, data){
  var url;
  if (!this.projectId()) {
    this.emit('error', 'Keen is missing a projectId property');
    return;
  }
  url = this.config.protocol + '://' + this.config.host;
  if (path) {
    url += path;
  }
  if (data) {
    url += '?' + serialize(data);
  }
  return url;
};

// ----------------------
// DEPRECATED
// ----------------------
Keen.prototype.setGlobalProperties = function(props){
  this.emit('error', 'This method has been deprecated. Check out #extendEvents: https://github.com/keen/keen-tracking.js#extend-events');
  if (!props || typeof props !== 'function') {
    this.emit('error', 'Invalid value for global properties: ' + props);
    return;
  }
  this.config.globalProperties = props;
  return this;
};

Emitter(Keen);
Emitter(Keen.prototype);

extend(Keen, {
  debug: false,
  enabled: true,
  loaded: false,
  helpers: {},
  utils: {},
  version: '__VERSION__'
});

Keen.log = function(message) {
  if (Keen.debug && typeof console == 'object') {
    console.log('[Keen IO]', message);
  }
};

function serialize(data){
  var query = [];
  each(data, function(value, key){
    if ('string' !== typeof value) {
      value = JSON2.stringify(value);
    }
    query.push(key + '=' + encodeURIComponent(value));
  });
  return query.join('&');
}

module.exports = Keen;
