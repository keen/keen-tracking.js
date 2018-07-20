export const configDefault = {

  // defer events - queue
  // https://github.com/keen/keen-tracking.js/blob/master/docs/defer-events.md
  queue: {
    capacity: 5000,
    interval: 15
  },

  // connection problems - retry request
  retry: {
    limit: 10,
    initialDelay: 200,
    retryOnResponseStatuses: [
      408,
      500,
      502,
      503,
      504
    ]
  }
}

export default configDefault;
