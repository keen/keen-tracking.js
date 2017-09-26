# Automated Event Tracking (browser-only)

Automatically record pageviews, clicks, and form submissions, with a robust data model.

**Upgrading from the Web Auto Collector?** The interface and behaviors of this feature are a little different, but the data models produced are backward compatible. One notable change is that `clicks` are only recorded for `<a>` tags now. Previously any click any element was recorded. If you would like to specify listeners for other DOM elements, check out the [DOM listener docs](./listeners.md) or the [`.initAutoTracking()` method source](../lib/browser-auto-tracking.js) for insight into how to set up your own listeners.

Any additional events recorded from the `client` instance below will use the same robust data models once auto-tracking is enabled.

### Installation

```html
<script src="https://d26b395fwzu5fz.cloudfront.net/keen-tracking-1.3.0.min.js"></script>
<script>
Keen.ready(function(){
  var client = new Keen({
    projectId: 'YOUR_PROJECT_ID',
    writeKey: 'YOUR_WRITE_KEY'
  });
  client.initAutoTracking();
});
</script>
```

### Configuration options

The following configuration options are available to let you specify which types of events to track (defaults shown):

```javascript
var client = new Keen({
  projectId: 'YOUR_PROJECT_ID',
  writeKey: 'YOUR_WRITE_KEY'
});
client.initAutoTracking({
  ignoreDisabledFormFields: false,
  ignoreFormFieldTypes: ['password'],
  recordClicks: true,
  recordFormSubmits: true,
  recordPageViews: true
});
```

### Customization

Add additional properties to any or all events with [`extendEvent` or `extendEvents` methods](./extend-events.md):

```javascript
var client = new Keen({
  projectId: 'YOUR_PROJECT_ID',
  writeKey: 'YOUR_WRITE_KEY'
});

client.extendEvents(function(){
  return {
    app: {
      version: '4.1.5'
    },
    user: {
      display_name: 'Johnny 5',
      email_address: 'example@domain.com'
    }
    /* Custom properties for all events */
  };
});

client.extendEvent('pageviews', function(){
  return {
    page: {
      author_id: 'f123109vb1231200312bb',
      author_name: 'Dustin Larimer',
      last_updated: '2017-09-13T12:00:00-07:00'
    }
    /* Custom properties for pageviews event */
  };
});

client.initAutoTracking();
```

**Want to record custom events?** Any additional events recorded from the `client` instance below will use the same robust data models once auto-tracking is enabled.


### Block bots and improve device recognition

Install [mobile-detect.js](https://github.com/hgoebl/mobile-detect.js) to identify basic device types and block noisy bots and crawlers.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/mobile-detect/1.3.7/mobile-detect.js"></script>
<script src="https://d26b395fwzu5fz.cloudfront.net/keen-tracking-1.3.0.min.js"></script>
<script>
Keen.ready(function(){
  var md = new MobileDetect();
  if (md.is('bot')) {
    return false;
  }

  var client = new Keen({
    projectId: 'YOUR_PROJECT_ID',
    writeKey: 'YOUR_WRITE_KEY'
  });

  client.extendEvents(function(){
    return {
      tech: {
        device_type: md.tablet() ? 'tablet' : md.mobile() ? 'mobile' : 'desktop'
      }
      /* Custom properties for all events */
    };
  });

  client.initAutoTracking();
});
</script>
```
