import md5 from './md5';
import { getFromCache, saveToCache } from './cache-browser';

let uniqueIds = [];

export const isUnique = (config, extendedEventBody) => {
  const stringifiedEvent = JSON.stringify(extendedEventBody);
  const hash = config.cache.hashingMethod && config.cache.hashingMethod.toLowerCase() === 'md5'
    ? md5(stringifiedEvent) : stringifiedEvent;
  const expiryTime = config.cache.maxAge ? (Date.now() + config.cache.maxAge) : undefined;
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

  if (config.cache.storage && config.cache.storage.toLowerCase() === 'indexeddb') {
    return getFromCache(hash, config).then(alreadySentEvent => {
      if (alreadySentEvent) {
        return false;
      }
      saveToCache(hash, config);
      return true;
    });
  }

  return Promise.resolve(true);
}

export default isUnique;
