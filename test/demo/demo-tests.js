const demoTests = (demoConfig, Keen) => {

 //demoConfig.requestType = 'beaconAPI';

  // demoConfig.referrerPolicy: 'origin',
  // https://googlechrome.github.io/samples/fetch-api/fetch-referrer-policy.html
  // const client = new Keen(demoConfig);
  /*
  demoConfig.retry = {
    limit: 3,
    initialDelay: 1000
  };
  */

  Keen.debug = true;

  const client = new Keen(demoConfig);

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


  client.recordEvent({
    collection: 'abc',
    event: {
      z: 1
    },
    requestType: 'beacon',
    callback: (err, res) => console.log(err,res)
  });


/*
.then(res=>{
  console.log(res);
}).catch(err => conrole.log(err));


  client
    .recordEvent('recordEvent', { z : 1}, function(err, res){
      console.log('with callback');
      if (err) {
        console.log('err', err);
      } else {
        Keen.log('#recordEvent');
        Keen.log(res);
      }
    });


  client.recordEvents({
    col1: [{
      some: 1
    }],
    col2: [{
      some: 1
    }]
  }, (err, res) => {
    console.log(err,res);
  });


*/

  return;


client.recordEvents({
  col1: [{
    some: 1
  }],
  col2: [{
    some: 1
  }]
}).then(res => {
  console.log(res);
});
return;
function save(id){
  client
    .recordEvent({
      collection: 'unique_clicks',
      event: {
        some_key: 'some_value',
        // ...
      },
      unique: true, // check if the event is unique, before sending to API
      cache: {
    //    storage: 'indexeddb', // for persistence. Remove this property to use RAM
    maxAge: 1000 * 3
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
    .recordEvent('recordEvent', { z : 1}, function(err, res){
      console.log('with callback');
      if (err) {
        console.log('err', err);
      } else {
        Keen.log('#recordEvent');
        Keen.log(res);
      }
    });
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
