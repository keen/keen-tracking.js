const pkg = require('./package');

module.exports = {
  files: './**',
  ignore: [
    './node_modules/**',
    './replace-config.js'
  ],
  from: RegExp(`${pkg.name}-(.*)\.min\.js`, 'g'),
  to: `${pkg.name}-${pkg.version}.min.js`,
}
