const beaconRecordEvents = (url, events) => {
  if (!navigator.sendBeacon) return;
  const data = JSON.stringify(events);
  navigator.sendBeacon(url, data);
}

export default (url, events) => {
    if (typeof window !== 'undefined') {
      window.addEventListener("unload", beaconRecordEvents(url, events), false);
    }
    // todo handling service worker
};
