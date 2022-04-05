// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhTAdQJpRBvPXX2JOkR2xp8MuSTjdx6KI",
  authDomain: "house-marketplace-anna-devs.firebaseapp.com",
  projectId: "house-marketplace-anna-devs",
  storageBucket: "house-marketplace-anna-devs.appspot.com",
  messagingSenderId: "910924680731",
  appId: "1:910924680731:web:f5b226a78069210946f2be",
  measurementId: "G-YDM0PB69DM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore()