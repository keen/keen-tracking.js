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
