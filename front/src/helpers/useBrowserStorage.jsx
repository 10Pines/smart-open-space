import { useState } from 'react';
import { 
  getLocalStorage, setLocalStorage, 
  getSessionStorage, setSessionStorage 
} from '#helpers/browserStorage.js';

const useBrowserStorage = (key, initialValue, isLocalStorage=true) => {

  const getStorage = isLocalStorage 
    ? getLocalStorage 
    : getSessionStorage;

  const setStorage = isLocalStorage 
    ? setLocalStorage 
    : setSessionStorage;

  const [storedValue, setStoredValue] = useState(() => {
    return getStorage(key, initialValue);
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue)
        : value;
      setStoredValue(valueToStore);
      setStorage(key, valueToStore);
    } catch (error) {
      console.error('error useBrowserStorage.setValue', error);
    }
  };

  return [storedValue, setValue];
};

export default useBrowserStorage;