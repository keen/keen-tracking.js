var assert = require('proclaim');
var Keen = require('../../../../lib/browser');
var each = require('../../../../lib/utils/each');
var listener = require('../../../../lib/utils/listener')(Keen);

describe('Keen.utils.listener', function() {

  beforeEach(function(){
    Keen.debug = true;
  });

  it('should be a function', function(){
    assert.isFunction(listener);
  });

  it('should create a Keen.domEvents object', function(){
    Keen.listenTo({});
    assert.isObject(Keen.domEvents);
  });

  it('should set window events', function(){
    var win = listener('window');
    var eventTypes = [
      'keydown',
      'keypress',
      'keyup',
      'mousedown',
      'mousemove',
      'mouseout',
      'mouseover',
      'mouseup',
      'blur',
      'focus',
      'hashchange',
      'resize',
      'scroll'
    ];
    each(eventTypes, function(type){
      win.on(type, function(e){ });
      assert.isObject(Keen.domListeners[type]);
      assert.isObject(Keen.domListeners[type]['window']);
    });
  });

  it('should set `<a>` events', function(){
    var a = listener('a');
    var eventTypes = [
      'mousedown',
      'mousemove',
      'mouseout',
      'mouseover',
      'mouseup'
    ];
    each(eventTypes, function(type){
      a.on(type, function(e){ });
      assert.isObject(Keen.domListeners[type]);
      assert.isObject(Keen.domListeners[type]['a']);
    });
  });

  it('should set `<form>` events', function(){
    var form = listener('form');
    var eventTypes = [
      'keydown',
      'keypress',
      'keyup',
      'mousedown',
      'mousemove',
      'mouseout',
      'mouseover',
      'mouseup'
      // 'submit'
    ];
    each(eventTypes, function(type){
      form.on(type, function(e){ });
      assert.isObject(Keen.domListeners[type]);
      assert.isObject(Keen.domListeners[type]['form']);
    });
  });


  it('should set and handle multiple `<a>` click events set with .on("click", fn)', function(done){
    var listenToThis = listener('body a#listen-to-anchor'),
        count = 0;

    listenToThis.on('click', callback);

    function callback(e){
      // Keen.log('click a#listen-to-anchor');
      count++;
      if (count === 3) {
        done();
        listenToThis.off('click', callback);
      }
      return false;
    }

    setTimeout(function(){
      var a = document.createElement("A");
      a.id = 'listen-to-anchor';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.click();
      a.click();
    }, 1000);
  });

  it('should remove specific handlers with .off("click", fn)', function(){
    var listenToThis = listener('body a#on-off');

    listenToThis.on('click', noop);
    listenToThis.on('click', noop);
    listenToThis.on('click', function(){
      // Not the same
    });
    assert.equal(Keen.domListeners['click']['body a#on-off'].length, 3);

    listenToThis.off('click', noop);
    assert.equal(Keen.domListeners['click']['body a#on-off'].length, 1);

    function noop(e){ }
  });

  it('should set and handle `<a>` click events set with .once("click", fn)', function(done){
    var listen = listener('a#listen-to-anchor-once');
    listen.once('click', function(e){
      // Keen.log('click a#listen-to-anchor-once');
      done();
      return false;
    });

    setTimeout(function(){
      var a = document.createElement('A');
      a.id = 'listen-to-anchor-once';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
    }, 1000);
  });

  // Not testable by IE8
  if(!document.addEventListener) return;

  it('should handle `<form>` submit events', function(done){
    var form, input, listen;

    listen = listener('form#listen-to-form');
    listen.on('submit', function(e){
      Keen.log('submit form#listen-to-form');
      done();
      return false;
    });

    setTimeout(function(){
      form = document.createElement('FORM');
      form.id = 'listen-to-form';
      form.style.display = 'none';

      input = window.input = document.createElement('INPUT');
      input.id = 'listen-to-form-btn';
      input.type = 'submit';

      form.appendChild(input);
      document.body.appendChild(form);

      input.click();
    }, 1000);

  });

});
