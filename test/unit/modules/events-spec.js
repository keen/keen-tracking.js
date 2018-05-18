import Keen from '../../../lib/server';

describe('Keen event emitter system', () => {
  const mockFn1 = jest.fn();
  const mockFn2 = jest.fn();

  beforeEach(() => {
    // Clear out events from previous tests
    Keen.off();
    mockFn1.mockReset();
    mockFn2.mockReset();
  });

  describe('#on', () => {
    it('should attach custom event listeners with #on', () => {
      Keen.on('event', () => {});
      expect(Keen.listeners()).toBeInstanceOf(Array);
    });
  });

  describe('#trigger', () => {
    it('should call bound functions when triggered', () => {
      Keen.on('event', mockFn1);
      Keen.emit('event');
      expect(mockFn1).toBeCalled();
    });

    it('should pass arguments to bound functions when triggered', () => {
      const payload = { status: 'ok' };
      Keen.on('event', mockFn1);
      Keen.emit('event', payload);
      expect(mockFn1).toBeCalledWith(payload);
    });

    it('should call bound functions multiple when triggered multiple times', () => {
      // const callback = chai.spy();
      Keen.on('event', mockFn1);
      Keen.emit('event');
      Keen.emit('event');
      Keen.emit('event');
      expect(mockFn1.mock.calls.length).toBe(3);
    });
  });

  describe('#off', () => {
    it('should remove all listeners for an event name with #off(name)', () => {
      Keen.on('event', mockFn1);
      Keen.on('event', mockFn1);
      Keen.off('event');
      Keen.emit('event');
      expect(mockFn1.mock.calls.length).toBe(0);
    });

    it('should remove specified listeners with #off(name, callback)', () => {
      Keen.on('event', mockFn1);
      Keen.on('event', mockFn2);
      Keen.off('event', mockFn2);
      Keen.emit('event');
      expect(mockFn1).toBeCalled();
      expect(mockFn2).not.toBeCalled();
    });
  });

  describe('#once', function() {
    it('should call once handlers once when triggered', () => {
      Keen.once('event', mockFn1);
      Keen.once('event', mockFn2);
      Keen.emit('event');
      expect(mockFn1.mock.calls.length).toBe(1);
      expect(mockFn2.mock.calls.length).toBe(1);
      Keen.emit('event');
      Keen.emit('event');
      expect(mockFn1.mock.calls.length).toBe(1);
      expect(mockFn2.mock.calls.length).toBe(1);
    });
  });
});
