import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import "./output.css";
import Tracker from "./pages/Tracker";
import ProfilePage from "./pages/ProfilePage";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ added
import { DialogWithForm } from "./components/AuthModal";
import { initializeAuthListener } from "./utils/user"; 

function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null); 
  const [componentKey, setComponentKey] = useState(0);

  const openSignInModal = () => {
    setIsSignInModalOpen(true);
  };

  const closeSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  useEffect(() => {
    const unsubscribe = initializeAuthListener(setUser, setLoading);
    return () => unsubscribe(); 
  }, []);

  useEffect(() => {
    if (user) {
      setIsSignInModalOpen(false);
      setComponentKey(prev => prev + 1); 
    }
  }, [user]);

  if (isLoading) return null;

  return (
    <div className="font-sans text-white min-h-screen">
      <BrowserRouter>
        <Navbar onSignInClick={openSignInModal} user={user} />
        <DialogWithForm open={isSignInModalOpen} onClose={closeSignInModal} />

        <Routes key={componentKey}>
          <Route index element={<Home ensureAuth={openSignInModal} />} />

          <Route
            path="/tracker/:trackingId"
            element={
              <ProtectedRoute user={user}>
                <Tracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/unauthorized"
            element={<Unauthorized onSignInClick={openSignInModal} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
