// $ node test/demo/record.js

var Keen = require('../../lib/server');

Keen.debug = true;
var client = new Keen.Client({
  projectId: '52f00ec205cd66404b000000',
  writeKey: '554a723d023da6cb24e51c56a9a54555e9dcf8403d4b71ffa37e9112295622e78a10eed43a13c83b14ce171b0f1317bb09aa8df43d50f73b77709ab431af611ea47ed65f4d74c0ea5f2bde8407322ab70559afef294673ee6c224308b1744c9e069508799edefc51264b3f75a1ba9e26'
});
var eventBody = {
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
  Keen.log('#recordEvent');
  Keen.log(err);
  Keen.log(res);
});
client.recordEvents({ 'recordEvents': [eventBody, eventBody, eventBody] }, function(err, res){
  Keen.log('#recordEvents');
  Keen.log(err);
  Keen.log(res);
});
