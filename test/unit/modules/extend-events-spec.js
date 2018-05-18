import Keen from '../../../lib/server';
import config from '../helpers/client-config';

describe('.extendEvent(s) methods', () => {
  let client1;
  const mockFn1 = jest.fn();

  beforeEach(() => {
    mockFn1.mockReset();
    Keen.enabled = false;
    Keen.debug = true;
    client1 = new Keen({
      projectId: config.projectId,
      writeKey: config.writeKey,
      requestType: 'xhr',
      host: config.host,
      protocol: config.protocol
    });
  });

  it('should have an extensions hash with "events" and "collections" queues', () => {
    expect(client1.extensions).toBeInstanceOf(Object);
    expect(client1.extensions.events).toBeInstanceOf(Array);
    expect(client1.extensions.collections).toBeInstanceOf(Object);
  });

  it('should store global extensions in the proper order', () => {
    client1.extendEvents({ key: 123 });
    client1.extendEvents(() => { return {} });
    client1.extendEvents({ key: 456 });

    expect(client1.extensions.events[0]).toBeInstanceOf(Object);
    expect(client1.extensions.events[0].key).toBe(123);
    expect(client1.extensions.events[1]).toBeInstanceOf(Function);
    expect(client1.extensions.events[2]).toBeInstanceOf(Object);
    expect(client1.extensions.events[2].key).toBe(456);
  });

  it('should store single collection extensions in the proper order', () => {
    client1.extendEvent('pageviews', { key: 123 });
    client1.extendEvent('pageviews', () => { return {} });
    client1.extendEvent('pageviews', { key: 456 });

    client1.extendEvent('purchases', { key: 123 });
    client1.extendEvent('purchases', () => { return {} });
    client1.extendEvent('purchases', { key: 456 });

    expect(client1.extensions.collections['pageviews'][0]).toBeInstanceOf(Object);
    expect(client1.extensions.collections['pageviews'][0].key).toBe(123);
    expect(client1.extensions.collections['pageviews'][1]).toBeInstanceOf(Function);
    expect(client1.extensions.collections['pageviews'][2]).toBeInstanceOf(Object);
    expect(client1.extensions.collections['pageviews'][2].key).toBe(456);

    expect(client1.extensions.collections['purchases'][0]).toBeInstanceOf(Object);
    expect(client1.extensions.collections['purchases'][0].key).toBe(123);
    expect(client1.extensions.collections['purchases'][1]).toBeInstanceOf(Function);
    expect(client1.extensions.collections['purchases'][2]).toBeInstanceOf(Object);
    expect(client1.extensions.collections['purchases'][2].key).toBe(456);
  });

  it('should emit an "extendEvent" event', () => {
    client1.on('extendEvent', mockFn1);
    client1.extendEvent('pageviews', { key: 123 });
    expect(mockFn1).toBeCalledWith('pageviews', { key: 123 });
  });

  it('should emit an "extendEvents" event', () => {
    client1.on('extendEvents', mockFn1);
    client1.extendEvents({ key: 123 });
    expect(mockFn1).toBeCalledWith({ key: 123 });
  });


  describe('when calling .recordEvent', () => {

    it('should extend the event body of all events', () => {
      client1.on('recordEvent', mockFn1);
      client1.extendEvents({ key: 123, user: { id: '3434' } });
      client1.recordEvent('test', { exists: true, user: { active: false } });
      expect(mockFn1).toBeCalledWith('test', { key: 123, exists: true, user: { id: '3434', active: false }});
    });

    it('should extend the event body of a specific collection', () => {
      client1.on('recordEvent', mockFn1);
      client1.extendEvent('test', { key: 123, user: { id: '3434' } });
      client1.recordEvent('test', { exists: true, user: { active: false } });
      expect(mockFn1).toBeCalledWith('test', { key: 123, exists: true, user: { id: '3434', active: false }});
      mockFn1.mockReset();
      client1.recordEvent('test2', { exists: true, user: { active: false } });
      expect(mockFn1).not.toBeCalledWith('test', { key: 123, exists: true, user: { id: '3434', active: false }});
    });

  });

  describe('when calling .recordEvents', () => {

    it('should extend the event body of all events', () => {
      client1.on('recordEvents', mockFn1);
      client1.extendEvents({ key: 123, user: { id: '424234' } });
      client1.recordEvents({
        'test 1': [ { exists: true, user: { key: 0 } } ],
        'test 2': [ { exists: false, test: 'string' } ],
        'test 3': [ { key: 456 }, { exists: true } ]
      });
      expect(mockFn1).toBeCalledWith({
        'test 1': [
          { key: 123, exists: true, user: { id: '424234', key: 0 } }
        ],
        'test 2': [
          { key: 123, exists: false, test: 'string', user: { id: '424234' } }
        ],
        'test 3': [
          { key: 456, user: { id: '424234' } },
          { key: 123, exists: true, user: { id: '424234' } }
        ]
      });
    });

  });

});
