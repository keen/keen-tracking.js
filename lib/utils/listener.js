var Emitter = require('component-emitter');
var Sizzle = require('sizzle');

var each = require('./each');

/*

  // Create a new element listner
  var myClickerCatcher = Keen.utils.listener(".nav li > a");

  // Listen for a given event
  myClicker.on("click", function(e){
    // do stuff!
  });

  // Listen for event once
  myClicker.once("click", function(e){ });

  // Cancel a given event listener
  myClicker.off("click");

  // Cancel all event listners
  myClicker.off();

*/

module.exports = function(ctx){

  // Make sure this object exists
  ctx.domListeners = ctx.domListeners || {
    // 'click': {
    //   '.nav li > a': function(e){ }
    // }
  };

  function eventHandler(action){
    return function(e){
      var evt = e ? e : window.event,
          target, callback;

      // If nothing assigned to this event type, let it go
      if ('undefined' === ctx.domListeners[action]) return;

      each(ctx.domListeners[action], function(fn, key){
        if (Sizzle.matches(key, [evt.target]).length) {
          if ('click' === action && 'A' === evt.target.nodeName) {
            return handleClickEvent(evt, evt.target, fn);
          }
          else if ('submit' === action && 'FORM' === evt.target.nodeName) {
            return handleFormSubmit(evt, evt.target, fn);
          }
          else {
            fn(evt);
          }
        }
        else if ('window' === key) {
          fn(evt);
        }
        return;
      });
    };
  }

  function listener(str){
    if (!str) return;
    if (this instanceof listener === false) {
      return new listener(str);
    }
    this.selector = str;
    return this;
  }

  listener.prototype.on = function(str, fn){
    var self = this;

    if (arguments.length !== 2 || 'string' !== typeof str || 'function' !== typeof fn) return this;

    // Set each listener on a parent dictionary, indexed by event:
    if ('undefined' === typeof ctx.domListeners[str]) {
      addListener(str, eventHandler(str));
      ctx.domListeners[str] = {};
    }

    ctx.domListeners[str][self.selector] = function(e){
      fn.call(self, e);
    };
    return self;
  };

  listener.prototype.once = function(str, fn){
    var self = this;
    self.on(str, function(e){
      fn.call(self, e);
      self.off(str);
    });
    return self;
  };

  listener.prototype.off = function(str){
    var self = this;
    if (arguments.length) {
      try {
        delete ctx.domListeners[str][self.selector];
      }
      catch(e){
        ctx.domListeners[str][self.selector] = function(){};
      }
    }
    else {
      // loop over every action and delete handlers
      each(ctx.domListeners, function(hash, action){
        // if ('undefined' === typeof hash[str]) return;
        try {
          delete ctx.domListeners[action][self.selector];
        }
        catch(e){
          ctx.domListeners[action][self.selector] = function(){};
        }
      });
    }
    return self;
  };

  return listener;
}


// ------------------------------
// Attach global event listener
// ------------------------------

function addListener(action, fn){
  if (window.addEventListener) {
    window.addEventListener(action, fn, false);
  } else {
    window.attachEvent("on" + action, fn);
  }
}


// ------------------------------
// Handle 'click' events (A)
// ------------------------------

function handleClickEvent(evt, anchor, callback){
  var timeout = 500,
      targetAttr,
      cbResponse;

  // Get 'target' attribute from anchor
  if (anchor.getAttribute !== void 0) {
    targetAttr = anchor.getAttribute("target");
  } else if (anchor.target) {
    targetAttr = anchor.target;
  }

  // Fire listener and catch possible response (return false)
  cbResponse = callback(evt);

  // If prevented within callback, bail:
  if (cbResponse === false || evt.defaultPrevented || evt.returnValue === false) {
    evt.preventDefault();
    evt.returnValue = false;
    return false;
  }
  // Else if anchor doesn't kick off a new window or tab.. defer and replay the event:
  else if (targetAttr !== '_blank' && targetAttr !== 'blank' && !evt.metaKey) {
    evt.preventDefault();
    evt.returnValue = false;
    setTimeout(function(){
      window.location = anchor.href;
    }, timeout);
  }

  return false;
}


// ------------------------------
// Handle 'submit' events (FORM)
// ------------------------------

function handleFormSubmit(evt, form, callback){
  var timeout = 500;

  // Fire listener and catch possible response (return false)
  cbResponse = callback(evt);

  // If prevented within callback, bail
  if (cbResponse === false || evt.defaultPrevented || evt.returnValue === false) {
    evt.preventDefault();
    evt.returnValue = false;
    return false;
  }
  // Defer and replay event
  else {
    evt.preventDefault();
    evt.returnValue = false;
    setTimeout(function(){
      form.submit();
    }, timeout);
  }

  return false;
}
