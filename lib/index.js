var Emitter = require('component-emitter');
var JSON2 = require('JSON2');

var each = require('./utils/each');
var queue = require('./utils/queue');

var root = this;
var previousKeen = root.Keen;

var Keen = {
  debug: false,
  enabled: true,
  loaded: false,
  helpers: {},
  utils: {},
  version: '__VERSION__'
};

Keen.Client = function(cfg){
  this.configure(cfg);
  Keen.emit('client', this);
}

Keen.Client.prototype.configure = function(cfg){
  var self = this, config = cfg || {}, defaultProtocol;

  if (config['host']) {
    config['host'].replace(/.*?:\/\//g, '');
  }

  defaultProtocol = 'https';
  // IE<10 request shim
  if ('undefined' !== typeof document && document.all) {
    config['protocol'] = (document.location.protocol !== 'https:') ? 'http' : defaultProtocol;
  }

  self.config = {
    projectId   : config.projectId,
    writeKey    : config.writeKey,
    // readKey     : config.readKey,
    // masterKey   : config.masterKey,
    host        : config['host']     || 'api.keen.io',
    protocol    : config['protocol'] || defaultProtocol,
    requestType : config.requestType || 'jsonp',
    writePath   : config.writePath,
  };

  self.queue = queue();
  self.queue.on('flush', function(){
    self.recordDeferredEvents();
  });

  if (Keen.debug) {
    self.on('error', Keen.log);
  }
  self.emit('ready');
  return self;
};

Keen.Client.prototype.projectId = function(str){
  if (!arguments.length) return this.config.projectId;
  this.config.projectId = (str ? String(str) : null);
  return this;
};

// Keen.Client.prototype.masterKey = function(str){
//   if (!arguments.length) return this.config.masterKey;
//   this.config.masterKey = (str ? String(str) : null);
//   return this;
// };
//
// Keen.Client.prototype.readKey = function(str){
//   if (!arguments.length) return this.config.readKey;
//   this.config.readKey = (str ? String(str) : null);
//   return this;
// };

Keen.Client.prototype.writeKey = function(str){
  if (!arguments.length) return this.config.writeKey;
  this.config.writeKey = (str ? String(str) : null);
  return this;
};

Keen.Client.prototype.writePath = function(str){
  if (!arguments.length) {
    if (!this.projectId()) {
      this.emit('error', 'Keen.Client is missing a projectId property');
      return;
    }
    return this.config.writePath ? this.config.writePath : ('/3.0/projects/' + this.projectId() + '/events');
  }
  this.config.writePath = (str ? String(str) : null);
  return this;
};

Keen.Client.prototype.url = function(path, data){
  var url;
  if (!this.projectId()) {
    this.emit('error', 'Keen.Client is missing a projectId property');
    return;
  }
  url = this.config.protocol + '://' + this.config.host + '/3.0/projects/' + this.projectId();
  if (path) {
    url += path;
  }
  if (data) {
    url += '?' + serialize(data);
  }
  return url;
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

Emitter(Keen);
Emitter(Keen.Client.prototype);

Keen.log = function(message) {
  if (Keen.debug && typeof console == 'object') {
    console.log('[Keen IO]', message);
  }
};

module.exports = Keen;
