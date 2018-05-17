
import Keen from '../../../../lib/server';

describe('Keen event emitter system', () => {

  beforeEach(() => {
    // Clear out events from previous tests
    Keen.off();
  });

  describe('#on', () => {
    it('should attach custom event listeners with #on', () => {
      Keen.on('event', () => {});
      expect().isArray(Keen.listeners());
    });
  });

  describe('#trigger', () => {
    it('should call bound functions when triggered', function(done){
      const count = 0;
      Keen.on('event', () => {
        count++;
        if (count === 1) {
          done();
        }
        else {
          throw Error('Called incorrectly');
        }
      });
      Keen.emit('event');
    });

    it('should pass arguments to bound functions when triggered', function(done){
      const payload = { status: 'ok' }, count = 0;
      Keen.on('event', function(data){
        count++;
        if (count === 1 && data.status === 'ok') {
          done();
        }
        else {
          throw Error('Called incorrectly');
        }
      });
      Keen.emit('event', payload);
    });

    it('should call bound functions multiple when triggered multiple times', () => {
      // const callback = chai.spy();
      const count = 0;
      Keen.on('event', () => {
        count++;
      });
      Keen.emit('event');
      Keen.emit('event');
      Keen.emit('event');
      expect().equal(count, 3);
      // expect(callback).to.have.been.called.exactly(3);
    });
  });

  describe('#off', () => {
    it('should remove all listeners for an event name with #off(name)', () => {
      const count = 0;
      function callback(){
        count++;
      };
      Keen.on('event', callback);
      Keen.on('event', callback);
      Keen.off('event');
      Keen.emit('event');
      expect().equal(count, 0);
    });

    it('should remove specified listeners with #off(name, callback)', () => {
      const count = 0;
      function callback(){
        count++;
      }
      function fakeback(){
        throw Error('Don\'t call me!');
      };
      Keen.on('event', callback);
      Keen.on('event', fakeback);
      Keen.off('event', fakeback);
      Keen.emit('event');
      expect().equal(count, 1);
    });
  });

  describe('#once', function() {
    it('should call once handlers once when triggered', () => {
      const countA = 0, countB = 0;
      function callbackA(){
        countA++;
      }
      function callbackB(){
        countB++;
      }
      Keen.once('event', callbackA);
      Keen.once('event', callbackB);
      Keen.emit('event');
      expect().equal(countA, 1);
      expect().equal(countB, 1);
      Keen.emit('event');
      expect().equal(countA, 1);
      expect().equal(countB, 1);
    });
  });
});
