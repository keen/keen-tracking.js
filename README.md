# keen-tracking.js

**Important:** This project is not yet functional. We're building this in public, in open collaboration with our customers and community members! Below is a sketch of planned functionality. [Learn more about contributing to this project](./CONTRIBUTING.md).

Run the following commands to get this dev project set up locally:

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

```
var client = new Keen.Client(object);

// Config accessors
client.projectId("PROJECT_ID");
client.writeKey("WRITE_KEY");

// Record events
client.recordEvent("collection", {}, function(err, res){ });
client.recordEvents({ "collection": [{}] }, function(err, res){ });

// Defer events for batch upload at a configurable interval
client.deferEvent("collection", {}, function(err, res){ });
client.deferEvents({ "collection": [{}] }, function(err, res){ });

// Force-clear the deferred queue
client.recordDeferredEvents();

// Configure deferred queue
client.queueCapacity(5000);
client.queueInterval(15000);

// Extend each event body for one or all collections
// Accepts a static object or function that returns an object
client.extendEvent("collection", {});
client.extendEvent("collection", function(){ return {} });
client.extendEvents({});
client.extendEvents(function(){ return {} });

// Listen to DOM events
Keen.listenTo({
	"submit form": function(e){ ... }
});
/* alternate:
Keen.listenTo(document.getElementById("signup-form"), "submit", function(e){ ... });
Keen.listenTo("#signup-form", "submit", function(e){ ... });
*/
Keen.deferDomEvents("FORM", "submit", 500);

// Miscellaneous

// Get/extend base API URL
client.url();
client.url("/events");

// Get API URL with url-encoded params
client.url("/events/name", { key: "value" });

// Read events in progress
Keen.debug(true);
client.on("all", Keen.log);
client.on("recordEvent", Keen.log);
```


### Getting started

* Project ID
* API Write Key

### Install the library

```
# via npm
$ npm install keen-tracking

# or bower
$ bower install keen-tracking
```

For quick browser use, copy/paste this snippet of JavaScript above the </head> tag of your page:

```
// async loader ...
!function(a,b){a("Keen","https://d26b395fwzu5fz.cloudfront.net/0.0.1/keen-tracking.min.js",b)}(function(a,b,c){var d,e,f;c["_"+a]={},c[a]=function(b){c["_"+a].clients=c["_"+a].clients||{},c["_"+a].clients[b.projectId]=this,this._config=b},c[a].ready=function(b){c["_"+a].ready=c["_"+a].ready||[],c["_"+a].ready.push(b)},d=["recordEvent","recordEvents","on"];for(var g=0;g<d.length;g++){var h=d[g],i=function(a){return function(){return this["_"+a]=this["_"+a]||[],this["_"+a].push(arguments),this}};c[a].prototype[h]=i(h)}e=document.createElement("script"),e.async=!0,e.src=b,f=document.getElementsByTagName("script")[0],f.parentNode.insertBefore(e,f)},this);
```

Or load the library synchronously from our CDN:

```
https://d26b395fwzu5fz.cloudfront.net/0.0.1/keen-tracking.min.js
```

### Configure a new client for each project

```
var client = new Keen.Client({
	projectId: "YOUR_PROJECT_ID",
	writeKey: "YOUR_WRITE_KEY"
});

// Callback used by examples
function callback(err, res){
	console.log(err, res);
};
```

### Record events

These methods push single or multiple events to their respective API endpoints.

```
// Single event
client.recordEvent("transaction", {}, callback);

// Multiple events
client.recordEvents({
	"transaction": [ {} ],
	"purchase": [ {}, {}, {} ],
	"pageview": [ {} ]
}, callback);
```

### Defer events

These methods handle an internal queue of events, which is pushed to the Events resource endpoint on a given interval.

```
// Single event
client.deferEvent("transaction", {}, callback);

// Multiple events
client.deferEvents({ "Name": [{},{}] }, callback);

// Force-clear the deferred queue
client.recordDeferredEvents();

// Configure deferred queue
client.queueCapacity(5000);
client.queueInterval(15000);
```


### Extend events (global properties)

These methods extend the event body of all or specified collections, and accept either an object or function that returns an object. Global transforms will be applied first, followed by per-collection transforms. In either case, transforms will be applied in the order that they are defined, and use a deep-extend method to fully blend nested objects together.

```
// Extend events for a single collection
client.extendEvent("transaction", {});
client.extendEvent("transaction", function(){ return {}; });

// Extend events for all collections
client.extendEvents({});
client.extendEvents(function(){ return {}; });

// Example usage

var userProps = {
  full_name: "User Dude",
  email: "name@domain.com",
  id: "f1233423h",
  username: "userdude213"
};

client.extendEvent("purchase", {
	"user": userProps
});

client.extendEvents({ "user": userProps });
client.extendEvents(function(){
	return {
		keen: {
			timestamp: new Date().toISOString()
		}
	};
});
client.extendEvent("pageview", { title: document.title });
```

