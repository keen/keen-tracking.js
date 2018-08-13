# HTML5 Video Player

This example demonstrates how to instrument an [HTML5 video player](https://www.w3schools.com/tags/ref_av_dom.asp) to capture usage stats with Keen IO.

### Installation

Install the library synchronously and configure a new `client` instance to capture events emitted by the HTML5 video player.

```html
<html>
<head>
  <meta charset="utf-8">
  <script crossorigin src="https://cdn.jsdelivr.net/npm/keen-tracking@4"></script>
</head>
<body>
  !-- HTML5 Video Player -->
  <div>
    <button id="video-control">Play</button>
    <br><br>
    <video id="video-player" width="420">
      <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
      <source src="https://www.w3schools.com/html/mov_bbb.ogg" type="video/ogg">
      Your browser does not support HTML5 video.
    </video>
  </div>

  <script>
  var video = videojs('video-player');

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

  document.addEventListener('DOMContentLoaded', function() {
    var control = document.getElementById('video-control');
    var player = document.getElementById('video-player');

    // Create a toggle button
    control.addEventListener('click', function(){
      if (player.paused) {
        player.play();
      }
      else {
        player.pause();
      }
    }, false);

    // Additional player-specific properties
    client.extendEvents(function(){
      return {
        browser: Keen.helpers.getBrowserProfile(),
        player: {
          'is-muted'         : player.muted,
          'current-position' : player.currentTime,
          'duration'         : player.duration,
          'volume'           : player.volume
        }
      }
    });

    player.addEventListener('play', function() {
      client.recordEvent('video-interaction', { event_type: 'started' });
    }, false);

    player.addEventListener('pause', function() {
      client.recordEvent('video-interaction', { event_type: 'paused' });
    }, false);

    player.addEventListener('ended', function() {
      client.recordEvent('video-interaction', { event_type: 'finished' });
    }, false);

    player.addEventListener('error', function() {
      client.recordEvent('video-interaction', { event_type: 'error' });
    }, false);
  }, false);
  </script>
</body>
</html>
```
