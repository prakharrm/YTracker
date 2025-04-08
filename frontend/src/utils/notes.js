import { auth, db } from "../firebase-config";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";


export const getNotes = async (trackingId, videoId, setNotes) => {
  const user = auth.currentUser;
  if (!user?.uid || !videoId) {
    console.error("Error getting the notes ");
    return;
  }

  const docRef = doc(db, "notes", `${trackingId}-${videoId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    setNotes(docSnap.data().notes || []);
  } else {
    setNotes([]); 
  }
};

export const trackNotes = async (trackingId, videoId, notes) => {
  const user = auth.currentUser;

  if (!user || !trackingId || !videoId) {
    console.error("Missing user, trackingId, or videoId");
    return;
  }

  const notesDocRef = doc(db, "notes", `${trackingId}-${videoId}`);
  const docSnap = await getDoc(notesDocRef);
  const data = docSnap.data();

  if (docSnap.exists() && user.uid === data["user-id"]) {
    await updateDoc(notesDocRef, {
      "user-id": user.uid,
      "notes": notes,
    });
  } else {
    await setDoc(notesDocRef, {
      "user-id": user.uid,
      "notes": notes,
    });
  }
};

