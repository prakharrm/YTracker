import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./output.css";
import YoutubeTrackerPage from "./pages/YoutubeTrackerPage";
import { DialogWithForm } from "./components/AuthModal";

function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const openSignInModal = () => {
    console.log('opening auth modal')
    setIsSignInModalOpen(true);
  };

  const closeSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  return (
    <div className=" text-white min-h-screen">
      <Navbar onSignInClick={openSignInModal} />  {/* Pass the function to Navbar */}
      <DialogWithForm open={isSignInModalOpen} onClose={closeSignInModal} /> {/* Control visibility */}
      <BrowserRouter>
        <Routes>
          <Route index element={<Home ensureAuth={openSignInModal}/>} />
          <Route path="/tracker/:trackingId" element={<YoutubeTrackerPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;