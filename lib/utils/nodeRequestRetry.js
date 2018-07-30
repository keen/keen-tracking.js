import 'promise-polyfill/src/polyfill';

import http from 'http';
import https from 'https';

import configDefault from '../config-default.js';

export default function(options) {

  const configRetry = {
    ...configDefault.retry,
    ...(options.retry || {})
  };

  const retriesLimit = configRetry.limit;
  const retryInitialDelay = configRetry.initialDelay;
  const retryOn = configRetry.retryOnResponseStatuses;
  const { callback } = options;
  let retriesCount = 0;

  if (retryOn && !(retryOn instanceof Array)) {
    throw {
      name: 'ArgumentError',
      message: 'retryOn property expects an array'
    }
  }

  const protocol = (options.protocol === 'http') ? http : https;

  const parseBody = (responseBody) => {
    return new Promise((resolve, reject) => {
      let response;
      let error;
      try {
        response = JSON.parse(responseBody);
      }
      catch (e) {
        // Parsing Error
        error = e;
      }
      if (!error && response.error_code) {
        // API Error
        error = new Error(response.message || 'Unknown error occurred');
        error.code = response.error_code;
        reject(error);
      }
      resolve(response);
    });
  };

  return new Promise((resolve, reject) => {
    const wrappedRequest = (n) => {
      let req = protocol.request(options.config, (response) => {
        let body = '';
        response.on('data', (d)  => {
          body += d;
        });
        response.on('end', ()  => {
          if (retryOn.indexOf(response.statusCode) === -1) {
            parseBody(body).then(parsedBody => {
              resolve(parsedBody);
              if (callback) callback(null, parsedBody);
            }).catch(err => {
              reject(err);
              if (callback) callback(err, null);
            });
          } else {
            if (n > 0) {
              retry();
            } else {
              if (callback) callback(body, null);
              reject(body);
            }
          }
        });
      });
      req.on('error', (err) => {
        if (n > 0) {
          retry();
        } else {
          if (callback) callback(body, null);
          reject(err);
        }
      });
      req.write(options.data);
      req.end();
    };

    function retry() {
      retriesCount = retriesCount + 1;
      setTimeout(function() {
          wrappedRequest(retriesLimit - retriesCount);
        }, 2^retriesCount * retryInitialDelay);
    }

    wrappedRequest(retriesLimit - retriesCount);
  });
};
