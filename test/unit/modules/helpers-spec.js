var assert = require('proclaim');

var getBrowserProfile = require('../../../lib/helpers/getBrowserProfile');
// var getDomEventProfile = require('../../../lib/helpers/getDomEventProfile');
var getDomNodePath = require('../../../lib/helpers/getDomNodePath');
var getScreenProfile = require('../../../lib/helpers/getScreenProfile');
// var getUniqueId = require('../../../lib/helpers/getUniqueId');
var getWindowProfile = require('../../../lib/helpers/getWindowProfile');

describe('Keen.helpers', function(){

  // BUILD ME!
  // describe('#getDomEventProfile', function(){
  //   it('should return a curated object of event properties', function(){
  //   });
  // });

  // BUILD ME!
  // describe('#getUniqueId', function(){
  //   it('should return a random GUID', function(){
  //   });
  // });

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

});
