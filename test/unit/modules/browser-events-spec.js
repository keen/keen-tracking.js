var assert = require('proclaim');
var Keen = require('../../../lib/browser');

describe('Keen.listenTo', function() {

  beforeEach(function(){
    Keen.domEvents = {};
  });

  it('should be a function', function(){
    assert.isFunction(Keen.listenTo);
  });

  it('should create a Keen.domEvents object', function(){
    Keen.listenTo({});
    assert.isObject(Keen.domEvents);
  });

  it('should set window events', function(){
    var noop = function(e){ return false; };
    Keen.listenTo({
      'click window': noop,
      'keydown window': noop,
      'keypress window': noop,
      'keyup window': noop,
      'mousedown window': noop,
      'mousemove window': noop,
      'mouseout window': noop,
      'mouseover window': noop,
      'mouseup window': noop,
      'blur window': noop,
      'focus window': noop,
      'hashchange window': noop,
      'resize window': noop,
      'scroll window': noop
    });
    assert.deepEqual(Keen.domEvents, {
      'click window': noop,
      'keydown window': noop,
      'keypress window': noop,
      'keyup window': noop,
      'mousedown window': noop,
      'mousemove window': noop,
      'mouseout window': noop,
      'mouseover window': noop,
      'mouseup window': noop,
      'blur window': noop,
      'focus window': noop,
      'hashchange window': noop,
      'resize window': noop,
      'scroll window': noop
    });
  });

  it('should set `<a>` events', function(){
    var noop = function(e){ return false; };
    Keen.listenTo({
      'click a': noop,
      'mousedown a': noop,
      'mousemove a': noop,
      'mouseout a': noop,
      'mouseover a': noop,
      'mouseup a': noop
    });
    assert.deepEqual(Keen.domEvents, {
      'click a': noop,
      'mousedown a': noop,
      'mousemove a': noop,
      'mouseout a': noop,
      'mouseover a': noop,
      'mouseup a': noop
    });
  });

  it('should set `<form>` events', function(){
    var noop = function(e){ return false; };
    Keen.listenTo({
      'submit form': noop,
      'keydown form': noop,
      'keypress form': noop,
      'keyup form': noop,
      'mousedown form': noop,
      'mousemove form': noop,
      'mouseout form': noop,
      'mouseover form': noop,
      'mouseup form': noop
    });
    assert.deepEqual(Keen.domEvents, {
      'submit form': noop,
      'keydown form': noop,
      'keypress form': noop,
      'keyup form': noop,
      'mousedown form': noop,
      'mousemove form': noop,
      'mouseout form': noop,
      'mouseover form': noop,
      'mouseup form': noop
    });
  });


  it('should handle `<a>` click events', function(){
    var btn = document.getElementById('listen-to-anchor');
    Keen.listenTo({
      'click a#listen-to-anchor': function(e){
        Keen.log('click a#listen-to-anchor');
        assert.ok(true);
        return false;
      }
    });
    btn.click();
  });

  it('should handle `<form>` submit events', function(){
    // var form = document.getElementById('listen-to-form');
    var btn = document.getElementById('listen-to-form-btn');
    Keen.listenTo({
      'submit form#listen-to-form': function(e){
        Keen.log('submit form#listen-to-form');
        assert.ok(true);
        return false;
      }
    });
    btn.click();
    // form.submit();
  });

});
