var assert = require('proclaim');

var queue = require('../../../../lib/utils/queue');

describe('Keen.utils.queue', function() {

  beforeEach(function(){
    this.queue = queue();
  });

  describe('constructor', function(){

    it('should return a constructed object', function() {
      assert.isObject(this.queue);
    });

    it('should have internal capacity property of 0 and config capacity property of 5000', function() {
      assert.isNumber(this.queue.capacity);
      assert.equal(this.queue.capacity, 0);
      assert.isNumber(this.queue.config.capacity);
      assert.equal(this.queue.config.capacity, 5000);
    });

    it('should have internal interval property of 0 and config interval property of 15', function() {
      assert.isNumber(this.queue.interval);
      assert.equal(this.queue.interval, 0);
      assert.isNumber(this.queue.config.interval);
      assert.equal(this.queue.config.interval, 15);
    });

    it('should have internal timer property that is null', function() {
      assert.isNull(this.queue.timer);
    });

    it('should have prototype methods', function() {
      assert.isFunction(this.queue.check);
      assert.isFunction(this.queue.flush);
      assert.isFunction(this.queue.pause);
      assert.isFunction(this.queue.start);
    });

  });

  describe('methods', function(){

    it('should set a new timer when .start() is called', function() {
      assert.isNull(this.queue.timer);
      // this.queue.pause();
      // assert.isNull(this.queue.timer);
      this.queue.start();
      assert.ok(this.queue.timer);
      this.queue.pause();
    });

    it('should call .flush() when .check() is called and capacity is == config.capacity', function() {
      this.queue.pause();
      this.queue.capacity = 1;
      this.queue.config.capacity = 1;
      this.queue.flush = function(){
        assert.ok(true);
      };
      this.queue.check();
    });

    it('should call .pause() when .check() is called and config.interval == 0', function() {
      this.queue.pause();
      this.queue.config.interval = 0;
      this.queue.pause = function(){
        assert.ok(true);
      };
      this.queue.check();
    });

    it('should clear timer when .pause() is called', function() {
      assert.isNull(this.queue.timer);
      this.queue.start();
      assert.ok(this.queue.timer);
      this.queue.pause();
      assert.isNull(this.queue.timer);
    });

    it('should clear timer when config.interval is set to 0', function() {
      this.queue.start();
      assert.ok(this.queue.timer);
      this.queue.config.interval = 0;
      this.queue.check();
      assert.isNull(this.queue.timer);
    });

  });

});
