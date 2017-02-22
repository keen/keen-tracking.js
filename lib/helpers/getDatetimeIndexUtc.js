var getDateTimeIndex = require('./getDateTimeIndex');

function getDateTimeIndexUtc(input){
  var date = input || new Date();
  var utcShiftedDate = new Date(date.getTime() + date.getTimezoneOffset() * 6e4);

  return getDateTimeIndex(utcShiftedDate);
}

module.exports = getDateTimeIndexUtc;
