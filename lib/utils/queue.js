import Emitter from 'component-emitter';

import configDefault from '../config-default.js';

export function queue(configQueue = {}) {
  if (this instanceof queue === false) {
    return new queue(configQueue);
  }
  this.capacity = 0;
  this.config = {
    ...configDefault.queue,
    ...configQueue
  };
  this.events = {
    // "collection-1": [],
    // "collection-2": []
  };
  this.interval = 0;
  this.timer = null;
  return this;
}

Emitter(queue.prototype);

queue.prototype.check = function() {
  if (shouldFlushQueue(this)) {
    this.flush();
  }
  if (this.config.interval === 0 || this.capacity === 0) {
    this.pause();
  }
  return this;
};

queue.prototype.flush = function() {
  this.emit('flush');
  this.interval = 0;
  return this;
};

queue.prototype.pause = function() {
  if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
  }
  return this;
};

queue.prototype.start = function() {
  var self = this;
  self.pause();
  self.timer = setInterval(function() {
    self.interval++;
    self.check();
  }, 1000);
  return self;
};

function shouldFlushQueue(props) {
  if (props.capacity > 0 && props.interval >= props.config.interval) {
    return true;
  }
  else if (props.capacity >= props.config.capacity) {
    return true;
  }
  return false;
}
