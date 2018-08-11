global.fetch = require('jest-fetch-mock');
global.navigator = {
  sendBeacon: jest.mock()
};
jest.mock('promise-polyfill', () => {});
jest.mock('promise-polyfill/src/polyfill', () => {});
