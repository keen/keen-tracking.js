# DOM Listeners

`Keen.utils.listener()` helps surface common DOM element events like "click", "scroll", and "submit". There is also a `Keen.listenTo()` method for quickly setting a series of listeners (below)

**Important:** Form submits and clicks will be delayed by 500ms, unless the event is cancelled within a given listener's callback.

```javascript
// Listen to DOM events

// Create a new element listener (assigned)
var navLinks = Keen.utils.listener('.nav li > a');

// Listen for a given event
navLinks.on('click', function(e){
  // You have 500ms to record an event!
});

// Listen for event once
myClicker.once('click', function(e){
  // First click!
});

// Cancel a given event listener
function clickHandler(e){
  // do something!
}
myClicker.on('click', clickHandler);
myClicker.off('click', clickHandler);

// Cancel all listeners for a given event
myClicker.off('click');
// .. or all events
myClicker.off();


var formListener = Keen.utils.listener('form#signup');
formListener.on('submit', function(e){
  client.recordEvent('signup', {
    // record signup data
  });
});
```

#### Keen.listenTo()

This is a convenience function for quickly creating multiple listeners. These listeners are constructed with the `Keen.utils.listener` utility, so the behavior will be identical to calling `Keen.utils.listener(selector).on(eventType, callback);`.

```javascript
Keen.listenTo({
  'click .nav li > a': function(e){
    // You have 500ms to record an event!
  },
  'submit form#signup': function(e){
    // Record a signup event
  }
});
```

This technique does not return a reference to the listener, but can be deactivated by defining a listener with the same selector and calling the `.off(eventType)` event:

```JavaScript
Keen.utils.listener('.nav li > a').off('click');
Keen.utils.listener('form#signup').off('submit');
```

#### Window events

```javascript
var winListener = Keen.utils.listener('window')
  .once('scroll', function(e){
    // user is interacting with the page
  })
  .on('hashchange', function(e){
    // user clicked an internal anchor (eg: /#some-heading)
  })
  .on('resize', function(e){
    // ...
  });
```

**Generally supported events:**

* click (see below for `<a>` clicks)
* submit (see below for `<form>` submits)
* keydown
* keypress
* keyup
* mousedown
* mousemove
* mouseout
* mouseover
* mouseup


**Important note about `<a>` and `<form>` elements:** `<a>` tag **clicks** (when navigating away from the current page) and `<form>` **submits** are deferred for 500ms to allow for quick, asynchronous API calls.

**`window` events:**

* blur
* focus
* hashchange
* resize
* scroll

**Not currently supported:**

* dblclick
* error
* onload
* unload
