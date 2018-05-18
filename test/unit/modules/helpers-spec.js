import { getBrowserProfile } from '../../../lib/helpers/getBrowserProfile';
import { getDatetimeIndex } from '../../../lib/helpers/getDatetimeIndex';
import { getDomainName } from '../../../lib/helpers/getDomainName';
import { getDomNodePath } from '../../../lib/helpers/getDomNodePath';
import { getDomNodeProfile } from '../../../lib/helpers/getDomNodeProfile';
import { getScreenProfile } from '../../../lib/helpers/getScreenProfile';
import { getScrollState } from '../../../lib/helpers/getScrollState';
import { getUniqueId } from '../../../lib/helpers/getUniqueId';
import { getWindowProfile } from '../../../lib/helpers/getWindowProfile';

describe('Keen.helpers', () => {

  describe('#getUniqueId', () => {
    it('should return a random UUID', () => {
      expect(getUniqueId()).not.toBe(null);
    });
    it('should return a string of length 36', () => {
      expect(getUniqueId().length).toBe(36);
    });
    it('should return a string of the correct structure', () => {
      const splitStr = getUniqueId().split('-');
      expect(splitStr.length).toBe(5);
      expect(splitStr[0].length).toBe(8);
      expect(splitStr[1].length).toBe(4);
      expect(splitStr[2].length).toBe(4);
      expect(splitStr[3].length).toBe(4);
      expect(splitStr[4].length).toBe(12);
    });
  });

  describe('#getDatetimeIndex', () => {
    it('should return an object of datetime properties', () => {
      const datetime = getDatetimeIndex();
      expect(datetime).toBeInstanceOf(Object);
      expect(datetime.hour_of_day).toBeGreaterThan(-1);
      expect(datetime.day_of_week).toBeGreaterThan(-1);
      expect(datetime.day_of_month).toBeGreaterThan(-1);
      expect(datetime.month).toBeGreaterThan(-1);
      expect(datetime.year).toBeGreaterThan(-1);
    });
    it('should return an object of datetime properties from a provided date', () => {
      const now = new Date();
      const datetime = getDatetimeIndex(now);
      expect(datetime).toEqual({
        'hour_of_day'  : now.getHours(),
        'day_of_week'  : parseInt( 1 + now.getDay() ),
        'day_of_month' : now.getDate(),
        'month'        : parseInt( 1 + now.getMonth() ),
        'year'         : now.getFullYear()
      });
    });
  });

  describe('#getDomainName', () => {
    it('should return the domain name', () => {
      expect(getDomainName('domain.name')).toBe('domain.name');
    });
    it('should return the domain name of a host with a subdomain', () => {
      expect(getDomainName('subdomain.domain.name')).toBe('domain.name');
    });
    it('should return the domain name of a host with a double subdomain', () => {
      expect(getDomainName('double.subdomain.domain.name')).toBe('domain.name');
    });
    it('should return the domain name of a host with .co.uk', () => {
      expect(getDomainName('subdomain.domain.co.uk')).toBe('domain.co.uk');
    });
  });

  describe('#getBrowserProfile', () => {
    it('should return an object of browser properties', () => {
      expect(getBrowserProfile()).toBeInstanceOf(Object);
    });
    it('should return a child object of screen properties', () => {
      expect(getBrowserProfile().screen).toBeInstanceOf(Object);
    });
    it('should return a child object of window properties', () => {
      expect(getBrowserProfile().window).toBeInstanceOf(Object);
    });
  });

  describe('#getScreenProfile', () => {
    it('should return an object of screen properties', () => {
      expect(getScreenProfile()).toBeInstanceOf(Object);
    });
  });

  describe('#getWindowProfile', () => {
    it('should return an object of window properties', () => {
      expect(getWindowProfile()).toBeInstanceOf(Object);
    });
    it('should have a height and width > 0', () => {
      const _window = getWindowProfile();
      expect(_window.height).toBeGreaterThan(0);
      expect(_window.width).toBeGreaterThan(0);
    });
  });

  describe('#getDomNodePath', () => {
    it('should return a string', () => {
      const el = document.body;
      const path = getDomNodePath(el);
      expect(path).toBe(path);
    });
  });

  describe('#getDomNodeProfile', () => {
    it('should return an object of properties for a given DOM node', () => {
      const el = document.body;
      const obj = getDomNodeProfile(el);
      expect(obj).toBeInstanceOf(Object);
      expect(obj.node_name).toBe('BODY');
    });
  });

  describe('#getScrollState', () => {
    it('should return an object of properties for the window scroll state', () => {
      const obj = getScrollState();
      expect(obj).toBeInstanceOf(Object);
      expect(obj.pixel).toBeGreaterThan(0);
      expect(obj.pixel_max).toBeGreaterThan(0);
      expect(obj.ratio).toBeGreaterThan(0);
      expect(obj.ratio_max).toBeGreaterThan(0);
    });

    it('should accept an object and return properties showing *_max diffs', () => {
      const obj = getScrollState({
        pixel: 800,
        ratio: 0.50,
        ratio_max: 1
      });
      expect(obj).toBeInstanceOf(Object);
      expect(obj.pixel_max).toBeGreaterThan(0);
    });

  });

});
