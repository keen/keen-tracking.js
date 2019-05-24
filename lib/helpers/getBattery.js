export function getBattery() {
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
