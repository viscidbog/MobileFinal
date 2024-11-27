// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnIEOhzb5mHSSIidT9pbNDPW6_wrmaYWY",
  authDomain: "kotinen-app.firebaseapp.com",
  databaseURL: "https://kotinen-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kotinen-app",
  storageBucket: "kotinen-app.firebasestorage.app",
  messagingSenderId: "742096630247",
  appId: "1:742096630247:web:d11b025f0468797d6b8d42",
  measurementId: "G-H1NGEXFRJ5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
