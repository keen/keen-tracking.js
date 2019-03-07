import XHRmock from 'xhr-mock';
// Keen.debug = true;

import KeenTracking from '../../../lib/browser';
import config from '../helpers/client-config';
import { setOptOut } from '../../../lib/utils/optOut';

describe('.recordEvent(s) methods (browser)', () => {
  let client;
  let mockFn1 = jest.fn();

  const batchData = {
        'pageview': [
          { page: 'this one' },
          { page: 'same!' }
        ],
        'click': [
          { page: 'tada!' },
          { page: 'same again' }
        ]
  };
  const batchResponse = JSON.stringify({
        click: [
          { 'success': true }
        ],
        pageview: [
          { 'success': true },
          { 'success': true }
        ]
  });
  const dummyResponse = { created: true };
  const dummyErrorResponse = { error: true };

  beforeEach(() => {
    fetch.resetMocks();
    XHRmock.setup();
    mockFn1.mockClear();
    client = new KeenTracking({
      projectId: config.projectId,
      writeKey: config.writeKey,
      host: config.host,
      protocol: config.protocol
    });
  });

  afterEach(() => {
    XHRmock.teardown();
  });

  describe('.recordEvent', () => {
    it('should not send events if KeenTracking.enabled is set to \'false\'', () => {
      KeenTracking.enabled = false;
      client.recordEvent('not-going', { test: 'data' }, mockFn1);
      expect(mockFn1).toBeCalledWith(expect.any(String), null);
      KeenTracking.enabled = true;
    });

    it('should not send events if KeenTracking.optedOut is set to \'true\'', () => {
      KeenTracking.optedOut = true;
      client.recordEvent('not-going', { test: 'data' }, mockFn1);
      expect(mockFn1).not.toBeCalled();
      KeenTracking.optedOut = undefined;
    });

    it('should not send events if KeenTracking.doNotTrack is set to \'true\'', () => {
      KeenTracking.doNotTrack = true;
      client.recordEvent('not-going', { test: 'data' }, mockFn1);
      expect(mockFn1).not.toBeCalled();
      KeenTracking.doNotTrack = undefined;
    });

    it('should set optout in localStorage when setOptOut(true) is called', () => {
      setOptOut(true);
      expect(localStorage.getItem('optout')).toEqual(true);
    });

    it('should remove optout from localStorage when setOptOut(false) is called', () => {
      setOptOut(false);
      expect(localStorage.getItem('optout')).toBeUndefined();
    });

    it('should return an error message if event collection is omitted', () => {
      client.recordEvent(null, { test: 'data' }, mockFn1);
      expect(mockFn1).toBeCalledWith(expect.any(String), null);
    });

    describe('via Fetch (default transport method)', () => {
      it('should send a POST request to the API', async () => {
        fetch.mockResponseOnce(JSON.stringify(dummyResponse));
        let res = await client.recordEvent(config.collection + '_succeed', config.properties);
        const fetchUrl = fetch.mock.calls[0][0];
        const fetchOptions = fetch.mock.calls[0][1];
        expect(fetchOptions).toMatchObject({
          method: 'POST',
          mode: 'cors',
          redirect: 'follow',
          referrerPolicy: 'unsafe-url',
          headers:
            { Authorization: 'bad71ffe8407322ab70559afef29508799ed64b3f75a1ba9e26',
              'Content-Type': 'application/json' },
          retry: undefined
        });
        expect(fetchOptions.body).toEqual(JSON.stringify(config.properties));
        expect(fetchUrl).toContain(config.collection + '_succeed');
        expect(res).toEqual(dummyResponse);
      });

      it('should return a Promise', (done) => {
        XHRmock.post(/./g, (req, res) => {
          return res.status(400);
        });
        client
          .recordEvent(config.collection + '_succeed', config.properties)
          .then(() => {}).catch(err => {
            done();
          });
      });
    });

  });

  describe('.recordEvents', () => {

    it('should not send events if KeenTracking.enabled is set to \'false\'', () => {
      KeenTracking.enabled = false;
      client.recordEvents(batchData, mockFn1);
      expect(mockFn1).toBeCalledWith(expect.any(String), null);
      KeenTracking.enabled = true;
    });

    it('should not send events if KeenTracking.optedOut is set to \'true\'', () => {
      KeenTracking.optedOut = true;
      client.recordEvents(batchData, mockFn1);
      expect(mockFn1).not.toBeCalled();
      KeenTracking.optedOut = undefined;
    });

    it('should not send events if KeenTracking.doNotTrack is set to \'true\'', () => {
      KeenTracking.doNotTrack = true;
      client.recordEvents(batchData, mockFn1);
      expect(mockFn1).not.toBeCalled();
      KeenTracking.doNotTrack = undefined;
    });
    
    it('should return an error message if first argument is not an object', () => {
      client.recordEvents([], mockFn1);
      expect(mockFn1).toBeCalledWith(expect.any(String), null);
      mockFn1.mockClear();
      client.recordEvents('', mockFn1);
      expect(mockFn1).toBeCalledWith(expect.any(String), null);
    });

    describe('via Fetch (default transport method)', () => {
      it('should send a POST request to the API', async () => {
        fetch.mockResponseOnce(JSON.stringify(dummyResponse));
        let res = await client.recordEvents(batchData);
        const fetchOptions = fetch.mock.calls[0][1];
        expect(fetchOptions).toMatchObject({
          method: 'POST',
          mode: 'cors',
          redirect: 'follow',
          referrerPolicy: 'unsafe-url',
          headers:
            { Authorization: 'bad71ffe8407322ab70559afef29508799ed64b3f75a1ba9e26',
              'Content-Type': 'application/json' },
          retry: undefined
        });
        expect(fetchOptions.body).toEqual(JSON.stringify(batchData));
        expect(res).toEqual(dummyResponse);
      });

      it('should return a Promise', (done) => {
        XHRmock.post(/./g, (req, res) => {
          return res.status(400);
        });
        client
          .recordEvents(batchData)
          .then(() => {}).catch(err => {
            done();
          });
      });
    });

  });

});

describe('.recordEvent(s) methods (browser) when optOut is set to true in config', () => {
  let client;
  let mockFn1 = jest.fn();

  const batchData = {
        'pageview': [
          { page: 'this one' },
          { page: 'same!' }
        ],
        'click': [
          { page: 'tada!' },
          { page: 'same again' }
        ]
  };
  const batchResponse = JSON.stringify({
        click: [
          { 'success': true }
        ],
        pageview: [
          { 'success': true },
          { 'success': true }
        ]
  });
  const dummyResponse = { created: true };
  const dummyErrorResponse = { error: true };

  beforeEach(() => {
    fetch.resetMocks();
    XHRmock.setup();
    mockFn1.mockClear();
    client = new KeenTracking({
      projectId: config.projectId,
      writeKey: config.writeKey,
      host: config.host,
      protocol: config.protocol,
      optOut: true
    });
  });

  afterEach(() => {
    XHRmock.teardown();
  });

  describe('.recordEvent', () => {
    it('should not send events if optOut is set to \'true\'', () => {
      client.recordEvent('not-going', { test: 'data' }, mockFn1);
      expect(mockFn1).not.toBeCalled();
    });

  });

  describe('.recordEvents', () => {

    it('should not send events if optOut is set to \'true\'', () => {
      client.recordEvents(batchData, mockFn1);
      expect(mockFn1).not.toBeCalled();
    });

  });

});
