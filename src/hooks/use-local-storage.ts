'use client';
import { useState, useEffect } from 'react';

// A custom hook for managing state in localStorage.
// It now correctly initializes state only once.
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  
  // This function is passed to useState and runs only on the initial render.
  // This prevents re-reading from localStorage on every render.
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Dispatch a custom event to notify other tabs/windows of the change.
        window.dispatchEvent(new Event("local-storage"));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  useEffect(() => {
    // This effect listens for changes in localStorage from other tabs.
    const handleStorageChange = (event: StorageEvent | CustomEvent) => {
      // For 'storage' events, check if the key matches.
      if (event instanceof StorageEvent && event.key !== key) {
        return;
      }

      if (typeof window !== 'undefined') {
        try {
          const item = window.localStorage.getItem(key);
          setStoredValue(item ? JSON.parse(item) : initialValue);
        } catch (error) {
          console.warn(`Error reading localStorage key “${key}” on change:`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
    // Adding initialValue and key to dependency array to be thorough,
    // although they are not expected to change.
  }, [key, initialValue]);

  return [storedValue, setValue];
}
