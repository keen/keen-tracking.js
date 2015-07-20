var assert = require('proclaim');
var Keen = require('../../../lib/index');
var config = require('../helpers/client-config');

// Keen.debug = true;

describe('Keen (browser)', function() {

  beforeEach(function() {
    this.client = new Keen({
      projectId: config.projectId,
      writeKey: config.writeKey
    });
  });

  describe('client defaults', function() {

    it('should have sensible values', function(){
      assert.equal(this.client.config.host, 'api.keen.io');
      //assert.equal(this.client.config.protocol, 'https');
      assert.equal(this.client.config.requestType, 'jsonp');
      assert.equal(this.client.writePath(), '/3.0/projects/' + config.projectId + '/events');
    });

  });

  describe('#configure', function(){

    it('should reconfigure an existing client', function(){
      this.client.configure({
        projectId: '123',
        writeKey: '456',
        protocol: 'http',
        host: 'none',
        writePath: '/customWritePath'
      });
      assert.equal(this.client.projectId(), '123');
      assert.equal(this.client.writeKey(), '456');
      assert.equal(this.client.config.host, 'none');
      assert.equal(this.client.config.protocol, 'http');
      assert.equal(this.client.writePath(), '/customWritePath');
    });

  });

  describe('#url', function(){

    beforeEach(function() {
      this.matchUrlBase = this.client.config.protocol + '://' + this.client.config.host;

      // Hack for IE9 request shim
      if ('undefined' !== typeof document && document.all) {
        this.matchUrlBase = this.matchUrlBase.replace('https', 'http');
      }
    });

    it('should return a base URL when no arguments are provided', function(){
      assert.equal(this.client.url(), this.matchUrlBase);
    });

    it('should return a resource URL when one argument is provided', function(){
      var url = this.client.url('/events/' + config.collection);
      assert.equal(url, this.matchUrlBase + '/events/' + config.collection);
    });

    it('should return a base URL with query string when all arguments are provided', function(){
      var url = this.client.url('/events/' + config.collection, { test: 123});
      assert.equal(url, this.matchUrlBase + '/events/' + config.collection + '?test=123');
    });

  });

  describe('#projectId', function(){

    it('should get projectId', function(){
      assert.equal(this.client.projectId(), config.projectId);
    });

    it('should set projectId', function(){
      this.client.projectId('123')
      assert.equal(this.client.projectId(), '123');
      this.client.projectId(config.projectId)
      assert.equal(this.client.projectId(), config.projectId);
    });

    it('should get writeKey', function(){
      assert.equal(this.client.writeKey(), config.writeKey);
    });

    it('should set writeKey', function(){
      this.client.writeKey('123')
      assert.equal(this.client.writeKey(), '123');
      this.client.writeKey(config.writeKey)
      assert.equal(this.client.writeKey(), config.writeKey);
    });

  });

});
