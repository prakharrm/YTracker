import { useEffect, useState, useRef } from "react";
import PlaylistNav from "../components/PlaylistNav";
import VideoPlayer from "../components/VideoPlayer";
import Notes from "../components/Notes";
import { useParams } from "react-router-dom";
import {
  fetchNewPlaylist,
  changePlaylistPage,
  updateTrackerState,
  fetchPlaylistId,
} from "../utils/playlist";
import UtilityButtons from "../components/UtilityButtons";
import { fetchResources } from "../utils/utilities";
import { updateFinishedCount } from "../utils/user";
function Tracker() {
  const { trackingId } = useParams();
  const [playlistId, setPlaylistId] = useState(null);

  const [items, setItems] = useState([]);
  const [finishedVideos, setFinishedVideo] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(); // current videos
  const [player, setPlayer] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [totalVideos, setTotalVideo] = useState(null);
  const [flagVideos, setFlagVideos] = useState([]); // flag video to watch later
  const [videoResource, setVideoResource] = useState(null);

  const notesRef = useRef();
  const finishedCountCallCountRef = useRef(0);
  const finishedCountTimeoutRef = useRef(null);
  const lastFinishedCountRef = useRef(null);



  const handleAddSearchNote = (title, content) => {
    if (notesRef.current) {
      notesRef.current.addSeachNote(title, content);
    }
  };

  async function loadPlaylist() {
    if (trackingId && playlistId) {
      try {
        await fetchNewPlaylist(
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
        );
      } catch (err) {
        console.error("an error occured: ", err);
      }
    }
  }

  async function handlePageChange(token) {
    if (playlistId) {
      await changePlaylistPage(
        playlistId,
        token,
        setNextPage,
        setPrevPage,
        setCurrentPage,
        setItems
      );
    }
  }

  useEffect(() => {
    const initializePlaylistId = async () => {
      if (trackingId) {
        const id = await fetchPlaylistId(trackingId);
        setPlaylistId(id);
      }
    };
    initializePlaylistId();
  }, [trackingId]);

  useEffect(() => {
    loadPlaylist();
  }, [playlistId]);

  useEffect(() => {
    if (trackingId && playlistId) {
      updateTrackerState(
        trackingId,
        playlistId,
        currentPage,
        nextPage,
        prevPage,
        selectedVideo,
        finishedVideos,
        flagVideos
      );
    }
  }, [
    currentPage,
    finishedVideos,
    nextPage,
    prevPage,
    selectedVideo,
    trackingId,
    playlistId,
    flagVideos,
  ]);

  //using delay to prevent unnecessary backend calls if the user is just going through videos and not actually watching the video
  useEffect(() => {
    if (!selectedVideo) return;

    const delay = setTimeout(() => {
      fetchResources(selectedVideo)
        .then((data) => {
          if (data && Array.isArray(data.items)) {
            setVideoResource(data);
          } else {
            console.warn("Invalid resource format", data);
            setVideoResource(null);
          }
        })
        .catch((err) => console.error("Failed to fetch resources:", err));
    }, 5000); // 5 sec delay

    return () => clearTimeout(delay);
  }, [selectedVideo]);

  // updating finished in count in user-info doc for profile cards, using 3sec debounce so that user cant call updateFinishedCount more than 10 times at a time
  useEffect(() => {
    if (!trackingId || !finishedVideos) return;

    // Check if the same number of finished videos was already updated
    const currentCount = finishedVideos.length;
    if (lastFinishedCountRef.current === currentCount) {
      return;
    }

    // Check call limit
    if (finishedCountCallCountRef.current >= 10) {
      console.warn("Maximum updateFinishedCount calls reached");
      return;
    }

    // Clear any pending update
    if (finishedCountTimeoutRef.current) {
      clearTimeout(finishedCountTimeoutRef.current);
    }

    // Debounce backend call
    finishedCountTimeoutRef.current = setTimeout(() => {
      updateFinishedCount(trackingId, finishedVideos);
      finishedCountCallCountRef.current += 1;
      lastFinishedCountRef.current = currentCount;
    }, 3000); // 3 second debounce

    return () => {
      if (finishedCountTimeoutRef.current) {
        clearTimeout(finishedCountTimeoutRef.current);
      }
    };
  }, [finishedVideos, trackingId]);


  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 px-1 md:px-6 py-6 w-full  mx-auto">
        <div className="w-full flex flex-col gap-4">
          <VideoPlayer id={selectedVideo} setPlayer={setPlayer} />
          <UtilityButtons
            addSeachNote={handleAddSearchNote}
            selectedVideo={selectedVideo}
            flagVideos={flagVideos}
            setFlagVideos={setFlagVideos}
            videoResource={videoResource}
          />
          <Notes
            ref={notesRef}
            player={player}
            trackingId={trackingId}
            videoId={selectedVideo}
          />
        </div>

        <div className="w-full md:w-[35%] lg:w-[35%]">
          <PlaylistNav
            playlistId={playlistId}
            nextPage={nextPage}
            prevPage={prevPage}
            selectedVideo={selectedVideo}
            onSelectVideo={setSelectedVideo}
            setPlayer={setPlayer}
            paginatedPlaylistData={items}
            handlePageChange={handlePageChange}
            finishedVideos={finishedVideos}
            setFinishedVideo={setFinishedVideo}
            totalVideos={totalVideos}
            flagVideos={flagVideos}
          />
        </div>
      </div>
    </>
  );
}

export default Tracker;
