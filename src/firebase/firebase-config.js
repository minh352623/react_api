// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdSTeRasL_iYXj6YVteRAE_SvwcOZOmeI",
  authDomain: "notify-78e4c.firebaseapp.com",
  projectId: "notify-78e4c",
  storageBucket: "notify-78e4c.appspot.com",
  messagingSenderId: "981759831648",
  appId: "1:981759831648:web:2f957b76cd8c62cb6edd05",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
