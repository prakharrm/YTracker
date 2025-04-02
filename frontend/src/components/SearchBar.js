import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa"; // Using Font Awesome
import { trackeNewPlaylist } from "../utils/playlist";
import { useNavigate } from "react-router-dom";

function SearchBar({ ensureAuth}) {
  const [playlistURI, setplaylistURI] = useState("");
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  const handleTrackPlaylist = async () => {
    if (!playlistURI) {
      setResponse({ success: false, message: "Please enter a playlist link." });
      return;
    }
    const result = await trackeNewPlaylist(playlistURI, ensureAuth);
    setResponse(result);

    if (response?.success) {
      
      navigate(`/tracker/${result.trackingId}`);

    }
  };

  return (
    <div className="w-[60%] ">
      <div className="flex items-center bg-transparent border border-gray-600 w-full rounded-full px-6 py-2">
        <input
          type="text"
          placeholder="Enter playlist link to track"
          className="flex-1 text-2xl h-12 bg-transparent text-white outline-none placeholder-gray-500"
          onChange={(e) => {
            setplaylistURI(e.target.value);
          }}
        />
        <button
          className="text-gray-400 hover:text-white"
          onClick={handleTrackPlaylist}
        >
          <FaArrowRight size={24} />
        </button>
        
      </div>
      <div>
      {response?.message && (
          <p
            style={{
              color: response?.success ? "green" : "red",
              marginTop: "10px",
            }}
          >
            {response.message}
          </p>
        )}

      </div>
    </div>
  );
}

export default SearchBar;
