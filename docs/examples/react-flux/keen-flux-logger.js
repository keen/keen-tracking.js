import Keen from 'keen-tracking';

// Record all actions to a single event stream
const EVENT_STREAM_NAME = 'app-actions';

// Omit noisy actions if necessary
const OMITTED_ACTIONS = [
  // 'KEYPRESS',
  // 'WINDOW_RESIZED'
];

// Define a client instance
const client = new Keen({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY'
});

if (process.env.NODE_ENV !== 'production') {
  // Optionally prevent recording in dev mode
  Keen.enabled = false;
  // Display events in the browser console
  client.on('recordEvent', KeenTracking.log);
}

const helpers = Keen.helpers;
const timer = Keen.utils.timer();
timer.start();

// Batch-record events every 5s
client.queueInterval(5);

// Define a baseline data model for every
// action/event that will be recorded
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
  };
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
    client.deferEvent(EVENT_STREAM_NAME, eventBody);
  }
}

export default fluxLogger;
