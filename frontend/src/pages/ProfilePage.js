import React from 'react'
import Profile from "../components/Profile";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  return (
    <div className="w-full px-6 mt-12">
      <p className='text-5xl font-bold px-6 mt-10'>Profile</p>
        <Profile/>
      </div>
  )
}

export default ProfilePage;