# Extend Events

These methods extend the event body of every event sent through `recordEvent()`, for all or specified collections, and accepts either a predefined object (static) or a function that returns an object (dynamic). This returned object is then grafted into the original event body with a deep-extend operation that seamlessly blends nested objects.

Global `extendEvent()` transforms will be applied first, followed by collection-specific `extendEvent()` transforms. In either case, transforms will be applied in the order that they are defined. Properties provided in the originating `recordEvent/s()` call will override any matching properties (static or dynamic) returned by these methods.

```javascript
import KeenTracking, { extendEvent } from 'keen-tracking';
const client = new KeenTracking({ /*configure*/ });

// Extend events for a single collection
extendEvent({
  client,
  collection: 'purchases',
  body: {
    some_custom_property: 'some value' // just for the purchases collection
  }
});

// Extend events for all collections
extendEvent({
  client,
  body: {
    some_custom_property: 'some value' // for all of the events
  }
});

// Example usage

const user = {
  full_name: 'User Dude',
  email: 'name@domain.com',
  id: 'f1233423h',
  username: 'userdude213'
};

// Include a predefined 'user' object with every purchase event
extendEvent({
  client,
  collection: 'purchases',
  body: {
    user
  }
});

// Include a predefined 'user' object with every event
extendEvent({
  client
  body: {
    user
  }
});
```
