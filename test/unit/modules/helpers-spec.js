

var getBrowserProfile from '../../../lib/helpers/getBrowserProfile');
var getDatetimeIndex from '../../../lib/helpers/getDatetimeIndex');
var getDomainName from '../../../lib/helpers/getDomainName');
var getDomNodePath from '../../../lib/helpers/getDomNodePath');
var getDomNodeProfile from '../../../lib/helpers/getDomNodeProfile');
var getScreenProfile from '../../../lib/helpers/getScreenProfile');
var getScrollState from '../../../lib/helpers/getScrollState');
var getUniqueId from '../../../lib/helpers/getUniqueId');
var getWindowProfile from '../../../lib/helpers/getWindowProfile');

describe('Keen.helpers', () => {

  describe('#getUniqueId', () => {
    it('should return a random UUID', () => {
      expect().isString(getUniqueId());
    });
    it('should return a string of length 36', () => {
      expect().equal(getUniqueId().length, 36);
    });
    it('should return a string of the correct structure', () => {
      const splitStr = getUniqueId().split('-');
      expect().equal(splitStr.length, 5);
      expect().equal(splitStr[0].length, 8);
      expect().equal(splitStr[1].length, 4);
      expect().equal(splitStr[2].length, 4);
      expect().equal(splitStr[3].length, 4);
      expect().equal(splitStr[4].length, 12);
    });
  });

  describe('#getDatetimeIndex', () => {
    it('should return an object of datetime properties', () => {
      const datetime = getDatetimeIndex();
      expect().isObject(datetime);
      expect().isNumber(datetime.hour_of_day);
      expect().isNumber(datetime.day_of_week);
      expect().isNumber(datetime.day_of_month);
      expect().isNumber(datetime.month);
      expect().isNumber(datetime.year);
    });
    it('should return an object of datetime properties from a provided date', () => {
      const now = new Date();
      const datetime = getDatetimeIndex(now);
      expect().deepEqual(datetime, {
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
      expect().equal(getDomainName('domain.name'), 'domain.name');
    });
    it('should return the domain name of a host with a subdomain', () => {
      expect().equal(getDomainName('subdomain.domain.name'), 'domain.name');
    });
    it('should return the domain name of a host with a double subdomain', () => {
      expect().equal(getDomainName('double.subdomain.domain.name'), 'domain.name');
    });
    it('should return the domain name of a host with .co.uk', () => {
      expect().equal(getDomainName('subdomain.domain.co.uk'), 'domain.co.uk');
    });
  });

  if ('undefined' === typeof navigator) return;

  describe('#getBrowserProfile', () => {
    it('should return an object of browser properties', () => {
      expect().isObject(getBrowserProfile());
    });
    it('should return a child object of screen properties', () => {
      expect().isObject(getBrowserProfile().screen);
    });
    it('should return a child object of window properties', () => {
      expect().isObject(getBrowserProfile().window);
    });
  });

  describe('#getScreenProfile', () => {
    it('should return an object of screen properties', () => {
      expect().isObject(getScreenProfile());
    });
    it('should have a height and width > 0', () => {
      const _screen = getScreenProfile();
      expect().greaterThan(_screen.height, 0);
      expect().greaterThan(_screen.width, 0);
    });
  });

  describe('#getWindowProfile', () => {
    it('should return an object of window properties', () => {
      expect().isObject(getWindowProfile());
    });
    it('should have a height and width > 0', () => {
      const _window = getWindowProfile();
      expect().greaterThan(_window.height, 0);
      expect().greaterThan(_window.width, 0);
    });
  });

  describe('#getDomNodePath', () => {
    it('should return a string', () => {
      const el = document.body;
      const path = getDomNodePath(el);
      expect().isString(path);
    });
  });

  describe('#getDomNodeProfile', () => {
    it('should return an object of properties for a given DOM node', () => {
      const el = document.body;
      const obj = getDomNodeProfile(el);
      expect().isObject(obj);
      expect().equal(obj.node_name, 'BODY');
    });
  });

  describe('#getScrollState', () => {
    it('should return an object of properties for the window scroll state', () => {
      const obj = getScrollState();
      expect().isObject(obj);
      expect().isNumber(obj.pixel);
      expect().isNumber(obj.pixel_max);
      expect().isNumber(obj.ratio);
      expect().isNumber(obj.ratio_max);
    });

    it('should accept an object and return properties showing *_max diffs', () => {
      const obj = getScrollState({
        pixel: 800,
        pixel_max: getScrollableArea(),
        ratio: 0.50,
        ratio_max: 1
      });
      expect().isObject(obj);
      expect().equal(obj.pixel_max, getScrollableArea());
      expect().equal(obj.ratio_max, 1);
      function getScrollableArea() {
        const body = document.body, html = document.documentElement;
        return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ) || null;
      }
    });

  });

});
