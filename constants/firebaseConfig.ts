import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {  
  apiKey: "AIzaSyCA49EYDbqUnYu1sXs0ETDMIGaWxtoxXOM",  
  authDomain: "reselling-store-c103e.firebaseapp.com",  
  databaseURL: "https://reselling-store-c103e-default-rtdb.firebaseio.com",  
  projectId: "reselling-store-c103e",  
  storageBucket: "reselling-store-c103e.firebasestorage.app",  
  messagingSenderId: "411682468136",  
  appId: "1:411682468136:web:79cc2b622148f42a62e01d",  
  measurementId: "G-9YREW04W1X"  
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
