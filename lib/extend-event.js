import { deepExtend } from './utils/deepExtend';
import each from 'keen-core/lib/utils/each';

export function extendEvent({ client, collection, body}){
  if (!client.extensions) {
    client.extensions = {};
  }
  if (!collection) {
    client.extensions.events.push(body);
    client.emit('extendEvents', body);
    return;
  }
  client.extensions.collections[collection] = client.extensions.collections[collection] || [];
  client.extensions.collections[collection].push(body);
  client.emit('extendEvent', collection, body);
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
