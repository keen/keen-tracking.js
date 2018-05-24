import nock from 'nock';

import Keen from '../../..';
import config from '../helpers/client-config';

// Keen.debug = true;

describe('.recordEvent(s) methods (server)', () => {
  let client;
  const requestKey = config.writeKey;
  const dummyResponse = { result: 123 };
  const dummyErrorResponse = { error: true };
  const dummyQueryData = config.properties;
  const dummyCollection = config.collection;

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
  const batchResponse = {
        click: [
          { 'success': true }
        ],
        pageview: [
          { 'success': true },
          { 'success': true }
        ]
  };

  beforeAll(() => {
    nock(/https:/, {
        reqheaders: {
          'authorization': requestKey,
          'content-type': 'application/json',
        }
      })
      .persist()
      .post(/./, JSON.stringify(dummyQueryData))
      .reply(200, dummyResponse);

    nock(/http:/, {
        reqheaders: {
          'authorization': requestKey,
          'content-type': 'application/json',
      }
      })
      .persist()
      .post(/./, JSON.stringify(dummyQueryData))
      .reply(200, dummyResponse);

    // batch events
    nock(/https:/, {
        reqheaders: {
          'authorization': requestKey,
          'content-type': 'application/json'
        }
      })
      .persist()
      .post(/./, JSON.stringify(batchData))
      .reply(200, batchResponse);
  });

  beforeEach(() => {
    client = new Keen({
      projectId: config.projectId,
      writeKey: requestKey
    });
  });

  describe('.recordEvent()', () => {

    it('should make an HTTP request', (done) => {
      client.recordEvent(dummyCollection, dummyQueryData, (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(dummyResponse);
        done();
      });
    });

    it('should default to HTTPS', () => {
      expect(client.config.protocol).toBe('https');
    });

    it('should respect client HTTP protocol', (done) => {
      client.config.protocol = 'http';
      client.recordEvent(dummyCollection, dummyQueryData, (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(dummyResponse);
        expect(client.config.protocol).toBe('http');
        done();
      });
    });

    it('should not make an HTTP request if Keen.enabled is set to \'false\'', (done) => {
      Keen.enabled = false;

      client.recordEvent(dummyCollection, dummyQueryData, (err, res) => {
        expect(err).not.toBe(null);
        expect(res).toEqual(null);
        Keen.enabled = true;
        done();
      });
    });

    it('should return an error message if event collection is omitted', (done) => {
      client.recordEvent(null, dummyQueryData, (err, res) => {
        expect(err).not.toBe(null);
        expect(res).toEqual(null);
        done();
      });
    });
  });

  describe('.recordEvents()', () => {

    it('should make an HTTP request', (done) => {
      client.recordEvents(batchData, (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(batchResponse);
        done();
      });
    });

    it('should not make an HTTP request if Keen.enabled is set to \'false\'', (done) => {
      Keen.enabled = false;
      client.recordEvents(batchData, (err, res) => {
        expect(err).not.toBe(null);
        expect(res).toEqual(null);
        Keen.enabled = true;
        done();
      });
    });

  });

});
