import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyBMl_uX6ndE7Mrjb_jy0LZFKzixDg4S86s",
  authDomain: "psychologists-eb810.firebaseapp.com",
  databaseURL: "https://psychologists-eb810-default-rtdb.firebaseio.com",
  projectId: "psychologists-eb810",
  storageBucket: "psychologists-eb810.firebasestorage.app",
  messagingSenderId: "462048810706",
  appId: "1:462048810706:web:3c800d1093c1f2f3a27f0b"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getDatabase(app)
export default app