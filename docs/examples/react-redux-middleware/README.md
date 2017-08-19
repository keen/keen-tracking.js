# React Redux Middleware

This example demonstrates how to instrument a Redux Store, based on the official [Redux Real World Example app](https://github.com/reactjs/redux/tree/master/examples/real-world).

### Installation

Install this package from npm:

```ssh
$ npm install keen-tracking --save
```

### Middleware

Create a new file where instrumentation and data modeling logic will live:

```ssh
redux/examples/real-world/src/store/keen-middleware.js
```

This file has a lot going on, so here's a quick overview:

1. Import the `keen-tracking` package and disable event logging when not in `production` mode.
2. `EVENT_STREAM_NAME` can be customized to your liking. We recommend recording events to a single stream when instrumenting apps like this, and filtering queries on the `action.type` (or similar) property defined within your actions.
3. `OMITTED_ACTIONS` allows you to omit noisy or trivial actions from being recorded.
4. Define a `client` instance and enable logging when not in `production` mode. Events won't be recorded, since `Keen.disabled` is `true`, but you will still be able to see captured events logged out in the console.
5. Use `client.extendEvents()` to define a baseline data model for every action/event that is recorded.
6. Define and export the actual middleware function where `action` and `state` data are captured.

```javascript
import Keen from 'keen-tracking';
if (process.env.NODE_ENV !== 'production') {
  Keen.disabled = true;
}

const EVENT_STREAM_NAME = 'app-action';
const OMITTED_ACTIONS = [
  '@@router/LOCATION_CHANGE'
];

const client = new Keen({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY'
});
if (process.env.NODE_ENV !== 'production') {
  client.on('recordEvent', KeenTracking.log);
}

const helpers = Keen.helpers;
const timer = Keen.utils.timer();
timer.start();

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
      browser: helers.getBrowserProfile(),
      info: { /* Enriched */ },
      user_agent: '${keen.user_agent}'
    },
    time: helpers.getDatetimeIndex(),
    visitor: {
      time_on_page: timer.value()
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
  };
});

const reduxMiddleware = function({ getState }) {
  return (next) => (action) => {
    const returnValue = next(action);
    const eventBody = {
      'action': action,
      'state': getState()
    };
    if (OMITTED_ACTIONS.indexOf(action.type) < 0) {
      client.recordEvent(EVENT_STREAM_NAME, eventBody);
    }
    return returnValue;
  };
}

export default reduxMiddleware;
```


### Instrument the Store

Next, let's insert our middleware where the store is first instantiated. The demo app contains distinct files for both `dev` and `prod` environments.

**configureStore.dev.js**

```ssh
redux/examples/real-world/src/store/configureStore.dev.js
```

Import the module defined previously and include it in the middleware composition [here](https://github.com/reactjs/redux/blob/master/examples/real-world/src/store/configureStore.dev.js#L13):

```javascript
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import api from '../middleware/api';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

// 1. Import middleware module
import KeenMiddleware from './keen-middleware';

const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      // 2. Append to middleware composition
      applyMiddleware(thunk, api, createLogger(), KeenMiddleware),
      DevTools.instrument()
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store;
}

export default configureStore;
```

**configureStore.prod.js**

```ssh
redux/examples/real-world/src/store/configureStore.prod.js
```

Import the module and include it in the middleware composition [here](https://github.com/reactjs/redux/blob/master/examples/real-world/src/store/configureStore.prod.js#L9):

```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import api from '../middleware/api';
import rootReducer from '../reducers';

// 1. Import middleware module
import KeenMiddleware from './keen-middleware';

const configureStore = preloadedState => createStore(
  rootReducer,
  preloadedState,
  // 2. Append to middleware composition
  applyMiddleware(thunk, api, KeenMiddleware)
)

export default configureStore
```

Once the app reloads, events should begin appearing in the browser console.
