var K = require('keen-core');

var each = require('./utils/each'),
    extend = require('./utils/extend'),
    queue = require('./utils/queue');

K.helpers = K.helpers || {};
K.resources.events = '{protocol}://{host}/3.0/projects/{projectId}/events';

// Install internal queue
K.on('client', function(client){
  client.extensions = {
    events: [],
    collections: {}
  };
  client.queue = queue();
  client.queue.on('flush', function(){
    client.recordDeferredEvents();
  });
});

// Accessors
K.prototype.writeKey = function(str){
  if (!arguments.length) return this.config.writeKey;
  this.config.writeKey = (str ? String(str) : null);
  return this;
};

// DEPRECATED
K.prototype.setGlobalProperties = function(props){
  K.log('This method has been deprecated. Check out #extendEvents: https://github.com/keen/keen-tracking.js#extend-events');
  if (!props || typeof props !== 'function') {
    this.emit('error', 'Invalid value for global properties: ' + props);
    return;
  }
  this.config.globalProperties = props;
  return this;
};

module.exports = K;
