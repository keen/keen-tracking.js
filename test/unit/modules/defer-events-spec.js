
import Keen from '../../../../lib/server';
import config from '../helpers/client-config';

describe('.deferEvent(s) methods', function() {

  beforeEach(function() {
    Keen.enabled = false;
    this.client = new Keen({
      projectId: config.projectId,
      writeKey: config.writeKey,
      requestType: 'xhr',
      host: config.host,
      protocol: config.protocol
    });
  });

  it('should have a queue', () => {
    expect().isObject(this.client.queue);
  });

  it('should overwrite capacity and interval settings with accessor methods', () => {
    this.client.queueCapacity(10);
    this.client.queueInterval(10);
    expect().equal(this.client.queue.config.capacity, 10);
    expect().equal(this.client.queue.config.interval, 10);
  });

  it('should push individual deferred events into a queue', () => {
    this.client.deferEvent('deferred event', { test: 'data' });
    expect().isArray(this.client.queue.events['deferred event']);
    expect().deepEqual(this.client.queue.events['deferred event'][0], { test: 'data' });
  });

  it('should push sets of deferred events into a queue', () => {
    this.client.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
    expect().isArray(this.client.queue.events['deferred event']);
    expect().isArray(this.client.queue.events['another event']);
    expect().deepEqual(this.client.queue.events['deferred event'][0], { test: 'data' });
    expect().deepEqual(this.client.queue.events['deferred event'][1], { test: 'none' });
    expect().deepEqual(this.client.queue.events['another event'][0], { test: 'data' });
  });

  it('should attempt to record events from the queue at given interval', () => {
    this.timeout(5000);
    this.client.queueInterval(2);
    this.client.on('recordDeferredEvents', function(data){
      expect().isObject(data);
      expect().isArray(data['deferred event']);
      expect().isArray(data['another event']);
      expect().deepEqual(data['deferred event'][0], { test: 'data' });
      expect().deepEqual(data['deferred event'][1], { test: 'none' });
      expect().deepEqual(data['another event'][0], { test: 'data' });
    });
    this.client.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
  });

  it('should attempt to record events from the queue when capacity is met', () => {
    this.timeout(5000);
    this.client.queueCapacity(3);
    this.client.on('recordDeferredEvents', function(data){
      expect().isObject(data);
      expect().isArray(data['deferred event']);
      expect().isArray(data['another event']);
      expect().deepEqual(data['deferred event'][0], { test: 'data' });
      expect().deepEqual(data['deferred event'][1], { test: 'none' });
      expect().deepEqual(data['another event'][0], { test: 'data' });
    });
    this.client.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
  });

  it('should attempt to record events when .recordDeferredEvents is called', () => {
    this.timeout(5000);
    this.client.on('recordDeferredEvents', function(data){
      expect().isObject(data);
      expect().isArray(data['deferred event']);
      expect().isArray(data['another event']);
      expect().deepEqual(data['deferred event'][0], { test: 'data' });
      expect().deepEqual(data['deferred event'][1], { test: 'none' });
      expect().deepEqual(data['another event'][0], { test: 'data' });
    });
    this.client.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
    this.client.recordDeferredEvents();
  });

  it('should not have an internal queue timer until an event is added to the queue', () => {
    expect().isNull(this.client.queue.timer);
    this.client.deferEvent('single-deferred-event', { prop: true });
    expect().ok(this.client.queue.timer);
  });

  it('should not have an internal queue timer until multiple events are added to the queue', () => {
    expect().isNull(this.client.queue.timer);
    this.client.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
    expect().ok(this.client.queue.timer);
  });

  it('should clear internal queue timer when .queueInterval() is set to 0', () => {
    expect().isNull(this.client.queue.timer);
    this.client.deferEvent('single-deferred-event', { prop: true });
    expect().ok(this.client.queue.timer);
    this.client.queueInterval(0);
    expect().isNull(this.client.queue.timer);
  });

});
