# Timers

`timer()` creates an object that tracks time, and can be paused, restarted, or initialized with a known value (seconds). It seems simple, but these little do-dads are excellent for recording the duration of sessions or specific interactions.

```javascript
import KeenTracking, { timer } from 'keen-tracking';

const userActivityTimer = timer();

// Start the timer
userActivityTimer.start();

// Pause the timer
userActivityTimer.pause();

// Return the value of the timer (seconds)
userActivityTimer.value(); // 10

// Clear the current value of the timer
userActivityTimer.clear();

// Start from a given number
const historicalActivityTimer = timer(3132).start();
historicalActivityTimer.pause();
```
