var assert = require('proclaim');
var Keen = require('../../../index');
var config = require('../helpers/client-config');

describe('.extendEvent(s) methods', function() {

  beforeEach(function() {
    Keen.enabled = false;
    Keen.debug = true;
    this.client = new Keen.Client({
      projectId: config.projectId,
      writeKey: config.writeKey,
      requestType: 'xhr',
      host: config.host,
      protocol: config.protocol
    });
  });

  it('should have an extensions hash with "events" and "collections" queues', function(){
    assert.isObject(this.client.extensions);
    assert.isArray(this.client.extensions.events);
    assert.isObject(this.client.extensions.collections);
  });

  it('should store global extensions in the proper order', function(){
    this.client.extendEvents({ key: 123 });
    this.client.extendEvents(function(){ return {} });
    this.client.extendEvents({ key: 456 });

    assert.isObject(this.client.extensions.events[0]);
    assert.equal(this.client.extensions.events[0].key, 123);
    assert.isFunction(this.client.extensions.events[1]);
    assert.isObject(this.client.extensions.events[2]);
    assert.equal(this.client.extensions.events[2].key, 456);
  });

  it('should store single collection extensions in the proper order', function(){
    this.client.extendEvent('pageviews', { key: 123 });
    this.client.extendEvent('pageviews', function(){ return {} });
    this.client.extendEvent('pageviews', { key: 456 });

    this.client.extendEvent('purchases', { key: 123 });
    this.client.extendEvent('purchases', function(){ return {} });
    this.client.extendEvent('purchases', { key: 456 });

    assert.isObject(this.client.extensions.collections['pageviews'][0]);
    assert.equal(this.client.extensions.collections['pageviews'][0].key, 123);
    assert.isFunction(this.client.extensions.collections['pageviews'][1]);
    assert.isObject(this.client.extensions.collections['pageviews'][2]);
    assert.equal(this.client.extensions.collections['pageviews'][2].key, 456);

    assert.isObject(this.client.extensions.collections['purchases'][0]);
    assert.equal(this.client.extensions.collections['purchases'][0].key, 123);
    assert.isFunction(this.client.extensions.collections['purchases'][1]);
    assert.isObject(this.client.extensions.collections['purchases'][2]);
    assert.equal(this.client.extensions.collections['purchases'][2].key, 456);
  });

  it('should emit an "extendEvent" event', function(){
    this.client.on('extendEvent', function(eventCollection, eventModifier){
      assert.equal(eventCollection, 'pageviews');
      assert.equal(eventModifier.key, 123);
    });
    this.client.extendEvent('pageviews', { key: 123 });
  });

  it('should emit an "extendEvents" event', function(){
    this.client.on('extendEvents', function(eventsModifier){
      assert.equal(eventsModifier.key, 123);
    });
    this.client.extendEvents({ key: 123 });
  });

});
