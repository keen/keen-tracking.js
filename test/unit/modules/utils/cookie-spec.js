import Cookies from 'js-cookie';
import { cookie } from '../../../../lib/utils/cookie';

describe('Keen.utils.cookie', function() {

  beforeEach(() => {
    this.cookie = cookie('keen-test-cookie');
  });

  afterEach(() => {
    this.cookie.expire();
  });

  describe('constructor', () => {

    it('should return a constructed object', function() {
      expect().isObject(this.cookie);
    });

    it('should have internal properties', function() {
      expect().isObject(this.cookie.data);
      expect().isObject(this.cookie.config.options);
      expect().isString(this.cookie.config.key);
      expect().equal(this.cookie.config.key, 'keen-test-cookie');
    });

    it('should have prototype methods', function() {
      expect().isFunction(this.cookie.get);
      expect().isFunction(this.cookie.set);
      expect().isFunction(this.cookie.expire);
    });

  });

  describe('.get', () => {

    it('should return a simple string for pre-existing non-json data', () => {
      Cookies.set('keen-test-cookie', 'some thing that is not json');
      expect().deepEqual(this.cookie.get(), 'some thing that is not json');
    });

    it('should return an empty object when no key name is provided and no data has been stored', () => {
      expect().deepEqual(this.cookie.get(), {});
    });

    it('should return stored key', () => {
      this.cookie.set('mocha-test-getter', 123);
      expect().deepEqual(this.cookie.get('mocha-test-getter'), 123);
    });

    it('should return null when requesting an unstored key', () => {
      expect().isNull(this.cookie.get('mocha-null'));
    });

  });

  describe('.set', () => {

    it('should set a string value', () => {
      this.cookie.set('library', 'keen-tracking.js');
      expect().equal(this.cookie.get('library'), 'keen-tracking.js');
    });

    it('should set a numeric value', () => {
      this.cookie.set('number', 123);
      expect().equal(this.cookie.get('number'), 123);
    });

    it('should set an array value', () => {
      this.cookie.set('array', ['1', 2, false]);
      expect().deepEqual(this.cookie.get('array'), ['1', 2, false]);
    });

    it('should set an object value to a key', () => {
      this.cookie.set('object', { object: true });
      expect().deepEqual(this.cookie.get('object'), { object: true });
    });

    it('should set an object of key:value pairs', () => {
      this.cookie.set({
        library: 'keen-tracking.js',
        number: 123,
        array: ['1', 2, false],
        object: { object: true }
      });
      const data = this.cookie.get();
      expect().equal(data.library, 'keen-tracking.js');
      expect().equal(data.number, 123);
      expect().deepEqual(data.array, ['1', 2, false]);
      expect().deepEqual(data.object, { object: true });
    });

  });

  describe('.expire', () => {

    it('should expire the cookie', () => {
      this.cookie.set('library', 'keen-tracking.js');
      this.cookie.expire();
      expect().deepEqual(this.cookie.get(), {});
    });

  });

  describe('.options', () => {

    it('should set options for cookies', () => {
      this.cookie.options({ secure: false });
      expect().equal(this.cookie.config.options.secure, false);
    });

    it('should get options for cookies', () => {
      this.cookie.options({ secure: false });
      expect().deepEqual(this.cookie.options(), { secure: false });
    });

  });

  describe('.enabled', () => {

    it('should return a boolean value', () => {
      expect().isBoolean(this.cookie.enabled());
    });

  });

});
