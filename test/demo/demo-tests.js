const demoTests = (demoConfig, Keen) => {
  // demoConfig.requestType = 'xhr';

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
    x
  };

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
