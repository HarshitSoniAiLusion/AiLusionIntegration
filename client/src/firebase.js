// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ailusionintegration.firebaseapp.com",
  projectId: "ailusionintegration",
  storageBucket: "ailusionintegration.appspot.com",
  messagingSenderId: "1050546755984",
  appId: "1:1050546755984:web:e77b135f7d25a41366bb15"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

