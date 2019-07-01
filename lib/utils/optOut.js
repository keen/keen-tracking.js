import { isLocalStorageAvailable } from './localStorage';

export function setOptOut(optOut = true) {
    if (!isLocalStorageAvailable) return;

    if (optOut) {
        localStorage.setItem('optout', optOut);
        return;
    }

    localStorage.removeItem('optout');
};
