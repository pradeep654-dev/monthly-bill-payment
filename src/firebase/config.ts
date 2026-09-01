import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import type { PaymentItem, PaymentTemplate } from '../types';

const STORAGE_KEY_FIREBASE_CONFIG = 'paytracker_firebase_config_v1';

export interface FirebaseSyncConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  syncCode?: string;
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export const getSavedFirebaseConfig = (): FirebaseSyncConfig | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_FIREBASE_CONFIG);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse saved firebase config', e);
  }
  return null;
};

export const saveFirebaseConfig = (config: FirebaseSyncConfig) => {
  localStorage.setItem(STORAGE_KEY_FIREBASE_CONFIG, JSON.stringify(config));
  initFirebase(config);
};

export const clearFirebaseConfig = () => {
  localStorage.removeItem(STORAGE_KEY_FIREBASE_CONFIG);
  app = null;
  db = null;
  auth = null;
};

export const initFirebase = (config?: FirebaseSyncConfig | null): { db: Firestore | null; auth: Auth | null } => {
  const targetConfig = config || getSavedFirebaseConfig();
  if (!targetConfig || !targetConfig.apiKey || !targetConfig.projectId) {
    return { db: null, auth: null };
  }

  try {
    if (!getApps().length) {
      app = initializeApp(targetConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    auth = getAuth(app);
    return { db, auth };
  } catch (e) {
    console.error('Error initializing Firebase:', e);
    return { db: null, auth: null };
  }
};

export const pushDataToCloud = async (
  syncCode: string,
  data: { payments: PaymentItem[]; templates: PaymentTemplate[] }
): Promise<boolean> => {
  if (!db) {
    const { db: newDb } = initFirebase();
    if (!newDb) return false;
  }
  if (!db) return false;

  try {
    const cleanSyncCode = syncCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!cleanSyncCode) return false;

    const docRef = doc(db, 'user_syncs', cleanSyncCode);
    await setDoc(docRef, {
      version: 1,
      lastUpdated: new Date().toISOString(),
      payments: data.payments,
      templates: data.templates
    }, { merge: true });
    return true;
  } catch (e) {
    console.error('Failed to push data to Cloud Firestore:', e);
    return false;
  }
};

export const subscribeToCloudSync = (
  syncCode: string,
  onDataReceived: (data: { payments: PaymentItem[]; templates: PaymentTemplate[] }) => void
): (() => void) | null => {
  if (!db) {
    const { db: newDb } = initFirebase();
    if (!newDb) return null;
  }
  if (!db) return null;

  const cleanSyncCode = syncCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!cleanSyncCode) return null;

  try {
    const docRef = doc(db, 'user_syncs', cleanSyncCode);
    const unsubscribe = onSnapshot(docRef, snapshot => {
      if (snapshot.exists()) {
        const cloudData = snapshot.data();
        if (Array.isArray(cloudData.payments)) {
          onDataReceived({
            payments: cloudData.payments,
            templates: Array.isArray(cloudData.templates) ? cloudData.templates : []
          });
        }
      }
    }, err => {
      console.error('Cloud Sync listener error:', err);
    });
    return unsubscribe;
  } catch (e) {
    console.error('Failed to subscribe to Cloud Sync:', e);
    return null;
  }
};
