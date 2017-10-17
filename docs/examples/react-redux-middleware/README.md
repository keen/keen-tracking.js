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

```javascript
import Keen from 'keen-tracking';

// Record all actions to a single event stream
const EVENT_STREAM_NAME = 'app-actions';

// Omit noisy actions if necessary
const OMITTED_ACTIONS = [
  // '@@router/LOCATION_CHANGE'
];

// Define a client instance
const client = new Keen({
  projectId: 'YOUR_PROJECT_ID',
  writeKey: 'YOUR_WRITE_KEY'
});

if (process.env.NODE_ENV !== 'production') {
  // Optionally prevent recording in dev mode
  Keen.enabled = false;
  // Display events in the browser console
  client.on('recordEvent', Keen.log);
}

// Track a 'pageview' event and initialize auto-tracking data model
client.initAutoTracking({
  recordClicks: false,
  recordFormSubmits: false,
  recordPageViews: true
});

const reduxMiddleware = function({ getState }) {
  return (next) => (action) => {
    const returnValue = next(action);
    const eventBody = {
      'action': action,
      'state': getState()
      /*
          Include additional properties here, or
          refine the state data that is recorded
          by cherry-picking specific properties
      */
    };
    // Filter omitted actions by action.type
    // ...or whatever you name this property
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
