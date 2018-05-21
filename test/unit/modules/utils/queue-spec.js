import { queue } from '../../../../lib/utils/queue';


describe('Keen.utils.queue', () => {

  describe('constructor', () => {
    let queue1 = queue();

    it('should return a constructed object', () => {
      expect(queue1).toBeInstanceOf(Object);
    });

    it('should have internal capacity property of 0 and config capacity property of 5000', () => {
      expect(queue1.capacity).toBe(0);
      expect(queue1.config.capacity).toBe(5000);
    });

    it('should have internal interval property of 0 and config interval property of 15', () => {
      expect(queue1.interval).toBe(0);
      expect(queue1.config.interval).toBe(15);
    });

    it('should have internal timer property that is null', () => {
      expect(queue1.timer).toBe(null);
    });

    it('should have prototype methods', () => {
      expect(queue1.check).toBeInstanceOf(Function);
      expect(queue1.flush).toBeInstanceOf(Function);
      expect(queue1.pause).toBeInstanceOf(Function);
      expect(queue1.start).toBeInstanceOf(Function);
    });

  });

  describe('methods', () => {
    let queue1;
    const mockFn1 = jest.fn();

    beforeEach(() => {
      queue1 = queue();
      mockFn1.mockClear();
    });

    it('should set a new timer when .start() is called', () => {
      expect(queue1.timer).toBe(null);
      // this.queue.pause();
      // expect().isNull(this.queue.timer);
      queue1.start();
      expect(queue1.timer).not.toBe(null);
      queue1.pause();
    });

    it('should call .flush() when .check() is called and capacity is == config.capacity', () => {
      queue1.pause();
      queue1.capacity = 1;
      queue1.config.capacity = 1;
      queue1.flush = mockFn1;
      queue1.check();
      expect(mockFn1).toBeCalled();
    });

    it('should call .pause() when .check() is called and config.interval == 0', () => {
      queue1.pause();
      queue1.config.interval = 0;
      queue1.pause = mockFn1;
      queue1.check();
      expect(mockFn1).toBeCalled();
    });

    it('should clear timer when .pause() is called', () => {
      expect(queue1.timer).toBe(null);
      queue1.start();
      expect(queue1.timer).not.toBe(null);
      queue1.pause();
      expect(queue1.timer).toBe(null);
    });

    it('should clear timer when config.interval is set to 0', () => {
      queue1.start();
      expect(queue1.timer).not.toBe(null);
      queue1.config.interval = 0;
      queue1.check();
      expect(queue1.timer).toBe(null);
    });

  });

});
