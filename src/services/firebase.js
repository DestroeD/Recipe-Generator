import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8U0mz1u_Wa5UFcLNUn_p9mBlWUbY3sfo",
  authDomain: "recipe-generator-d24d9.firebaseapp.com",
  projectId: "recipe-generator-d24d9",
  storageBucket: "recipe-generator-d24d9.firebasestorage.app",
  messagingSenderId: "256540165070",
  appId: "1:256540165070:web:5a29d8ec82c5b94b01e19f",
  measurementId: "G-VJGBWQ5G7X"
};

const app = initializeApp(firebaseConfig);

// Експортуємо сервіси
export const auth = getAuth(app);
export const db = getFirestore(app);
