// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbDoaKF1UnUPveM0_zkHBoL6ZKvdoHo60",
  authDomain: "reactjsfirebase-c35c9.firebaseapp.com",
  projectId: "reactjsfirebase-c35c9",
  storageBucket: "reactjsfirebase-c35c9.firebasestorage.app",
  messagingSenderId: "413294050206",
  appId: "1:413294050206:web:87ced14c663937b66d348f",
  measurementId: "G-5XGTSCMYSE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default auth;