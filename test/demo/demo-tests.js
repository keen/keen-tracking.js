const demoTests = (demoConfig, Keen) => {

  // demoConfig.requestType = 'beaconAPI';

  // Keen.debug = true;
  const client = new Keen(demoConfig);

  client
  .recordEvent('beacon_purchases', {
    item: 'Avocado',
    number_of_items: 10,
    user: {
      name: 'John Smith'
    }
  });
  /*
  .then((response) => {
    console.log(response);
    // handle successful responses
  })
  .catch(error => {
    console.log(error);
    // handle errors
  });
*/
  return;

  client.recordEvent({
    collection: 'abc',
    event: {
      z: 1
    }
  });

  return;

/*
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

  client.extendEvents({aaaa: 123});

  client.recordEvent('aaa', {
    // collection: 'abc',
    event: {
      z: 1
    },
    // requestType: 'beacon',
    // callback: (err, res) => console.log(err,res)
  });



  return;
*/
function save(id){
  client
    .recordEvent({
      collection: 'unique_clicks',
      event: {
        some_key: 'some_value'
        // ...
      },
      unique: true, // check if the event is unique, before sending to API
      cache: {
        storage: 'indexeddb', // for persistence. Remove this property to use RAM
        maxAge: 1000 * 30
      }
    })
    .then((response) => {
      console.log('ok', response);
    })
    .catch(someError => {
      console.log('error', someError);
    });
}
save(1);
save(2);
setTimeout(() => save(3), 6000);

return;
setInterval(() => {
  eventBody.z=Math.random();
  save();
}, 2000);
setTimeout(() => {
  save();
}, 5000);

return;

  client
    .recordEvent('recordEvent', eventBody)
    .then((res) => {
      console.log('with promise');
      Keen.log('#recordEvent');
      Keen.log(res);
      console.log('ok');
    })
    .catch(some => {
      console.log('failed',some);
    });

  return;


  client
    .recordEvent('recordEvent', eventBody, function(err, res){
      console.log('with callback');
      if (err) {
        console.log('err', err);
      } else {
        Keen.log('#recordEvent');
        Keen.log(res);
      }
    })
    .then((res) => {
      console.log('with promise');
      Keen.log('#recordEvent');
      Keen.log(res);
      console.log('ok');
    })
    .catch(some => {
      console.log('failed',some);
    });

  client.recordEvents({ 'recordEvents': [eventBody, eventBody, eventBody] }, function(err, res){
    console.log('with callback');
    if (err) {
      console.log('err', err);
    } else {
      Keen.log('#recordEvents');
      Keen.log(res);
    }
  })
  .then((res) => {
    console.log('with promise');
    Keen.log('#recordEvents');
    Keen.log(res);
    console.log('ok');
  })
  .catch(err => {
    console.log('failed', err);
  });
  /*  */
}

if (typeof window !== 'undefined') {
  window.demoTests = demoTests;
}
if (typeof global !== 'undefined') {
  module.exports = demoTests;
}
