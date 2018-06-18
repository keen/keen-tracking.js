const demoTests = (demoConfig, Keen) => {
  // demoConfig.requestType = 'xhr';

  // demoConfig.referrerPolicy: 'origin',
  // https://googlechrome.github.io/samples/fetch-api/fetch-referrer-policy.html
  const client = new Keen(demoConfig);
  Keen.debug = true;

  const eventBody = {
    ip_address: '${keen.ip}',
    keen: {
      addons: [
        {
          name : 'keen:ip_to_geo',
          input : { ip : 'ip_address' },
          output : 'ip_geo_info'
        }
      ]
    }
  };


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
