export function getBattery() {
  if (!('getBattery' in navigator || ('battery' in navigator && 'Promise' in window))) {
    return 'navigator.battery is not supported';
  }

  let batteryPromise;

  if ('getBattery' in navigator) {
    batteryPromise = navigator.getBattery();
  } else {
    batteryPromise = Promise.resolve(navigator.battery);
  }

  return batteryPromise
  .then(battery => battery)
  .catch(err => console.error(err));

}