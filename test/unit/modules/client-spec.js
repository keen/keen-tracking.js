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
      expect().equal(this.client.config.host, 'api.keen.io');
      //expect().equal(this.client.config.protocol, 'https');
      expect().equal(this.client.config.requestType, 'jsonp');
    });

  });

  describe('.configure()', function(){

    it('should reconfigure an existing client', function(){
      this.client.configure({
        projectId: '123',
        writeKey: '456',
        protocol: 'http',
        host: 'none'
      });
      expect().equal(this.client.projectId(), '123');
      expect().equal(this.client.writeKey(), '456');
      expect().equal(this.client.config.host, 'none');
      expect().equal(this.client.config.protocol, 'http');
    });

  });

  describe('.projectId()', function(){

    it('should get projectId', function(){
      expect().equal(this.client.projectId(), config.projectId);
    });

    it('should set projectId', function(){
      this.client.projectId('123')
      expect().equal(this.client.projectId(), '123');
      this.client.projectId(config.projectId)
      expect().equal(this.client.projectId(), config.projectId);
    });

    it('should get writeKey', function(){
      expect().equal(this.client.writeKey(), config.writeKey);
    });

    it('should set writeKey', function(){
      this.client.writeKey('123')
      expect().equal(this.client.writeKey(), '123');
      this.client.writeKey(config.writeKey)
      expect().equal(this.client.writeKey(), config.writeKey);
    });

  });

  describe('.resources()', function(){
    beforeEach(function() {
      this.matchUrlBase = this.client.config.protocol + '://' + this.client.config.host;

      // Hack for IE9 request shim
      if ('undefined' !== typeof document && document.all) {
        this.matchUrlBase = this.matchUrlBase.replace('https', 'http');
      }
    });

    it('should return the current resources object', function(){
      expect().deepEqual(this.client.resources(), Keen.resources);
    });

    it('should set a new resource', function(){
      this.client.resources({
        'test': '{protocol}://{host}/{projectId}'
      });
      expect().equal(this.client.resources()['test'], '{protocol}://{host}/{projectId}');
    });

    it('should unset a given resource', function(){
      this.client.resources({
        'test': null
      });
      expect().equal(this.client.resources()['test'], null);
    });

  });

  describe('.url()', function(){

    beforeEach(function() {
      this.matchUrlBase = this.client.config.protocol + '://' + this.client.config.host;

      // Hack for IE9 request shim
      if ('undefined' !== typeof document && document.all) {
        this.matchUrlBase = this.matchUrlBase.replace('https', 'http');
      }
    });

    it('should return a base URL when no arguments are provided', function(){
      expect().equal(this.client.url(), this.matchUrlBase);
    });

    it('should return a known resource URL when a matching name is provided', function(){
      var url = this.client.url('events');
      var match = this.matchUrlBase + '/3.0/projects/' + this.client.projectId() + '/events';
      expect().equal(url, match);
    });

    it('should return a known resource URL with query string when all arguments are provided', function(){
      var url = this.client.url('events', { test: 123 });
      var match = this.matchUrlBase + '/3.0/projects/' + this.client.projectId() + '/events';
      expect().equal(url, match + '?test=123');
    });

    it('should return a constructed URL when one argument is provided', function(){
      var url = this.client.url('/test/' + config.collection);
      expect().equal(url, this.matchUrlBase + '/test/' + config.collection);
    });

    it('should return a constructed URL with query string when all arguments are provided', function(){
      var url = this.client.url('/events/' + config.collection, { test: 123});
      expect().equal(url, this.matchUrlBase + '/events/' + config.collection + '?test=123');
    });

  });

});
