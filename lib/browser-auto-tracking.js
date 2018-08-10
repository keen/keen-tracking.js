import pkg from '../package.json';

export function initAutoTrackingCore(lib) {
  return function(obj) {
    const client = this;
    const helpers = lib.helpers;
    const utils = lib.utils;

    const options = utils.extend({
      ignoreDisabledFormFields: false,
      ignoreFormFieldTypes: ['password'],
      recordClicks: true,
      recordFormSubmits: true,
      recordPageViews: true,
      recordPageViewsOnExit: false,
      recordScrollState: true,
      shareUuidAcrossDomains: false,
      collectIpAddress: true,
      collectUuid: true,
      catchError: undefined // optional, function(someError) - error handler
    }, obj);

    if (client.config.requestType === 'beaconAPI' && options.catchError) {
      throw `You cannot use the BeaconAPI and catchError function in the same time, because BeaconAPI ignores errors. For requests with error handling - use requestType: 'fetch'`;
      return;
    }

    if (
      client.config.requestType === 'jsonp' // jsonp is deprecated, it's the default value from old keen's client
    ) {
      if (options.catchError) {
        client.config.requestType = 'fetch';
      } else {
        client.config.requestType = 'beaconAPI';
      }
    }

    const now = new Date();
    const cookie = new utils.cookie('keen');

    const domainName = helpers.getDomainName(window.location.hostname);
    const cookieDomain = domainName && options.shareUuidAcrossDomains ? {
      domain: '.' + domainName
    } : {};

    let uuid;
    if (options.collectUuid) {
      uuid = cookie.get('uuid');
      if (!uuid) {
        uuid = helpers.getUniqueId();
        cookie.set('uuid', uuid, cookieDomain);
      }
    }

    let initialReferrer = cookie.get('initialReferrer');
    if (!initialReferrer){
      initialReferrer = document && document.referrer || undefined;
      cookie.set('initialReferrer', initialReferrer, cookieDomain);
    }

    let scrollState = {};
    if (options.recordScrollState) {
      scrollState = helpers.getScrollState();
      utils.listener('window').on('scroll', () => {
        scrollState = helpers.getScrollState(scrollState);
      });
    }

    const addons = [
      {
        name: 'keen:ua_parser',
        input: {
          ua_string: 'user_agent'
        },
        output: 'tech'
      },
      {
        name: 'keen:url_parser',
        input: {
          url: 'url.full'
        },
        output: 'url.info'
      },
      {
        name: 'keen:url_parser',
        input: {
          url: 'referrer.full'
        },
        output: 'referrer.info'
      },
      {
        name: 'keen:date_time_parser',
        input: {
          date_time: 'keen.timestamp'
        },
        output: 'time.utc'
      },
      {
        name: 'keen:date_time_parser',
        input: {
          date_time: 'local_time_full'
        },
        output: 'time.local'
      }
    ];

    let ip_address = '${keen.ip}';
    addons.push({
      name: 'keen:ip_to_geo',
      input: {
        ip: 'ip_address',
        remove_ip_property: !options.collectIpAddress
      },
      output : 'geo'
    });

    client.extendEvents(function() {
      const browserProfile = helpers.getBrowserProfile();
      return {
        tracked_by: pkg.name + '-' + pkg.version,
        local_time_full: new Date().toISOString(),
        user: {
          uuid
        },
        page: {
          title: document ? document.title : null,
          description: browserProfile.description,
          scroll_state: scrollState,
          time_on_page: getSecondsSinceDate(now),
          time_on_page_ms: getMiliSecondsSinceDate(now)
        },

        ip_address,
        geo: { /* Enriched */ },

        user_agent: '${keen.user_agent}',
        tech: {
          profile: browserProfile
          /* Enriched */
        },

        url: {
          full: window ? window.location.href : '',
          info: { /* Enriched */ }
        },

        referrer: {
          initial: initialReferrer,
          full: document ? document.referrer : '',
          info: { /* Enriched */ }
        },

        time: {
          local: { /* Enriched */ },
          utc: { /* Enriched */ }
        },

        keen: {
          timestamp: new Date().toISOString(),
          addons,
        }
      };
    });

    if (options.recordClicks === true) {
      utils.listener('a, a *').on('click', function(e) {
        const el = e.target;
        const event = {
          element: helpers.getDomNodeProfile(el),
          local_time_full: new Date().toISOString()
        };

        if (options.catchError) {
          return client
            .recordEvent({
              collection: 'clicks',
              event
            }).catch(err => {
              options.catchError(err);
            });
        }

        return client
          .recordEvent({
            collection: 'clicks',
            event
          });
      });
    }

    if (options.recordFormSubmits === true) {
      utils.listener('form').on('submit', function(e) {
        const el = e.target;
        const serializerOptions = {
          disabled: options.ignoreDisabledFormFields,
          ignoreTypes: options.ignoreFormFieldTypes
        };
        const event = {
          form: {
            action: el.action,
            fields: utils.serializeForm(el, serializerOptions),
            method: el.method
          },
          element: helpers.getDomNodeProfile(el),
          local_time_full: new Date().toISOString()
        };

        if (options.catchError) {
          return client
            .recordEvent({
              collection: 'form_submissions',
              event
            })
            .catch(err => {
              options.catchError(err);
            });
        }

        return client.recordEvent({
          collection: 'form_submissions',
          event
        });
      });
    }

    if (options.recordPageViews === true && !options.recordPageViewsOnExit) {
      if (options.catchError) {
        client
          .recordEvent({
            collection: 'pageviews'
          })
          .catch(err => {
            options.catchError(err);
          });
      } else {
        client
          .recordEvent({
            collection: 'pageviews'
          });
      }
    }

    if (options.recordPageViewsOnExit && typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        client.config.requestType = 'beaconAPI'; // you can run beforeunload only with beaconAPI
        client.recordEvent({
          collection: 'pageviews'
        });
      });
    }

    return client;
  };
}

function getSecondsSinceDate(date) {
  return Math.round(getMiliSecondsSinceDate(date) / 1000);
}

function getMiliSecondsSinceDate(date) {
  return new Date().getTime() - date.getTime();
}
