# keen-tracking.js [![Build Status](https://travis-ci.org/keen/keen-tracking.js.svg?branch=master)](https://travis-ci.org/keen/keen-tracking.js)

### Installation

Install this package from npm:

```ssh
$ npm install keen-tracking --save
```

Or load it from our CDN:

```html
<script src="https://d26b395fwzu5fz.cloudfront.net/keen-tracking-1.4.2.min.js"></script>
```

[Read about more installation options here](./docs/installation.md)

### Project ID & API Keys

[Login to Keen IO to create a project](https://keen.io/login?s=gh_js) and grab the **Project ID** and **Write Key** from your project's **Access** page.

## Getting started

The following examples demonstrate how to implement rock-solid web analytics, capturing **pageviews**, **clicks**, and **form submissions** with robust data models.

Not interested in web analytics? Use these examples as a primer for getting up and running quickly. These examples also make use of several [helpers](./docs/#helpers) and [utilities](./docs/#utilities) that were designed to address common requirements and help produce insightful, valuable data models.

[Full documentation is available here](./docs/README.md)

If any of this is confusing, that's our fault and we would love to help. Join our  [Slack community](https://slack.keen.io) or send us a [message](https://keen.io/support/).

**Using React? Check out these setup guides:**

* [React Flux Logger](./docs/examples/react-flux): How to instrument a Flux ReduceStore
* [React Redux Middleware](./docs/examples/react-redux-middleware): How to instrument a Redux Store

**Looking for compute capabilities?** Check out [keen-analysis.js](https://github.com/keen/keen-analysis.js).

**Upgrading from an earlier version of keen-js?** [Read this](./docs/upgrade-guide.md).

---

### Automated Event Tracking (Browser-only)

Automatically record `pageviews`, `clicks`, and `form_submissions` events with robust data models:

```html
<script src="https://d26b395fwzu5fz.cloudfront.net/keen-tracking-1.4.2.min.js"></script>
<script>
Keen.ready(function(){
  var client = new Keen({
    projectId: 'YOUR_PROJECT_ID',
    writeKey: 'YOUR_WRITE_KEY'
  });
  client.initAutoTracking();
});
</script>
```

[Learn how to configure and customize this functionality here](./docs/auto-tracking.md)

---

### Pageview Tracking (Browser/Front-end)

First, let's create a new `client` instance with your Project ID and Write Key, and use the `.extendEvents()` method to define a solid baseline data model that will be applied to every single event that is recorded. Consistent data models and property names make life much easier later on, when analyzing and managing several event streams. This setup also includes our [data enrichment add-ons](https://keen.io/docs/streams/data-enrichment-overview/), which will populate additional information when an event is received on our end.

```javascript
import Keen from 'keen-tracking';

const client = new Keen({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY'
});
const helpers = Keen.helpers;
const utils = Keen.utils;

const sessionCookie = utils.cookie('rename-this-example-cookie');
if (!sessionCookie.get('guest_id')) {
  sessionCookie.set('guest_id', helpers.getUniqueId());
}

client.extendEvents(() => {
  return {
    geo: {
      info: { /* Enriched */ },
      ip_address: '${keen.ip}',
    },
    page: {
      info: { /* Enriched */ },
      title: document.title,
      url: document.location.href
    },
    referrer: {
      info: { /* Enriched */ },
      url: document.referrer
    },
    tech: {
      browser: helpers.getBrowserProfile(),
      info: { /* Enriched */ },
      user_agent: '${keen.user_agent}'
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

client.recordEvent('pageviews', {});
```

Every event that is recorded will inherit this baseline data model. Additional properties defined in `client.recordEvent()` will be applied before the event is finally recorded.

Want to get up and running faster? This can also be achieved in the browser with [automated event tracking](./docs/auto-tracking.md).

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

### Click and Form Submit Tracking (Browser/Front-end)

Clicks and form submissions can be captured with `.listenTo()`. This function intercepts events for designated elements and creates a brief 500ms delay, allowing an HTTP request to execute before the page begins to unload.

This example further extends the `client` instance defined previously, and activates a simple timer when the page the loaded. Once a `click` or `submit` event is captured, the timer's value will be recorded as `visitor.time_on_page`.

```javascript
import Keen from 'keen-tracking';

const client = new Keen({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY'
});
const helpers = Keen.helpers;
const timer = Keen.utils.timer();
timer.start();

Keen.listenTo({
  'click .nav a': function(e){
    client.recordEvent('click', {
      action: {
        intent: 'navigate',
        target_path: helpers.getDomNodePath(e.target)
      },
      visitor: {
        time_on_page: timer.value()
      }
    });
  },
  'submit form#signup': function(e){
    client.recordEvent('form-submit', {
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

Want to get up and running faster? This can also be achieved in the browser with [automated event tracking](./docs/auto-tracking.md).

---

### Block Bots and Improve Device Recognition (Browser/Front-end)

Install [mobile-detect.js](https://github.com/hgoebl/mobile-detect.js) to identify basic device types and block noisy bots and crawlers.

```ssh
$ npm install mobile-detect --save
```

This example further extends the `client` instance defined above, inserting a new `tech.device_type` property with three possible values: `'desktop'`, `'mobile'`, and `'tablet'`. If the user agent is determined to be a bot, it may be ideal to abort and avoid recording an event.

```javascript
import MobileDetect from 'mobile-detect';

const md = new MobileDetect();
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

### Server Side Tracking (Back-end)

```javascript
const Keen = require('keen-tracking');

const client = new Keen({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY'
});

client.recordEvent('purchases', {
  item: 'Avocado',
  price: 12
});
```

---

### Contributing

This is an open source project and we love involvement from the community! Hit us up with pull requests and issues.

[Learn more about contributing to this project](./CONTRIBUTING.md).

---

### Support

Need a hand with something? Shoot us an email at [team@keen.io](mailto:team@keen.io). We're always happy to help, or just hear what you're building! Here are a few other resources worth checking out:

* [API status](http://status.keen.io/)
* [API reference](https://keen.io/docs/api)
* [How-to guides](https://keen.io/guides)
* [Data modeling guide](https://keen.io/guides/data-modeling-guide/)
* [Slack (public)](http://slack.keen.io/)
