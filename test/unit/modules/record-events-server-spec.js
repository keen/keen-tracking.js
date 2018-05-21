const mockFnData = jest.fn();
const mockFnOptions = jest.fn();
jest.mock('https', () => {
  const httpsMock = {};
  httpsMock.request = (options, response) => {
    mockFnOptions(options);
    response.on = (emit, callback) => {};
    const requestMock = {};
    requestMock.onCallbacks = {};
    requestMock.write = (data) => mockFnData(JSON.parse(data));
    requestMock.on = (emit, callback) => {};
    requestMock.end = () => {  };
    return requestMock;
  };
  return httpsMock;
});

import Keen from '../../../lib/server';
import config from '../helpers/client-config';

// Keen.debug = true;

describe('.recordEvent(s) methods (server)', () => {
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

  beforeEach(() => {
    mockFn1.mockClear();
    mockFnOptions.mockClear();
    mockFnData.mockClear();
    client = new Keen({
      projectId: config.projectId,
      writeKey: config.writeKey
    });
  });

  describe('.recordEvent()', () => {

    it('should make an HTTP request', () => {
      client.recordEvent( config.collection, config.properties, mockFn1);
      expect(mockFnData).toBeCalledWith(config.properties);
      expect(mockFnOptions).toBeCalledWith({
        headers: expect.any(Object),
        host: 'api.keen.io',
        method: 'POST',
        path: expect.any(String)
      });
    });

    it('should default to HTTPS', () => {
      client.config.host = 'nonexistenthost';
      client.recordEvent( config.collection, config.properties, mockFn1);
      expect(mockFnData).toBeCalled();
    });

    it('should respect client HTTP protocol', () => {
      client.config.host = 'nonexistenthost';
      client.config.protocol = 'http';
      client.recordEvent( config.collection, config.properties, mockFn1);
      expect(mockFnData).not.toBeCalled();
    });

    it('should not make an HTTP request if Keen.enabled is set to \'false\'', () => {
      Keen.enabled = false;
      client.recordEvent( config.collection, config.properties, mockFn1);
      expect(mockFnData).not.toBeCalled();
      Keen.enabled = true;
    });

    it('should return an error message if event collection is omitted', () => {
      client.recordEvent( null, config.properties, mockFn1);
      expect(mockFn1).toBeCalledWith(expect.any(String), null);
    });
  });

  describe('.recordEvents()', () => {

    it('should make an HTTP request', () => {
      client.recordEvents( batchData, mockFn1);
      expect(mockFnData).toBeCalledWith(batchData);
      expect(mockFnOptions).toBeCalledWith({
        headers: expect.any(Object),
        host: 'api.keen.io',
        method: 'POST',
        path: expect.any(String)
      });
    });

    it('should not make an HTTP request if Keen.enabled is set to \'false\'', () => {
      Keen.enabled = false;
      client.recordEvents(batchData, mockFn1);
      expect(mockFnData).not.toBeCalled();
      Keen.enabled = true;
    });
  });

});
