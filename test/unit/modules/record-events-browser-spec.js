var assert = require('proclaim');
var JSON2 = require('JSON2');

var Keen = require('../../../lib/browser');
var config = require('../helpers/client-config');

// Keen.debug = true;

describe('.recordEvent(s) methods (browser)', function() {

  describe('.recordEvent', function() {

    beforeEach(function() {
      this.client = new Keen({
        projectId: config.projectId,
        writeKey: config.writeKey,
        requestType: 'xhr',
        host: config.host,
        protocol: config.protocol
      });
      this.postUrl = this.client.url(this.client.writePath() + '/' + encodeURIComponent(config.collection));

      // Hack for IE9 request shim
      if ('undefined' !== typeof document && document.all) {
        this.postUrl = this.postUrl.replace('https', 'http');
      }
    });

    it('should not send events if set to \'false\'', function(){
      Keen.enabled = false;
      this.client.recordEvent('not-going', { test: 'data' }, function(err, res){
        assert.isNotNull(err);
        assert.isNull(res);
      });
      Keen.enabled = true;
    });

    it('should return an error message if event collection is omitted', function(){
      this.client.recordEvent(null, { test: 'data' }, function(err, res){
        assert.isNotNull(err);
        assert.isNull(res);
      });
    });

    describe('via XHR/CORS (if supported)', function(){

      it('should send a POST request to the API using XHR', function() {
        var count = 0;
        var headers = {
          'Content-Type': 'application/json'
        };
        this.client.recordEvent(config.collection + '_succeed', config.properties, function(err, res){
          count++;
          assert.isNull(err);
          assert.isNotNull(res);
          assert.equal(count, 1);
        });
      });

      it('should fire the callback on error', function() {
        var count = 0;
        var headers = {
          'Content-Type': 'application/json'
        };
        this.client.config.writeKey = 'nope';
        this.client.recordEvent(config.collection + '_error', config.properties, function(err, res){
          count++;
          assert.isNotNull(err);
          assert.isNull(res);
          assert.equal(count, 1);
        });
      });

    });

  });

  describe('.recordEvents', function() {

    beforeEach(function() {
      this.client = new Keen({
        projectId: config.projectId,
        writeKey: config.writeKey,
        requestType: 'xhr',
        host: config.host,
        protocol: config.protocol 
      });
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
      this.batchResponse = JSON2.stringify({
        click: [
          { 'success': true }
        ],
        pageview: [
          { 'success': true },
          { 'success': true }
        ]
      });
    });

    it('should not send events if Keen.enabled is set to \'false\'', function(){
      Keen.enabled = false;
      this.client.recordEvents(this.batchData, function(err, res){
        assert.isNotNull(err);
        assert.isNull(res);
      });
      Keen.enabled = true;
    });

    it('should return an error message if first argument is not an object', function(){
      this.client.recordEvents([], function(err, res){
        assert.isNotNull(err);
        assert.isNull(res);
      });
      this.client.recordEvents('', function(err, res){
        assert.isNotNull(err);
        assert.isNull(res);
      });
    });

    describe('via XHR/CORS (if supported)', function(){

      beforeEach(function() {
        this.postUrl = this.client.url(this.client.writePath());
      });

      it('should send a POST request to the API using XHR', function() {
        var count = 0;
        this.client.recordEvents(this.batchData, function(err, res){
          count++;
          assert.isNull(err);
          assert.isNotNull(res);
          assert.equal(count, 1);
        });
      });

      it('should call the error callback on error', function() {
        var count = 0;
        this.client.config.writeKey = 'nope';
        this.client.recordEvents(this.batchData, function(err, res){
          count++;
          assert.isNotNull(err);
          assert.isNull(res);
          assert.equal(count, 1);
        });
      });

    });

  });

});
