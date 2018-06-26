import Cookies from 'js-cookie';
import Keen from '../../../lib/browser';
import { deepExtend } from '../../../lib/utils/deepExtend';
import pkg from '../../../package.json';
import { cookie } from '../../../lib/utils/cookie';

jest.mock('promise-polyfill', () => {});
jest.mock('whatwg-fetch', () => {});

describe('Auto Tracking', () => {
  let client1;
  let mockFn1 = jest.fn();

  beforeEach(() => {
    client1 = new Keen({
      projectId: 'aa',
      writeKey: 'bb'
    });
    client1.on('recordEvent', mockFn1);
    mockFn1.mockClear();
    client1.initAutoTracking();
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
      time_on_page: expect.any(Number)
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
            ip: 'ip_address'
          },
          output : 'geo'
        }
      ],
    }
  };

  const extendedParamsClick = {
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
      time_on_page: expect.any(Number)
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
            ip: 'ip_address'
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
      time_on_page: expect.any(Number)
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
            ip: 'ip_address'
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

  it('should capture "form submits" with Extended params, ignore passwords', () => {
    mockFn1.mockClear();

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
  });

  it('should create cookie with UUID', () => {
    const cookie = Keen.utils.cookie('keen');
    const uuid = cookie.get('uuid');
    expect(uuid).not.toBe(null);
    expect(uuid.length).toBeGreaterThan(0);
  });

  describe('GDPR', () => {
    beforeEach(() => {
      client1 = new Keen({
        projectId: 'aa',
        writeKey: 'bb'
      });
      client1.on('recordEvent', mockFn1);
      mockFn1.mockClear();
      client1.initAutoTracking({
        collectIpAddress: false
      });
    });

    it('should not collect IP addresses', () => {
      expect(mockFn1.mock.calls[0][1].ip_address).toEqual(undefined);
    });
  });

});
