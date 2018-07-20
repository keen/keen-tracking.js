import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

import configDefault from '../config-default.js';

export default function(url, options) {
  const retriesLimit = (options.retry && options.retry.limit)
    ? options.retry.limit : configDefault.retry.limit;
  const retryDelay = (options.retry && options.retry.initialDelay)
    ? options.retry.initialDelay : configDefault.retry.initialDelay;
  const retryOn = (options.retry && options.retry.retryOnResponseStatuses)
    ? options.retry.retryOnResponseStatuses : configDefault.retry.retryOnResponseStatuses;
  let retriesCount = 0;

  if (options && options.retryOn) {
    if (!(options.retryOn instanceof Array)) {
      throw {
        name: 'ArgumentError',
        message: 'retryOn property expects an array'
      }
    }
  }

  return new Promise(function(resolve, reject) {
    const wrappedFetch = function(n) {
      fetch(url, options)
        .then(function(response) {
          if (retryOn.indexOf(response.status) === -1) {
            resolve(response);
          } else {
            if (n > 0) {
              retry();
            } else {
              reject(response);
            }
          }
        })
        .catch(function(error) {
          if (n > 0) {
            retry();
          } else {
            reject(error);
          }
        });
    };

    function retry() {
      retriesCount = retriesCount + 1;
      setTimeout(function() {
          wrappedFetch(retriesLimit - retriesCount);
        }, 2^retriesCount * retryDelay);
    }

    wrappedFetch(retriesLimit - retriesCount);
  });
};
