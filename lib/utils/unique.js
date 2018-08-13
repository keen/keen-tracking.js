import 'promise-polyfill/src/polyfill';

import md5 from './md5';
import { getFromCache, saveToCache } from './cache-browser';

import configDefault from '../config-default.js';

let uniqueIds = [];

export const isUnique = (customCacheConfig, extendedEventBody) => {
  const configCache = { ...configDefault.cache, ...customCacheConfig.cache };
  const stringifiedEvent = JSON.stringify(extendedEventBody);
  const { hashingMethod } = configCache;
  const hash = hashingMethod && hashingMethod.toLowerCase() === 'md5'
    ? md5(stringifiedEvent) : stringifiedEvent;
  const expiryTime = configCache.maxAge ? (Date.now() + configCache.maxAge) : undefined;
  const item = {
    hash,
    expiryTime
  };
  if (expiryTime){
    const now = Date.now();
    uniqueIds = uniqueIds.filter(item => item.expiryTime > now);
  }

  const alreadySentEvent = uniqueIds.find(item => item.hash === hash);
  if (alreadySentEvent) {
    if (alreadySentEvent.expiryTime && alreadySentEvent.expiryTime < Date.now()) {
      uniqueIds = uniqueIds.filter(item => item.hash !== hash);
    } else {
      return Promise.resolve(false);
    }
  }
  uniqueIds.push(item);
  if (configCache.storage && configCache.storage.toLowerCase() === 'indexeddb') {
    return getFromCache(hash, configCache).then(alreadySentEvent => {
      if (alreadySentEvent) {
        return false;
      }
      saveToCache(hash, configCache);
      return true;
    });
  }

  return Promise.resolve(true);
}

export default isUnique;
