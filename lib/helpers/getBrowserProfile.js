import { getBattery } from './getBattery';
import { getMediaDevices } from './getMediaDevices';
import { getScreenProfile } from './getScreenProfile';
import { getWindowProfile } from './getWindowProfile';

export function getBrowserProfile() {
  // MediaDevices and BatteryManager supported
  if ((navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
    && ('getBattery' in navigator || ('battery' in navigator && 'Promise' in window))) {
      return Promise.all([getBattery(), getMediaDevices()])
      .then((data) => {
        const [ battery, mediaDevices ] = data;
        const browserProfile = getBrowserData();
    
        browserProfile.battery = battery;
        browserProfile.mediaDevices = mediaDevices;
        return browserProfile;
      });
  }

  // MediaDevices supported
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    return getMediaDevices()
    .then((data) => {
      const browserProfile = getBrowserData();
  
      browserProfile.mediaDevices = data;
      return browserProfile;
    });
  }

  // BatteryManager supported
  if ('getBattery' in navigator || ('battery' in navigator && 'Promise' in window)) {
    return getBattery()
      .then((data) => {
        const browserProfile = getBrowserData();
    
        browserProfile.battery = data;
        return browserProfile;
      });
  }

  // none of the above supported
  return getBrowserData();
}

function getDocumentDescription() {
  var el;
  if (document && typeof document.querySelector === 'function') {
    el = document.querySelector('meta[name="description"]');
  }
  return el ? el.content : '';
}

function getConnection() {
  return navigator.connection || navigator.mozConnection ||
    navigator.webkitConnection || navigator.msConnection;
}

function getBrowserData() {
  return {
    'activeVRDisplays'  : navigator.activeVRDisplays,
    'connection' : getConnection(),
    'cookies'    : ('undefined' !== typeof navigator.cookieEnabled) ? navigator.cookieEnabled : false,
    'codeName'   : navigator.appCodeName,
    'description': getDocumentDescription(),
    'deviceMemory'  : navigator.deviceMemory,
    'doNotTrack' : navigator.doNotTrack,
    'hardwareConcurrency' : navigator.hardwareConcurrency,
    'language'   : navigator.language,
    'maxTouchPoints': navigator.maxTouchPoints,
    'name'       : navigator.appName,
    'online'     : navigator.onLine,
    'platform'   : navigator.platform,
    'useragent'  : navigator.userAgent,
    'version'    : navigator.appVersion,
    'screen'     : getScreenProfile(),
    'window'     : getWindowProfile()
  }
}
