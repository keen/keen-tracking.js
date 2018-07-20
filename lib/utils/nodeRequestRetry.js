import http from 'http';
import https from 'https';

import configDefault from '../config-default.js';

export default function(options) {
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

  const protocol = (options.protocol === 'http') ? http : https;

  const wrappedRequest = (n) => {
    let req = protocol.request(options.config, (response) => {
      let body = '';
       response.on('data', (d)  => {
         body += d;
       });
       response.on('end', ()  => {
         if (retryOn.indexOf(response.statusCode) === -1) {
           options.callbackOnSuccess(body);
         } else {
           if (n > 0) {
             retry();
           } else {
             options.callbackOnError(body);
           }
         }
       });
    });
    req.on('error', (err) => {
      if (n > 0) {
        retry();
      } else {
        options.callbackOnError(err);
      }
    });
    req.write(options.data);
    req.end();
  }

  function retry() {
    retriesCount = retriesCount + 1;
    setTimeout(function() {
        wrappedRequest(retriesLimit - retriesCount);
      }, 2^retriesCount * retryDelay);
  }

  wrappedRequest(retriesLimit - retriesCount);
};
