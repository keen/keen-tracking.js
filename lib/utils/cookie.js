import Cookies from 'js-cookie';
import extend from 'keen-core/lib/utils/extend';

export const cookie = function(str){
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
  return this;
}

cookie.prototype.get = function(str){
  var data = {};

  if (Cookies.get(this.config.key)) {
    data = Cookies.getJSON(this.config.key);
  }
  if (str && typeof data === 'object' && typeof data !== null) {
    return (typeof data[str] !== 'undefined') ? data[str] : null;
  }
  else {
    return data;
  }
};

cookie.prototype.set = function(str, value, options){
  if (!arguments.length || !this.enabled()) return this;
  if (typeof str === 'string' && arguments.length >= 2) {
    this.data[str] = value ? value : null;
  }
  else if (typeof str === 'object' && arguments.length === 1) {
    extend(this.data, str);
  }
  Cookies.set(
    this.config.key,
    this.data,
    extend(this.config.options, options || {})
  );
  return this;
};

cookie.prototype.expire = function(daysUntilExpire){
  if (daysUntilExpire) {
    Cookies.set(
      this.config.key,
      this.data,
      extend(this.config.options, { expires: daysUntilExpire })
    );
  } else {
    Cookies.remove(this.config.key);
    this.data = {};
  }
  return this;
};

cookie.prototype.options = function(obj){
  if (!arguments.length) return this.config.options;
  this.config.options = (typeof obj === 'object') ? obj : {};
  return this;
};

cookie.prototype.enabled = function(){
  return navigator.cookieEnabled;
};
