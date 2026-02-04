import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { FUNCTIONS_REGION } from "@/config/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, FUNCTIONS_REGION);

export const connectEmulatorsIfDev = () => {
  if (!import.meta.env.DEV) {
    return;
  }

  const authHost = import.meta.env.VITE_EMULATOR_AUTH_HOST || "localhost";
  const authPort = Number(import.meta.env.VITE_EMULATOR_AUTH_PORT || 9099);
  connectAuthEmulator(auth, `http://${authHost}:${authPort}`);

  const firestoreHost = import.meta.env.VITE_EMULATOR_FIRESTORE_HOST || "localhost";
  const firestorePort = Number(import.meta.env.VITE_EMULATOR_FIRESTORE_PORT || 8080);
  connectFirestoreEmulator(db, firestoreHost, firestorePort);

  const functionsHost = import.meta.env.VITE_EMULATOR_FUNCTIONS_HOST || "localhost";
  const functionsPort = Number(import.meta.env.VITE_EMULATOR_FUNCTIONS_PORT || 5001);
  connectFunctionsEmulator(functions, functionsHost, functionsPort);

  const storageHost = import.meta.env.VITE_EMULATOR_STORAGE_HOST || "localhost";
  const storagePort = Number(import.meta.env.VITE_EMULATOR_STORAGE_PORT || 9199);
  connectStorageEmulator(storage, storageHost, storagePort);
};

connectEmulatorsIfDev();
