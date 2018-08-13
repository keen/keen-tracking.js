# Youtube iFrame Video Player

This example demonstrates how to instrument the [Youtube iFrame video player](https://developers.google.com/youtube/iframe_api_reference) to capture usage stats with Keen IO.

### Installation

Install the library synchronously and configure a new `client` instance to capture events emitted by the Youtube iFrame video player.

```html
<html>
<head>
  <meta charset="utf-8">
  <script crossorigin src="https://cdn.jsdelivr.net/npm/keen-tracking@4"></script>
</head>
<body>
  <!-- Youtube iframe video player code -->
  <iframe id="youtube-iframe-player"
          width="640" height="360"
          src="https://www.youtube.com/embed/G5UBjF1z9hA?enablejsapi=1"
          frameborder="0"
          style="border: solid 4px #37474F"></iframe>

  <script>
  var client = new KeenTracking({
    projectId: 'YOUR_PROJECT_ID',
    writeKey: 'YOUR_WRITE_KEY'
  });

  // Optional debug mode
  KeenTracking.debug = true;
  client.on('recordEvent', Keen.log);

  // Track a 'pageview' event and initialize auto-tracking data model
  client.initAutoTracking({
    recordClicks: false,
    recordFormSubmits: false,
    recordPageViews: true
  });

  // Install YouTube SDK
  var newTag = document.createElement('script');
  newTag.src = 'https://www.youtube.com/iframe_api';
  var firstTag = document.getElementsByTagName('script')[0];
  firstTag.parentNode.insertBefore(newTag, firstTag);

  function onYouTubeIframeAPIReady() {
    var player = new YT.Player('youtube-iframe-player');

    // Additional player-specific properties
    client.extendEvents(function(){
      return {
        player: {
          'is-muted'         : player.isMuted(),
          'current-position' : player.getCurrentTime(),
          'duration'         : player.getDuration(),
          'playback-quality' : player.getPlaybackQuality(),
          'volume'           : player.getVolume()
        }
      }
    })

    player.addEventListener('onStateChange', function(e) {
      var state = e.data;
      if (state === 1) {
        client.recordEvent('video-interaction', { event_type: 'started' });
      }
      else if (state === 2) {
        client.recordEvent('video-interaction', { event_type: 'paused' });
      }
      else if (state === 0) {
        client.recordEvent('video-interaction', { event_type: 'finished' });
      }
    }, false);

    player.addEventListener('onError', function(e) {
      client.recordEvent('video-interaction', { event_type: 'error' });
    }, false);
  }
  </script>
</body>
</html>
```
