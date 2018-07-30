const files = `<rootDir>/test/unit/modules/*${
  process.env.TEST_ENV ? `-${process.env.TEST_ENV}-` : ``
}*.js`;

module.exports = {
  verbose: true,
  bail: true,
  testMatch: [files],
  testEnvironment: process.env.TEST_ENV || 'jsdom',
  automock: false,
  setupFiles: [
    "./test/setupJest.js"
  ],
  transform: {
      "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!promise-polyfill|whatwg-fetch)/"
  ]
};
