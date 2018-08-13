import Keen from './index';
import each from 'keen-core/lib/utils/each';
import { queue } from './utils/queue';

export function deferEvent(eventCollection, eventBody){

  if (arguments.length !== 2 || typeof eventCollection !== 'string') {
    handleValidationError.call(this, 'Incorrect arguments provided to #deferEvent method');
    return;
  }

  this.queue.events[eventCollection] = this.queue.events[eventCollection] || [];
  this.queue.events[eventCollection].push(eventBody);
  this.queue.capacity++;
  if (!this.queue.timer) {
    this.queue.start();
  }
  this.emit('deferEvent', eventCollection, eventBody);
  return this;
}

export function deferEvents(eventsHash){
  var self = this;

  if (arguments.length !== 1 || typeof eventsHash !== 'object') {
    handleValidationError.call(this, 'Incorrect arguments provided to #deferEvents method');
    return;
  }

  each(eventsHash, function(eventList, eventCollection){
    self.queue.events[eventCollection] = self.queue.events[eventCollection] || [];
    self.queue.events[eventCollection] = self.queue.events[eventCollection].concat(eventList);
    self.queue.capacity = self.queue.capacity + eventList.length;
    if (!self.queue.timer) {
      self.queue.start();
    }
  });
  self.emit('deferEvents', eventsHash);
  return self;
}

export function queueCapacity(num){
  if (!arguments.length) return this.queue.config.capacity;
  this.queue.config.capacity = num ? Number(num): 0;
  this.queue.check();
  return this;
}

export function queueInterval(num){
  if (!arguments.length) return this.queue.config.interval;
  this.queue.config.interval = num ? Number(num): 0;
  this.queue.check();
  return this;
}

export function recordDeferredEvents(){
  const self = this;

  if (self.queue.capacity > 0) {
    self.queue.pause();
    let clonedQueueConfig = { ...self.queue.config };
    let clonedQueueEvents = { ...self.queue.events };
    self.queue = queue();
    self.queue.config = clonedQueueConfig;
    self.queue.on('flush', function(){
      self.recordDeferredEvents();
    });
    self.emit('recordDeferredEvents', clonedQueueEvents);
    self.recordEvents(clonedQueueEvents, (err, res) => {
      if (err) {
        self.emit('recordDeferredEventsError', err, clonedQueueEvents);
      }
    });
  }
  return self;
}

function handleValidationError(message){
  this.emit('error', `Event(s) not deferred: ${message}`);
}
