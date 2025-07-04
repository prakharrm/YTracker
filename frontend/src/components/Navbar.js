import logo from "../Ytracker logo.png";
import ProfileModal from "./ProfileModal";
import { auth} from "../firebase-config";

function Navbar({ onSignInClick }) {
  const user = auth.currentUser;
  

  

  return (
    <nav className="">
      <div className="flex flex-wrap items-center justify-between  mx-auto py-4">
        <a href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
          <img src={logo} className="h-10" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-medium whitespace-nowrap dark:text-white">
            YTracker
          </span>
        </a>
        
          <div className="left-0">
            {user?.photoURL ? (
              <ProfileModal photoURL={user.photoURL}/>
            ) : (
              <button
                className="block text-white border hover:bg-gray-800 border-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                type="button"
                onClick={onSignInClick}
              >
                Sign In
              </button>
            )}
          </div>
        
      </div>
    </nav>
  );
}

export default Navbar;
