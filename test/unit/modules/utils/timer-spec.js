import { timer } from '../../../../lib/utils/timer';

describe('Keen.utils.timer', () => {
  let timer1;

  beforeEach(() => {
    timer1 = timer();
  });

  afterEach(() => {
    timer1.clear();
  });

  describe('constructor', () => {

    it('should return a constructed object', () => {
      expect(timer1).toBeInstanceOf(Object);
    });

    it('should have internal count property of zero', () => {
      expect(timer1.count).toBe(0);
    });

    it('should have internal count property matching provided value', () => {
      const newTimer = timer(123);
      expect(newTimer.count).toBe(123);
    });

    it('should have prototype methods', () => {
      expect(timer1.start).toBeInstanceOf(Function);
      expect(timer1.pause).toBeInstanceOf(Function);
      expect(timer1.value).toBeInstanceOf(Function);
      expect(timer1.clear).toBeInstanceOf(Function);
    });

  });

  describe('methods', () => {

    it('should run the timer and return a value', () => {
      timer1.start();
      expect(timer1.interval).toBeGreaterThan(0);
    });

    it('should clear the value of the timer', () => {
      timer1.clear();
      expect(timer1.value()).toBe(0);
    });

  });

});
