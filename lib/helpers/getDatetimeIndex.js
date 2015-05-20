function getDateTimeIndex(input){
  var date = input || new Date();
  return {
    'hour-of-day'  : date.getHours(),
    'day-of-week'  : parseInt( 1 + date.getDay() ),
    'day-of-month' : date.getDate(),
    'month'        : parseInt( 1 + date.getMonth() ),
    'year'         : date.getFullYear()
  };
}

module.exports = getDateTimeIndex;
