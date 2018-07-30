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
      recordScrollState: true,
      shareUuidAcrossDomains: false,
      collectIpAddress: true
    }, obj);

    const now = new Date();
    const cookie = new utils.cookie('keen');

    const domainName = helpers.getDomainName(window.location.hostname);
    const cookieDomain = domainName && options.shareUuidAcrossDomains ? {
      domain: '.' + domainName
    } : {};

    let uuid = cookie.get('uuid');
    if (!uuid) {
      uuid = helpers.getUniqueId();
      cookie.set('uuid', uuid, cookieDomain);
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

    let ip_address = undefined;
    if (options.collectIpAddress){
      ip_address = '${keen.ip}';
      addons.push({
        name: 'keen:ip_to_geo',
        input: {
          ip: 'ip_address'
        },
        output : 'geo'
      });
    }

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
          time_on_page: getSecondsSinceDate(now)
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
        const props = {
          element: helpers.getDomNodeProfile(el),
          local_time_full: new Date().toISOString(),
          page: {
            scroll_state: scrollState
          }
        };
        return client.recordEvent('clicks', props);
      });
    }

    if (options.recordFormSubmits === true) {
      utils.listener('form').on('submit', function(e) {
        const el = e.target;
        const serializerOptions = {
          disabled: options.ignoreDisabledFormFields,
          ignoreTypes: options.ignoreFormFieldTypes
        };
        const props = {
          form: {
            action: el.action,
            fields: utils.serializeForm(el, serializerOptions),
            method: el.method
          },
          element: helpers.getDomNodeProfile(el),
          local_time_full: new Date().toISOString(),
          page: {
            scroll_state: scrollState
          }
        };
        return client.recordEvent('form_submissions', props);
      });
    }

    if (options.recordPageViews === true) {
      client.recordEvent('pageviews');
    }

    return client;
  };
}

function getSecondsSinceDate(date) {
  const diff = new Date().getTime() - date.getTime();
  return Math.round(diff / 1000);
}
