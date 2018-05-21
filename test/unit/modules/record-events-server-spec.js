var chai from 'chai'),
    expect from 'chai').expect,
    spies from 'chai-spies');

chai.use(spies);

import Keen from '../../../../lib/server';
import config from '../helpers/client-config';

// Keen.debug = true;

describe('.recordEvent(s) methods (server)', () => {
  let client;

  beforeEach(() => {
    client = new Keen({
      projectId: config.projectId,
      writeKey: config.writeKey
    });
  });

  // afterEach(() => {});

  describe('.recordEvent()', () => {

    it('should make an HTTP request',function(done){
      client.recordEvent( config.collection, config.properties, (err, res) => {
        expect(err).to.be.null;
        expect(res).to.deep.equal( JSON.parse(config.responses.success) );
        done();
      });
    });

    it('should default to HTTPS',function(done){
      client.config.host = 'nonexistenthost';
      client.recordEvent( config.collection, config.properties, function(err) {
        expect(err.port).to.equal(443);
        done();
      });
    });

    it('should respect client HTTP protocol',function(done){
      client.config.host = 'nonexistenthost';
      client.config.protocol = 'http';
      client.recordEvent( config.collection, config.properties, function(err) {
        expect(err.port).to.equal(80);
        done();
      });
    });

    it('should not make an HTTP request if Keen.enabled is set to \'false\'', function(done){
      Keen.enabled = false;
      client.recordEvent( config.collection, config.properties, (err, res) => {
        expect(err).to.exist;
        expect(res).to.not.exist;
        done();
      });
      Keen.enabled = true;
    });

    it('should return an error message if event collection is omitted', function(done){
      client.recordEvent( null, config.properties, (err, res) => {
        expect(err).to.exist;
        expect(res).to.not.exist;
        done();
      });
    });

  });

  describe('.recordEvents()', () => {

    beforeEach(() => {
      this.batchData = {
        'pageview': [
          { page: 'this one' },
          { page: 'same!' }
        ],
        'click': [
          { page: 'tada!' },
          { page: 'same again' }
        ]
      };
      this.batchResponse = {
        click: [
          { 'success': true },
          { 'success': true }
        ],
        pageview: [
          { 'success': true },
          { 'success': true }
        ]
      };
    });

    it('should make an HTTP request',function(done){
      const self = this;
      self.client.recordEvents( self.batchData, (err, res) => {
        expect(err).to.be.null;
        expect(res).to.deep.equal( self.batchResponse );
        done();
      });
    });

    it('should not send events if Keen.enabled is set to \'false\'', () => {
      Keen.enabled = false;
      client.recordEvents(this.batchData, (err, res) => {
        expect(err).to.exist;
        expect(res).to.be.null;
      });
      Keen.enabled = true;
    });

    it('should return an error message if first argument is not an object', () => {
      client.recordEvents([], (err, res) => {
        expect(err).to.exist;
        expect(res).to.be.null;
      });
    });

  });

});
