var assert = require('proclaim');

var deepExtend = require('../../../../lib/utils/deepExtend');

describe('Keen.utils.deepExtend', function() {

  it('should blend objects and arrays together', function(){

    var a = {
      a: {
        a1: null,
        a2: true,
        a3: false,
        a4: undefined,
        a5: 'a5'
      },
      b: [],
      c: [ 1, 2, 3 ],
      d: {
        value: 'd1'
      }
    };

    var b = {
      a: {
        a1: 'string',
        a2: 123,
        a3: null,
        a4: {
          nested: '123'
        }
      },
      b: false,
      c: [ '3', 3, 5 ],
      d: {
        value: 'd2'
      }
    };

    assert.deepEqual(deepExtend(a, b), {
      a: {
        a1: 'string',
        a2: 123,
        a3: null,
        a4: {
          nested: '123'
        },
        a5: 'a5'
      },
      b: false,
      c: [ 1, 2, 3, '3', 5 ],
      d: {
        value: 'd2'
      }
    });

  });

});
