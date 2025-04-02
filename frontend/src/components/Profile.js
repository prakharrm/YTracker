import React, { useEffect, useState } from 'react';
import { profile } from '../utils/user';
import { useNavigate } from "react-router-dom";

function PlaylistCard({ title, cover, videoCount ,trackingId }) {
  const navigate = useNavigate();

  const navigatePlaylist = () => {
    navigate(`/tracker/${trackingId}`);
  };

  return (
    <div onClick={navigatePlaylist} className="flex flex-col items-start p-3 shadow-lg hover:shadow-2xl transition duration-300 ease-in-out w-full border border-gray-500 rounded-2xl bg-[#212121] hover:bg-[#3d3d3d]">
      <img className='w-full rounded-lg' src={cover}>
      </img>
      
      <h3 className="text-lg font-semibold text-white text-left">{title}</h3>
      <p className='text-sm font-light text-white bg-gray-700 px-2 py-1 rounded-lg'> video: {videoCount}</p>
    </div>
  );
}

function Profile() {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await profile();
      setProfileData(data); // Store fetched data properly
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(profileData?.playlists); // Debugging the playlists
  }, [profileData]);

  return (
    <>
      {profileData?.playlists && profileData.playlists.length > 0 && (
        <div className="w-full px-6 mt-24 mb-24 ">
          <div className="grid grid-cols-4 gap-6">
            {profileData.playlists.map((elm) => (
              <PlaylistCard key={elm.trackingId} title={elm.title} cover={elm.cover} videoCount={elm.videoCount} trackingId={elm.trackingId} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
