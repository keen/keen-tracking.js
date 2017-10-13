# Vue vuex Logging

This example demonstrates how to instrument Keen on [Vuex](https://vuex.vuejs.org/en/intro.html), capturing both the `mutations` and `state` data.

### Installation

Install this package from npm:

```ssh
$ npm install keen-tracking --save
```

Create a new file called `keen-vuex-logger.js` where instrumentation and data modeling logic will live, or grab a copy [here](./keen-vuex-logger.js).

```javascript
import Keen from 'keen-tracking'

// Record all actions to a single event stream
const EVENT_STREAM_NAME = 'app-actions'

// Omit noisy actions if necessary
const OMITTED_ACTIONS = [
  // 'KEYPRESS',
  // 'WINDOW_RESIZED'
]

// Define a client instance
const client = new Keen({
  projectId: 'YOUR_PROJECT_ID',
  writeKey: 'YOUR_WRITE_KEY'
})
// make debug mode
Keen.debug = true
client.on('recordEvent', Keen.log)
client.on('deferEvent', Keen.log)
client.on('deferEvents', Keen.log)

const helpers = Keen.helpers
const timer = Keen.utils.timer()
timer.start()

// Batch-record events every 5s
client.queueInterval(5)

// Define a baseline data model for every
// action/event that will be recorded
client.extendEvents(() => {
  return {
    geo: {
      info: { /* Enriched */ },
      ip_address: Keen.ip,
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
      user_agent: Keen.user_agent
    },
    time: helpers.getDatetimeIndex(),
    visitor: {
      time_on_page: timer.value()
      /* Include additional visitor info here */
    },
    keen: {
      timestamp: new Date().toISOString(),
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
})

const vuexLogger = store => {
  // called when the store is initialized
  store.subscribe((mutation, state) => {
    // called after every mutation.
    // The mutation comes in the format of `{ type, payload }`.
    const eventBody = {
      'mutation': mutation,
      'state': state
      /*
        Include additional properties here, or
        refine the state data that is recorded
        by cherry-picking specific properties
      */
    }
    // Filter omitted actions by action.type
    // ...or whatever you name this property
    if (OMITTED_ACTIONS.indexOf(action.type) < 0) {
      client.deferEvent(EVENT_STREAM_NAME, eventBody)
    }
  })
}

export default vuexLogger
```


### Instrument the Store

Next, import our new `keen-vuex-logger` vuex plugin into your Store definition:

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import vuexLogger from './keen-vuex-logger.js'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules,
  strict: debug,
  plugins: debug ? [vuexLogger] : []
})
```
