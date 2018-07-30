# Cookies

`KeenTracking.utils.cookie(key)` finds or creates a cookie with a given key (string) value, and returns an object with several methods for managing the data contained in that cookie.

This utility uses [js-cookie](https://github.com/js-cookie/js-cookie).

```javascript
const sessionCookie = KeenTracking.utils.cookie('visitor-stats');

// Set a single value
sessionCookie.set('user_id', '222323843234');

// Set multiple values
sessionCookie.set({
  user_id: '222323843234',
  first_referrer: 'https://github.com/keen/keen-tracking.js'
})

// Get a single value, if it exists
sessionCookie.get('user_id');
// Returns '222323843234' or null

// Get all values
sessionCookie.get();
// Returns { user_id: '222323843234' }

sessionCookie.enabled();
// Returns true or false

// Expire the cookie
sessionCookie.expire();

// Set options on the cookie
sessionCookie.options({
  domain: '...',
  secure: true
});
```

**Important:** Some browsers do not allow cookies to be created or accessed from a local file (`file://dev/index.html`), which can make local development and testing problematic. `.set()` and `.get()` methods will only function correctly when cookies are enabled.

<a name="cookie-migration"></a>
Prior to the 1.0 release, this library used [Cookies.js](https://github.com/ScottHamper/Cookies), but incorrectly encoded the cookie data twice. Data stored in cookies by v0.1.1 or earlier can be accessed and resolved like so:

```javascript
const cookies = document.cookie.split(';');
const myCookie = KeenTracking.utils.cookie('your-cookie-name');
let badData;
let newData;

for (let i = 0; i < cookies.length; i++) {
  if (cookies[i].indexOf('your-cookie-name=') < 0) continue;
  badData = cookies[i].split('your-cookie-name=')[1];
  newData = JSON.parse(
    decodeURIComponent(
      decodeURIComponent(badData)
    )
  );
  myCookie.set(newData);
  break;
}
```
