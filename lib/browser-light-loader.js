import KeenT, { listener, getDomNodePath } from './browser-light';

KeenT.debug = true;

const client = new KeenT(KeenT.defaultConfig);


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

// listener(client);

const navLinks = listener('.nav a');

// Listen for a given event
navLinks.on('click', (e) => {
  // handle click
  console.log(e, 'ok');
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
*/
client.recordEvent({
  collection: 'abc',
  event: {
    z: 1
  },
  callback: (err, res) => console.log(err,res)
});

console.log(client);
