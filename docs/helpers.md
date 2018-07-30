# Helpers

These helpers are designed to generate useful properties and objects for event data models, and can be used when recording, deferring or extending events.

### Datetime index

`KeenTracking.utils.helpers.getDatetimeIndex()` returns a set of properties like "hour_of_day" or "day_of_month". This helper accepts an optional `Date` object as an argument, otherwise it will construct and return a datetime index object based on "now".

This helper works with a new `Date` object, and therefore the value returned is localized and not UTC. [Read more about this issue here](https://github.com/keen/keen-tracking.js/issues/49).

```javascript
import KeenTracking from 'keen-tracking';

const datetimeIndex = KeenTracking.helpers.getDatetimeIndex();
/*
// Monday, June 29th, 2015
{
  'hour_of_day': 14,
  'day_of_week': 2,
  'day_of_month': 29,
  'month': 6,
  'year': 2015
}
*/
```

#### UTC datetime index

Create and pass a UTC `Date` object into `KeenTracking.helpers.getDatetimeIndex()` to include a UTC datetime index with your event data model.

```javascript
import KeenTracking from 'keen-tracking';

const now = new Date();
const utc = new Date(
  now.getUTCFullYear(),
  now.getUTCMonth(),
  now.getUTCDate(),
  now.getUTCHours(),
  now.getUTCMinutes(),
  now.getUTCSeconds(),
  now.getUTCMilliseconds()
);
const utcDatetimeIndex = KeenTracking.helpers.getDatetimeIndex(utc);
/*
// Monday, June 29th, 2015
{
  'hour_of_day': 14,
  'day_of_week': 2,
  'day_of_month': 29,
  'month': 6,
  'year': 2015
}
*/
```


### Unique ID

`KeenTracking.helpers.getUniqueId()` returns a UUID. This is useful in conjunction with `KeenTracking.utils.cookie()` for identifying and tracking unauthenticated site visitors.

```javascript
import KeenTracking from 'keen-tracking';

const uniqueId = KeenTracking.helpers.getUniqueId();
// '150caf6b-ef9f-48cd-ae32-43e2f5bb0fe8'
```

### DOM node path

`KeenTracking.helpers.getDomNodePath(el)` returns the xPath for a given DOM element.

```javascript
import KeenTracking from 'keen-tracking';

const btn = document.getElementById('signup-button');
const domNodePath = KeenTracking.helpers.getDomNodePath(btn);
// 'body > div#nav > ul > li:eq(1) > a#signup-button'
```

### DOM node profile

`KeenTracking.helpers.getDomNodeProfile(el)` returns an object of properties profiling a given DOM node.

```javascript
import KeenTracking from 'keen-tracking';

const btn = document.getElementById('signup-button');
const domNodeProfile = KeenTracking.helpers.getDomNodeProfile(btn);
/*
{
  "class":"",
  "href":"http://localhost:9000/demo/auto-tracking.html#hash",
  "id":"signup-button",
  "name":"",
  "node_name":"A",
  "selector":"body > div#nav > ul > li:eq(3) > a#signup-button",
  "text":"Signup",
  "title":"",
  "type":"",
  "x_position":48,
  "y_position":70
}
*/
```

### Screen profile

`KeenTracking.helpers.getScreenProfile()` returns a set of properties describing the current device screen, like "height", "availHeight", and "orientation".

```javascript
import KeenTracking from 'keen-tracking';

const screenProfile = KeenTracking.helpers.getScreenProfile();
/*
{
  height: 900,
  width: 1440,
  colorDepth: 24,
  pixelDepth: 24,
  availHeight: 878,
  availWidth: 1436,
  orientation: {
    angle: 0,
    type: 'landscape'
  }
}
*/
```

### Window profile

`KeenTracking.helpers.getWindowProfile()` returns a set of properties describing the current window, like "height", "scrollHeight", and "ratio" to screen dimensions.

```javascript
import KeenTracking from 'keen-tracking';

const windowProfile = KeenTracking.helpers.getWindowProfile();
/*
{
  height: 436,
  width: 1209,
  scrollHeight: 13834,
  ratio: {
    height: 0.5,
    width: 0.84
	}
}
*/
```

### Browser profile

`KeenTracking.helpers.getBrowserProfile()` returns a set of properties describing the current browser, like "useragent", "online" status, and "language", plus [screen](#screen-profile) and [window](#window-profile) profiles.

```javascript
import KeenTracking from 'keen-tracking';

const browserProfile = KeenTracking.helpers.getBrowserProfile();
/*
{
  cookies: true,
  codeName: 'Mozilla',
  language: 'en-US',
  name: 'Netscape',
  online: true,
  platform: 'MacIntel',
  useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36',
  version: '5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36',

  // includes KeenTracking.helpers.getScreenProfile();
	screen: {
    height: 900,
    width: 1440,
    colorDepth: 24,
    pixelDepth: 24,
    availHeight: 878,
    availWidth: 1436,
    orientation: {
      angle: 0,
      type: 'landscape'
    }
  },

  // includes KeenTracking.helpers.getWindowProfile();
  window: {
	  height: 436,
    width: 1209,
    scrollHeight: 13834,
    ratio: {
      height: 0.5,
      width: 0.84
  	}
  }
}
*/
```

### Scroll State

`KeenTracking.helpers.getScrollState()` returns an object of properties profiling the current scroll state. This lets you measure how much of a page a user has viewed before taking a recorded action.

```javascript
import KeenTracking from 'keen-tracking';

const scrollState = KeenTracking.helpers.getScrollState();
/*
{
  pixel: 900,
  pixel_max: 900,
  ratio: 0.75,
  ratio_max: 0.75
}
*/
```

This object can then be passed into the helper again to receive a new object with updated `pixel_max` and `ratio_max` values. Use this in conjunction with a `window` scroll listener to include the latest scroll state when recording an event:

```javascript
let scrollState = helpers.getScrollState();
utils.listener('window').on('scroll', function() {
  scrollState = helpers.getScrollState(scrollState);
  console.log('Latest state', scrollState);
});
/*
{
  pixel: 900,
  pixel_max: 1200,
  ratio: 0.75,
  ratio_max: 1
}
*/

utils.listener('a, a *').on('click', function() {
  client.recordEvent('clicks', { scrollState });
});
```
