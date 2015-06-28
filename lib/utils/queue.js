var Emitter = require('component-emitter');

module.exports = queue;

function queue(){
  var self = this;
  if (this instanceof queue === false) {
    return new queue();
  }

  self.capacity = 0;
  self.interval = 0;

  self.config = {
    capacity: 5000,
    interval: 15
  };

  self.events = {
    // "collection 1": [],
    // "collection 2": []
  };

  setInterval(function(){
    self.interval++;
    checkQueue.call(self);
  }, 1000);

  return self;
}

function checkQueue(){
  if ((this.capacity > 0 && this.interval >= this.config.interval)
    || this.capacity >= this.config.capacity) {
      this.emit('flush');
      this.interval = 0;
  }
}

Emitter(queue.prototype);
