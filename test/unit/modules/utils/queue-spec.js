import { queue } from '../../../../lib/utils/queue');

describe('Keen.utils.queue', function() {

  beforeEach(() => {
    this.queue = queue();
  });

  describe('constructor', () => {

    it('should return a constructed object', function() {
      expect().isObject(this.queue);
    });

    it('should have internal capacity property of 0 and config capacity property of 5000', function() {
      expect().isNumber(this.queue.capacity);
      expect().equal(this.queue.capacity, 0);
      expect().isNumber(this.queue.config.capacity);
      expect().equal(this.queue.config.capacity, 5000);
    });

    it('should have internal interval property of 0 and config interval property of 15', function() {
      expect().isNumber(this.queue.interval);
      expect().equal(this.queue.interval, 0);
      expect().isNumber(this.queue.config.interval);
      expect().equal(this.queue.config.interval, 15);
    });

    it('should have internal timer property that is null', function() {
      expect().isNull(this.queue.timer);
    });

    it('should have prototype methods', function() {
      expect().isFunction(this.queue.check);
      expect().isFunction(this.queue.flush);
      expect().isFunction(this.queue.pause);
      expect().isFunction(this.queue.start);
    });

  });

  describe('methods', () => {

    it('should set a new timer when .start() is called', function() {
      expect().isNull(this.queue.timer);
      // this.queue.pause();
      // expect().isNull(this.queue.timer);
      this.queue.start();
      expect().ok(this.queue.timer);
      this.queue.pause();
    });

    it('should call .flush() when .check() is called and capacity is == config.capacity', function() {
      this.queue.pause();
      this.queue.capacity = 1;
      this.queue.config.capacity = 1;
      this.queue.flush = () => {
        expect().ok(true);
      };
      this.queue.check();
    });

    it('should call .pause() when .check() is called and config.interval == 0', function() {
      this.queue.pause();
      this.queue.config.interval = 0;
      this.queue.pause = () => {
        expect().ok(true);
      };
      this.queue.check();
    });

    it('should clear timer when .pause() is called', function() {
      expect().isNull(this.queue.timer);
      this.queue.start();
      expect().ok(this.queue.timer);
      this.queue.pause();
      expect().isNull(this.queue.timer);
    });

    it('should clear timer when config.interval is set to 0', function() {
      this.queue.start();
      expect().ok(this.queue.timer);
      this.queue.config.interval = 0;
      this.queue.check();
      expect().isNull(this.queue.timer);
    });

  });

});
