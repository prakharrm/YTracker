import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyB58Tb_t2GeSdwnlCaT0b-8LynnMe1TwnU",
  authDomain: "productivity-app-yt-tracker.firebaseapp.com",
  projectId: "productivity-app-yt-tracker",
  storageBucket: "productivity-app-yt-tracker.firebasestorage.app",
  messagingSenderId: "323799271126",
  appId: "1:323799271126:web:9423b3d7fc49344c25eb77",
  measurementId: "G-M5B2QEGWR3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app)