import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

import configDefault from '../config-default.js';
import Constants from '../constants.js';

export default function(url, options) {
  const config = {
    ...configDefault,
    ...(options.retry || {})
  };

  const retriesLimit = config.retry.limit;
  const retryInitialDelay = config.retry.initialDelay;
  const retryOn = config.retry.retryOnResponseStatuses;
  let retriesCount = 0;

  if (retryOn && !(retryOn instanceof Array)) {
    throw {
      name: 'ArgumentError',
      message: 'retryOn property expects an array'
    }
  }
  let abortController;
  if (typeof AbortController !== 'undefined') {
    abortController = new AbortController();
  }

  const promiseWithAbort = new Promise(function(resolve, reject) {
    const wrappedFetch = function(n) {
      fetch(url, {...options, signal: abortController.signal})
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
          if(error.code === DOMException.ABORT_ERR) {
            return reject(Constants.QUERY_ABORTED);
          }
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
        }, 2^retriesCount * retryInitialDelay);
    }

    wrappedFetch(retriesLimit - retriesCount);
  });

  promiseWithAbort.abort = () => {
      abortController.abort();
  }

  return promiseWithAbort;
};
