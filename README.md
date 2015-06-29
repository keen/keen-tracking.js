# keen-tracking.js [![Build Status](https://travis-ci.org/keen/keen-tracking.js.svg?branch=master)](https://travis-ci.org/keen/keen-tracking.js)

**Important:** This project is not yet functional. We're building this in public, in open collaboration with our customers and community members! Below is a sketch of planned functionality. [Learn more about contributing to this project](./CONTRIBUTING.md).

### Vision quest

Why are we splitting this functionality out of [keen-js](https://github.com/keen/keen-js)? Tracking and Analysis+Dataviz are two distinct workflows and it rarely makes sense for these tools to be duct-taped together. Monolithic codebases bring more heartache than nirvana.

Once this project is ready, we'll import and replace existing tracking functionality within keen-js. This *could* get messy :) If you have any ideas for how to make this purely awesome instead, jump on in and join the fun!

### Roadmap

Here's what is done:

* [x] `Keen.Client` instance and accessors
* [x] `Keen.helpers`: a collection of helpers to return common data model fragments
* [x] `Keen.utils`: a collection of handy utilities like `each` and `parseParams`
* [x] `#recordEvent` and `#recordEvents` methods for sending single/multiple events
* [x] `#deferEvent` and `#deferEvents` methods for managing a queue of events that are processed at a configurable interval
* [x] `#extendEvent` and `#extendEvents` methods for augmenting events before recording
* [x] `Keen.utils.cookie()` for managing simple cookies
* [x] `Keen.utils.timer()` for managing a simple timer
* [x] `Keen.listenTo` for listening to common user/window events
* [x] Asynchronous loading, similar to keen-js setup, though hopefully smaller and easier to extend
* [x] Top-level `Keen` settings for debugging and disabling event transmission

Here's what needs to be done:

* [ ] `Keen.helpers.getUniqueId`: return a guuid
* [ ] Validate `Keen.listenTo` form submit binding on IE8
* [ ] Expose `A` element click event and `FORM` element submit event timeouts (default: 500ms)


*So how about dependencies?* No required dependencies. As for internally bundled deps, let's also avoid them as much as possible to minimize the compiled/minified browser library. Currently considering using [sizzle.js](http://sizzlejs.com/) for DOM wizardry, but open to alternatives here as well.

*Ready to get started?* Run the following commands to get this dev project set up locally:

```ssh
# Clone the repo
$ git clone https://github.com/keen/keen-tracking.js.git && cd keen-tracking.js

# Install common dependencies
$ npm install

# Install browser dependencies for tests
$ bower install

# Build and launch project site
$ gulp

# Build and launch with tests
$ gulp with-tests

# View test results at http://localhost:9000
```

### Overview

```javascript
var client = new Keen.Client(object);

// Config accessors
client.projectId('PROJECT_ID');
client.writeKey('WRITE_KEY');

// Record events
client.recordEvent('collection', {}, function(err, res){ });
client.recordEvents({ 'collection': [{}] }, function(err, res){ });

// Defer events for batch upload at a configurable interval
client.deferEvent('collection', {});
client.deferEvents({ 'collection': [{}] });

// Force-clear the deferred queue
client.recordDeferredEvents();

// Configure deferred queue
client.queueCapacity(5000);
client.queueInterval(15000);

// Extend each event body for one or all collections
// Accepts a static object or function that returns an object
client.extendEvent('collection', {});
client.extendEvent('collection', function(){
  return {}
});
client.extendEvents({});
client.extendEvents(function(){
  return {}
});

// Listen to DOM events
Keen.listenTo({
  'click .nav a': function(e){
    // you have 500ms.. record an event!
  }
});

// Accessor methods not yet built-
// Keen.deferDomEvents('A', 'click', 500);
// Keen.deferDomEvents('FORM', 'submit', 500);


// Miscellaneous

// Track errors and messages in the dev console
Keen.debug = true;

// Disable event writes to the API
Keen.enabled = false;

// Observe what's happening
client.on('recordEvent', Keen.log);
client.on('recordEvents', Keen.log);
client.on('deferEvent', Keen.log);
client.on('deferEvents', Keen.log);
client.on('recordDeferredEvents', Keen.log);
client.on('extendEvent', Keen.log);
client.on('extendEvents', Keen.log);
```


### Getting started

* Project ID
* API Write Key

### Install the library

*Currently unpublished.. but not far off!*

<!--
```ssh
# via npm
$ npm install keen-tracking

# or bower
$ bower install keen-tracking
```
-->

#### Asynchronous loading

Copy/paste this snippet of JavaScript above the </head> tag of your page to load the tracking library asynchronously. This technique sneaks the library into your page without significantly impacting page load speed.

```html
<script>
// Loads the library asynchronously from any URI
!function(name,path,ctx){
  var latest,prev=name!=='Keen'&&window.Keen?window.Keen:false;ctx[name]=ctx[name]||{ready:function(fn){var h=document.getElementsByTagName('head')[0],s=document.createElement('script'),w=window,loaded;s.onload=s.onerror=s.onreadystatechange=function(){if((s.readyState&&!(/^c|loade/.test(s.readyState)))||loaded){return}s.onload=s.onreadystatechange=null;loaded=1;latest=w.Keen;if(prev){w.Keen=prev}else{try{delete w.Keen}catch(e){w.Keen=void 0}}ctx[name]=latest;ctx[name].ready(fn)};s.async=1;s.src=path;h.parentNode.insertBefore(s,h)}}
}('Keen','./keen-tracking.js',this);

// Executes when the library is loaded and ready
Keen.ready(function(){
	var client = new Keen.Client({
		projectId: 'YOUR_PROJECT_ID',
		writeKey: 'YOUR_WRITE_KEY'
	});
	client.recordEvent('pageviews', {
		// Define your event data model
		title: document.title
	});
});
</script>
```

This loader works a little differently than all the previous versions we have released.

Notice the last line of the asynchronous loader snippet: `}('Keen', './keen-tracking.js', this);`. These three arguments can be overwritten, allowing you to customize important details about the installation process.

1. **Namespace:** Define a custom namespace for the library, instead of the default `Keen`, like `MyCustomKeenBuild`.
2. **Script URI:** Define the location of the script to load. You don't need to rely on our CDN. You can use your own, or host the file locally.
3. **Context:** Define where the library should be installed. Global pollution is a problem. This helps you fight back.

Here's an example that uses all of these features together:

```javascript
var modules = {};
!function(name,path,ctx){
  //~ .etc
}('MyKeenBuild','/assets/js/custom-keen-tracking.js', modules);

modules.MyKeenBuild.ready(function(){
	var client = new modules.MyKeenBuild.Client({
		projectId: 'YOUR_PROJECT_ID',
		writeKey: 'YOUR_WRITE_KEY'
	});
	// client.recordEvent('pageviews', {});
});
```

**Important:** This update brings an important change to note. In past versions of keen-js, we shimmed tracking-methods so you could begin using them immediately without the `.ready()` callback wrapper. This created a lot of strange edge cases and version conflicts. Now, everything must be initialized from within the `.ready(function(){ ... })` wrapper.

#### Synchronous loading

You can also load the library synchronously:

```html
<!-- Currently not available in our CDN (coming soon!) -->
<script src='https://d26b395fwzu5fz.cloudfront.net/0.0.1/keen-tracking.min.js'></script>
```


### Configure a new client for each project

```javascript
var client = new Keen.Client({
	projectId: 'YOUR_PROJECT_ID',
	writeKey: 'YOUR_WRITE_KEY',

	/* Additional options (defaults shown):

	writePath: '/3.0/projects/YOUR_PROJECT_ID/events'
	host: 'api.keen.io'
	protocol: 'https'
	requestType: 'jsonp' // Also: 'xhr', 'beacon'

	*/
});

// Callback used by examples
function callback(err, res){
	console.log(err, res);
};
```

**Important notes about client configuration options:**

* `host` and `writePath`: these options can be overwritten to make it easier than ever to proxy events through your own intermediary host.
* `protocol`: older versions of IE feature a fun little quirk where cross-domain requests to a secure resource (https) from an insecure host (!https) fail. In these rare cases the library will match the current host's protocol.
* `requestType`: this option sets a default for GET requests, which is only supported when recording single events. There are limits to the URL string length of a request, so if this limit is exceeded we'll attempt to execute a POST instead, using XHR. In rare cases where XHR isn't supported, the request will fail.


### Record events

These methods push single or multiple events to their respective API endpoints.

```javascript
// Single event
client.recordEvent('transaction', { value: 123 }, callback);

// Multiple events
client.recordEvents({
	'transaction': [ { value: 123 } ],
	'purchase': [
		{ value: 123 },
		{ value: 456 },
		{ value: 789 }
	],
	'pageview': [ { value: 012 } ]
}, callback);
```


### Defer events

These methods handle an internal queue of events, which is pushed to the Events resource endpoint on a given interval.

```javascript
// Single event
client.deferEvent('transaction', {});

// Multiple events
client.deferEvents({ 'Name': [{},{}] });

// Flush the deferred queue
client.recordDeferredEvents();

// Record events when queue contains at least N events (default: 5000)
client.queueCapacity(5000);
client.queueCapacity(); // 5000

// Record events every N seconds (default: 15)
client.queueInterval(15);
client.queueInterval(); // 15
```


### Extend events

These methods extend the event body of every event sent through `recordEvent()` or `recordEvents()`, for all or specified collections, and accepts either a predefined object (static) or a function that returns an object (dynamic). This returned object is then grafted into the original event body with a deep-extend operation that seamlessly blends nested objects.

`extendEvents` transforms will be applied first, followed by collection-specific `extendEvent` transforms. In either case, transforms will be applied in the order that they are defined. Properties provided in the originating `recordEvent/s()` call will override any matching properties (static or dynamic) returned by these methods.

```javascript
// Extend events for a single collection
client.extendEvent('transaction', {});
client.extendEvent('transaction', function(){
	return {};
});

// Extend events for all collections
client.extendEvents({});
client.extendEvents(function(){
	return {};
});

// Example usage

var userProps = {
	full_name: 'User Dude',
	email: 'name@domain.com',
	id: 'f1233423h',
	username: 'userdude213'
};

// Include a predefined 'user' object with every purchase event
client.extendEvent('purchase', {
	'user': userProps
});

// Include a predefined 'user' object with every event
client.extendEvents({
	'user': userProps
});

// Include a dynamic 'keen.timestamp' property with every event
client.extendEvents(function(){
	return {
		keen: {
			timestamp: new Date().toISOString()
		}
	};
});
```

**Example usage:**

```javascript
// Object (static)
client.extendEvents({
	page: {
		href: document.location.href,
		title: document.title
	},
	referrer: document.referrer,
	user: {
		email: 'name@domain.com',
		id: 'f1233423h',
		username: 'someuser123'
	}
});

// Function that returns an object (dynamic)
// Useful for attaching time-sensitive data
client.extendEvents(function(){
	return {
		keen: {
			timestamp: new Date().toISOString()
		}
	}
});

//
client.recordEvent('pageview');

/* Resulting event body:
{
	user: {
		email: 'name@domain.com',
		id: 'f1233423h',
		username: 'someuser123'
	},
	page: {
		href: 'https://github.com/keen/keen-tracking.js#extend-events',
		title: document.title
	},
	referrer: 'https://github.com/keen/',
	keen: {
		timestamp: '2015-06-28T22:01:38.824Z'
	}
}
*/
```


### DOM Element tracking

This method surfaces events from user interactions. Form submits and clicks will be delayed by default (configurable).

Also check out declarative binding demo here: http://jsfiddle.net/hm514aj8/10/

```javascript
// Listen to DOM events
Keen.listenTo({
	// Form submits and clicks will be delayed (configurable)

	'submit form#my-fancy-form': function(e){
		client.recordEvent('signup');
	},

	'click .nav > a': function(e){
		client.recordEvent('user_action', { type: 'click' });
	},

	'mouseover .nav > a.login': function(e){
		client.recordEvent('user_action', { type: 'mouseover' });
	}
});

Keen.listenTo({ 'submit form': function(e){ ... } });

// Override DOM event timeouts (defaults shown)
Keen.deferDomEvents('A', 'click', 500);
Keen.deferDomEvents('FORM', 'submit', 500);

```

#### Window events

```javascript
Keen.listenTo({
	'hashchange window': function(e){
		// user clicked an internal anchor (eg: /#some-heading)
	},
	'scroll window': function(e){
		// user scrolled the page
	}
});
```

**Generally supported events:**

* click (see below for `<a>` clicks)
* submit (see below for `<form>` submits)
* keydown
* keypress
* keyup
* mousedown
* mousemove
* mouseout
* mouseover
* mouseup


**Important note about `<a>` and `<form>` elements:** `<a>` tag **clicks** (when navigating away from the current page) and `<form>` **submits** are deferred for 500ms to allow for quick, asynchronous API calls.


**`window` events:**

* blur
* focus
* hashchange
* resize
* scroll

**Not currently supported:**

* dblclick
* error
* onload
* unload



### Cookies

This utility uses [ScottHamper's](https://github.com/ScottHamper) wonderfully simple [Cookies.js](https://github.com/ScottHamper/Cookies) library.

```javascript
var session = Keen.utils.cookie('visitor-stats');

// Set a single value
session.set('user_id', '222323843234');

// Set multiple values
session.set({
	user_id: '222323843234',
	first_referrer: 'https://github.com/keen/keen-tracking.js'
})

// Get a single value
session.get('user_id'); // '222323843234'

// Get all values
session.get(); // { user_id: '222323843234' }

// Expire the cookie
session.expire();

// Set options on the cookie
session.options({
	domain: '...',
	secure: true
});
```

Read all options for Cookies.js [here](https://github.com/ScottHamper/Cookies#cookiessetkey-value--options).


### Timers

```javascript
var userActivity = Keen.utils.timer();

// Start a timer
userActivity.start();

// Pause the timer
userActivity.pause();

// Return the vale of the timer (seconds)
userActivity.value(); // 10

// Clear the current value of the timer
userActivity.clear();

// Start from a given number
var historicalActivity = Keen.utils.timer(3132).start();
historicalActivity.pause();
```


### Helpers

These helpers can be passed into `client.extendEvent(s)` method(s) to construct and attach common sets of properties.

```javascript
Keen.helpers = {
	getBrowserProfile: function(){
		return {
			'cookies' : navigator.cookieEnabled,
			'screen'  : Keen.helpers.getScreenProperties(),
			'window'  : Keen.helpers.getWindowProperties()
		};
	},
	getDatetimeIndex: function(obj){
		var date = obj || new Date();
		return {
			'hour_of_day'    : date.getHours(),
			'day_of_week'    : parseInt( 1 + date.getDay() ),
			'day_of_month'   : date.getDate(),
			'month'          : parseInt( 1 + date.getMonth() ),
			'year'           : date.getFullYear()
		};
	},
	getDomNodePath: function(el){
		// returns something like 'body > div#nav > ul > a#signup'
    // via: http://stackoverflow.com/a/16742828/2511985
	},
	getUniqueId: function(){},
	getScreenProperties: function(){},
	getWindowProperties: function(){}
};

```

## Example Setup

```javascript
var client = new Keen.Client({});

Keen.listenTo({
	'submit form#signup': function(e){
		var userEmail = document.getElementById('signup-email').value;
		client.recordEvent('user signup', {
			'interaction': {
				'type': 'submit'
			},
			'visitor': {
				'email': userEmail
			}
		});
	},
	'click .nav a': function(e){
		// Clicked a nav link!
	}
});

client.extendEvents(function(){
	return {
		'page': {
			title: document.title,
			href: document.href
		},
		'tech': Keen.helpers.getBrowserProfile(),
		'time': Keen.helpers.getDatetimeIndex(),
		'visitor': {
			'id': Keen.helpers.getUniqueId()
		},
		'keen': {
			'timestamp': new Date().toISOString()
		}
	};
});

client.recordEvent('pageview');
```

### Inspect event stream

```javascript
client.on('recordEvent', Keen.log);
client.on('recordEvents', Keen.log);
client.on('deferEvent', Keen.log);
client.on('deferEvents', Keen.log);
client.on('recordDeferredEvents', Keen.log);
client.on('extendEvent', Keen.log);
client.on('extendEvents', Keen.log);
```
