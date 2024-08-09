// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
// const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
// const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
// const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
// const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
// const appId = import.meta.env.VITE_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: "AIzaSyCZOXmYkF3Ro3AneXvQLm25HOjCqQzF6Bc",
  authDomain: "boctrust-62237.firebaseapp.com",
  projectId: "boctrust-62237",
  storageBucket: "boctrust-62237.appspot.com",
  messagingSenderId: "888735370405",
  appId: "1:888735370405:web:93d27b740c519e0598d14c"
};



// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
