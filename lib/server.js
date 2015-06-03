var Keen = require('./');
var extend = require('./utils/extend');

// ------------------------
// Methods
// ------------------------
extend(Keen.Client.prototype, require('./record-server'));

// ------------------------
// Helpers
// ------------------------
extend(Keen.helpers, {
  'getDatetimeIndex'   : require('./helpers/getDatetimeIndex'),
  'getUniqueId'        : require('./helpers/getUniqueId')
});

Keen.version = require('../package.json').version;

module.exports = Keen;
