# Helpers

These helpers are designed to generate useful properties and objects for event data models, and can be used when recording, deferring or extending events.

### Datetime index

**Important:** This is now supported by the API as an add-on! Learn more here: https://keen.io/docs/api/#datetime-parser

`Keen.helpers.getDatetimeIndex()` returns a set of properties like "hour_of_day" or "day_of_month". This helper accepts an optional Date object as an argument, otherwise it will construct and return a datetime index object based on "now".

This helper works with a new `Date` object, and therefore the value returned is localized and not UTC. [Read more about this issue here](https://github.com/keen/keen-tracking.js/issues/49).

```javascript
var datetimeIndex = Keen.helpers.getDatetimeIndex();
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

`Keen.helpers.getUniqueId()` returns a UUID. This is useful in conjunction with `Keen.utils.cookie()` for identifying and tracking unauthenticated site visitors.

```javascript
var uniqueId = Keen.helpers.getUniqueId();
// '150caf6b-ef9f-48cd-ae32-43e2f5bb0fe8'
```

### DOM node path

`Keen.helpers.getDomNodePath(el)` returns the xPath for a given DOM element.

```javascript
var btn = document.getElementById('signup-button');
var domNodePath = Keen.helpers.getDomNodePath(btn);
// 'body > div#nav > ul > li:eq(1) > a#signup-button'
```

### Screen profile

`Keen.helpers.getScreenProfile()` returns a set of properties describing the current device screen, like "height", "availHeight", and "orientation".

```javascript
var screenProfile = Keen.helpers.getScreenProfile();
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

`Keen.helpers.getWindowProfile()` returns a set of properties describing the current window, like "height", "scrollHeight", and "ratio" to screen dimensions.

```javascript
var windowProfile = Keen.helpers.getWindowProfile();
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

`Keen.helpers.getBrowserProfile()` returns a set of properties describing the current browser, like "useragent", "online" status, and "language", plus [screen](#screen-profile) and [window](#window-profile) profiles.

```javascript
var browserProfile = Keen.helpers.getBrowserProfile();
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

  // includes Keen.helpers.getScreenProfile();
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

  // includes Keen.helpers.getWindowProfile();
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
