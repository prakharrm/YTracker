import { auth, googleProvider } from "./firebase-config";
import { signInWithPopup, signOut } from "firebase/auth";

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error(err);
  }
};
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
  } 
};


