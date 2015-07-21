module.exports = function(config) {
  config.set({
    browsers: [ 'Chrome', 'Firefox', 'Safari' ],
    frameworks: [ 'mocha' ],
    files: [
      // Include requirejs presence
      // './test/vendor/require.js',
      './test/unit/build/browserified-tests.js'
    ],
    client: {
      mocha: {
        reporter: 'html',
        ui: 'bdd'
      }
    },
    reporters: [ 'nyan' ],
    singleRun: true
  });
};
