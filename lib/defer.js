var Keen = require('./index');
var each = require('./utils/each');
var queue = require('./utils/queue');

module.exports = {
  'deferEvent': deferEvent,
  'deferEvents': deferEvents,
  'queueCapacity': queueCapacity,
  'queueInterval': queueInterval,
  'recordDeferredEvents': recordDeferredEvents
};

function deferEvent(eventCollection, eventBody){

  if (arguments.length !== 2 || typeof eventCollection !== 'string') {
    handleValidationError.call(this, 'Incorrect arguments provided to #deferEvent method');
    return;
  }

  this.queue.events[eventCollection] = this.queue.events[eventCollection] || [];
  this.queue.events[eventCollection].push(eventBody);
  this.queue.capacity++;
  this.emit('deferEvent', eventCollection, eventBody);
  return this;
}

function deferEvents(eventsHash){
  var self = this;

  if (arguments.length !== 1 || typeof eventsHash !== 'object') {
    handleValidationError.call(this, 'Incorrect arguments provided to #deferEvents method');
    return;
  }

  each(eventsHash, function(eventList, eventCollection){
    self.queue.events[eventCollection] = self.queue.events[eventCollection] || [];
    self.queue.events[eventCollection] = self.queue.events[eventCollection].concat(eventList);
    self.queue.capacity = self.queue.capacity + eventList.length;
  });
  self.emit('deferEvents', eventsHash);
  return self;
}

function queueCapacity(num){
  if (!arguments.length) return this.queue.config.capacity;
  this.queue.config.capacity = num ? Number(num): 0;
  return this;
}

function queueInterval(num){
  if (!arguments.length) return this.queue.config.interval;
  this.queue.config.interval = num ? Number(num): 0;
  return this;
}

function recordDeferredEvents(){
  var self = this, currentQueue;
  if (self.queue.capacity > 0) {
    currentQueue = JSON.parse(JSON.stringify(self.queue));
    self.queue = queue();
    self.queue.options = currentQueue.options;

    self.emit('recordDeferredEvents', currentQueue.events);
    self.recordEvents(currentQueue.events, function(err, res){
      if (err) {
        // Retry once
        self.recordEvents(currentQueue.events);
      }
      else {
        currentQueue = void 0;
      }
    });
  }
  return self;
}

function handleValidationError(message){
  var err = 'Event(s) not deferred: ' + message;
  this.emit('error', err);
}
