import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");

export const githubProvider = new GithubAuthProvider();

export default auth;