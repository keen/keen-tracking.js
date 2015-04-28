var assert = require('proclaim');
var Keen = require('../../../index');

describe('Keen event emitter system', function(){

  beforeEach(function(){
    // Clear out events from previous tests
    Keen.off();
  });

  describe('#on', function(){
    it('should attach custom event listeners with #on', function(){
      Keen.on('event', function(){});
      assert.isArray(Keen.listeners());
    });
  });

  describe('#trigger', function(){
    it('should call bound functions when triggered', function(done){
      // var callback = chai.spy();
      var count = 0;
      Keen.on('event', function(){
        count++;
        if (count === 1) {
          done();
        }
        else {
          throw Error('Called incorrectly');
        }
      });
      Keen.emit('event');
      // expect(callback).to.have.been.called.once;
    });

    it('should pass arguments to bound functions when triggered', function(done){
      // var callback = chai.spy(),
      var payload = { status: 'ok' }, count = 0;
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
      // expect(callback).to.have.been.called.once.with(payload);
    });

    it('should call bound functions multiple when triggered multiple times', function(){
      // var callback = chai.spy();
      var count = 0;
      Keen.on('event', function(){
        count++;
      });
      Keen.emit('event');
      Keen.emit('event');
      Keen.emit('event');
      assert.equal(count, 3);
      // expect(callback).to.have.been.called.exactly(3);
    });
  });

  describe('#off', function(){
    it('should remove all listeners for an event name with #off(name)', function(){
      // var callback = chai.spy();
      var count = 0;
      function callback(){
        count++;
      };
      Keen.on('event', callback);
      Keen.on('event', callback);
      Keen.off('event');
      Keen.emit('event');
      assert.equal(count, 0);
      // expect(callback).to.not.have.been.called.once;
    });

    it('should remove specified listeners with #off(name, callback)', function(){
      // var callback = chai.spy(),
      var count = 0;
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
      assert.equal(count, 1);
      // expect(callback).to.have.been.called.once;
    });
  });

  describe('#once', function() {
    it('should call once handlers once when triggered', function(){
      var countA = 0, countB = 0;
      function callbackA(){
        countA++;
      }
      function callbackB(){
        countB++;
      }
      Keen.once('event', callbackA);
      Keen.once('event', callbackB);
      Keen.emit('event');
      assert.equal(countA, 1);
      assert.equal(countB, 1);
      // expect(callbackA).to.have.been.called.once;
      // expect(callbackB).to.have.been.called.once;
      Keen.emit('event');
      assert.equal(countA, 1);
      assert.equal(countB, 1);
      // expect(callbackA).to.have.been.called.once;
      // expect(callbackB).to.have.been.called.once;
    });
  });
});
