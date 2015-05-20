var Emitter = require('component-emitter');
var each = require('./utils/each');
var JSON2 = require('JSON2');

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
  var config = cfg || {}, defaultProtocol;

  if (config['host']) {
    config['host'].replace(/.*?:\/\//g, '');
  }

  defaultProtocol = 'https';
  // IE<10 request shim
  if ('undefined' !== typeof document && document.all) {
    config['protocol'] = (document.location.protocol !== 'https:') ? 'http' : defaultProtocol;
  }

  this.config = {
    projectId   : config.projectId,
    writeKey    : config.writeKey,
    // readKey     : config.readKey,
    // masterKey   : config.masterKey,
    requestType : config.requestType || 'jsonp',
    host        : config['host']     || 'api.keen.io/3.0',
    protocol    : config['protocol'] || defaultProtocol
  };

  if (Keen.debug) {
    this.on('error', Keen.log);
  }
  this.emit('ready');
  return this;
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

Keen.Client.prototype.url = function(path, data){
  var url;
  if (!this.projectId()) {
    this.emit('error', 'Keen.Client is missing a projectId property');
    return;
  }
  url = this.config.protocol + '://' + this.config.host + '/projects/' + this.projectId();
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

Keen.noConflict = function(){
  root.Keen = previousKeen;
  return Keen;
};

module.exports = Keen;
