# Installation

Install this package from NPM *Recommended*

```ssh
npm install keen-tracking --save
```

Or load it from public CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/keen-tracking@2"></script>
```

Prefer asynchronous loading? Copy/paste this snippet of JavaScript above the `</head>` tag of your page to load the tracking library asynchronously. This technique sneaks the library into your page without significantly impacting page load speed.

```html
<script>
// Loads the library asynchronously from any URI
!function(name,path,ctx){
  var latest,prev=name!=='Keen'&&window.Keen?window.Keen:false;ctx[name]=ctx[name]||{ready:function(fn){var h=document.getElementsByTagName('head')[0],s=document.createElement('script'),w=window,loaded;s.onload=s.onreadystatechange=function(){if((s.readyState&&!(/^c|loade/.test(s.readyState)))||loaded){return}s.onload=s.onreadystatechange=null;loaded=1;latest=w.Keen;if(prev){w.Keen=prev}else{try{delete w.Keen}catch(e){w.Keen=void 0}}ctx[name]=latest;ctx[name].ready(fn)};s.async=1;s.src=path;h.parentNode.insertBefore(s,h)}}
}('KeenTracking','https://cdn.jsdelivr.net/npm/keen-tracking@2',this);

// Executes when the library is loaded and ready
KeenTracking.ready(function(){

  // Create a new client instance
  const client = new KeenTracking({
    projectId: 'YOUR_PROJECT_ID',
    writeKey: 'YOUR_WRITE_KEY'
  });

  // Record an event!
  client.recordEvent('pageviews', {
    // Define your event data model
    title: document.title
  });

});
</script>
```

This loader works a little differently than all the previous versions we have released.

Notice the last line of the asynchronous loader snippet: `}('KeenTracking', './filename.js', this);`. These three arguments can be overwritten, allowing you to customize important details about the installation process.

1. **Namespace:** Define a custom namespace for the library, instead of the default `KeenTracking`, like `MyCustomKeenBuild`.
2. **Script URI:** Define the location of the script to load. You don't need to rely on our CDN. You can use your own, or host the file locally.
3. **Context:** Define where the library should be installed. Global pollution is a problem. This helps you fight back.

Here's an example that uses all of these features together:

```javascript
const modules = {};
!function(name,path,ctx){
  //~ .etc
}('MyKeenBuild','/assets/js/custom-keen-tracking.js', modules);

modules.MyKeenBuild.ready(function(){
  const client = new modules.MyKeenBuild.Client({
    projectId: 'YOUR_PROJECT_ID',
    writeKey: 'YOUR_WRITE_KEY'
  });
  // client.recordEvent('pageviews', {});
});
```

**Important:** This update brings an important change to note. In past versions of keen-js, we shimmed tracking-methods so you could begin using them immediately without the `.ready()` callback wrapper. This created a lot of strange edge cases and version conflicts. Now, everything must be initialized from within the `.ready(function(){ ... })` wrapper.

Also note a global `Keen` object will still be defined. This is meant to ensure the library can initialize in environments where neighboring scripts are unknown or uncontrollable.

## Client instances

The client instance is the core of the library and will be required for all API-related functionality. The `client` variable defined below will also be used throughout this document.

```javascript
import KeenTracking from 'keen-tracking';

const client = new KeenTracking({
  projectId: 'YOUR_PROJECT_ID',
  writeKey: 'YOUR_WRITE_KEY',
  // host: 'api.keen.io',
  // protocol: 'https',
  // request types: 'fetch' (default), 'xhr', 'beacon'
});

// Optional accessor methods are available too
client.projectId('PROJECT_ID');
client.writeKey('WRITE_KEY');
```

**Important notes about client configuration options:**

* `host` and `writePath`: these options can be overwritten to make it easier than ever to proxy events through your own intermediary host.
* `protocol`: older versions of IE feature a fun little quirk where cross-domain requests to a secure resource (https) from an insecure host (!https) fail. In these rare cases the library will match the current host's protocol.
* `requestType`: this option sets a default for GET requests, which is only supported when recording single events. There are limits to the URL string length of a request, so if this limit is exceeded we'll attempt to execute a POST instead, using Fetch API.
