# keen-tracking.js [![Build Status](https://travis-ci.org/keen/keen-tracking.js.svg?branch=master)](https://travis-ci.org/keen/keen-tracking.js)


### Installation

Install this package from npm:

```ssh
$ npm install keen-tracking --save
```

Or load it from our CDN:

```html
<script src="https://d26b395fwzu5fz.cloudfront.net/keen-tracking-1.1.4.min.js"></script>
```

[Read about more installation options here](./docs/installation.md)


### Project ID & API Keys

[Login to Keen IO to create a project](https://keen.io/login?s=gh_js) and grab the **Project ID** and **Write Key** from your project's **Access** page.


## Getting started

The following examples demonstrate how to implement rock-solid web analytics, capturing **pageviews**, **clicks**, and **form submissions**. These examples also make use of several [helpers](https://github.com/keen/keen-tracking.js/tree/master/lib/helpers) and [utilities](https://github.com/keen/keen-tracking.js/tree/master/lib/utils) that were designed to address common requirements and help produce insightful, valuable data models.

Not interested in web analytics? That's fine! Use these examples as a primer for getting up and running quickly.

[Read the docs here](./docs). If any of this is confusing or vague, that's our fault and we would love to help. Jump into our [public Slack channel](https://slack.keen.io) or send us a [direct message](https://keen.io/support/).

**Upgrading from an earlier version of keen-js?** [Read this](./docs/upgrade-guide.md).


### Setup and Pageview Tracking

Next, let's create a new `client` instance with your Project ID and Write Key, and use the `.extendEvents()` method to define a solid baseline data model that will be applied to every single event that is recorded. Consistent data models and property names make life much easier later on, when analyzing and managing several event streams. This setup also includes our [data enrichment add-ons](https://keen.io/docs/streams/data-enrichment-overview/), which will populate additional information when an event is received on our end.

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
      browser: getBrowserProfile(),
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

client.recordEvent('pageview', {});
```

Now every event that is recorded will inherit this baseline data model. Any additional properties defined in `client.recordEvent()` will be applied before the event finally submitted.

What else can this SDK do?

* [Record multiple events in batches](./docs/record-events.md)
* [Extend event data models for a single event stream](*)
* [Queue events to be recorded at a given time interval](*)

[Read the docs here](./docs)

---

### Click and Form Submit Tracking

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

---

### Block Bots and Improve Device Recognition

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

---

### Contributing

This is an open source project and we love involvement from the community! Hit us up with pull requests and issues. The more contributions the better!

**TODO:**

* [ ] Validate `Keen.utils.listener()` form submit binding on IE8
* [ ] Expose `A` element click event and `FORM` element submit event timeouts (default: 500ms)

[Learn more about contributing to this project](./CONTRIBUTING.md).

---

### Support

Need a hand with something? Shoot us an email at [team@keen.io](mailto:team@keen.io). We're always happy to help, or just hear what you're building! Here are a few other resources worth checking out:

* [API status](http://status.keen.io/)
* [API reference](https://keen.io/docs/api)
* [How-to guides](https://keen.io/guides)
* [Data modeling guide](https://keen.io/guides/data-modeling-guide/)
* [Slack (public)](http://slack.keen.io/)
