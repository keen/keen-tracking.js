import { deepExtend } from './utils/deepExtend';
import each from 'keen-core/lib/utils/each';

export function extendEvent(eventCollection, eventModifier){
  if (arguments.length !== 2 || typeof eventCollection !== 'string'
    || ('object' !== typeof eventModifier && 'function' !== typeof eventModifier)) {
      handleValidationError.call(this, 'Incorrect arguments provided to #extendEvent method');
      return;
  }
  this.extensions.collections[eventCollection] = this.extensions.collections[eventCollection] || [];
  this.extensions.collections[eventCollection].push(eventModifier);
  this.emit('extendEvent', eventCollection, eventModifier);
  return this;
}

export function extendEvents(eventsModifier){
  if (arguments.length !== 1 || ('object' !== typeof eventsModifier && 'function' !== typeof eventsModifier)) {
    handleValidationError.call(this, 'Incorrect arguments provided to #extendEvents method');
    return;
  }
  this.extensions.events.push(eventsModifier);
  this.emit('extendEvents', eventsModifier);
  return this;
}

function handleValidationError(message){
  this.emit('error', `Event(s) not extended: ${message}`);
}

export function getExtendedEventBody(result, queue){
  if (queue && queue.length > 0) {
    each(queue, function(eventModifier, i){
      let modifierResult = (typeof eventModifier === 'function') ? eventModifier() : eventModifier;
      deepExtend(result, modifierResult);
    });
  }
  return result;
}
