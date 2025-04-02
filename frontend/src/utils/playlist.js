import { auth, db } from "../firebase-config";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import axios from "axios";

export const fetchPlaylistId = async (trackingId) => {
  const user = auth.currentUser;

  if (!user) {
    console.error("user not found");
  }

  const userDocRef = doc(db, "user-info", user.uid);
  const docSnap = await getDoc(userDocRef);
  const data = docSnap.data();

  if (user.uid === data["user-id"] && docSnap.exists()) {
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

  //fetching playlist title

  const response = await axios.get(`http://localhost:5000/api/title`, {
    params: { playlistId },
  });

  let trackingId = uuidv4();
  const data = docSnap.data();

  if (user.uid === data["user-id"] && docSnap.exists()) {
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
          videoCount: response.data.videoCount
        }),
      });
      return {
        success: true,
        message: "Playlist added successfully!",
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
          videoCount: response.data.videoCount
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
  setTotalVideo
) => {
  try {
    const user = auth.currentUser;

  if (!user) {
    console.error("user not found");
  }
    const userDocRef = doc(db, "user-info", user.uid);
    const userPlaylistDocRef = doc(db, "user-playlist-info", trackingId);

    const userdocSnap = await getDoc(userDocRef);
    const userPlaylistSnap = await getDoc(userPlaylistDocRef);

    const data = userdocSnap.data();
    const playlistData = userPlaylistSnap.data();

    if (!userdocSnap.exists() || !data["user-id"] === user.uid) {
      return;
    }

    const response = await axios.get(
      `http://localhost:5000/tracker/${trackingId}`,
      {
        params: { playlistId },
      }
    );

    if (user.uid === data["user-id"] && userPlaylistSnap.exists()) {
      setSelectedVideo(playlistData["currentVideo"]);
      setNextPage(playlistData["next-page"]);
      setPrevPage(playlistData["prev-page"]);
      setFinishedVideo(playlistData["finished-video"]);
    } else {
      setDoc(userPlaylistDocRef, {
        currentVideo: response.data.items[0].id,
        "next-page": response.data.nextPageToken,
        "prev-page": response.data.prevPageToken,
        "tracking-id": trackingId,
        "playlist-id": playlistId,
        "user-id": user.uid,
        "finished-video": [],
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
  const user = auth.currentUser;

  if (!user) {
    console.error("user not found");
  }
  const response = await axios.get(
    `http://localhost:5000/api/change-playlist-page`,
    {
      params: { playlistId, token },
    }
  );
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
  finishedVideos
) => {
  try {
    const user = auth.currentUser;

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
    });
  } catch (err) {
    console.error("error: ", err);
  }
};
