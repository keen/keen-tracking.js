# DOM Listeners

`KeenTracking.utils.listener()` helps surface common DOM element events like "click", "scroll", and "submit". There is also a `KeenTracking.listenTo()` method for quickly setting a series of listeners (below)

**Important:** Form submits and clicks will be delayed by 500ms, unless the event is cancelled within a given listener's callback.

```javascript
import KeenTracking from 'keen-tracking';

// Listen to DOM events

// Create a new element listener (assigned)
const navLinks = KeenTracking.utils.listener('.nav li > a');

// Listen for a given event
navLinks.on('click', (e) => {
  // handle click
});

// Listen for event once
myClicker.once('click', (e) => {
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


const formListener = KeenTracking.utils.listener('form#signup');
formListener.on('submit', (e) => {
  return client.recordEvent('signup', {
    // record signup data
    somedata: 123
  });
});
```

### KeenTracking.listenTo()

This is a convenience function for quickly creating multiple listeners. These listeners are constructed with the `KeenTracking.utils.listener` utility, so the behavior will be identical to calling `KeenTracking.utils.listener(selector).on(eventType, callback);`.

```javascript
import KeenTracking from 'keen-tracking';

KeenTracking.listenTo({
  'click .nav li > a': (e) => {
    // record signup data
    return client.recordEvent('signup', {
      somedata: 1234
    });
  },
  'submit form#signup': (e) => {
    // Record a signup event
    return client.recordEvent('signup', {
      somedata: 1234
    });
  }
});
```

This technique does not return a reference to the listener, but can be deactivated by defining a listener with the same selector and calling the `.off(eventType)` event:

```JavaScript
import KeenTracking from 'keen-tracking';

KeenTracking.utils.listener('.nav li > a').off('click');
KeenTracking.utils.listener('form#signup').off('submit');
```


### Nested DOM elements

To capture events from anchor tags that contain nested elements, such as `<img>`, `<i>`, or `<strong>` nodes, use a wildcard selector (#72):

```html
<a class="my-btn" href="./index.html">
  <img class="nav-brand" src="assets/logo.png" title="Logo" />
</a>
```

```javascript
import KeenTracking from 'keen-tracking';

KeenTracking.utils.listener('a.my-btn, a.my-btn *').on('click', (e) => {
  return client.recordEvent('signup', {
    // record signup data
  });
});
```


### Window events

```javascript
import KeenTracking from 'keen-tracking';

const winListener = KeenTracking.utils.listener('window')
  .once('scroll', (e) => {
    // user is interacting with the page
  })
  .on('hashchange', (e) => {
    // user clicked an internal anchor (eg: /#some-heading)
  })
  .on('resize', (e) => {
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
