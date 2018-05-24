const files = `<rootDir>/test/unit/modules/*${
  process.env.TEST_ENV ? `-${process.env.TEST_ENV}-` : ``
}*.js`;

module.exports = {
  verbose: true,
  bail: true,
  testMatch: [files],
  testEnvironment: process.env.TEST_ENV || 'jsdom'
};