### DOM Element tracking

This method surfaces events from user interactions. Form submits and clicks will be delayed by default (configurable).

Also check out declarative binding demo here: http://jsfiddle.net/hm514aj8/10/

```
// Listen to DOM events
Keen.listenTo({
	// Form submits and clicks will be delayed (configurable)

	"submit form#my-fancy-form": function(e){
		client.recordEvent("signup");
	},

	"click .nav > a": function(e){
		client.recordEvent("user_action", { type: "click" });
	},

	"mouseover .nav > a.login": function(e){
		client.recordEvent("user_action", { type: "mouseover" });
	}
});

Keen.listenTo({ "submit form": function(e){ ... } });

// Override DOM event timeouts (defaults shown)
Keen.deferDomEvents("A", "click", 500);
Keen.deferDomEvents("FORM", "submit", 500);

```

#### Window events

```
Keen.listenTo({
	"scroll window": function(e){
		// update engagement helper's scroll tracking
	},
	"unload window": function(e){
		// kick out a synchronous request
	}
});
```

**Supported events:**

* blur
* click
* dblclick
* error
* focus
* hashchange
* keydown
* keypress
* keyup
* onload
* mousedown
* mousemove
* mouseout
* mouseover
* mouseup
* resize
* unload


```
/* Alternate interface
	Pass in DOM elements or CSS selectors (sizzle.js) */
var form = document.getElementById('my-fancy-form');
client.listenTo(form, "submit", function(e){ ... });
client.listenTo(".nav > a.login", "click", function(e){ ... });
```


### Cookies

```
var session = Keen.utils.cookie("visitor-stats");
session.set("user_id", "222323843234");
session.get("user_id"); // "222323843234"
session.get(); // { user_id: "222323843234" }
session.clear();
```

### Timers

```
var userActivity = Keen.utils.timer();
userActivity.start();
userActivity.pause();
userActivity.value();
userActivity.clear();
// Start from a given number
var historicalActivity = Keen.utils.timer(312413123123).start();
historicalActivity.pause();
```


### Helpers

These helpers can be passed into `client.extendEvent(s)` method(s) to construct and attach common sets of properties.

```
Keen.helpers = {
	getBrowserProfile: function(){
		return {
			"cookies" : navigator.cookieEnabled,
			"screen"  : Keen.helpers.getScreenProperties(),
			"window"  : Keen.helpers.getWindowProperties()
		};
	},
	getDatetimeIndex: function(obj){
		var date = obj || new Date();
		return {
			"hour_of_day"    : date.getHours(),
			"day_of_week"    : parseInt( 1 + date.getDay() ),
			"day_of_month"   : date.getDate(),
			"month"          : parseInt( 1 + date.getMonth() ),
			"year"           : date.getFullYear()
		};
	},
	getDomEventProfile: function(e){
		return {
			"innerText": e.target.innerText,
            "path": Keen.helpers.getDomPath(e.target).join(' > '),
            "tagName": e.target.tagName,
            "title": e.target.title
		};
	},
	getDomNodePath: function(el){
		// http://stackoverflow.com/a/16742828/2511985
		// returns something like "body > div#nav > ul > a#signup"
	},
	getEngagementInfo: function(){},
	getKitchenSink: function(){
		// applies all helpers
	},
	getRandomId: function(){},
	getScreenProperties: function(){},
	getWindowProperties: function(){}
};

```

## Example Setup

```
var client = new Keen.Client({});

Keen.listenTo({
	"submit form#signup": function(e){
		var userEmail = document.getElementById("signup-email").value;
		client.recordEvent("user signup", {
			"interaction": {
				"type": "submit"
			},
			"visitor": {
				"email": userEmail
			}
		});
	},
	"error window": function(e){
		// Report a JavaScript error
	}
});

client.extendEvents(function(){
	return {
		"engagement": Keen.helpers.getEngagementInfo(),
		"interaction": {
			"event": Keen.helpers.getDomEventProfile(),
			"target": Keen.helpers.getDomNodePath()
		},
		"page": {
			title: document.title,
			href: document.href
		},
		"tech": Keen.helpers.getBrowserProfile(),
		"time": Keen.helpers.getDatetimeIndex(),
		"visitor": {
			"id": Keen.helpers.getRandomId()
		},
		"keen": {
			"timestamp": new Date().toISOString()
		}
	};
});

client.recordEvent("pageview");
```

### Inspect event stream

```
Keen.debug(true);
client.on("all", Keen.log);
client.on("recordEvent", Keen.log);
client.on("recordEvents", Keen.log);
client.on("deferEvent", Keen.log);
client.on("deferEvents", Keen.log);
client.on("recordDeferredEvents", Keen.log);
client.on("extendEvent", Keen.log);
client.on("extendEvents", Keen.log);
```
