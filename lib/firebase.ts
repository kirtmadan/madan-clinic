// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
