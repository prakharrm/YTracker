import React, { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { profile, deletePlaylist } from "../utils/user";
import { useNavigate } from "react-router-dom";
function PlaylistCard({ title, cover, videoCount, trackingId }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigatePlaylist = () => {
    navigate(`/tracker/${trackingId}`);
  };

  const handleDelete = async () => {
    try {
      await deletePlaylist(trackingId);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest("#profile-card-menu-container")) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      id="profile-card-menu-container"
      className="relative flex flex-col justify-between h-full p-3 shadow-lg hover:shadow-2xl transition duration-300 ease-in-out w-full border border-gray-500 rounded-2xl bg-[#212121] hover:bg-[#3d3d3d]"
    >
      <div onClick={navigatePlaylist} className="w-full cursor-pointer">
        <img className="w-full rounded-lg mb-2" src={cover} alt={title} />
        <h3 className="text-lg font-semibold text-white text-left">{title}</h3>
      </div>

      <div className="flex items-center justify-between w-full mt-4">
        <p className="text-sm font-light text-white bg-gray-700 px-3 py-1 rounded-full">
          video: {videoCount}
        </p>

        <div className="relative">
          <button
            className="p-2 text-white hover:bg-gray-600 rounded-full"
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <MoreVertical size={20} />
          </button>

          {menuOpen && (
            <ul
              role="menu"
              className="absolute right-0 mt-2 z-10 min-w-[180px] rounded-2xl border border-gray-700 bg-[#282828] p-2 shadow-xl"
            >
              <li
                role="menuitem"
                className="flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 text-sm  hover:bg-gray-700 transition-all"
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
                <span className="whitespace-nowrap">Delete Playlist</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
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

  useEffect(() => {
    console.log(profileData?.playlists);
  }, [profileData]);

  return (
    <>
      {profileData?.playlists && profileData.playlists.length > 0 && (
        <div className="w-full px-6 mt-5 mb-24 ">
          <div className="grid grid-cols-4 gap-6">
            {profileData.playlists.map((elm) => (
              <PlaylistCard
                key={elm.trackingId}
                title={elm.title}
                cover={elm.cover}
                videoCount={elm.videoCount}
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
