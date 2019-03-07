import KeenCore from 'keen-core';
import each from 'keen-core/lib/utils/each';
import extend from 'keen-core/lib/utils/extend';
import { queue } from './utils/queue';
import { setOptOut } from './utils/optOut';
import pkg from '../package.json';

KeenCore.helpers = KeenCore.helpers || {};
KeenCore.prototype.observers = KeenCore.observers || {};

// Install internal queue
KeenCore.on('client', function(client){
  client.extensions = {
    events: [],
    collections: {}
  };
  
  if (!client.config.respectDoNotTrack) {
    this.doNotTrack = false;
  }

  if (typeof client.config.optOut !== 'undefined') {
    setOptOut(client.config.optOut);
    this.optedOut = client.config.optOut;
  }
  
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
  KeenCore.log('This method has been removed. Check out #extendEvents: https://github.com/keen/keen-tracking.js#extend-events');
  return this;
};

KeenCore.version = pkg.version;

export default KeenCore;
