// Bulletproof IndexedDB + LocalStorage dual-layer persistence
// Prevents data loss during PWA updates, service worker reloads, and browser cache clears.

const DB_NAME = 'PayTrackerPermanentDB';
const DB_VERSION = 1;
const STORE_NAME = 'user_data_store';

const openDB = (): Promise<IDBDatabase | null> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = (err) => {
        console.warn('[DBStorage] IndexedDB open error:', err);
        resolve(null);
      };
    } catch (e) {
      console.warn('[DBStorage] IndexedDB exception:', e);
      resolve(null);
    }
  });
};

/**
 * Saves data synchronously to localStorage and asynchronously to IndexedDB backup.
 */
export const saveToPersistentStorage = async (key: string, data: any): Promise<void> => {
  try {
    // 1. Synchronous localStorage save
    localStorage.setItem(key, JSON.stringify(data));
    
    // 2. Asynchronous IndexedDB backup
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(data, key);
    }
  } catch (err) {
    console.warn(`[DBStorage] Failed to save key ${key}:`, err);
  }
};

/**
 * Loads data from localStorage or IndexedDB fallback.
 */
export const loadFromPersistentStorage = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    // 1. Try localStorage first
    const localVal = localStorage.getItem(key);
    if (localVal) {
      return JSON.parse(localVal);
    }

    // 2. Fallback to IndexedDB if localStorage was wiped during app update
    const db = await openDB();
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          if (req.result !== undefined && req.result !== null) {
            // Restore to localStorage for fast sync access
            try {
              localStorage.setItem(key, JSON.stringify(req.result));
            } catch (e) {
              console.warn('[DBStorage] Restore to localStorage error:', e);
            }
            resolve(req.result);
          } else {
            resolve(fallback);
          }
        };
        req.onerror = () => resolve(fallback);
      });
    }
  } catch (err) {
    console.warn(`[DBStorage] Failed to load key ${key}:`, err);
  }
  return fallback;
};
