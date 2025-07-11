import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { trackeNewPlaylist } from "../utils/playlist";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function SearchBar({ ensureAuth }) {
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

    if (result?.success) {
      navigate(`/tracker/${result.trackingId}`);
    }
  };

  return (
    <motion.div
      className="w-full px-4 sm:px-6 md:px-8 lg:max-w-[60%] mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center bg-[#1f1f1f]/60 border border-gray-600 rounded-full px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-md shadow-lg">
        <input
          type="text"
          placeholder="Enter playlist link to track..."
          className="flex-1 text-base sm:text-lg md:text-xl h-10 sm:h-12 bg-transparent text-white outline-none placeholder:text-gray-500 focus:placeholder:text-gray-400 transition-all duration-300"
          onChange={(e) => setplaylistURI(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-400 hover:text-white transition-colors duration-200 ml-2 sm:ml-3"
          onClick={handleTrackPlaylist}
          aria-label="Track Playlist"
        >
          <FaArrowRight size={20} className="sm:size-5 md:size-6" />
        </motion.button>
      </div>

      {response?.message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-3 text-sm sm:text-base ${
            response.success ? "text-green-400" : "text-red-400"
          }`}
        >
          {response.message}
        </motion.p>
      )}
    </motion.div>
  );
}

export default SearchBar;
