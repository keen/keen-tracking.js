requirejs.config({
  paths: {
    'keen-tracking': '../../../dist/keen-tracking.js'
  }
});

require([
    'keen-tracking'
  ], function(KeenAMD) {

    var client = new KeenAMD.Client({
      projectId: "123",
      writeKey: "456"
    });

    console.log(KeenAMD, client);

});
