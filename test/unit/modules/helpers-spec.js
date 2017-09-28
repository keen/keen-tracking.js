var assert = require('proclaim');

var getBrowserProfile = require('../../../lib/helpers/getBrowserProfile');
var getDatetimeIndex = require('../../../lib/helpers/getDatetimeIndex');
var getDomNodePath = require('../../../lib/helpers/getDomNodePath');
var getDomNodeProfile = require('../../../lib/helpers/getDomNodeProfile');
var getScreenProfile = require('../../../lib/helpers/getScreenProfile');
var getScrollState = require('../../../lib/helpers/getScrollState');
var getUniqueId = require('../../../lib/helpers/getUniqueId');
var getWindowProfile = require('../../../lib/helpers/getWindowProfile');

describe('Keen.helpers', function(){

  describe('#getUniqueId', function(){
    it('should return a random UUID', function(){
      assert.isString(getUniqueId());
    });
    it('should return a string of length 36', function(){
      assert.equal(getUniqueId().length, 36);
    });
    it('should return a string of the correct structure', function(){
      var splitStr = getUniqueId().split('-');
      assert.equal(splitStr.length, 5);
      assert.equal(splitStr[0].length, 8);
      assert.equal(splitStr[1].length, 4);
      assert.equal(splitStr[2].length, 4);
      assert.equal(splitStr[3].length, 4);
      assert.equal(splitStr[4].length, 12);
    });
  });

  describe('#getDatetimeIndex', function(){
    it('should return an object of datetime properties', function(){
      var datetime = getDatetimeIndex();
      assert.isObject(datetime);
      assert.isNumber(datetime.hour_of_day);
      assert.isNumber(datetime.day_of_week);
      assert.isNumber(datetime.day_of_month);
      assert.isNumber(datetime.month);
      assert.isNumber(datetime.year);
    });
    it('should return an object of datetime properties from a provided date', function(){
      var now = new Date();
      var datetime = getDatetimeIndex(now);
      assert.deepEqual(datetime, {
        'hour_of_day'  : now.getHours(),
        'day_of_week'  : parseInt( 1 + now.getDay() ),
        'day_of_month' : now.getDate(),
        'month'        : parseInt( 1 + now.getMonth() ),
        'year'         : now.getFullYear()
      });
    });
  });

  if ('undefined' === typeof navigator) return;

  describe('#getBrowserProfile', function(){
    it('should return an object of browser properties', function(){
      assert.isObject(getBrowserProfile());
    });
    it('should return a child object of screen properties', function(){
      assert.isObject(getBrowserProfile().screen);
    });
    it('should return a child object of window properties', function(){
      assert.isObject(getBrowserProfile().window);
    });
  });

  describe('#getScreenProfile', function(){
    it('should return an object of screen properties', function(){
      assert.isObject(getScreenProfile());
    });
    it('should have a height and width > 0', function(){
      var _screen = getScreenProfile();
      assert.greaterThan(_screen.height, 0);
      assert.greaterThan(_screen.width, 0);
    });
  });

  describe('#getWindowProfile', function(){
    it('should return an object of window properties', function(){
      assert.isObject(getWindowProfile());
    });
    it('should have a height and width > 0', function(){
      var _window = getWindowProfile();
      assert.greaterThan(_window.height, 0);
      assert.greaterThan(_window.width, 0);
    });
  });

  describe('#getDomNodePath', function(){
    it('should return a string', function(){
      var el = document.body;
      var path = getDomNodePath(el);
      assert.isString(path);
    });
  });

  describe('#getDomNodeProfile', function(){
    it('should return an object of properties for a given DOM node', function(){
      var el = document.body;
      var obj = getDomNodeProfile(el);
      assert.isObject(obj);
      assert.equal(obj.node_name, 'BODY');
    });
  });

  describe('#getScrollState', function(){
    it('should return an object of properties for the window scroll state', function(){
      var obj = getScrollState();
      assert.isObject(obj);
      assert.isNumber(obj.pixel);
      assert.isNumber(obj.pixel_max);
      assert.isNumber(obj.ratio);
      assert.isNumber(obj.ratio_max);
    });

    it('should accept an object and return properties showing *_max diffs', function(){
      var obj = getScrollState({
        pixel: 800,
        pixel_max: getScrollableArea(),
        ratio: 0.50,
        ratio_max: 1
      });
      assert.isObject(obj);
      assert.equal(obj.pixel_max, getScrollableArea());
      assert.equal(obj.ratio_max, 1);
      function getScrollableArea() {
        var body = document.body, html = document.documentElement;
        return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ) || null;
      }
    });

  });

});
