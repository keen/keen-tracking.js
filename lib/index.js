var Emitter = require('component-emitter');

var root = this;
var previousKeen = root.Keen;

var Keen = {
  version: '__VERSION__'
};

Keen.noConflict = function(){
  root.Keen = previousKeen;
  return Keen;
};

Emitter(Keen);

module.exports = Keen;
