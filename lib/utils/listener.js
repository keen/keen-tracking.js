import Emitter from 'component-emitter';
import each from 'keen-core/lib/utils/each';
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

export const listenerCore = function(ctx){

  // Make sure this object exists
  ctx.domListeners = ctx.domListeners || {
    /*
    'click': {
      '.nav li > a': [fn, fn, fn]
    }
    */
  };

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
    ctx.domListeners[str][self.selector] = ctx.domListeners[str][self.selector] || [];
    ctx.domListeners[str][self.selector].push(fn);
    return self;
  };

  listener.prototype.once = function(str, fn){
    var self = this;
    function on() {
      self.off(str, on);
      return fn.apply(self, arguments);
    }
    on.fn = fn;
    self.on(str, on);
    return self;
  };

  listener.prototype.off = function(str, fn){
    var self = this, survivors = [];
    if (arguments.length === 2) {
      each(ctx.domListeners[str][self.selector], function(handler, i){
        if (handler === fn || handler.fn === fn) return;
        survivors.push(handler);
      });
      ctx.domListeners[str][self.selector] = survivors;
    }
    else if (arguments.length === 1) {
      try {
        delete ctx.domListeners[str][self.selector];
      }
      catch(e){
        ctx.domListeners[str][self.selector] = [];
      }
    }
    else {
      // loop over every eventType and delete handlers
      each(ctx.domListeners, function(hash, eventType){
        // if ('undefined' === typeof hash[str]) return;
        try {
          delete ctx.domListeners[eventType][self.selector];
        }
        catch(e){
          ctx.domListeners[eventType][self.selector] = function(){};
        }
      });
    }
    return self;
  };

  function eventHandler(eventType){
    return function(e){
      var evt, target;

      evt = e || window.event;
      target = evt.target || evt.srcElement;

      // If nothing assigned to this event type, let it go
      if ('undefined' === ctx.domListeners[eventType]) return;

      each(ctx.domListeners[eventType], function(handlers, key){

        if (matches(target, key)) {
          // Call all handlers for this eventType + node
          each(handlers, function(fn, i){
            if ('click' === eventType && 'A' === target.nodeName) {
              deferClickEvent(evt, target, fn);
            }
            else if ('submit' === eventType && 'FORM' === target.nodeName) {
              deferFormSubmit(evt, target, fn);
            }
            else {
              fn(evt);
            }
          });
        }
        else if ('window' === key) {
          // Call all handlers
          each(handlers, function(fn, i){
            fn(evt);
          });
        }
        return;
      });
    };
  }

  return listener;
}


// ------------------------------
// Attach global event listener
// ------------------------------

function addListener(eventType, fn){
  if (document.addEventListener) {
    document.addEventListener(eventType, fn, false);
  } else {
    document.attachEvent("on" + eventType, fn);
  }
}


// ------------------------------
// Match DOM element to selector
// ------------------------------

function matches(elem, selector) {
  // We'll use querySelectorAll to find all element matching the selector,
  // then check if the given element is included in that list.
  // Executing the query on the parentNode reduces the resulting nodeList,
  // document doesn't have a parentNode, though.
  var nodeList = ( elem.parentNode || document ).querySelectorAll( selector ) || [],
      i = nodeList.length;

  // loop on the nodeList
  while ( i-- ) {
    if ( nodeList[i] == elem ) { return true; }
  }
  return false;
}


// ------------------------------
// Handle 'click' events (A)
// ------------------------------

function deferClickEvent(evt, anchor, callback){
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
  if (('boolean' === typeof cbResponse && cbResponse === false) || evt.defaultPrevented || evt.returnValue === false) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    evt.returnValue = false;
    return false;
  }
  // Else if anchor doesn't kick off a new window or tab.. defer and replay the event:
  else if (targetAttr !== '_blank' && targetAttr !== 'blank' && !evt.metaKey && !anchor.hasAttribute('download')) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    evt.returnValue = false;
    if (
      anchor.href
      && anchor.href !== '#'
      && anchor.href !== (window.location + '#')
    ) {
      if (typeof cbResponse !== 'undefined') {
        if (navigator && navigator.sendBeacon) {
          window.location = anchor.href;
          return;
        }
        // promise
        cbResponse.then(() => {
          window.location = anchor.href;
        }).catch(err => {
          // change location anyway - to not let user hanging
          window.location = anchor.href;
        });
      } else {
        setTimeout(function(){
          window.location = anchor.href;
        }, timeout);
      }
    }
  }

  return false;
}


// ------------------------------
// Handle 'submit' events (FORM)
// ------------------------------

function deferFormSubmit(evt, form, callback){
  var timeout = 500;
  // Fire listener and catch possible response (return false)
  var cbResponse = callback(evt);

  // If prevented within callback, bail
  if (('boolean' === typeof cbResponse && cbResponse === false) || evt.defaultPrevented || evt.returnValue === false) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    evt.returnValue = false;
    return false;
  }
  // Defer and replay event
  else {
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    evt.returnValue = false;
    if (typeof cbResponse !== 'undefined') {
      if (navigator && navigator.sendBeacon) {
        form.submit();
        return;
      }
      // promise
      cbResponse.then(() => {
        form.submit();
      }).catch(err => {
        // submit form anyway - to not let user hanging
        form.submit();
      });
    } else {
      setTimeout(function(){
        form.submit();
      }, timeout);
    }
  }

  return false;
}
