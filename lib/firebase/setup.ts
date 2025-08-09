// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import {
  getAuth,
  indexedDBLocalPersistence,
  setPersistence,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKewRWTpRQ28l8ZM3cXjxEC1X0cke9COA",
  authDomain: "madan-clinic.firebaseapp.com",
  projectId: "madan-clinic",
  storageBucket: "madan-clinic.firebasestorage.app",
  messagingSenderId: "258872861879",
  appId: "1:258872861879:web:f79f49702eec30f3c75932",
  measurementId: "G-28K7ZMDFY2",
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
void setPersistence(auth, indexedDBLocalPersistence);

// export const analytics =
//   typeof window !== "undefined" ? getAnalytics(app) : null;
