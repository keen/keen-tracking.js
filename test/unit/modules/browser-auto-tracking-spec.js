import Cookies from 'js-cookie';
import KeenTracking from '../../../lib/browser';
import { deepExtend } from '../../../lib/utils/deepExtend';
import pkg from '../../../package.json';
import { cookie } from '../../../lib/utils/cookie';

jest.mock('promise-polyfill', () => {});
jest.mock('whatwg-fetch', () => {});

describe('Auto Tracking', () => {
  let client;
  let mockFn1 = jest.fn();
  let config = {
    projectId: 'aa',
    writeKey: 'bb',
    requestType: 'beaconAPI'
  };

  beforeEach(() => {
    client = new KeenTracking(config);
    client.on('recordEvent', mockFn1);
    mockFn1.mockClear();
    client.initAutoTracking();
  });

  const extendedParams = {
    geo: expect.any(Object),
    ip_address: "${keen.ip}",
    tracked_by: pkg.name + '-' + pkg.version,
    local_time_full: expect.any(String),
    user: {
      uuid: expect.any(String),
    },
    page: {
      title: expect.any(String),
      description: expect.any(String),
      time_on_page: expect.any(Number),
      time_on_page_ms: expect.any(Number),
      scroll_state: expect.any(Object)
    },
    ip_address: '${keen.ip}',
    geo: { },
    user_agent: '${keen.user_agent}',
    tech: {
      profile: expect.any(Object)
    },
    url: {
      full: window ? window.location.href : '',
      info: {  }
    },
    referrer: {
      full: document ? document.referrer : '',
      info: {  }
    },
    time: {
      local: {  },
      utc: {  }
    },
    keen: {
      timestamp: expect.any(String),
      addons: [
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
        },
        {
          name: 'keen:ip_to_geo',
          input: {
            ip: 'ip_address',
            remove_ip_property: false
          },
          output : 'geo'
        }
      ],
    }
  };

  const extendedParamsClick = {
    geo: expect.any(Object),
    tracked_by: pkg.name + '-' + pkg.version,
    local_time_full: expect.any(String),
    user: {
      uuid: expect.any(String),
    },
    page: {
      title: expect.any(String),
      description: expect.any(String),
      time_on_page: expect.any(Number),
      time_on_page_ms: expect.any(Number),
      scroll_state: expect.any(Object)
    },
    ip_address: '${keen.ip}',
    geo: { },
    user_agent: '${keen.user_agent}',
    tech: {
      profile: expect.any(Object)
    },
    url: {
      full: window ? window.location.href : '',
      info: {  }
    },
    referrer: {
      full: document ? document.referrer : '',
      info: {  }
    },
    time: {
      local: {  },
      utc: {  }
    },
    keen: {
      timestamp: expect.any(String),
      addons: [
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
        },
        {
          name: 'keen:ip_to_geo',
          input: {
            ip: 'ip_address',
            remove_ip_property: false
          },
          output : 'geo'
        }
      ],
    },
    element: expect.any(Object),
    local_time_full: expect.any(String),
    page: expect.any(Object)
  };

  const extendedParamsForm = {
    geo: expect.any(Object),
    ip_address: "${keen.ip}",
    tracked_by: pkg.name + '-' + pkg.version,
    local_time_full: expect.any(String),
    user: {
      uuid: expect.any(String),
    },
    page: {
      title: expect.any(String),
      description: expect.any(String),
      time_on_page: expect.any(Number),
      time_on_page_ms: expect.any(Number),
      scroll_state: expect.any(Object)
    },
    user_agent: '${keen.user_agent}',
    tech: {
      profile: expect.any(Object)
    },
    url: {
      full: window ? window.location.href : '',
      info: {  }
    },
    referrer: {
      full: document ? document.referrer : '',
      info: {  }
    },
    time: {
      local: {  },
      utc: {  }
    },
    keen: {
      timestamp: expect.any(String),
      addons: [
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
        },
        {
          name: 'keen:ip_to_geo',
          input: {
            ip: 'ip_address',
            remove_ip_property: false
          },
          output : 'geo'
        }
      ],
    },
    element: expect.any(Object),
    local_time_full: expect.any(String),
    page: expect.any(Object),
    form: {
      action: '/',
      method: 'get',
      fields: {
        email: 'team@keen.io',
        password: undefined
      }
    }
  };

  it('should capture "pageviews"', () => {
    expect(mockFn1).toBeCalledWith('pageviews', expect.objectContaining({}));
  });

  it('should capture "pageviews" with Extended params', () => {
    expect(mockFn1).toBeCalledWith('pageviews', expect.objectContaining(extendedParams));
  });

  it('should capture "clicks" with Extended params', () => {
    mockFn1.mockClear();
    const aNode = document.createElement('A');
    aNode.id = 'test-auto-tracker-clicks';
    document.body.appendChild(aNode);
    aNode.click();
    expect(mockFn1).toBeCalledWith('clicks', expect.objectContaining(extendedParamsClick));
  });

  it('should capture "form submits" with Extended params, ignore passwords', async () => {
    mockFn1.mockClear();
    fetch.mockResponseOnce(JSON.stringify({}));

    const bNode = document.createElement('BUTTON');
    const fNode = document.createElement('FORM');
    const iNode = document.createElement('INPUT');
    const pNode = document.createElement('INPUT');

    fNode.id = 'test-auto-tracker-submits';
    fNode.action = '/';
    fNode.onsubmit = mockFn1;

    iNode.type = 'text';
    iNode.name = 'email';
    iNode.value = extendedParamsForm.form.fields.email;

    pNode.type = 'password';
    pNode.name = 'password';
    pNode.value = '**********';

    bNode.type = 'submit';
    fNode.appendChild(iNode);
    fNode.appendChild(pNode);
    fNode.appendChild(bNode);
    document.body.appendChild(fNode);

    bNode.click();
    expect(mockFn1).toBeCalledWith('form_submissions', expect.objectContaining(extendedParamsForm));
    const fetchUrl = fetch.mock.calls[0][0];
    const fetchOptions = fetch.mock.calls[0][1];
    expect(fetchOptions).toMatchObject({
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      referrerPolicy: 'unsafe-url',
      headers:
        { Authorization: config.writeKey,
          'Content-Type': 'application/json' },
      retry: undefined
    });
    expect(JSON.parse(fetchOptions.body)).toMatchObject({ page: {}
    });
  });

  it('should capture "element_views"', () => {
    client.initAutoTracking({
      recordElementViews: true
    });

    const fNode = document.createElement('FORM');
    fNode.id = 'test-auto-tracker-submits';

    client.observers.IntersectionObserver.simulate([
      { target: fNode, isIntersecting: true }
    ]);

    expect(mockFn1).toBeCalledWith('element_views', expect.objectContaining({}));
  });

  it('should create cookie with UUID', () => {
    const cookie = KeenTracking.utils.cookie('keen');
    const uuid = cookie.get('uuid');
    expect(uuid).not.toBe(null);
    expect(uuid.length).toBeGreaterThan(0);
  });

  it('should create cookie with UUID', () => {
    const cookie = KeenTracking.utils.cookie('keen');
    const uuid = cookie.get('uuid');
    expect(uuid).not.toBe(null);
    expect(uuid.length).toBeGreaterThan(0);
  });

});
