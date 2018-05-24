const demoTests = (demoConfig, Keen) => {
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

  client.recordEvent('recordEvent', eventBody, function(err, res){
    if (err) {
      console.log('err', err);
    } else {
      Keen.log('#recordEvent');
      Keen.log(res);
    }
  });
  client.recordEvents({ 'recordEvents': [eventBody, eventBody, eventBody] }, function(err, res){
    if (err) {
      console.log('err', err);
    } else {
      Keen.log('#recordEvents');
      Keen.log(res);
    }
  });
}

if (typeof window !== 'undefined') {
  window.demoTests = demoTests;
}
if (typeof global !== 'undefined') {
  module.exports = demoTests;
}
