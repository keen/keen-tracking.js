import Keen from '../../../lib/index';
import config from '../helpers/client-config';
// Keen.debug = true;

describe('Keen (browser)', () => {
  let client1;
  let matchUrlBase;

  beforeEach(() => {
    client1 = new Keen({
      projectId: config.projectId,
      writeKey: config.writeKey
    });
    matchUrlBase = client1.config.protocol + '://' + client1.config.host;
  });

  describe('client defaults', () => {

    it('should have sensible values', () => {
      expect(client1.config.host).toBe('api.keen.io');
      //expect().toBe(client1.config.protocol, 'https');
      expect(client1.config.requestType).toBe('jsonp');
    });

  });

  describe('.configure()', () => {

    it('should reconfigure an existing client', () => {
      client1.configure({
        projectId: '123',
        writeKey: '456',
        protocol: 'http',
        host: 'none'
      });
      expect(client1.projectId()).toBe('123');
      expect(client1.writeKey()).toBe('456');
      expect(client1.config.host).toBe('none');
      expect(client1.config.protocol).toBe('http');
    });

  });

  describe('.projectId()', () => {

    it('should get projectId', () => {
      expect(client1.projectId()).toBe(config.projectId);
    });

    it('should set projectId', () => {
      client1.projectId('123')
      expect(client1.projectId()).toBe('123');
      client1.projectId(config.projectId)
      expect(client1.projectId()).toBe(config.projectId);
    });

    it('should get writeKey', () => {
      expect(client1.writeKey()).toBe(config.writeKey);
    });

    it('should set writeKey', () => {
      client1.writeKey('123')
      expect(client1.writeKey()).toBe('123');
      client1.writeKey(config.writeKey)
      expect(client1.writeKey()).toBe(config.writeKey);
    });

  });

  describe('.resources()', () => {

    it('should return the current resources object', () => {
      expect(client1.resources()).toEqual(Keen.resources);
    });

    it('should set a new resource', () => {
      client1.resources({
        'test': '{protocol}://{host}/{projectId}'
      });
      expect(client1.resources()['test']).toBe('{protocol}://{host}/{projectId}');
    });

    it('should unset a given resource', () => {
      client1.resources({
        'test': null
      });
      expect(client1.resources()['test']).toBe(null);
    });

  });

  describe('.url()', () => {

    it('should return a base URL when no arguments are provided', () => {
      expect(client1.url()).toBe(matchUrlBase);
    });

    it('should return a known resource URL when a matching name is provided', () => {
      const url = client1.url('events');
      const match = matchUrlBase + '/3.0/projects/' + client1.projectId() + '/events';
      expect(url).toBe(match);
    });

    it('should return a known resource URL with query string when all arguments are provided', () => {
      const url = client1.url('events', { test: 123 });
      const match = matchUrlBase + '/3.0/projects/' + client1.projectId() + '/events';
      expect(url).toBe(match + '?test=123');
    });

    it('should return a constructed URL when one argument is provided', () => {
      const url = client1.url('/test/' + config.collection);
      expect(url).toBe(matchUrlBase + '/test/' + config.collection);
    });

    it('should return a constructed URL with query string when all arguments are provided', () => {
      const url = client1.url('/events/' + config.collection, { test: 123});
      expect(url).toBe(matchUrlBase + '/events/' + config.collection + '?test=123');
    });

  });

});
