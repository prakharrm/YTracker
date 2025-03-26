import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { initializeAuthListener } from "../utils/user";

function Home({ensureAuth}) {
 

  
  return (
    <div className="flex flex-col items-center min-h-screen w-full pt-52 px-4 text-center">
      <div className="mb-6 ">
        <h1 className="text-white font-semibold text-[4rem] md:text-[5rem] leading-tight">
          Effortless Playlist Management & Tracking
        </h1>
        <p className="text-gray-400 text-xl md:text-2xl max-w-[90rem] mx-auto">
          Seamlessly monitor, manage, and interact with your YouTube playlists—all in one place. 
          Take notes, save timestamps, and access video summaries with ease. 
          Enhance your workflow and never lose track of important content again.
        </p>
      </div>
      <div className="w-full flex justify-center">
        <SearchBar ensureAuth={ensureAuth}/>
      </div>
    </div>
  );
}

export default Home;
