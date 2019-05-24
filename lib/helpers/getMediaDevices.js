export function getMediaDevices() {
  return navigator.mediaDevices.enumerateDevices()
  .then(devices => devices)
  .catch(err => console.error(err))
}
