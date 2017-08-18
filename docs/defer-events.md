# Defer Events

These methods handle an internal queue of events, which is pushed to the [events](https://keen.io/docs/api/#record-multiple-events) API resource on a given interval (default: 15 seconds), or when the queue reaches a maximum capacity (default: 5000).

```javascript
import Keen from 'keen-tracking';
const client = new Keen({ /*configure*/ });

// Single event from the previous example
client.deferEvent('purchase', purchaseEvent);

// Multiple events from the previous example
client.deferEvents(multipleEvents);

// Flush the deferred queue
client.recordDeferredEvents();

// Record events when queue contains at least N events (default: 5000)
client.queueCapacity(5000);
client.queueCapacity(); // 5000

// Record events every N seconds (default: 15)
client.queueInterval(15);
client.queueInterval(); // 15
```
