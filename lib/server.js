var Keen = require('./');
var extend = require('./utils/extend');

// ------------------------
// Methods
// ------------------------
extend(Keen.Client.prototype, require('./record-server'));

module.exports = Keen;
