# Record events

These methods push single or multiple events to their respective API endpoints. Wondering what you should record? Browse our [data modeling guide](https://keen.io/guides/data-modeling-guide/), and let us know if you don't find what you're looking for.

### Record a single event

Here is an example for recording a "purchases" event. Note that dollar amounts are tracked in cents:

```javascript
import KeenTracking from 'keen-tracking';
const client = new KeenTracking({ /*configure*/ });

// Create a data object with the properties you want to record
const purchaseEvent = {
  item: 'golden gadget',
  price: 2550,
  keen: {
    timestamp: new Date().toISOString()
  }
};

client.recordEvent('purchases', purchaseEvent, function(err, res){
  if (err) {
    // there was an error!
  }
  else {
    // see sample response below
  }
});
```

**API response for recording a single event:**

```jsonp
{
  "created": true
}
```

### Record multiple events

Here is an example for how to record multiple events with a single API call. Note that dollar amounts are tracked in cents:

```javascript
import KeenTracking from 'keen-tracking';
const client = new KeenTracking({ /*configure*/ });

const multipleEvents = {
  purchases: [
    {
      item: 'golden gadget',
      price: 2550,
      transaction_id: 'f029342'
    },
    {
      item: 'a different gadget',
      price: 1775,
      transaction_id: 'f029342'
    }
  ],
  transactions: [
    {
      id: 'f029342',
      items: 2,
      total: 4325
    }
  ]
};

// Send multiple events to several collections
client.recordEvents(multipleEvents, function(err, res){
  if (err) {
    // there was an error!
  }
  else {
    // see sample response below
  }
});
```

**API response for recording multiple events:**

```json
{
  "purchases": [
    {
      "success": true
    },
    {
      "success": true
    }
  ],
  "transactions": [
    {
      "success": true
    }
  ]
}
```
