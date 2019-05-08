# keen-tracking.js

A JavaScript tracking library for [Keen](https://keen.io).
Track events, user actions, clicks, pageviews, conversions and more!

<a href="https://keen.io/"><img src="https://img.shields.io/github/release/keen/keen-tracking.js.svg?style=flat-square&maxAge=600" alt=""></a>
<a href="https://github.com/keen/keen-tracking.js/graphs/contributors" alt="Contributors"><img src="https://img.shields.io/github/contributors/keen/keen-tracking.js.svg" /></a>
<a href="https://github.com/keen/keen-tracking.js/pulse" alt="Activity"><img src="https://img.shields.io/github/last-commit/keen/keen-tracking.js.svg" /></a>
![](https://img.shields.io/github/license/keen/keen-tracking.js.svg)
<a href="http://slack.keen.io/"><img src="https://img.shields.io/badge/slack-keen-orange.svg?style=flat-square&maxAge=3600" alt="Slack"></a>
<a href="https://www.jsdelivr.com/package/npm/keen-tracking"><img src="https://data.jsdelivr.com/v1/package/npm/keen-tracking/badge" alt=""></a>
<a href="https://www.npmjs.com/package/keen-tracking"><img src="https://img.shields.io/npm/dm/keen-tracking.svg" alt=""></a>

### Installation

Install this package from NPM *Recommended*

```ssh
npm install keen-tracking --save
```

Public CDN

```html
<script crossorigin src="https://cdn.jsdelivr.net/npm/keen-tracking@4"></script>
```

### Project ID & API Keys

[Login to Keen IO to create a project](https://keen.io/login?s=gh_js) and grab the **Project ID** and **Write Key** from your project's **Access** page.

## Getting started

The following examples demonstrate how to implement rock-solid web analytics, capturing **pageviews**, **clicks**, and **form submissions** with robust data models.

[Full documentation is available here](./docs/README.md)

**Using React? Check out these setup guides:**

* [React Flux Logger](./docs/examples/react-flux): How to instrument a Flux ReduceStore
* [React Redux Middleware](./docs/examples/react-redux-middleware): How to instrument a Redux Store

**Upgrading from an earlier version of keen-js?** [Read this](./docs/upgrade-guide.md).

---

### Record an Event

```javascript
import KeenTracking from 'keen-tracking';

const client = new KeenTracking({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY'
});

client
  .recordEvent('purchases', {
    item: 'Avocado',
    number_of_items: 10,
    user: {
      name: 'John Smith'
    }
  })
  .then((response) => {
    // handle successful responses
  })
  .catch(error => {
    // handle errors
  });
```

---

### Automated Event Tracking

Automatically record `pageviews`, `clicks`, `form_submissions` and `element_views` events with robust data models:

```html
<script>
  (function(name,path,ctx){ctx[name]=ctx[name]||{ready:function(fn){var h=document.getElementsByTagName('head')[0],s=document.createElement('script'),w=window,loaded;s.onload=s.onerror=s.onreadystatechange=function(){if((s.readyState&&!(/^c|loade/.test(s.readyState)))||loaded){return}s.onload=s.onreadystatechange=null;loaded=1;ctx[name].ready(fn)};s.async=1;s.src=path;h.parentNode.insertBefore(s,h)}}})
  ('KeenTracking', 'https://cdn.jsdelivr.net/npm/keen-tracking@4/dist/keen-tracking.min.js', this);

  KeenTracking.ready(function(){
    const client = new KeenTracking({
      projectId: 'YOUR_PROJECT_ID',
      writeKey: 'YOUR_WRITE_KEY'
    });
    client.initAutoTracking();
  });
</script>
```

[Learn how to configure and customize this functionality here](./docs/auto-tracking.md)

---

### Pageview Tracking

First, let's create a new `client` instance with your Project ID and Write Key, and use the `.extendEvents()` method to define a solid baseline data model that will be applied to every single event that is recorded. Consistent data models and property names make life much easier later on, when analyzing and managing several event streams. This setup also includes our [data enrichment add-ons](https://keen.io/docs/streams/data-enrichment-overview/), which will populate additional information when an event is received on our end.

```javascript
import KeenTracking from 'keen-tracking';

const client = new KeenTracking({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY'
});
const helpers = KeenTracking.helpers;
const utils = KeenTracking.utils;

const sessionCookie = utils.cookie('rename-this-example-cookie');
if (!sessionCookie.get('guest_id')) {
  sessionCookie.set('guest_id', helpers.getUniqueId());
}

// optional
client.extendEvents(() => {
  return {
    geo: {
      ip_address: '${keen.ip}',
      info: {
        /* Enriched data from the API will be saved here */
        /* https://keen.io/docs/api/?javascript#ip-to-geo-parser */
      }
    },
    page: {
      title: document.title,
      url: document.location.href,
      info: { /* Enriched */ }
    },
    referrer: {
      url: document.referrer,
      info: { /* Enriched */ }
    },
    tech: {
      browser: helpers.getBrowserProfile(),
      user_agent: '${keen.user_agent}',
      info: { /* Enriched */ }
    },
    time: helpers.getDatetimeIndex(),
    visitor: {
      guest_id: sessionCookie.get('guest_id')
      /* Include additional visitor info here */
    },
    keen: {
      addons: [
        {
          name: 'keen:ip_to_geo',
          input: {
            ip: 'geo.ip_address'
          },
          output : 'geo.info'
        },
        {
          name: 'keen:ua_parser',
          input: {
            ua_string: 'tech.user_agent'
          },
          output: 'tech.info'
        },
        {
          name: 'keen:url_parser',
          input: {
            url: 'page.url'
          },
          output: 'page.info'
        },
        {
          name: 'keen:referrer_parser',
          input: {
            referrer_url: 'referrer.url',
            page_url: 'page.url'
          },
          output: 'referrer.info'
        }
      ]
    }
  }
});

// record the event
client
  .recordEvent('pageviews', {
    // here you can add even more data
    // some_key: some_value
  })
  .then((response) => {
    // handle responses
  }).catch(error => {
    // handle errors
  });
```

Every event that is recorded will inherit this baseline data model. Additional properties defined in `client.recordEvent()` will be applied before the event is finally recorded.

**What else can this SDK do?**

* [Automated tracking (browser-only)](./docs/auto-tracking.md)
* [Record multiple events in batches](./docs/record-events.md)
* [Extend event data models for a single event stream](./docs/extend-events.md)
* [Queue events to be recorded at a given time interval](./docs/defer-events.md)

**App Frameworks:**

* [React Flux Logger](./docs/examples/react-flux): How to instrument a Flux ReduceStore
* [React Redux Middleware](./docs/examples/react-redux-middleware): How to instrument a Redux Store
* [Vue.js Vuex Store](./docs/examples/vue-vuex): How to instrument a Vue Vuex Store

**Video Players:**

* [Facebook video player](./docs/examples/video/facebook-video)
* [HTML5 video player](./docs/examples/video/html5)
* [Video.js player](./docs/examples/video/video-js)
* [Vimeo video player](./docs/examples/video/vimeo)
* [Youtube iFrame video player](./docs/examples/video/youtube)

[Full documentation is available here](./docs/README.md)

---

### Click and Form Submit Tracking

Clicks and form submissions can be captured with `.listenTo()`.
This example further extends the `client` instance defined previously, and activates a simple timer when the page the loaded. Once a `click` or `submit` event is captured, the timer's value will be recorded as `visitor.time_on_page`.

```javascript
import KeenTracking from 'keen-tracking';

const client = new KeenTracking({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY'
});
const helpers = KeenTracking.helpers;
const timer = KeenTracking.utils.timer();
timer.start();

KeenTracking.listenTo({
  'click .nav a': (e) => {
    return client.recordEvent('click', {
      action: {
        intent: 'navigate',
        target_path: helpers.getDomNodePath(e.target)
      },
      visitor: {
        time_on_page: timer.value()
      }
    });
  },
  'submit form#signup': (e) => {
    return client.recordEvent('form-submit', {
      action: {
        intent: 'signup',
        target_path: helpers.getDomNodePath(e.target)
      },
      visitor: {
        email_address: document.getElementById('signup-email').value,
        time_on_page: timer.value()
      }
    });
  }
});
```

Click events (`clicks`) will record specific attributes from the clicked element or its ancestor elements and pass them via the `element` property in the event object data:
```javascript
// event object
{
    // ...

    // specific to the clicks event type
    "element": {
      "action" : undefined,                 // [DIRECT]
      "class": "cta",                       // [DIRECT]
      "href": "https://keen.io/",     // [INHERITED]
      "id": "main-cta",                     // [INHERITED]
      "event_key": "learn-more-cta",        // [INHERITED] from the `data-event-key` attribute
      "method": "learn-more-link",          // [DIRECT]
      "node_name": "A",                     // [DIRECT]
      "selector": "body > div:eq(0) > div:eq(1) > div:eq(0) > a", // [DIRECT]
      "text": "Learn More",                 // [INHERITED]
      "title": "Learn More",                // [INHERITED]
      "type": undefined,                    // [DIRECT]
      "x_position": 191,                    // [DIRECT]
      "y_position": 970                     // [DIRECT]
  }
}
```

In the above list of collected properties for a click event, some properties are gathered from the nearest ancestor elements if they can't be found on the immediate source element of the event.  These properties are shown with `[INHERITED]` above.

For example, a click on the word `clicked!` below:
```html
  <a href='foo.html' data-event-key='click-me-cta'>
    <span id='contrived-example'>I want to be <strong class='enhance'>clicked!</strong></span>
  </a>
```

Would generate an event including a mixture of immediate attributes and attributes found by traversing up the DOM tree:
```js
{
  // ...
  "id" : "contrived-example",
  "class" : "enhance",
  "text" : "clicked!",
  "href" : "foo.html",
  "node_name" : "STRONG",
  "event_key" : "click-me-cta",
}
```
**Note:** The `event_key` value (`data-event-key` attribute) is a more explicit keen-specific identifier that gives you an option outside of `href`, `id`, and `class` values to group or identify and query clicks in a meaningful way without potential ID/class collisions or dual-use naming schemes.

Want to get up and running faster? This can also be achieved in the browser with [automated event tracking](./docs/auto-tracking.md).

---

### Track views of the HTML elements

Use [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to track elements that have been seen by a user. In an example the CSS selector of the HTML elements is defined as `.track-element-view`. Use `threshold` to control the sensitivity of the Observer.
Note: This feature works only on the [browsers that support Intersection Observer](https://caniuse.com/#search=IntersectionObserver).

```javascript
import KeenTracking from 'keen-tracking';

const client = new KeenTracking({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY'
});
const helpers = KeenTracking.helpers;

if(typeof IntersectionObserver !== 'undefined'){
  const elementViewsOptions = {
    threshold: 1.0,
  }
  const elementViewsCallback = (events, observer) => {
    events.forEach(el => {
      if(el.isIntersecting){
        return client
          .recordEvent({
            event_collection: 'element_views',
            event: {
              element: helpers.getDomNodeProfile(el.target)
           }
          });
      }
    });
  }
  const observer = new IntersectionObserver(elementViewsCallback, elementViewsOptions);
  const target = document.querySelectorAll('.track-element-view');
  target.forEach(el => {
    observer.observe(el);
  });
}
```
---

### Block Bots and Improve Device Recognition

Install [mobile-detect.js](https://github.com/hgoebl/mobile-detect.js) to identify basic device types and block noisy bots and crawlers.

```ssh
npm install mobile-detect --save
```

This example further extends the `client` instance defined above, inserting a new `tech.device_type` property with three possible values: `'desktop'`, `'mobile'`, and `'tablet'`. If the user agent is determined to be a bot, it may be ideal to abort and avoid recording an event.

```javascript
import MobileDetect from 'mobile-detect';

const md = new MobileDetect(window.navigator.userAgent);
if (md.is('bot')) {
  return false;
}

// extends client instance defined previously
client.extendEvents(() => {
  return {
    tech: {
      device_type: md.tablet() ? 'tablet' : md.mobile() ? 'mobile' : 'desktop'
    }
  };
});
```

Check out the many additional methods supported by [mobile-detect.js](https://github.com/hgoebl/mobile-detect.js) to further enrich your data model.

This can also be used with [automated event tracking](./docs/auto-tracking.md).

---

### Server-side Event Tracking

```javascript
const KeenTracking = require('keen-tracking');

const client = new KeenTracking({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY'
});

// promise
client
  .recordEvent('purchases', {
    item: 'Avocado',
    number_of_items: 10,
    user: {
      name: 'John Promise'
    }
  })
  .then((response) => {
    // handle successful responses
  })
  .catch(error => {
    // handle errors
  });

// or callback
client
  .recordEvent('purchases', {
    item: 'Avocado',
    number_of_items: 10,
    user: {
      name: 'John Callback'
    }
  }, (error, response) => {
    if (error) {
      // handle errors
      return;
    }
    // handle responses
  });
```

---

### Handling connection problems

When KeenTracking encounters connection problems, it will retry to send the data.

```javascript
import KeenTracking from 'keen-tracking';

const client = new KeenTracking({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY',

  // customize the default values
  retry: {
    limit: 10, // how many times retry to record an event
    initialDelay: 200, // initial delay between consecutive calls.
    // Each next retry will be delayed by (2^retries_count * 100) milliseconds,
    retryOnResponseStatuses: [ // array of invalid http response statuses
      408,
      500,
      502,
      503,
      504
    ]
  }
});
```

---

### Unique events

Save the event only once.

```javascript
client
  .recordEvent({
    event_collection: 'unique_clicks',
    event: {
      some_key: 'some_value',
      // ...
    },
    unique: true, // check if the event is unique, before sending to API
    cache: {
      storage: 'indexeddb', // for persistence. Remove this property to use RAM
      hashingMethod: 'md5', // remove this property to store as a stringified json
      maxAge: 1000 * 60, // store the information about unique value for 60 seconds
    }
  })
  .then((response) => {
    console.log('ok', response);
  })
  .catch(someError => {
    console.log('error', someError);
  });
```

---

### Request types

By default, we make requests using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

For UI interactions, consider using the
[BeaconAPI](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API).
It's the fastest non-invasive way to track user behaviour.
Due to its nature, BeaconAPI runs requests in the background, with no possibility
to handle errors. If you want to handle errors, you need to use the Fetch API.

```javascript
// specify request types for all requests
const client = new KeenTracking({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY',
  requestType: 'fetch' // fetch, beaconAPI, img
});

// you can use different requestType for a single request
client
  .recordEvent({
    event_collection: 'clicks',
    event: {
      some_key: 'some_value',
      // ...
    },
    requestType: 'beaconAPI'
  });
```

---

### Custom Host

You can set a custom domain for requests

```
const client = new KeenTracking({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY',
  host: 'somehost.com'
});
```

---

### Recorded Event ID

A successful response from our API does not contain the ID of the newly created event. We are using Cassandra Database (NoSQL), so there are no joins. Store all necessary data in each event you record.
Denormalization and duplication of data is a fact of life with Cassandra.
Read more:
- [Cassandra Modeling Guide](https://www.datastax.com/dev/blog/basic-rules-of-cassandra-data-modeling)
- [How not to use Cassandra](https://opencredo.com/how-not-to-use-cassandra-like-an-rdbms-and-what-will-happen-if-you-do/)
---

### Tracking Opt-Out

It's easy to build tracking opt-out functionality. If opt-out is set to true no data is recorded.

You can set up opt-out by defining client instance

```javascript
const client = new KeenTracking({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY',
  optOut: true
});
```

or by invoking `client.setOptOut(true)` method

```javascript
client.setOptOut(true);
```

**Note:** The user can block tracking in the browser by [doNotTrack](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/doNotTrack) setting. We can respect or overwrite this setting by defining client instance
```javascript
const client = new KeenTracking({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY',
  respectDoNotTrack: true // it's false by default
});
```

---

### Contributing

This is an open source project and we love involvement from the community! Hit us up with pull requests and issues.

[Learn more about contributing to this project](./CONTRIBUTING.md).

---

### Support

Need a hand with something? Shoot us an email at [team@keen.io](mailto:team@keen.io). We're always happy to help, or just hear what you're building! Here are a few other resources worth checking out:

* [Feature requests](https://keen.canny.io/)
* [API status](http://status.keen.io/)
* [API reference](https://keen.io/docs/api)
* [How-to guides](https://keen.io/guides)
* [Data modeling guide](https://keen.io/guides/data-modeling-guide/)
* [Slack (public)](http://slack.keen.io/)
