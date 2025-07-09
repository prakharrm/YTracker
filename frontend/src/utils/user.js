import { doc, setDoc, getDoc, runTransaction } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase-config";

export const initializeAuthListener = (setUser, setLoading) => {
  return onAuthStateChanged(auth, async (userInfo) => {
    setUser(userInfo);
    setLoading(false);

    if (userInfo) {
      await ensureUserDoc(userInfo);  // only create user doc if missing
    }
  });
};


export const ensureUserDoc = async (user) => {
  if (!user) return;

  const userDocRef = doc(db, "user-info", user.uid);

  try {
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      await setDoc(userDocRef, {
        userUid: user.uid,
        playlists: [],
      });
    }
  } catch (err) {
    console.error("[ensureUserDoc] Failed:", err);
  }
};


export const getVerifiedUser = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not signed in.");
  }
  return user;
};


export const profile = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("[profile] No signed‑in user");
    return null;
  }

  const snap = await getDoc(doc(db, "user-info", user.uid));
  return snap.exists() ? snap.data() : null;
};


export const deletePlaylist = async (trackingId) => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("[deletePlaylist] No signed‑in user");
    return;
  }

  const userDocRef = doc(db, "user-info", user.uid);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(userDocRef);
    if (!snap.exists()) {
      console.warn("[deletePlaylist] User doc missing");
      return;
    }

    const { playlists = [] } = snap.data();
    const updated = playlists.filter((pl) => pl.trackingId !== trackingId);
    tx.update(userDocRef, { playlists: updated });
  });
};
