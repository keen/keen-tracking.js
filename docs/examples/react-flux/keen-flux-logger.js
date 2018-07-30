import KeenTracking from 'keen-tracking';

// Record all actions to a single event stream
const EVENT_STREAM_NAME = 'app-actions';

// Omit noisy actions if necessary
const OMITTED_ACTIONS = [
  // 'KEYPRESS',
  // 'WINDOW_RESIZED'
];

// Define a client instance
const client = new KeenTracking({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY'
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

const fluxLogger = function(state, action) {
  const eventBody = {
    'action': action,
    'state': state
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
}

export default fluxLogger;
