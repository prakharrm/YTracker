import { auth, db } from "../firebase-config";
import { doc, setDoc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";


export const getNotes = async (trackingId, videoId, setNotes) => {
  const user = auth.currentUser;

  console.log("user check in here", user);
  if (!user) {
    console.error("user not found");
  }

  const notesDocRef = doc(db, "notes", trackingId, videoId);
  const docSnap = await getDoc(notesDocRef);
  const data = docSnap.data();

  if(docSnap.exists()) {
    setNotes(data.notes);
  } else {
    setNotes([]);
  }
};


export const trackNotes = async (trackingId, videoId, notes) => {
  const user = auth.currentUser;

  console.log("user check in here", user);
  if (!user) {
    console.error("user not found");
  }

  const notesDocRef = doc(db, "notes", trackingId, videoId);
  const docSnap = await getDoc(notesDocRef);
  const data = docSnap.data();

  if(docSnap.exists() && user.uid === data["user-id"] ) {
    await updateDoc(notesDocRef, {
        "user-id" : user.uid,
        "notes" : notes
    })
  } else {
    await setDoc(notesDocRef, {
        "user-id" : user.uid,
        "notes" : notes
    })
  }
};
