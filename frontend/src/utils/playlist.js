import { db } from "../firebase-config";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { getVerifiedUser } from "./user";
import axios from "axios";

const BASE_URL =
  `http://localhost:5000/api` || `https://ytracker-uohc.onrender.com/api`;

export const fetchPlaylistId = async (trackingId) => {
  const user = getVerifiedUser();

  if (!user) {
    console.error("user not found");
  }

  const userDocRef = doc(db, "user-info", user.uid);
  const docSnap = await getDoc(userDocRef);
  const data = docSnap.data();

  if (docSnap.exists() && user.uid === data["user-id"]) {
    try {
      const playlist = data.playlists.find(
        (elm) => elm.trackingId === trackingId
      );
      if (playlist) {
        return playlist.playlistId;
      }
    } catch (err) {
      console.error("Error fetching playlist:", err);
    }
  } else {
    return {
      success: false,
      message: "Please enter valid playlist link.",
    };
  }
};

export const trackeNewPlaylist = async (playlistURI, ensureAuth) => {
  const user = getVerifiedUser();

  if (!user) {
    ensureAuth();
    return {
      success: false,
      message: "Please sign in to continue.",
    };
  }

  const userDocRef = doc(db, "user-info", user.uid);
  const docSnap = await getDoc(userDocRef);

  const url = new URL(playlistURI);
  const urlParams = new URLSearchParams(url.search);
  const playlistId = urlParams.get("list");
  if (!playlistId) {
    return {
      success: false,
      message: "Please enter valid playlist link.",
    };
  }

  //fetching playlist title

  const response = await axios.get(`${BASE_URL}/title`, {
    params: { playlistId },
  });

  let trackingId = uuidv4();
  const data = docSnap.data();

  if (docSnap.exists() && user.uid === data["user-id"]) {
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
          title: response.data.title,
          cover: response.data.cover,
          videoCount: response.data.videoCount,
        }),
      });
      return {
        success: true,
        message: "Playlist added successfully!",
        trackingId: trackingId,
        playlistId: playlistId,
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
      playlists: [
        {
          trackingId: trackingId,
          playlistId: playlistId,
          title: response.data.title,
          cover: response.data.cover,
          videoCount: response.data.videoCount,
        },
      ],
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
  setPrevPage,
  setItems,
  setFinishedVideo,
  setTotalVideo,
  setFlagVideos
) => {
  try {
    const user = getVerifiedUser();

    const userPlaylistDocRef = doc(db, "user-playlist-info", trackingId);
    const userPlaylistSnap = await getDoc(userPlaylistDocRef);

    const playlistData = userPlaylistSnap.data();

    const response = await axios.get(`${BASE_URL}/tracker/${trackingId}`, {
      params: { playlistId },
    });

    if (userPlaylistSnap.exists()) {
      setSelectedVideo(playlistData["currentVideo"]);
      setNextPage(playlistData["next-page"]);
      setPrevPage(playlistData["prev-page"]);
      setFinishedVideo(playlistData["finished-video"]);
      setFlagVideos(playlistData["flag-videos"]);
    } else {
      setDoc(userPlaylistDocRef, {
        currentVideo: response.data.items[0].id,
        "next-page": response.data.nextPageToken,
        "prev-page": response.data.prevPageToken,
        "tracking-id": trackingId,
        "playlist-id": playlistId,
        "user-id": user.uid,
        "finished-video": [],
        "flag-videos": [],
      });

      console.log("response", response);

      setSelectedVideo(response.data.items[0].id);
      setNextPage(response.data.nextPageToken);
      setPrevPage(response.data.prevPageToken);
    }

    setTotalVideo(response.data.totalVideos);
    setItems(response.data.items);
  } catch (err) {
    console.error("Error fetching playlist:", err);
  }
};

export const changePlaylistPage = async (
  playlistId,
  token,
  setNextPage,
  setPrevPage,
  setCurrentPage,
  setItems
) => {
  const user = getVerifiedUser();

  if (!user) {
    console.error("user not found");
  }
  const response = await axios.get(`${BASE_URL}/change-playlist-page`, {
    params: { playlistId, token },
  });
  setCurrentPage(token);
  setNextPage(response.data.nextPageToken);
  setPrevPage(response.data.prevPageToken);
  setItems(response.data.items);
};

//update firebase user-playlist-info if any changes
export const updateTrackerState = async (
  trackingId,
  playlistId,
  currentPage,
  nextPage,
  prevPage,
  selectedVideo,
  finishedVideos,
  flagVideos
) => {
  try {
    const user = getVerifiedUser();

    if (!user) {
      console.error("user not found");
    }

    const userDocRef = doc(db, "user-playlist-info", trackingId);

    await updateDoc(userDocRef, {
      currentVideo: selectedVideo,
      "next-page": nextPage,
      "playlist-id": playlistId,
      "prev-page": prevPage,
      "tracking-id": trackingId,
      "user-id": user.uid,
      "finished-video": finishedVideos,
      "flag-videos": flagVideos,
    });
  } catch (err) {
    console.error("error: ", err);
  }
};

// user search query through search button
export const searchGemini = async (searchQuery) => {
  const user = getVerifiedUser();

  if (!user) {
    return;
  }

  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: { searchQuery },
    });
    return response.data;
  } catch (err) {
    console.error("error: ", err);
  }
};

// export const markForLater = async (
//   trackingId,
//   playlistId,
//   currentPage,
//   nextPage,
//   prevPage,
//   selectedVideo,
//   finishedVideos
// ) => {
//   try {
//     const user = getVerifiedUser();

//     if (!user) {
//       console.error("user not found");
//     }

//     const userDocRef = doc(db, "user-playlist-info", trackingId);

//     await updateDoc(userDocRef, {
//       currentVideo: selectedVideo,
//       "next-page": nextPage,
//       "playlist-id": playlistId,
//       "prev-page": prevPage,
//       "tracking-id": trackingId,
//       "user-id": user.uid,
//       "finished-video": finishedVideos,
//     });
//   } catch (err) {
//     console.error("error: ", err);
//   }
// };
