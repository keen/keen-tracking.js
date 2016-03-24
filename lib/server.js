var Keen = require('./');
var extend = require('./utils/extend');

// ------------------------
// Methods
// ------------------------
extend(Keen.prototype, require('./record-events-server'));
extend(Keen.prototype, require('./defer-events'));
extend(Keen.prototype, {
  'extendEvent': require('./extend-events').extendEvent,
  'extendEvents': require('./extend-events').extendEvents
});

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
  'deepExtend' : require('./utils/deepExtend'),
  'timer'      : require('./utils/timer')
});

Keen.version = require('../package.json').version;

module.exports = Keen;
