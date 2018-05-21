import Cookies from 'js-cookie';
import { cookie } from '../../../../lib/utils/cookie';

describe('Keen.utils.cookie', () => {
  let cookie1;

  beforeEach(() => {
    cookie1 = cookie('keen-test-cookie');
  });

  afterEach(() => {
    cookie1.expire();
  });

  describe('constructor', () => {

    it('should return a constructed object', () => {
      expect(cookie1).toBeInstanceOf(Object);
    });

    it('should have internal properties', () => {
      expect(cookie1.data).toBeInstanceOf(Object);
      expect(cookie1.config.options).toBeInstanceOf(Object);
      expect(cookie1.config.key).toBe('keen-test-cookie');
    });

    it('should have prototype methods', () => {
      expect(cookie1.get).toBeInstanceOf(Function);
      expect(cookie1.set).toBeInstanceOf(Function);
      expect(cookie1.expire).toBeInstanceOf(Function);
    });

  });

  describe('.get', () => {

    it('should return a simple string for pre-existing non-json data', () => {
      Cookies.set('keen-test-cookie', 'some thing that is not json');
      expect(cookie1.get()).toEqual('some thing that is not json');
    });

    it('should return an empty object when no key name is provided and no data has been stored', () => {
      expect(cookie1.get()).toEqual({});
    });

    it('should return stored key', () => {
      cookie1.set('mocha-test-getter', 123);
      expect(cookie1.get('mocha-test-getter')).toEqual(123);
    });

    it('should return null when requesting an unstored key', () => {
      expect(cookie1.get('mocha-null')).toBe(null);
    });

  });

  describe('.set', () => {

    it('should set a string value', () => {
      cookie1.set('library', 'keen-tracking.js');
      expect(cookie1.get('library')).toBe('keen-tracking.js');
    });

    it('should set a numeric value', () => {
      cookie1.set('number', 123);
      expect(cookie1.get('number')).toBe(123);
    });

    it('should set an array value', () => {
      cookie1.set('array', ['1', 2, false]);
      expect(cookie1.get('array')).toEqual(['1', 2, false]);
    });

    it('should set an object value to a key', () => {
      cookie1.set('object', { object: true });
      expect(cookie1.get('object')).toEqual({ object: true });
    });

    it('should set an object of key:value pairs', () => {
      cookie1.set({
        library: 'keen-tracking.js',
        number: 123,
        array: ['1', 2, false],
        object: { object: true }
      });
      const data = cookie1.get();
      expect(data.library).toEqual('keen-tracking.js');
      expect(data.number).toEqual(123);
      expect(data.array).toEqual(['1', 2, false]);
      expect(data.object).toEqual({ object: true });
    });

    it('should set an object value to a key when extended options passed', () => {
      cookie1.set('object', { object: true }, {});
      expect(cookie1.get('object')).toEqual({ object: true });
    });

  });

  describe('.expire', () => {

    it('should expire the cookie', () => {
      cookie1.set('library', 'keen-tracking.js');
      cookie1.expire();
      expect(cookie1.get()).toEqual({});
    });

  });

  describe('.options', () => {

    it('should set options for cookies', () => {
      cookie1.options({ secure: false });
      expect(cookie1.config.options.secure).toEqual(false);
    });

    it('should get options for cookies', () => {
      cookie1.options({ secure: false });
      expect(cookie1.options()).toEqual({ secure: false });
    });

  });

  describe('.enabled', () => {

    it('should return a boolean value', () => {
      expect(cookie1.enabled()).toBe(true);
    });

  });

});
