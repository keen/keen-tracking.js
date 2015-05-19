var Emitter = require('component-emitter');

var root = this;
var previousKeen = root.Keen;

var Keen = {
  debug: false,
  enabled: true,
  helpers: {},
  utils: {},
  version: '__VERSION__'
};
// Keen.loaded = true;

Keen.Client = function(cfg){
  this.configure(cfg);
  Keen.emit('client', this);
}

Keen.Client.prototype.configure = function(cfg){
  var config = cfg || {};
  if (config['host']) {
    config['host'].replace(/.*?:\/\//g, '');
  }
  if (config.protocol && config.protocol === 'auto') {
    config['protocol'] = location.protocol.replace(/:/g, '');
  }
  this.config = {
    projectId   : config.projectId,
    writeKey    : config.writeKey,
    // readKey     : config.readKey,
    // masterKey   : config.masterKey,
    requestType : config.requestType || 'jsonp',
    host        : config['host']     || 'api.keen.io/3.0',
    protocol    : config['protocol'] || 'https'
    // globalProperties: null
  };
  if (Keen.debug) {
    this.on('error', Keen.log);
  }
  this.emit('ready');
};

Keen.Client.prototype.projectId = function(str){
  if (!arguments.length) return this.config.projectId;
  this.config.projectId = (str ? String(str) : null);
  return this;
};

Keen.Client.prototype.masterKey = function(str){
  if (!arguments.length) return this.config.masterKey;
  this.config.masterKey = (str ? String(str) : null);
  return this;
};

Keen.Client.prototype.readKey = function(str){
  if (!arguments.length) return this.config.readKey;
  this.config.readKey = (str ? String(str) : null);
  return this;
};

Keen.Client.prototype.writeKey = function(str){
  if (!arguments.length) return this.config.writeKey;
  this.config.writeKey = (str ? String(str) : null);
  return this;
};

Keen.Client.prototype.url = function(path){
  if (!this.projectId()) {
    this.emit('error', 'Keen.Client is missing a projectId property');
    return;
  }
  return this.config.protocol + '://' + this.config.host + '/projects/' + this.projectId() + path;
};

Emitter(Keen);
Emitter(Keen.Client.prototype);

Keen.log = function(message) {
  if (Keen.debug && typeof console == 'object') {
    console.log('[Keen IO]', message);
  }
};

Keen.noConflict = function(){
  root.Keen = previousKeen;
  return Keen;
};

module.exports = Keen;
