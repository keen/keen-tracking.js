# Facebook Video Player

This example demonstrates how to instrument the [Facebook video player](https://developers.facebook.com/docs/plugins/embedded-video-player/api#control-reference) to capture usage stats with Keen IO.

### Installation

Install the library synchronously and configure a new `client` instance to capture events emitted by the Facebook video player.

```html
<html>
<head>
  <meta charset="utf-8">
  <script crossorigin src="https://cdn.jsdelivr.net/npm/keen-tracking@4"></script>
</head>
<body>
  <!-- Facebook SDK and embedded video player code -->
  <div id="fb-root"></div>  
  <div class="fb-video"
       data-href="https://www.facebook.com/WeRateDogs/videos/1134644986596723/"
       data-width="500"
       data-allowfullscreen="true"></div>

  <script>
  var FACEBOOK_VIDEO_APP_ID = 'YOUR_FB_APP_ID';

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

  window.fbAsyncInit = function() {
    FB.init({
      appId: FACEBOOK_VIDEO_APP_ID,
      xfbml: true,
      version: 'v2.6'
    });

    FB.Event.subscribe('xfbml.ready', function(msg) {
      if (msg.type === 'video') {
        trackVideoEvents(msg.instance);
      }
    });
  };

  function trackVideoEvents(player) {

    // Additional player-specific properties
    client.extendEvents(function(){
      return {
        player: {
          'is-muted'         : player.isMuted(),
          'current-position' : player.getCurrentPosition(),
          'duration'         : player.getDuration(),
          'volume'           : player.getVolume()
        }
      }
    })

    player.subscribe('startedPlaying', function(e) {
      client.recordEvent('video-interaction', { event_type: 'started' });
    });

    player.subscribe('paused', function(e) {
      client.recordEvent('video-interaction', { event_type: 'paused' });
    });

    player.subscribe('finishedPlaying', function(e) {
      client.recordEvent('video-interaction', { event_type: 'finished' });
    });

    player.subscribe('startedBuffering', function(e) {
      client.recordEvent('video-interaction', { event_type: 'started-buffering' });
    });

    player.subscribe('finishedBuffering', function(e) {
      client.recordEvent('video-interaction', { event_type: 'finished-buffering' });
    });

    player.subscribe('error', function(e) {
      client.recordEvent('video-interaction', { event_type: 'error' });
    });
  }

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = 'https://connect.facebook.net/en_US/sdk.js';
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
  </script>
</body>
</html>
```
