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

// ------------------------
// Utils
// ------------------------
extend(Keen.utils, {
  'each'       : require('./utils/each'),
  'extend'     : extend,
  'timer'      : require('./utils/timer')
});

Keen.version = require('../package.json').version;

module.exports = Keen;
