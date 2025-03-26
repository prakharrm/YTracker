import React, { useEffect, useState } from "react";
import PlaylistNav from "../components/PlaylistNav";
import VideoPlayer from "../components/VideoPlayer";
import Notes from "../components/Notes";
import { useLocation } from "react-router-dom";
import { fetchNewPlaylist, changePlaylistPage } from "../utils/playlist";

function YoutubeTrackerPage() {
  const location = useLocation();
  const { playlistId, trackingId } = location.state || {};


  const [playlistData, setPlaylistData] = useState({});
  
  const [finishedVideos, setFinishedVideo] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(); // current video
  const [player, setPlayer] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [token, setToken] = useState(null);

  async function loadPlaylist() {
    if (trackingId && playlistId) {
      try {
        const data = await fetchNewPlaylist(
          trackingId,
          playlistId,
          setSelectedVideo,
          setCurrentPage,
          setNextPage,
          setPrevPage
        );
        setPlaylistData(data);
      
     
      } catch (err) {
        console.error("an error occured: ", err);
      }
    }
  }     
  async function handlePageChange() {
    if (playlistId && playlistId) {
     
      const fetchData = await changePlaylistPage(
        playlistId,
        token,
        setNextPage,
        setPrevPage,
        setCurrentPage
      );
      setPlaylistData(fetchData);
   
    }
  }

  useEffect(() => {
    loadPlaylist();
  }, []);

  useEffect(() => {

  }, [setCurrentPage, setFinishedVideo, setNextPage, setPrevPage, setSelectedVideo])

  return (
    <>
      <div className="flex flex-col md:flex-row mb-20 h-[80vh]">
  {/* Left Column (Video & Notes) */}
  <div className="flex flex-col w-full md:w-[70%] lg:w-[75%] h-full">
    <VideoPlayer id={selectedVideo} setPlayer={setPlayer} />
    <Notes player={player} />
  </div>

  {/* Right Column (Playlist) */}
  <div className="w-full md:w-[30%] lg:w-[25%] h-full">
    <PlaylistNav
      playlistId={playlistId}
      nextPage={nextPage}
      prevPage={prevPage}
      onSelectVideo={setSelectedVideo}
      setPlayer={setPlayer}
      paginatedPlaylistData={playlistData.items}
      handlePageChange={handlePageChange}
      setToken={setToken}
      finishedVideos={finishedVideos}
      setFinishedVideo={setFinishedVideo}
    />
  </div>
</div>
    </>
  );
}

export default YoutubeTrackerPage;
