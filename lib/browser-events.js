var Sizzle = require('sizzle');
var each = require('./utils/each');

module.exports = listenTo;

function listenTo(ctx){
  return function(listenerHash){
    ctx.domEvents = ctx.domEvents || {};
    each(listenerHash, function(callback, key){
      // Set each listener on a parent dictionary
      ctx.domEvents[key] = callback;
      // Create a global listener
      setListener(key.split(' ')[0], key.split(' ').splice(1).join(' '), callback);
    });
  };
}


// ------------------------------
// Bind event listeners
// ------------------------------

function setListener(action, selector, callback){
  window.addEventListener(action, handleEvent, false);

  function handleEvent(e){
    var evt, target, match, timeout;

    evt = e ? e : window.event;
    // target = (evt.currentTarget) ? evt.currentTarget : (evt.srcElement || evt.target);
    timeout = 2000;

    match = Sizzle.matches(selector, [evt.target]);
    // https://github.com/jquery/sizzle/wiki

    if (match.length) {

      if ('click' === action && 'A' === evt.target.nodeName) {
        return handleClickEvent(evt, evt.target, callback);
      }
      else if ('submit' === action && 'FORM' === evt.target.nodeName) {
        return handleFormSubmit(evt, evt.target, callback);
      }
      else {
        callback(evt);
      }

    }
    else if ('window' === selector) {
      callback(evt);
      return;
    }
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
    return false;
  }
  // Else if anchor doesn't kick off a new window or tab.. defer and replay the event:
  else if (targetAttr !== '_blank' && targetAttr !== 'blank' && !evt.metaKey) {
    evt.preventDefault();
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
    return false;
  }
  // Defer and replay event
  else {
    evt.preventDefault();
    setTimeout(function(){
      form.submit();
    }, timeout);
  }

  return false;
}
