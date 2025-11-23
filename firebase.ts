import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBn8PQodjH3IWmzZuOeKbcTx3Xpmz0fEV0",
  authDomain: "unichoice-1a52e.firebaseapp.com",
  databaseURL: "https://unichoice-1a52e-default-rtdb.firebaseio.com",
  projectId: "unichoice-1a52e",
  storageBucket: "unichoice-1a52e.firebasestorage.app",
  messagingSenderId: "649554228740",
  appId: "1:649554228740:web:f47564000c9a4e24afe751",
  measurementId: "G-JZ4MK45ZM5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, db, auth, googleProvider };
export default app;