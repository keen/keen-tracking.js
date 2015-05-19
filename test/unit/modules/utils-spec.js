var assert = require('proclaim');

var each = require('../../../lib/utils/each'),
    extend = require('../../../lib/utils/extend'),
    parseParams = require('../../../lib/utils/parseParams');

describe('Keen.utils', function() {

  describe('#each', function(){
    it('Should be a function', function() {
      assert.isFunction(each);
    });
  });

  describe('#extend', function(){
    it('Should be a function', function() {
      assert.isFunction(extend);
    });
  });

  describe('#parseParams', function(){
    it('Should be a function', function() {
      assert.isFunction(parseParams);
    });
  });

});
