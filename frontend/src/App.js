import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./output.css";
import Tracker from "./pages/Tracker";
import ProfilePage from "./pages/ProfilePage";
import { DialogWithForm } from "./components/AuthModal";
import { initializeAuthListener } from "./utils/user"; 

function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null); 

  const openSignInModal = () => {
    console.log("Opening auth modal");
    setIsSignInModalOpen(true);
  };

  const closeSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  useEffect(() => {

    const unsubscribe = initializeAuthListener(setUser, setLoading);

    return () => unsubscribe(); 
  }, []);

  if (isLoading) return null; 

  return (
    <BrowserRouter>
      <div className="text-white min-h-screen">
        <Navbar onSignInClick={openSignInModal} />
        <DialogWithForm open={isSignInModalOpen} onClose={closeSignInModal} />

        <Routes>
          <Route index element={<Home ensureAuth={openSignInModal} />} />
          <Route path="/tracker/:trackingId" element={<Tracker />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
