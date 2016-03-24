var Cookies = require('js-cookie');
var json = require('./json');
var extend = require('./extend');

module.exports = cookie;

function cookie(str){
  if (!arguments.length) return;
  if (this instanceof cookie === false) {
    return new cookie(str);
  }

  this.config = {
    key: str,
    options: {
      expires: 365
    }
  };
  this.data = this.get();
  this.enabled = true;
  return this;
}

cookie.prototype.get = function(str){
  var data = {};

  if (Cookies.get(this.config.key)) {
    data = json.parse(Cookies.get(this.config.key));
  }
  if (str) {
    return (typeof data[str] !== 'undefined') ? data[str] : null;
  }
  else {
    return data;
  }
};

cookie.prototype.set = function(str, value, daysUntilExpire){
  if (!arguments.length || !this.enabled) return this;
  if (typeof str === 'string'  && arguments.length === 2) {
    this.data[str] = value ? value : null;
  }
  else if (typeof str === 'object' && arguments.length === 1) {
    extend(this.data, str);
  }
  var extraOptions = {};
  if (daysUntilExpire) { extraOptions.expires = daysUntilExpire };
  Cookies.set(this.config.key, this.data, extend(this.config.options, extraOptions));
  return this;
};

cookie.prototype.expire = function(){
  Cookies.remove(this.config.key);
  this.data = {};
  return this;
};

cookie.prototype.options = function(obj){
  if (!arguments.length) return this.config.options;
  this.config.options = (typeof obj === 'object') ? obj : {};
  return this;
};