var Cookies = require('cookies-js');
var JSON2 = require('JSON2');
var extend = require('./extend');

module.exports = cookie;

function cookie(str){
  if (!arguments.length) return;
  if (this instanceof cookie === false) {
    return new cookie(str);
  }

  this.config = {
    key: str,
    options: {}
  };
  this.data = this.get();
  return this;
}

cookie.prototype.get = function(str){
  var data = Cookies.get(this.config.key) ? JSON2.parse( decodeURIComponent(Cookies.get(this.config.key)) ) : {};
  return (str && typeof data[str] !== 'undefined') ? data[str] : data;
};

cookie.prototype.set = function(str, value){
  if (!arguments.length) return this;
  if ('string' === typeof str && arguments.length === 2) {
    this.data[str] = value ? value : null;
  }
  else if ('object' === typeof str && arguments.length === 1) {
    extend(this.data, str);
  }
  Cookies.set(this.config.key, encodeURIComponent( JSON2.stringify(this.data) ), this.config.options);
  return this;
};

cookie.prototype.expire = function(){
  Cookies.expire(this.config.key);
  this.data = {};
  return this;
};

cookie.prototype.options = function(obj){
  if (!arguments.length) return this.config.options;
  this.config.options = (typeof obj === 'object') ? obj : {};
  return this;
};
