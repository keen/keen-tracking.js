var assert = require('proclaim');

var getBrowserProfile = require('../../../lib/helpers/getBrowserProfile');
var getDatetimeIndex = require('../../../lib/helpers/getDatetimeIndex');
var getDomainName = require('../../../lib/helpers/getDomainName');
var getDomNodePath = require('../../../lib/helpers/getDomNodePath');
var getDomNodeProfile = require('../../../lib/helpers/getDomNodeProfile');
var getScreenProfile = require('../../../lib/helpers/getScreenProfile');
var getScrollState = require('../../../lib/helpers/getScrollState');
var getUniqueId = require('../../../lib/helpers/getUniqueId');
var getWindowProfile = require('../../../lib/helpers/getWindowProfile');

describe('Keen.helpers', function(){

  describe('#getUniqueId', function(){
    it('should return a random UUID', function(){
      expect().isString(getUniqueId());
    });
    it('should return a string of length 36', function(){
      expect().equal(getUniqueId().length, 36);
    });
    it('should return a string of the correct structure', function(){
      var splitStr = getUniqueId().split('-');
      expect().equal(splitStr.length, 5);
      expect().equal(splitStr[0].length, 8);
      expect().equal(splitStr[1].length, 4);
      expect().equal(splitStr[2].length, 4);
      expect().equal(splitStr[3].length, 4);
      expect().equal(splitStr[4].length, 12);
    });
  });

  describe('#getDatetimeIndex', function(){
    it('should return an object of datetime properties', function(){
      var datetime = getDatetimeIndex();
      expect().isObject(datetime);
      expect().isNumber(datetime.hour_of_day);
      expect().isNumber(datetime.day_of_week);
      expect().isNumber(datetime.day_of_month);
      expect().isNumber(datetime.month);
      expect().isNumber(datetime.year);
    });
    it('should return an object of datetime properties from a provided date', function(){
      var now = new Date();
      var datetime = getDatetimeIndex(now);
      expect().deepEqual(datetime, {
        'hour_of_day'  : now.getHours(),
        'day_of_week'  : parseInt( 1 + now.getDay() ),
        'day_of_month' : now.getDate(),
        'month'        : parseInt( 1 + now.getMonth() ),
        'year'         : now.getFullYear()
      });
    });
  });

  describe('#getDomainName', function(){
    it('should return the domain name', function(){
      expect().equal(getDomainName('domain.name'), 'domain.name');
    });
    it('should return the domain name of a host with a subdomain', function(){
      expect().equal(getDomainName('subdomain.domain.name'), 'domain.name');
    });
    it('should return the domain name of a host with a double subdomain', function(){
      expect().equal(getDomainName('double.subdomain.domain.name'), 'domain.name');
    });
    it('should return the domain name of a host with .co.uk', function(){
      expect().equal(getDomainName('subdomain.domain.co.uk'), 'domain.co.uk');
    });
  });

  if ('undefined' === typeof navigator) return;

  describe('#getBrowserProfile', function(){
    it('should return an object of browser properties', function(){
      expect().isObject(getBrowserProfile());
    });
    it('should return a child object of screen properties', function(){
      expect().isObject(getBrowserProfile().screen);
    });
    it('should return a child object of window properties', function(){
      expect().isObject(getBrowserProfile().window);
    });
  });

  describe('#getScreenProfile', function(){
    it('should return an object of screen properties', function(){
      expect().isObject(getScreenProfile());
    });
    it('should have a height and width > 0', function(){
      var _screen = getScreenProfile();
      expect().greaterThan(_screen.height, 0);
      expect().greaterThan(_screen.width, 0);
    });
  });

  describe('#getWindowProfile', function(){
    it('should return an object of window properties', function(){
      expect().isObject(getWindowProfile());
    });
    it('should have a height and width > 0', function(){
      var _window = getWindowProfile();
      expect().greaterThan(_window.height, 0);
      expect().greaterThan(_window.width, 0);
    });
  });

  describe('#getDomNodePath', function(){
    it('should return a string', function(){
      var el = document.body;
      var path = getDomNodePath(el);
      expect().isString(path);
    });
  });

  describe('#getDomNodeProfile', function(){
    it('should return an object of properties for a given DOM node', function(){
      var el = document.body;
      var obj = getDomNodeProfile(el);
      expect().isObject(obj);
      expect().equal(obj.node_name, 'BODY');
    });
  });

  describe('#getScrollState', function(){
    it('should return an object of properties for the window scroll state', function(){
      var obj = getScrollState();
      expect().isObject(obj);
      expect().isNumber(obj.pixel);
      expect().isNumber(obj.pixel_max);
      expect().isNumber(obj.ratio);
      expect().isNumber(obj.ratio_max);
    });

    it('should accept an object and return properties showing *_max diffs', function(){
      var obj = getScrollState({
        pixel: 800,
        pixel_max: getScrollableArea(),
        ratio: 0.50,
        ratio_max: 1
      });
      expect().isObject(obj);
      expect().equal(obj.pixel_max, getScrollableArea());
      expect().equal(obj.ratio_max, 1);
      function getScrollableArea() {
        var body = document.body, html = document.documentElement;
        return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ) || null;
      }
    });

  });

});
