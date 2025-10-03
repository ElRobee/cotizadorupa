import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Comentamos Firebase Storage por ahora para evitar errores de build
// import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBwRKeZr6dCV2FDo_n3Gide4EHS5r0YFt4",
  authDomain: "cotizaciones-app-9bfd7.firebaseapp.com",
  projectId: "cotizaciones-app-9bfd7",
  storageBucket: "cotizaciones-app-9bfd7.firebasestorage.app",
  messagingSenderId: "53634767010",
  appId: "1:53634767010:web:71d2c6c51a042995b81ffb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Comentamos Storage por ahora
// export const storage = getStorage(app);
