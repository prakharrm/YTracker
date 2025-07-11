import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Profile from "../components/Profile";
import { getVerifiedUser } from "../utils/user";

function Home({ ensureAuth }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const u = getVerifiedUser();
      setUser(u);
    } catch (err) {
      setUser(null); // Not signed in
    }
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen w-full px-4 sm:px-6 md:px-12 pt-32 sm:pt-40 text-center">
      <div className="mb-10 w-full">
        <h1 className="text-white font-semibold text-4xl sm:text-xl md:text-7xl leading-tight md:leading-[1.2]">
          Effortless Playlist Management & Tracking
        </h1>
        <p className="text-gray-400 text-base sm:text-lg md:text-xl mt-4 max-w-7xl mx-auto">
          Seamlessly monitor, manage, and interact with your YouTube playlists—all in one place.
          Take notes, save timestamps, and access video summaries with ease.
          Enhance your workflow and never lose track of important content again.
        </p>
      </div>

      <div className="w-full flex justify-center">
        <SearchBar ensureAuth={ensureAuth} />
      </div>

      {user && (
        <div className="w-full px-0 sm:px-6 mt-20">
          <Profile />
        </div>
      )}
    </div>
  );
}

export default Home;
