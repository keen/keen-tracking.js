import KeenT, { listener, deferEvent } from './browser-light';

KeenT.debug = true;

const client = new KeenT({
  ...KeenT.defaultConfig,
  requestType: 'beaconAPI',

  queue: {
    capacity: 3, // maximum number of items
    interval: 5 // seconds
  }
});

const x = Math.random();
console.log(x);
const eventBody = {
  x: 123456,
  page: {
    a: 1,
    b: {
      c:1
    }
  }
};



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



/*


client.recordEvent({
  collection: 'abc',
  event: {
    z: 1
  }
});


// listener(client);

const navLinks = listener('.nav a');

// Listen for a given event
navLinks.on('click', (e) => {
  // handle click
  console.log('cccc');
});

/*
client.listenTo({
  'click .nav a': (e) => {
    return client.recordEvent('click', {
      action: {
        intent: 'navigate',
        target_path: getDomNodePath(e.target)
      }
    });
  },
  'submit form': (e) => {
    return client.recordEvent('form-submit', {
      action: {
        intent: 'signup',
      }
    });
  }
});

client.recordEvent({
  collection: 'abc',
  event: {
    z: 1
  },
  callback: (err, res) => console.log(err,res)
});

console.log(client);

*/
