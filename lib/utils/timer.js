export function timer(num){
  if (this instanceof timer === false) {
    return new timer(num);
  }
  this.count = num || 0;
  return this;
}

timer.prototype.start = function(){
  var self = this;
  this.pause();
  this.interval = setInterval(function(){
    self.count++;
  }, 1000);
  return this;
};

timer.prototype.pause = function(){
  clearInterval(this.interval);
  return this;
};

timer.prototype.value = function(){
  return this.count;
};

timer.prototype.clear = function(){
  this.count = 0;
  return this;
};
