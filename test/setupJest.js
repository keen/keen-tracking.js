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
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
jest.mock('promise-polyfill', () => {});
jest.mock('promise-polyfill/src/polyfill', () => {});
