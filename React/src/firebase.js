// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsRYVHKmSA2PAn9v62DIlrJ5TIxGMRb34",
  authDomain: "ultima-entrada.firebaseapp.com",
  projectId: "ultima-entrada",
  storageBucket: "ultima-entrada.firebasestorage.app",
  messagingSenderId: "232447094146",
  appId: "1:232447094146:web:b52ccc38234936bf8ef39b",
  measurementId: "G-HJDYM901QS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);