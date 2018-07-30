import KeenTracking from 'keen-tracking';

// Record all mutations to a single event stream
const EVENT_STREAM_NAME = 'app-mutations';

// Omit noisy mutations if necessary
const OMITTED_MUTATIONS = [
  // 'KEYPRESS',
  // 'WINDOW_RESIZED'
];

// Define a client instance
const client = new KeenTracking({
  projectId: 'YOUR_PROJECT_ID',
  writeKey: 'YOUR_WRITE_KEY'
});
// Optional debugging
KeenTracking.debug = true;
client.on('recordEvent', Keen.log);

// Track a 'pageview' event and initialize auto-tracking data model
client.initAutoTracking({
  recordClicks: false,
  recordFormSubmits: false,
  recordPageViews: true
});

const vuexLogger = store => {
  // Called when the store is initialized
  store.subscribe((mutation, state) => {
    // Called after every mutation.
    // The mutation comes in the format of `{ type, payload }`.
    const eventBody = {
      'mutation': mutation,
      'state': state
      /*
        Include additional properties here, or
        refine the state data that is recorded
        by cherry-picking specific properties
      */
    };
    // Filter omitted mutations by mutation.type
    // ...or whatever you name this property
    if (OMITTED_MUTATIONS.indexOf(mutation.type) < 0) {
      client.recordEvent(EVENT_STREAM_NAME, eventBody);
    }
  })
};

export default vuexLogger;
