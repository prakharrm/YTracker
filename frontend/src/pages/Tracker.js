import React, { useEffect, useState } from "react";
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

function Tracker() {
  const { trackingId } = useParams();
  const [playlistId, setPlaylistId] = useState(null);

  const [items, setItems] = useState([]);
  const [finishedVideos, setFinishedVideo] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(); // current video
  const [player, setPlayer] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [totalVideos, setTotalVideo] = useState(null);

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
          setTotalVideo
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
        finishedVideos
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
    finishedVideos,
  ]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 px-1 md:px-6 py-6 w-full  mx-auto">
        <div className="w-full flex flex-col gap-4">
          <VideoPlayer id={selectedVideo} setPlayer={setPlayer} />
          <UtilityButtons/>
          <Notes
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
          />
        </div>
      </div>
    </>
  );
}

export default Tracker;
