# Defer Events

These methods handle an internal queue of events, which is pushed to the [events](https://keen.io/docs/api/#record-multiple-events) API resource on a given interval (default: 15 seconds), or when the queue reaches a maximum capacity (default: 5000 events).

### Defer a single event

```javascript
import Keen from 'keen-tracking';
const client = new Keen({ /*configure*/ });

client.deferEvent('purchase', {
  user_id: '35465434643'
  /* Data Model */
});
```

### Defer multiple events

```javascript
import Keen from 'keen-tracking';
const client = new Keen({ /*configure*/ });

client.deferEvents([
  'collection-1': [
    { user_id: '21325432423' /* Event Data Model */ },
    { user_id: '55421323121' /* Event Data Model */ }
  ],
  'collection-2': [ /* Multiple Events */ ]
]);
```

### Set queue capacity

Determine the maximum number of events to store before flushing the queue by passing a number (total) to `client.queueCapacity()`. Calling this method without an argument returns the current setting. The default capacity is `5000` events.

```javascript
import Keen from 'keen-tracking';
const client = new Keen({ /*configure*/ });

client.queueCapacity(5000);
client.queueCapacity(); // 5000
```

### Set queue interval

Determine how often the queue should be flushed by passing a number (seconds) to `client.queueInterval()`. Calling this method without an argument returns the current setting. The default interval is `15` seconds.

```javascript
import Keen from 'keen-tracking';
const client = new Keen({ /*configure*/ });

client.queueInterval(15);
client.queueInterval(); // 15
```

**Important:** Setting `client.queueInterval(0);` will stop the internal `setInterval` loop that monitors the queue. Another method for exiting this process is `client.queue.pause();`.


### Flush the queue

Flush all events currently queued by calling `client.recordDeferredEvents()`.

```javascript
import Keen from 'keen-tracking';
const client = new Keen({ /*configure*/ });

client.deferEvent('purchase', {
  /* Data Model */
});

client.recordDeferredEvents();
```
