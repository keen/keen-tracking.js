module.exports = deepExtend;

function deepExtend(target){
  for (var i = 1; i < arguments.length; i++) {
    // Copy unique items from incoming array
    if (target instanceof Array && arguments[i] instanceof Array) {
      for (var j = 0; j < arguments[i].length; j++) {
        if (target.indexOf(arguments[i][j]) < 0) {
          target.push(arguments[i][j]);
        }
      }
    }
    // Blend objects
    else {
      for (var prop in arguments[i]){
        // Recurse when both contain objects of same name and incoming is not a null object
        if ('undefined' !== typeof target[prop] && 'object' === typeof arguments[i][prop] && arguments[i][prop] !== null) {
          deepExtend(target[prop], clone(arguments[i][prop]));
        }
        // Otherwise just copy it over...
        else if (arguments[i][prop] !== undefined) {
          target[prop] = clone(arguments[i][prop]);
        }
      }
    }
  }
  return target;
}

function clone(input){
  return JSON.parse( JSON.stringify(input) );
}
