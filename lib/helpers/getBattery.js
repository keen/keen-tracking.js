export function getBattery() {
  if (!('getBattery' in navigator || 'battery' in navigator)) return;

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
