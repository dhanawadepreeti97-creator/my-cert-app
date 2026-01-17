import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // For history & templates
import { getAuth } from "firebase/auth";           // For organization login

const firebaseConfig = {
  apiKey: "AIzaSyAfnWSsQ8gs-Zm2rxq9bf-bYMXsg2zFlJ8",
  authDomain: "nexcert-a718b.firebaseapp.com",
  projectId: "nexcert-a718b",
  storageBucket: "nexcert-a718b.firebasestorage.app",
  messagingSenderId: "930636216606",
  appId: "1:930636216606:web:128bf3d89482b866b0710f",
  measurementId: "G-PFPL5CLWRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const analytics = getAnalytics(app);
export const db = getFirestore(app); // We will use 'db' for saving certificate data
export const auth = getAuth(app);    // We will use 'auth' for organization profiles

export default app;