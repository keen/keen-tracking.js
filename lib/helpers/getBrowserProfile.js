import { getBattery } from './getBattery';
import { getMediaDevices } from './getMediaDevices';
import { getScreenProfile } from './getScreenProfile';
import { getWindowProfile } from './getWindowProfile';

export function getBrowserProfile() {
  return {
    'activeVRDisplays'  : navigator.activeVRDisplays,
    'battery'    : 'battery', // <--
    'connection' : getConnection(),
    'cookies'    : ('undefined' !== typeof navigator.cookieEnabled) ? navigator.cookieEnabled : false,
    'codeName'   : navigator.appCodeName,
    'description': getDocumentDescription(),
    'deviceMemory'  : navigator.deviceMemory,
    'doNotTrack' : navigator.doNotTrack,
    'hardwareConcurrency' : navigator.hardwareConcurrency,
    'language'   : navigator.language,
    'maxTouchPoints': navigator.maxTouchPoints,
    'mediaDevices'  : 'mediaDevices', // <---
    'name'       : navigator.appName,
    'online'     : navigator.onLine,
    'platform'   : navigator.platform,
    'useragent'  : navigator.userAgent,
    'version'    : navigator.appVersion,
    'screen'     : getScreenProfile(),
    'window'     : getWindowProfile()
  }
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
