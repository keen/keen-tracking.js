import Keen from '../../../lib/browser';
import config from '../helpers/client-config';

// Keen.debug = true;

// Mock XHR
window.XMLHttpRequest = () => {};
window.XMLHttpRequest.prototype.status = 0;
window.XMLHttpRequest.prototype.open = () => {}
window.XMLHttpRequest.prototype.setRequestHeader = () => {}
window.XMLHttpRequest.prototype.send = function(){
  this.status = 200;
  this.readyState = 4;
  this.responseText = '{ "created": true }';
  this.onreadystatechange();
}

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

  beforeEach(() => {
    mockFn1.mockClear();
    client = new Keen({
      projectId: config.projectId,
      writeKey: config.writeKey,
      requestType: 'xhr',
      host: config.host,
      protocol: config.protocol
    });
  });

  describe('.recordEvent', () => {

    it('should not send events if set to \'false\'', () => {
      Keen.enabled = false;
      client.recordEvent('not-going', { test: 'data' }, mockFn1);
      expect(mockFn1).toBeCalledWith(expect.any(String), null);
      Keen.enabled = true;
    });

    it('should return an error message if event collection is omitted', () => {
      client.recordEvent(null, { test: 'data' }, mockFn1);
      expect(mockFn1).toBeCalledWith(expect.any(String), null);
    });

    describe('via XHR/CORS (if supported)', () => {

      it('should send a POST request to the API using XHR', () => {
        client.recordEvent(config.collection + '_succeed', config.properties, mockFn1);
        expect(mockFn1).toBeCalledWith(null, expect.any(Object));
      });

    });

  });

  describe('.recordEvents', () => {

    it('should not send events if Keen.enabled is set to \'false\'', () => {
      Keen.enabled = false;
      client.recordEvents(batchData, mockFn1);
      expect(mockFn1).toBeCalledWith(expect.any(String), null);
      Keen.enabled = true;
    });

    it('should return an error message if first argument is not an object', () => {
      client.recordEvents([], mockFn1);
      expect(mockFn1).toBeCalledWith(expect.any(String), null);
      mockFn1.mockClear();
      client.recordEvents('', mockFn1);
      expect(mockFn1).toBeCalledWith(expect.any(String), null);
    });

    describe('via XHR/CORS (if supported)', () => {
      it('should send a POST request to the API using XHR', () => {
        client.recordEvents(batchData, mockFn1);
        expect(mockFn1).toBeCalledWith(null, expect.any(Object));
      });
    });
  });

});
