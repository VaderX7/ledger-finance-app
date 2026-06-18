import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLS4xgq2FKgByf4MxP7Jrdod5YoMLzOD4",
  authDomain: "ledger-finance-cc892.firebaseapp.com",
  projectId: "ledger-finance-cc892",
  storageBucket: "ledger-finance-cc892.firebasestorage.app",
  messagingSenderId: "443071266261",
  appId: "1:443071266261:web:3a4f2c09836816299e115c",
  measurementId: "G-E0HDPV9TD9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);
export { onAuthStateChanged } from 'firebase/auth';
export type { User };
