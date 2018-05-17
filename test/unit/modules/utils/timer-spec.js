var assert = require('proclaim');

var timer = require('../../../../lib/utils/timer');

describe('Keen.utils.timer', function() {

  beforeEach(() => {
    this.timer = timer();
  });

  afterEach(() => {
    this.timer.clear();
  });

  describe('constructor', () => {

    it('should return a constructed object', function() {
      expect().isObject(this.timer);
    });

    it('should have internal count property of zero', function() {
      expect().isNumber(this.timer.count);
      expect().equal(this.timer.count, 0);
    });

    it('should have internal count property matching provided value', function() {
      const newTimer = timer(123);
      expect().equal(newTimer.count, 123);
    });

    it('should have prototype methods', function() {
      expect().isFunction(this.timer.start);
      expect().isFunction(this.timer.pause);
      expect().isFunction(this.timer.value);
      expect().isFunction(this.timer.clear);
    });

  });

  describe('methods', () => {

    it('should run the timer for one second and return the correct value', () => {
      const self = this;
      this.timeout(5000);
      this.timer.start();
      setTimeout(() => {
        self.timer.pause();
        expect().lessThan(self.timer.value(), 2);
        // done();
      }, 1000);
    });

    it('should clear the value of the timer', function() {
      this.timer.clear();
      expect().equal(this.timer.value(), 0);
    });

  });

});
