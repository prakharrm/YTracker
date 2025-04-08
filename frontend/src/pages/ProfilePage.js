import React from 'react'
import Profile from "../components/Profile";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  return (
    <div className="w-full px-6">
        <Profile/>
      </div>
  )
}

export default ProfilePage;