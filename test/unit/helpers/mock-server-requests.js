var nock = require('nock'),
    config = require('./client-config');

var baseUrl = 'https://api.keen.io',
    resHeader = { 'Content-Type': 'application/json' };

module.exports = {
  'post': mockPostRequest,
  'get': mockGetRequest,
  'del': mockDelRequest
};

function mockPostRequest(path, responseCode, responseBody, delay){
  nock(baseUrl)
    .post('/3.0/projects/' + config.projectId + path)
    .delay(delay || 0)
    .reply(responseCode, responseBody, resHeader);
}

function mockGetRequest(path, responseCode, responseBody, delay){
  nock(baseUrl)
    .get('/3.0/projects/' + config.projectId + path)
    .delay(delay || 0)
    .reply(responseCode, responseBody, resHeader);
}

function mockDelRequest(path, responseCode, responseBody, delay) {
  nock(baseUrl)
    .delete('/3.0/projects/' + config.projectId + path)
    .delay(delay || 0)
    .reply(responseCode, responseBody, resHeader);
}
