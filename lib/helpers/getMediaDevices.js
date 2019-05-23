export function getMediaDevices() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return 'navigator.mediaDevices is not supported';
  }

  return navigator.mediaDevices.enumerateDevices()
  .then(devices => devices)
  .catch(err => console.error(err))

  // navigator.mediaDevices.enumerateDevices()
  // .then(devices => {
  //   // console.log('devices ', devices);
  //   obj.mediaDevices = devices
  //   // return devices;
  // })
  // .catch(err => console.error(err.message));

  // return obj;
}

// function getData() {
//   const devices = async () => {
//     await navigator.mediaDevices.enumerateDevices()
//   .then(devices => devices)
//   .catch(err => console.error(err.message));
//   };

//   return {
//     window: window,
//     devices: devices()
//   }
// }

// let a;

// async function getData() {
//   a = await navigator.mediaDevices.enumerateDevices();
//   return a;
// }

// getData();
// console.log(a)