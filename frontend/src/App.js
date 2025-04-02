import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./output.css";
import Tracker from "./pages/Tracker";
import { DialogWithForm } from "./components/AuthModal";
import { initializeAuthListener } from "./utils/user"; // Fixed path

function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Define user state

  const openSignInModal = () => {
    console.log("Opening auth modal");
    setIsSignInModalOpen(true);
  };

  const closeSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = initializeAuthListener(setUser, setLoading);

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  if (isLoading) return null; // Prevent rendering until Firebase Auth is ready

  return (
    <div className="text-white min-h-screen">
      <Navbar onSignInClick={openSignInModal} />
      <DialogWithForm open={isSignInModalOpen} onClose={closeSignInModal} />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home ensureAuth={openSignInModal} />} />
          <Route path="/tracker/:trackingId" element={<Tracker />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
