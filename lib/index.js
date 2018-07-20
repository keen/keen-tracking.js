import KeenCore from 'keen-core';
import each from 'keen-core/lib/utils/each';
import extend from 'keen-core/lib/utils/extend';
import { queue } from'./utils/queue';

KeenCore.helpers = KeenCore.helpers || {};

// Install internal queue
KeenCore.on('client', function(client){
  client.extensions = {
    events: [],
    collections: {}
  };
  client.queue = queue(client.config.queue);
  client.queue.on('flush', function(){
    client.recordDeferredEvents();
  });
});

// Accessors
KeenCore.prototype.writeKey = function(str){
  if (!arguments.length) return this.config.writeKey;
  this.config.writeKey = (str ? String(str) : null);
  return this;
};

KeenCore.prototype.referrerPolicy = function(str){
  if (!arguments.length) return this.config.referrerPolicy;
  this.config.referrerPolicy = (str ? String(str) : null);
  return this;
};

// DEPRECATED
KeenCore.prototype.setGlobalProperties = function(props){
  KeenCore.log('This method has been deprecated. Check out #extendEvents: https://github.com/keen/keen-tracking.js#extend-events');
  if (!props || typeof props !== 'function') {
    this.emit('error', 'Invalid value for global properties: ' + props);
    return;
  }
  this.config.globalProperties = props;
  return this;
};

export default KeenCore;
