var assert = require('proclaim');

var timer = require('../../../../lib/utils/timer');

describe('Keen.utils.timer', function() {

  beforeEach(function(){
    this.timer = timer();
  });

  afterEach(function(){
    this.timer.clear();
  });

  describe('constructor', function(){

    it('should return a constructed object', function() {
      assert.isObject(this.timer);
    });

    it('should have internal count property of zero', function() {
      assert.isNumber(this.timer.count);
      assert.equal(this.timer.count, 0);
    });

    it('should have internal count property matching provided value', function() {
      var newTimer = timer(123);
      assert.equal(newTimer.count, 123);
    });

    it('should have prototype methods', function() {
      assert.isFunction(this.timer.start);
      assert.isFunction(this.timer.pause);
      assert.isFunction(this.timer.value);
      assert.isFunction(this.timer.clear);
    });

  });

  describe('methods', function(){

    it('should run the timer for one second and return the correct value', function(){
      var self = this;
      this.timeout(5000);
      this.timer.start();
      setTimeout(function(){
        self.timer.pause();
        assert.equal(self.timer.value(), 1);
        // done();
      }, 1000);
    });

    it('should clear the value of the timer', function() {
      this.timer.clear();
      assert.equal(this.timer.value(), 0);
    });

  });

});
