import React, { useEffect, useState } from "react";
import { logout } from "../auth";
import { useNavigate } from "react-router-dom";
export default function ProfileModal({ photoURL }) {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);

  const toggleDropdown = () => setOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (!event.target.closest("#profile-menu-container")) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      {
        <div id="profile-menu-container" className="relative overflow-visible ">
          <img
            alt="Profile"
            src={photoURL}
            className="inline-block h-12 w-12 cursor-pointer rounded-full object-cover border border-gray-500"
            onClick={toggleDropdown}
          />

          {isOpen && (
            <ul
              role="menu"
              className="absolute z-50 right-0 mt-2 w-36 rounded-xl border  bg-[#282828] border-gray-600 p-2 shadow-xl"
              style={{ minWidth: "240px", background: "#282828" }}
            >
              <li
                role="menuitem"
                className="flex items-center gap-4 cursor-pointer rounded-lg px-2 py-2 text-sm text-gray-200 transition-all hover:bg-gray-700"
                onClick={() => {
                  navigate(`/profile`);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="font-medium whitespace-nowrap">My Profile</p>
              </li>

              <hr className="my-2 border-gray-600" />

              <li
                role="menuitem"
                className="flex items-center gap-4 cursor-pointer rounded-lg px-2 py-2 text-sm text-gray-200 transition-all hover:bg-gray-700"
                onClick={logout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="font-medium whitespace-nowrap">Sign Out</p>
              </li>
            </ul>
          )}
        </div>
      }
    </>
  );
}
