var assert = require('proclaim');

var cookie = require('../../../../lib/utils/cookie');

describe('Keen.utils.cookie', function() {

  beforeEach(function(){
    this.cookie = cookie('keen-test-cookie');
  });

  afterEach(function(){
    this.cookie.expire();
  });

  describe('constructor', function(){

    it('should return a constructed object', function() {
      assert.isObject(this.cookie);
    });

    it('should have internal properties', function() {
      assert.isObject(this.cookie.data);
      assert.isObject(this.cookie.config.options);
      assert.isString(this.cookie.config.key);
      assert.equal(this.cookie.config.key, 'keen-test-cookie');
    });

    it('should have prototype methods', function() {
      assert.isFunction(this.cookie.get);
      assert.isFunction(this.cookie.set);
      assert.isFunction(this.cookie.expire);
    });

  });

  describe('.get', function(){

    it('should return an empty object', function(){
      assert.deepEqual(this.cookie.get(), {});
    });

  });

  describe('.set', function(){

    it('should set a string value', function(){
      this.cookie.set('library', 'keen-tracking.js');
      assert.equal(this.cookie.get('library'), 'keen-tracking.js');
    });

    it('should set a numeric value', function(){
      this.cookie.set('number', 123);
      assert.equal(this.cookie.get('number'), 123);
    });

    it('should set an array value', function(){
      this.cookie.set('array', ['1', 2, false]);
      assert.deepEqual(this.cookie.get('array'), ['1', 2, false]);
    });

    it('should set an object value to a key', function(){
      this.cookie.set('object', { object: true });
      assert.deepEqual(this.cookie.get('object'), { object: true });
    });

    it('should set an object of key:value pairs', function(){
      this.cookie.set({
        library: 'keen-tracking.js',
        number: 123,
        array: ['1', 2, false],
        object: { object: true }
      });
      var data = this.cookie.get();
      assert.equal(data.library, 'keen-tracking.js');
      assert.equal(data.number, 123);
      assert.deepEqual(data.array, ['1', 2, false]);
      assert.deepEqual(data.object, { object: true });
    });

  });

  describe('.expire', function(){

    it('should expire the cookie', function(){
      this.cookie.set('library', 'keen-tracking.js');
      this.cookie.expire();
      assert.deepEqual(this.cookie.get(), {});
    });

  });

  describe('.options', function(){

    it('should set options for cookies', function(){
      this.cookie.options({ secure: false });
      assert.equal(this.cookie.config.options.secure, false);
    });

    it('should get options for cookies', function(){
      this.cookie.options({ secure: false });
      assert.deepEqual(this.cookie.options(), { secure: false });
    });

  });

});
