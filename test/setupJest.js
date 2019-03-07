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
const mockStorage = {};
const localStorage = {
  setItem: (key, val) => Object.assign(mockStorage, {[key]: val}),
  getItem: key => mockStorage[key],
  removeItem: key => { delete mockStorage[key]; },
  clear: () => mockStorage,
};
global.localStorage = localStorage;

jest.mock('promise-polyfill', () => {});
jest.mock('promise-polyfill/src/polyfill', () => {});
