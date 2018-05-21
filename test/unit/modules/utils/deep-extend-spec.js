import { deepExtend } from '../../../../lib/utils/deepExtend';

describe('Keen.utils.deepExtend', () => {
  test('should blend objects and arrays together', () => {
    const a = {
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

    const b = {
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
        value: 'd2',
        someFunction: function() {}
      }
    };

    expect(deepExtend(a, b)).toEqual({
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

  test('should not blend function attributes', () => {
    const a = {
      value: 'a'
    };

    const b = {
      value: 'b',
      someFunction: function() {}
    };

    expect(deepExtend(a, b)).toEqual({
      value: 'b'
    });

  });

});
