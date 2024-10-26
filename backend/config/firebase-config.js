// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCptAd_JnqvAGC0kSHySLfSC3xRwYCo9EE",
  authDomain: "verifyit-f0cae.firebaseapp.com",
  projectId: "verifyit-f0cae",
  storageBucket: "verifyit-f0cae.appspot.com",
  messagingSenderId: "266072102489",
  appId: "1:266072102489:web:caf74d715783ac09cbc348",
  measurementId: "G-W78W2F4ZH2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth,app};