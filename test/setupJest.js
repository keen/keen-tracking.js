global.fetch = require('jest-fetch-mock');
global.IntersectionObserver = function(callback, options = {}) {
  this.callback = callback;
}
global.IntersectionObserver.prototype.observe = jest.mock();
global.IntersectionObserver.prototype.simulate = function(elements){
  this.callback(elements);
};
global.navigator = {
  sendBeacon: jest.mock()
};
jest.mock('promise-polyfill', () => {});
jest.mock('promise-polyfill/src/polyfill', () => {});
