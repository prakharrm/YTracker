import { auth, db } from "../firebase-config";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import axios from "axios";

export const trackeNewPlaylist = async (playlistURI, ensureAuth) => {
  const user = auth.currentUser;

  if (!user) {
    ensureAuth();
    return {
      success: false,
      message: "Please sign in to continue.",
    };
  }

  const userDocRef = doc(db, "user-info", user.uid);
  const docSnap = await getDoc(userDocRef);

  const urlParams = new URLSearchParams(playlistURI);
  const playlistId = urlParams.get("list");
  if (!playlistId) {
    return {
      success: false,
      message: "Please enter valid playlist link.",
    };
  }
  let trackingId = uuidv4();

  if (docSnap.exists()) {
    const data = docSnap.data();

    //checks if the playlist already exists
    const playlistExists = data.playlists.some((elm) => {
      if (elm.playlistId === playlistId) {
        trackingId = elm.trackingId;
        return true;
      }
      return false;
    });

    if (playlistExists) {
      return {
        // MIGHT CHANGE THIS LATER AS OF NOW JUST RESPONDING WITH EXISTING DATA IN FIRESTORE
        //   success: false,
        //   message: "This playlist already exists.",

        //
        success: true,
        message: "Playlist is already being tracked",
        playlistId: playlistId,
        trackingId: trackingId,
        //
      };
    }

    if (data.playlists.length < 5) {
      await updateDoc(userDocRef, {
        playlists: arrayUnion({
          trackingId: trackingId,
          playlistId: playlistId,
        }),
      });
      return {
        success: true,
        message: "Playlist added successfully!",
        playlistId: playlistId,
        trackingId: trackingId,
      };
    } else {
      return {
        success: false,
        message: "You can only track up to 5 playlists.",
      };
    }
  } else {
    await setDoc(userDocRef, {
      "user-id": user.uid,
      playlists: [{ trackingId: trackingId, playlistId: playlistId }],
    });
    return {
      success: true,
      message: "Playlist added successfully!",
      playlistId: playlistId,
      trackingId: trackingId,
    };
  }
};

export const fetchNewPlaylist = async (
  trackingId,
  playlistId,
  setSelectedVideo,
  setCurrentPage,
  setNextPage,
  setPrevPage
) => {
  try {
    const user = auth.currentUser;
    const userDocRef = doc(db, "user-info", user.uid);
    const docSnap = await getDoc(userDocRef);

    const data = docSnap.data();

    if (!docSnap.exists() || !data["user-id"] === user.uid) {
      return;
    }

    const response = await axios.get(
      `http://localhost:5000/tracker/${trackingId}`,
      {
        params: { playlistId },
      }
    );

    setSelectedVideo(response.data.items[0].id);

    setNextPage(response.data.nextPageToken);
    setPrevPage(response.data.prevPageToken);

    return response.data;
  } catch (err) {
    console.error("Error fetching playlist:", err);
  }
};

export const changePlaylistPage = async (
  playlistId,
  token,
  setNextPage,
  setPrevPage,
  setCurrentPage
) => {
  const response = await axios.get(
    `http://localhost:5000/api/change-playlist-page`,
    {
      params: { playlistId, token },
    }
  );
  setCurrentPage(token);
  setNextPage(response.data.nextPageToken);
  setPrevPage(response.data.prevPageToken);
  return response.data;
};

export const fetchTrackerState = async (
  trackingId,
  playlistId,
  currentPage,
  nextPage,
  prevPage
) => {
  try {
    const user = auth.currentUser;
    const userDocRef = doc(db, "user-info", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {

    } 

  } catch (err) {
    console.error("error: ", err);
  }
};
