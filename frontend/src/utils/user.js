import { doc, setDoc, getDoc, updateDoc, runTransaction } from "firebase/firestore";
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
  const user = getVerifiedUser();
  const snap = await getDoc(doc(db, "user-info", user.uid));
  return snap.exists() ? snap.data() : null;
};


export const deletePlaylist = async (trackingId) => {
  const user = getVerifiedUser();
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

export const updateFinishedCount = async (trackingId, finishedVideos) => {
  const user = getVerifiedUser();
  const userRef = doc(db, "user-info", user.uid);

  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      const playlists = data.playlists || [];

      const updatedPlaylists = playlists.map(playlist => {
        if (playlist.trackingId === trackingId) {
          return {
            ...playlist,
            finishedCount: finishedVideos.length
          };
        }
        return playlist;
      });

      await updateDoc(userRef, { playlists: updatedPlaylists });
    } else {
      console.warn("User document not found.");
    }
  } catch (err) {
    console.error("Error occurred: ", err);
  }
};