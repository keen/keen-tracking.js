import Keen from './index';
import each from 'keen-core/lib/utils/each';
import { queue } from './utils/queue';

export function deferEvent({ client, events }){
  each(events, function(event){
    client.queue.events[event.collection] = client.queue.events[event.collection] || [];
    client.queue.events[event.collection].push(event.event);
    client.queue.capacity++;
  });
  if (!client.queue.timer) {
    client.queue.start();
  }
  client.emit('deferEvent', events);
}

export function deferEventsx(eventsHash){
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

export function recordDeferredEvents(client){
  if (client.queue.capacity > 0) {
    client.queue.pause();
    let clonedQueueConfig = { ...client.queue.config };
    let clonedQueueEvents = { ...client.queue.events };
    client.queue = queue();
    client.queue.config = clonedQueueConfig;
    client.queue.on('flush', function(){
      return recordDeferredEvents(client);
    });
    client.emit('recordDeferredEvents', clonedQueueEvents);
    return client
      .recordEvent(clonedQueueEvents);
  }
}

function handleValidationError(message){
  this.emit('error', `Event(s) not deferred: ${message}`);
}
