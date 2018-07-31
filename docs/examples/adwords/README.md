## keen-tracking.js Google Adwords Example

### Example

```javascript
import KeenTracking from 'keen-tracking';

const client = new KeenTracking({
  projectId: 'YOUR_PROJECT_ID',
  writeKey: 'YOUR_WRITE_KEY'
});

client.extendEvents(() => {
  return {
    page: {
      title: document.title,
      url: document.location.href
    },
    keen: {
      addons: [
        {
          name: 'keen:url_parser',
          input: {
            url: 'page.url'
          },
          output: 'page.info'
        }
      ]
    }
  }
});

client.recordEvent('pageviews', {
  // you can put any additional data here
});
```

## Adwords URL Query String

In your Adwords Campaign, edit your Ad's [Final URL](https://support.google.com/adwords/answer/6080568):
* add any parameter that will help you identify the source of the traffic later on. For example: "?ad_id=123"

## Stream

Your events should contain page.info.query_string
with values from the URL of the landing page (Final URL)

![alt text](https://raw.githubusercontent.com/keen/keen-tracking.js/master/docs/examples/adwords/img/screen1.png)

## Explorer

Run a query to see how many visitors came from the Ad

* Analysis type: count
* Event Collection: pageviews
* Add filter: page.info.query_string.ad_id = 123

![alt text](https://raw.githubusercontent.com/keen/keen-tracking.js/master/docs/examples/adwords/img/screen2.png)
