
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase-config";

export const initializeAuthListener = (setUser, setLoading) => {
  const unsubscribe = onAuthStateChanged(auth, async (userInfo) => {
    setUser(userInfo);
    setLoading(false);

    if (userInfo) {
      await handleUserUuid(userInfo);
    }
  });

  return unsubscribe;
};

export const handleUserUuid = async (user) => {
  if (!user) return;

  try {
    const userDocRef = doc(db, "user-info", user.uid);
    const docSnap = await getDoc(userDocRef);


    if (!docSnap.exists()) {
      await setDoc(userDocRef, {
        "user-id": user.uid,
        playlists: [],
      });

    } else {

    }
  } catch (err) {
    console.error("Error saving user data:", err);
  }
};


export const profile = async () => {

  const user = auth.currentUser;

  if (!user) {
    console.error("user not found");
  }

  const userDocRef = doc(db, "user-info", user.uid);
  const docSnap = await getDoc(userDocRef);
  const data = docSnap.data();


  return data;
};

export const deletePlaylist = async (trackingId) => {
  const user = auth.currentUser;

  if (!user) {
    console.error("user not found");
  }

  const userDocRef = doc(db, "user-info", user.uid);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const updatedPlaylistData = data.playlists.filter(
      (playlist) => playlist.trackingId !== trackingId);

    await updateDoc(userDocRef, {
      playlists: updatedPlaylistData,
    });
  } else {
    console.error("could not find playlists")
  }
};

