export function setOptOut(optOut = true) {
    if (optOut) {
        localStorage.setItem('optout', optOut);
        return;
    }

    localStorage.removeItem('optout');
};
