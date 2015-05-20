var getScreenProfile = require('./getScreenProfile'),
    getWindowProfile = require('./getWindowProfile');

function getBrowserProfile(){
  return {
    'cookies'  : ('undefined' !== typeof navigator.cookieEnabled) ? navigator.cookieEnabled : false,
    'codeName' : navigator.appCodeName,
    'language' : navigator.language,
    'name'     : navigator.appName,
    'online'   : navigator.onLine,
    'platform' : navigator.platform,
    'useragent': navigator.userAgent,
    'version'  : navigator.appVersion,
    'screen'   : getScreenProfile(),
    'window'   : getWindowProfile()
  }
}

module.exports = getBrowserProfile;
