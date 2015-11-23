var Emitter = require('component-emitter');
var json = require('./utils/json');

var each = require('./utils/each');
var extend = require('./utils/extend');
var queue = require('./utils/queue');

var K = function(config){
  var self = this;

  this.configure(config);

  extend(this.config.resources, K.resources);

  this.extensions = {
    events: [],
    collections: {}
  };

  this.queue = queue();
  this.queue.on('flush', function(){
    self.recordDeferredEvents();
  });

  if (K.debug) {
    this.on('error', K.log);
  }

  this.emit('ready');
  K.emit('client', this);
};

Emitter(K);
Emitter(K.prototype);

extend(K, {
  debug: false,
  enabled: true,
  loaded: false,
  helpers: {},
  resources: {
    'base'      : '{protocol}://{host}',
    'version'   : '{protocol}://{host}/3.0',
    'projects'  : '{protocol}://{host}/3.0/projects',
    'projectId' : '{protocol}://{host}/3.0/projects/{projectId}',
    'events'    : '{protocol}://{host}/3.0/projects/{projectId}/events'
  },
  utils: {},
  version: '__VERSION__'
});

K.log = function(message) {
  if (K.debug && typeof console == 'object') {
    console.log('[Keen IO]', message);
  }
};

K.prototype.configure = function(cfg){
  var self = this,
      config = cfg || {},
      defaultProtocol = 'https';

  this.config = this.config || {
    projectId: undefined,
    writeKey: undefined,
    host: 'api.keen.io',
    protocol: defaultProtocol,
    requestType: 'jsonp',
    resources: {},
    writePath: undefined
  };

  // IE<10 request shim
  if ('undefined' !== typeof document && document.all) {
    config['protocol'] = (document.location.protocol !== 'https:') ? 'http' : defaultProtocol;
  }
  if (config['host']) {
    config['host'].replace(/.*?:\/\//g, '');
  }

  extend(this.config, config);
  return self;
};

K.prototype.projectId = function(str){
  if (!arguments.length) return this.config.projectId;
  this.config.projectId = (str ? String(str) : null);
  return this;
};

K.prototype.writeKey = function(str){
  if (!arguments.length) return this.config.writeKey;
  this.config.writeKey = (str ? String(str) : null);
  return this;
};

K.prototype.resources = function(obj){
  if (!arguments.length) return this.config.resources;
  var self = this;
  if (typeof obj === 'object') {
    each(obj, function(value, key){
      self.config.resources[key] = (value ? value : null);
    });
  }
  return this;
};

K.prototype.url = function(name){
  var args = Array.prototype.slice.call(arguments, 1),
      baseUrl = K.resources.base || '{protocol}://{host}',
      path;

  if (name && typeof name === 'string') {
    if (this.config.resources[name]) {
      path = this.config.resources[name];
    }
    else {
      path = baseUrl + name;
    }
  }
  else {
    path = baseUrl;
  }

  each(this.config, function(value, key){
    if (typeof value !== 'object') {
      path = path.replace('{' + key + '}', value);
    }
  });

  each(args, function(arg, i){
    if (typeof arg === 'string') {
      path += '/' + arg;
    }
    else if (typeof arg === 'object') {
      path += '?';
      each(arg, function(value, key){
        path += key + '=' + value + '&';
      });
      path = path.slice(0, -1);
    }
  });

  return path;
};


// ----------------------
// DEPRECATED
// ----------------------

K.prototype.setGlobalProperties = function(props){
  K.log('This method has been deprecated. Check out #extendEvents: https://github.com/keen/keen-tracking.js#extend-events');
  if (!props || typeof props !== 'function') {
    this.emit('error', 'Invalid value for global properties: ' + props);
    return;
  }
  this.config.globalProperties = props;
  return this;
};

K.prototype.writePath = function(str){
  K.log('This method has been deprecated. Use client.url(\'events\') instead.');
  if (!arguments.length) return this.config.writePath;
  if (!this.projectId()) {
    this.emit('error', 'Client instance is missing a projectId property');
    return this.config.writePath || ('/3.0/projects/' + this.projectId() + '/events');
  }
  this.config.writePath = str ? String(str) : ('/3.0/projects/' + this.projectId() + '/events');
  return this;
};


function serialize(data){
  var query = [];
  each(data, function(value, key){
    if ('string' !== typeof value) {
      value = json.stringify(value);
    }
    query.push(key + '=' + encodeURIComponent(value));
  });
  return query.join('&');
}

module.exports = K;
