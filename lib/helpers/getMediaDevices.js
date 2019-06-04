export function getMediaDevices() {
  if (!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)) return;

  return navigator.mediaDevices.enumerateDevices()
    .then(devices => devices)
    .catch(err => console.error(err))
}
