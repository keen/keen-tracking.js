<!--
<a name="{version}"></a>
# {version}
**FIXED:**
**NEW:**
**BREAKING:**
**CHANGE:**
-->
# AutoTracking - IP addresses
<a name="2.0.7"></a>

**New:**
* Turn off IP collecting with:
`client.initAutoTracking({
  collectIpAddress: false
});`

# Fetch & Promises
<a name="2.0.2"></a>

**New:**
* Fetch API is now the default method of communication.
* client.recordEvent returns a Promise

**FIXED:**
* auto-tracking listeners will wait more than 500ms if necessary

<a name="2.0.1"></a>

**FIXED:**
* Listener for HTML A tags containing downloadable base64 data. (#128 contributed by [hinaloe](https://github.com/hinaloe))

<a name="2.0.0"></a>
# Move from Gulp to Webpack / UMD

**NEW:**
* JS/dist files are now bundled by Webpack 4.8.3 - UMDs!

<a name="1.4.1"></a>
# 1.4.1 Fixes

**NEW:**
* Cookie sharing across subdomains: `client.initAutoTracking({ shareUuidAcrossDomains: true });` (#104 contributed by [jmousseau](https://github.com/jmousseau))

**FIXED:**
* Gracefully handle a tags without hrefs (#105)
* Avoid refreshing window when `href="#"` (#111)
* Don't attempt to clone a function attribute in deepExtend (#106)
* Record deferred events loop (#116)

<a name="1.4.0"></a>
# 1.4.0 Improved Protocol Handling and Dev Setup

**NEW:**
* Server-side tracking now respects the `"http"` value for `protocol` option, using the `http` module. Previously this always used `https`, regardless of the configuration value, which can cause issues for internal proxies (#82, via #92 contributed by [lukechilds](https://github.com/lukechilds))
* Auto-tracking now records `page.time_on_page` (seconds) for all events

**FIXED:**
* This project now builds and runs correctly in NodeJS v7 and v8 (#95, via #96 contributed by [lukechilds](https://github.com/lukechilds))


<a name="1.3.0"></a>
# 1.3.0 Automated Event Tracking (browser-only)

**NEW:**
* Ported functionality from the Web Auto Collector into this SDK: The interface and behaviors of this feature are a little different, but the data models produced are backward compatible (#83)
* New helper: `Keen.helpers.getScrollState()`: Return an object of properties profiling the current scroll state, and optionally pass this object back into the helper again to receive a new object with updated `pixel_max` and `ratio_max` values
* New helper: `Keen.helper.getDomNodeProfile(<ELEMENT>)`: Return an object containing properties profiling a given DOM node
* New utility: `Keen.utils.serializeForm(<FORM>, OPTIONS)`: Serialize the data of a form, with the option to ignore certain input types by passing in a `{ ignoreTypes: ['password'] }` option

**FIXED:**
* Wrap `JSON.parse()` in a `try/catch` block to mitigate error impact when the API returns un-parsable contents (#88)

**UPDATED:**
* Description meta tag content is now part of the `Keen.helpers.getBrowserProfile()` output when present


<a name="1.2.1"></a>
# 1.2.1 Fix queue polling

**FIXED:**
* Fixed a queue polling issue (#84) to prevent queue from polling until events are added to the queue, allowing scripts to close properly when queues are _not_ used
* Clear polling loop prior to replacing queue with a new one

<a name="1.2.0"></a>
# 1.2.0 Fix queue exiting

**FIXED:**
* Fixed queue handling (#76) to clear the internal `setInterval` loop and allow scripts using queues to exit properly
* Fixed async loader snippet (#77).

**UPDATED:**
* Updated tests and docs related to deferred event handling and queueing (#76).
* Updated docs about assigning DOM listeners to anchor tags with nested elements (#72).
* Include a UTC Datetime Index example in `docs/helpers.md` (#49, #70).


<a name="1.1.4"></a>
# 1.1.4 Bug fix for React Native

**FIXED:**
* Fixed `window.navigator` reference to avoid errors in environments that expose non-standard `window` objects, such as React Native.


<a name="1.1.3"></a>
# 1.1.3 Fix `recordEvents()` server usage

**FIXED:**
* This update fixes #66, where server usage of `recordEvents()` includes a trailing slash, resulting in a `ResourceNotFoundError` error.


<a name="1.1.2"></a>
# 1.1.2 Fix Resource Mapping

**NEW:**
* This patch installs `keen-core@0.1.2` and removes the internal `events` resource mapping (now in keen-core) to fix an issue with prototype inheritance and state.


<a name="1.1.1"></a>
# 1.1.1 Global Namespace Fix (Pt2)

**FIXED:**
* This patch isolates global namespace definition and installs `keen-core@0.1.1` to fix an issue where prototype methods of other SDKs were blended into this SDK's prototype.


<a name="1.1.0"></a>
# 1.1.0 Global Namespace Fix

**FIXED:**
* This library will now coalesce into a shared global `Keen` namespace, rather than colliding and overwriting other modular SDKs. Check out [keen-core.js@0.1.0](https://github.com/keen/keen-core.js/blob/master/CHANGELOG.md#010-manage-modular-namespace) for details about this fix.


<a name="1.0.3"></a>
# 1.0.3

**FIXED:**

* Minor update imports keen-core.js@0.0.3 with `Keen.ready(fn)` handler and an internal `domReady` function (previously part of this library, last bit of functionality to port over to keen-core.js)


<a name="1.0.2"></a>
# 1.0.2

**CHANGED:**
* Cookie values that are strings *or* JSON can be successfully retreived using the same `.get` function form the `Keen.utils.cookie` module. The `.get` function now intelligently decides whether to return a Javascript object or a simple string value.

<a name="1.0.1"></a>
# 1.0.1

**FIXED:**
* Event properties with `undefined` values no longer throw an error when used with `Keen.utils.extend`.


<a name="1.0.0"></a>
# 1.0.0

**NEW:**
* Move core client functionality to keen-core.js (PR #40).

**BREAKING:**
* Replaced [cookies-js](https://github.com/ScottHamper/Cookies) with [js-cookie](https://github.com/js-cookie/js-cookie). Cookies are now encoded properly, but will require a workaround (covered [here](./README.md#cookie-migration)) to fix previous cookie data.
* Removed `client.writePath()` method and `writePath` config option in favor of internal resource mapping and the `client.resources()` method.


<a name="0.1.1"></a>
# 0.1.1

**CHANGE:**
* Publish to bower


<a name="0.1.0"></a>
# 0.1.0

**CHANGE:**
* Reworked `.url()` method to use resource templates, with an internal collection that makes specific API URLS easy to request and customize.


<a name="0.0.5"></a>
# 0.0.5

**FIXED:**
* Define noop func when no callback is provided (fixes #34)


<a name="0.0.4"></a>
# 0.0.4

**FIXED:**
* Fix reference to proper lib file for server usage (#32)

**NEW:**
* Upgrade internal JSON dep to JSON3 (#33)


<a name="0.0.3"></a>
# 0.0.3

**FIXED:**
* Each `Keen.utils.cookie` instance now returns `null` for single undefined properties (#30)

**NEW:**
* Each `Keen.utils.cookie` instance now has an `.enabled()` method that returns `true` or `false`


<a name="0.0.2"></a>
# 0.0.2

**NEW:**
* Synchronous XHR option (#28, ported from keen-js)

**BREAKING:**
* `.recordEvent` XHR calls now use POST, mirroring previous keen-js functionality (#27).
* `client.url()`: The previous keen-js implementation of `client.url()` automatically included `https://api.keen.io/3.0/projects/PROJECT_ID` + a `path` argument ('/events/whatever'), which severely limited its value. It now only returns `https://api.keen.io` + the path argument.


<a name="0.0.1"></a>
# 0.0.1 Hello, world!

**NEW:**
* [Everything](./README.md) :)
