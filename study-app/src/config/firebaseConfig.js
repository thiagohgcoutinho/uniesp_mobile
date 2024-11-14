import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyBpd5OfC4Gbl4zvH7iGhKO3pKHdFMFgtZM",
  authDomain: "study-app-56d76.firebaseapp.com",
  projectId: "study-app-56d76",
  storageBucket: "study-app-56d76.firebasestorage.app",
  messagingSenderId: "8065312101",
  appId: "1:8065312101:web:e3e0d6136df3a57bca6d8c"
}


const app = !getApps.length ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)