/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc , setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCykjw_H8idiVDfwwXg8PWn7KIHFOb9S1A",
  authDomain: "finance-tracker-app-eb108.firebaseapp.com",
  projectId: "finance-tracker-app-eb108",
  storageBucket: "finance-tracker-app-eb108.appspot.com",
  messagingSenderId: "581279969310",
  appId: "1:581279969310:web:0beda20fa302f06baebe0f",
  measurementId: "G-RRPZ12DYX5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export{ db, auth, provider , doc, setDoc }