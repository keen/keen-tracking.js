# Defer Events

These methods handle an internal queue of events, which is pushed to the [events](https://keen.io/docs/api/#record-multiple-events) API resource on a given interval (default: 15 seconds), or when the queue reaches a maximum capacity (default: 5000 events).

### Defer a single event

```javascript
import KeenTracking, { deferEvent } from 'keen-tracking';

const client = new KeenTracking({
  // projectId: '',
  // writeKey: '',

  // customize default values
  queue: {
    capacity: 5000, // maximum number of items
    interval: 15 // seconds
  }
});

deferEvent({
  client,
  events: [
    {
      collection: 'purchase',
      event: {
        some_data: 1234,
        user_id: 35465434643
        /* Data Model */
      }
    }
    // add as many events as you want
  ]
});
```

### Stop interval

Remove interval listener by calling `client.queue.pause();`

```javascript
// ...
client.queue.pause();
```

### Flush the queue

Flush all events currently queued by calling `recordDeferredEvents()`.

```javascript
recordDeferredEvents(client);
```
