require([
    '../../../dist/keen-tracking.js'
  ], function(KeenAMD) {

    var client = new KeenAMD.Client({
      projectId: "123",
      writeKey: "456"
    });

    console.log(KeenAMD, client);

});
