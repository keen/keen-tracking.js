<!--
<a name="{version}"></a>
# {version}
**FIXED:**
**NEW:**
**BREAKING:**
**CHANGE:**
-->
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
