import Keen from '../../../lib/server';
import config from '../helpers/client-config';

describe('.deferEvent(s) methods', () => {
  let client1;

  beforeEach(() => {
    Keen.enabled = false;
    client1 = new Keen({
      projectId: config.projectId,
      writeKey: config.writeKey,
      requestType: 'xhr',
      host: config.host,
      protocol: config.protocol
    });
  });

  it('should have a queue', () => {
    expect(client1.queue).toBeInstanceOf(Object);
  });

  it('should overwrite capacity and interval settings with accessor methods', () => {
    client1.queueCapacity(10);
    client1.queueInterval(11);
    expect(client1.queue.config.capacity).toBe(10);
    expect(client1.queue.config.interval).toBe(11);
  });

  it('should push individual deferred events into a queue', () => {
    client1.deferEvent('deferred event', { test: 'data' });
    expect(client1.queue.events['deferred event']).toBeInstanceOf(Array);
    expect(client1.queue.events['deferred event'][0]).toEqual({ test: 'data' });
  });

  it('should push sets of deferred events into a queue', () => {
    client1.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
    expect(client1.queue.events['deferred event']).toBeInstanceOf(Array);
    expect(client1.queue.events['another event']).toBeInstanceOf(Array);
    expect(client1.queue.events['deferred event'][0]).toEqual({ test: 'data' });
    expect(client1.queue.events['deferred event'][1]).toEqual({ test: 'none' });
    expect(client1.queue.events['another event'][0]).toEqual({ test: 'data' });
  });

  it('should attempt to record events from the queue at given interval', () => {
    client1.queueInterval(1);
    client1.on('recordDeferredEvents', (data) => {
      expect(data).toBeInstanceOf(Object);
      expect(data['deferred event']).toBeInstanceOf(Array);
      expect(data['another event']).toBeInstanceOf(Array);
      expect(data['deferred event'][0]).toEqual({ test: 'data' });
      expect(data['deferred event'][1]).toEqual({ test: 'none' });
      expect(data['another event'][0]).toEqual({ test: 'data' });
    });
    client1.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
  });

  it('should attempt to record events from the queue when capacity is met', () => {
    client1.queueCapacity(3);
    client1.on('recordDeferredEvents', (data) => {
      expect(data).toBeInstanceOf(Object);
      expect(data['deferred event']).toBeInstanceOf(Array);
      expect(data['another event']).toBeInstanceOf(Array);
      expect(data['deferred event'][0]).toEqual({ test: 'data' });
      expect(data['deferred event'][1]).toEqual({ test: 'none' });
      expect(data['another event'][0]).toEqual({ test: 'data' });
    });
    client1.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
  });

  it('should attempt to record events when .recordDeferredEvents is called', () => {
    client1.on('recordDeferredEvents', (data) => {
      expect(data).toBeInstanceOf(Object);
      expect(data['deferred event']).toBeInstanceOf(Array);
      expect(data['another event']).toBeInstanceOf(Array);
      expect(data['deferred event'][0]).toEqual({ test: 'data' });
      expect(data['deferred event'][1]).toEqual({ test: 'none' });
      expect(data['another event'][0]).toEqual({ test: 'data' });
    });
    client1.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
    client1.recordDeferredEvents();
  });

  it('should not have an internal queue timer until an event is added to the queue', () => {
    expect(client1.queue.timer).toBe(null);
    client1.deferEvent('single-deferred-event', { prop: true });
    expect(client1.queue.timer).not.toBe(null);
  });

  it('should not have an internal queue timer until multiple events are added to the queue', () => {
    expect(client1.queue.timer).toBe(null);
    client1.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
    expect(client1.queue.timer).not.toBe(null);
  });

  it('should clear internal queue timer when .queueInterval() is set to 0', () => {
    expect(client1.queue.timer).toBe(null);
    client1.deferEvent('single-deferred-event', { prop: true });
    expect(client1.queue.timer).not.toBe(null);
    client1.queueInterval(0);
    expect(client1.queue.timer).toBe(null);
  });

});
