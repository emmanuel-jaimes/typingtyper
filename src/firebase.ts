import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Optional: for authentication
import { getFirestore } from "firebase/firestore"; // Optional: for Firestore
import { getStorage } from "firebase/storage"; // Optional: for Cloud Storage

// Firebase configuration 
const firebaseConfig = {
//   authDomain: "YOUR_AUTH_DOMAIN",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); //  authentication
export const db = getFirestore(app); //  Firestore
export const storage = getStorage(app); //  Cloud Storage

export default app;