import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { profile, deletePlaylist } from "../utils/user";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function CircularProgress({ progress }) {
  return (
    <div className="relative w-9 h-9">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(#22c55e ${progress * 3.6}deg, #2a2a2a 0deg)`,
        }}
      />
      <div className="absolute inset-[3px] bg-[#212121] rounded-full flex items-center justify-center">
        <span className="text-[10px] text-white font-semibold">{progress}%</span>
      </div>
    </div>
  );
}
function PlaylistCard({ title, cover, videoCount, finishedCount = 69, trackingId }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const progress = videoCount > 0 ? Math.round((finishedCount / videoCount) * 100) : 0;

  const navigatePlaylist = () => navigate(`/tracker/${trackingId}`);

  const handleDelete = async () => {
    try {
      await deletePlaylist(trackingId);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(`#menu-${trackingId}`)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full max-w-sm rounded-2xl border border-gray-700 bg-[#212121] shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Dots Menu Button */}
      <div className="absolute top-3 right-3 z-20" id={`menu-${trackingId}`}>
        <button
          className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <MoreVertical size={18} />
        </button>

        {menuOpen && (
          <ul
            role="menu"
            className="absolute right-0 mt-2 z-30 min-w-[180px] rounded-xl border border-gray-700 bg-[#282828] p-2 shadow-xl"
          >
            <li
              role="menuitem"
              className="flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-gray-700 transition"
              onClick={handleDelete}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7"
                />
              </svg>
              <span>Delete Playlist</span>
            </li>
          </ul>
        )}
      </div>

      {/* Cover Image */}
      <div onClick={navigatePlaylist} className="cursor-pointer">
        <img
          src={cover}
          alt={title}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 mb-3">
          {title}
        </h3>

        <div className="flex justify-between items-center">
          <span className="bg-blue-600/20 text-blue-400 text-xs font-medium px-3 py-1 rounded-full">
            {videoCount} videos
          </span>
          <CircularProgress progress={progress} />
        </div>
      </div>
    </motion.div>
  );
}


function Profile() {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await profile();
      setProfileData(data);
    };
    fetchData();
  }, []);

  return (
    <>
      {profileData?.playlists && profileData.playlists.length > 0 && (
        <div className="w-full px-4 sm:px-6 mt-5 mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profileData.playlists.map((elm) => (
              <PlaylistCard
                key={elm.trackingId}
                title={elm.title}
                cover={elm.cover}
                videoCount={elm.videoCount}
                finishedCount={elm.finishedCount || 50}
                trackingId={elm.trackingId}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}


export default Profile;
