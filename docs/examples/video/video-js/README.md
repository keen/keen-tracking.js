# Video.js Player

This example demonstrates how to instrument the [Video.js player](https://docs.videojs.com/) to capture usage stats with Keen IO.

### Installation

Install the library synchronously and configure a new `client` instance to capture events emitted by the Video.js player.

```html
<html>
<head>
  <meta charset="utf-8">
  <script crossorigin src="https://cdn.jsdelivr.net/npm/keen-tracking@4"></script>

  <!-- Video.js Assets -->
  <link href="https://vjs.zencdn.net/5.8.8/video-js.css" rel="stylesheet">
  <script src="https://vjs.zencdn.net/5.8.8/video.js"></script>
</head>
<body>
  <!-- Video.js Player -->
  <div>
    <video id="video-player" class="video-js" controls preload="auto" width="640">
      <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
      <source src="https://www.w3schools.com/html/mov_bbb.ogg" type="video/ogg">
      <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
      </p>
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

  /*
    Simple Video.js Plugin
  */
  videojs.plugin('recordKeenEvents', function(client){
    // Additional player-specific properties
    client.extendEvents(function(){
      return {
        player: {
          'is-muted'         : this.muted(),
          'current-position' : this.currentTime(),
          'duration'         : this.duration(),
          'volume'           : this.volume()
        }
      }
    }.bind(this));

    this.on('play', function() {
      client.recordEvent('video-interaction', { event_type: 'started' });
    });
    this.on('pause', function() {
      client.recordEvent('video-interaction', { event_type: 'paused' });
    });
    this.on('ended', function() {
      client.recordEvent('video-interaction', { event_type: 'finished' });
    });
    this.on('error', function() {
      client.recordEvent('video-interaction', { event_type: 'error' });
    });
  });

  video.recordKeenEvents(client);
  </script>
</body>
</html>
```
