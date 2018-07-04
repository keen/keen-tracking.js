export function getUniqueId() {
  // uuidv4
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // browser
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  } else {
    // node & older browsers
    let str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return str.replace(/[xy]/g, function(c) {
      let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
}
