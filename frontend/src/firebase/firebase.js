import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "consulthub-dadf4",
  storageBucket: "consulthub-dadf4.firebasestorage.app",
  messagingSenderId: "357533254388",
  appId: "1:357533254388:web:6c082f02aba9ca7e9a54a1",
  measurementId: "G-N7705NHV6Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
