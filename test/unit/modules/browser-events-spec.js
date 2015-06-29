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
    var noop = function(e){ };
    Keen.listenTo({
      // 'click window': noop,
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
      // 'click window': noop,
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
    var noop = function(e){ };
    Keen.listenTo({
      // 'click a': noop,
      'mousedown a': noop,
      'mousemove a': noop,
      'mouseout a': noop,
      'mouseover a': noop,
      'mouseup a': noop
    });
    assert.deepEqual(Keen.domEvents, {
      // 'click a': noop,
      'mousedown a': noop,
      'mousemove a': noop,
      'mouseout a': noop,
      'mouseover a': noop,
      'mouseup a': noop
    });
  });

  it('should set `<form>` events', function(){
    var noop = function(e){ };
    Keen.listenTo({
      // 'submit form': noop,
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
      // 'submit form': noop,
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
    var a;
    Keen.listenTo({
      'click a#listen-to-anchor': function(e){
        // e.preventDefault();
        Keen.log('click a#listen-to-anchor');
        assert.ok(true);
        return false;
      }
    });

    setTimeout(function(){
      a = document.createElement("A");
      a.id = 'listen-to-anchor';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
    }, 1000);
  });

  // Not testable by IE8
  if(!document.addEventListener) return;

  it('should handle `<form>` submit events', function(){
    var form, input;
    Keen.listenTo({
      'submit form#listen-to-form': function(e){
        Keen.log('submit form#listen-to-form');
        assert.ok(true);
        return false;
      }
    });

    setTimeout(function(){
      form = document.createElement("FORM");
      form.id = 'listen-to-form';
      form.style.display = 'none';

      input = document.createElement("INPUT");
      input.id = 'listen-to-form-btn';
      input.type = 'submit';

      form.appendChild(input);
      document.body.appendChild(form);

      input.click();
    }, 1000);

  });

});
