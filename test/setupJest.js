global.fetch = require('jest-fetch-mock');

jest.mock('promise-polyfill', () => {});
jest.mock('promise-polyfill/src/polyfill', () => {});
