const getStorage = (isLocalStorage) => isLocalStorage
    ? window.localStorage
    : window.sessionStorage;

const getBrowserStorage = (key, defaultValue=undefined, isLocalStorage=true) => {
    try {
        const browserStorage = getStorage(isLocalStorage);
        const item = browserStorage.getItem(key);
        return item 
            ? JSON.parse(item) 
            : defaultValue;
    } catch (error) {
        console.error(`error getting in browser storage with isLocalStorage=${isLocalStorage} and key=${key}`, error);
        return defaultValue;
    }
};

const setBrowserStorage = (key, value, isLocalStorage=true) => {
    try {
        const browserStorage = getStorage(isLocalStorage);
        browserStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`error setting in browser storage with isLocalStorage=${isLocalStorage}, key=${key} and value=${value}`, error);
        return false;
    }
};

export const getLocalStorage = (key, defaultValue=undefined) => getBrowserStorage(key, defaultValue, true);
export const setLocalStorage = (key, value) => setBrowserStorage(key, value, true);

export const getSessionStorage = (key, defaultValue=undefined) => getBrowserStorage(key, defaultValue, false);
export const setSessionStorage = (key, value) => setBrowserStorage(key, value, false);