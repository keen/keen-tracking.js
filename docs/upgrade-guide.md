# Upgrade Guide

There are several new methods and name changes from earlier versions of [keen-js](https://github.com/keen/keen-js), but fear not! We have included shims and legacy methods to make this library fully backward-compatible with the core functionality of keen-js, aside from one breaking change to the `client.url()` method (detailed below).


### Deprecated methods

The following legacy methods are now deprecated:

* `addEvent` and `addEvents` are now [`recordEvent`](./record-events.md) and [`recordEvents`](./record-events.md)
* `setGlobalProperties` is now handled by the [`extendEvents`](./extend-events.md) methods
* `trackExternalLinks` is now handled by the [DOM listeners](./listeners.md) utility (browser-only)

Please avoid using these deprecated methods, as they will eventually get axed. Deprecation messages will be visible in the developer console if [debugging](#debugging) is enabled.


### Breaking changes

The previous implementation of `client.url()` automatically included `https://api.keen.io/3.0/projects/PROJECT_ID` plus a `path` argument ('/events/whatever'). This design severely limited its utility, so we've revamped this method.

This method now references an internal collection of resource paths, and constructs URLs using client configuration properties like `host` and `projectId`:

```javascript
import KeenTracking from 'keen-tracking';
const client = new KeenTracking({ /*configure*/ });

const url = client.url('projectId');
// Renders {protocol}://{host}/3.0/projects/{projectId}
// Returns https://api.keen.io/3.0/projects/PROJECT_ID
```

Default resources:

* 'base': '`{protocol}`://`{host}`',
* 'version': '`{protocol}`://`{host}`/3.0',
* 'projects': '`{protocol}`://`{host}`/3.0/projects',
* 'projectId': '`{protocol}`://`{host}`/3.0/projects/`{projectId}`',
* 'events': '`{protocol}`://`{host}`/3.0/projects/`{projectId}`/events'

Unmatching strings will be appended to the base resource, like so:

```javascript
import KeenTracking from 'keen-tracking';
const client = new KeenTracking({ /*configure*/ });

const url = client.url('/3.0/projects');
// Returns https://api.keen.io/3.0/projects
```

You can also pass in an object to append a serialized query string to the result, like so:

```javascript
import KeenTracking from 'keen-tracking';
const client = new KeenTracking({ /*configure*/ });

const url = client.url('events', { api_key: 'YOUR_API_KEY' });
// Returns https://api.keen.io/3.0/projects/PROJECT_ID/events?api_key=YOUR_API_KEY
```

Resources can be returned or added with the `client.resources()` method, like so:

```javascript
import KeenTracking from 'keen-tracking';
const client = new KeenTracking({ /*configure*/ });

client.resources()
// Returns client.config.resources object

client.resources({
  'new': '{protocol}://analytics.mydomain.com/my-custom-endpoint/{projectId}'
});
client.url('new');
// Returns 'https://analytics.mydomain.com/my-custom-endpoint/PROJECT_ID'
```
