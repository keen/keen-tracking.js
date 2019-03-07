export function setOptOut(optOut = true) {
    if (optOut) {
        localStorage.setItem('optout', optOut);
    } else {
        localStorage.removeItem('optout');
    }
  }
