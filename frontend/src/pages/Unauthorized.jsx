import { Link } from "react-router-dom";

export default function Unauthorized({onSignInClick}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center mt-36  text-white px-4 sm:px-6 text-center">
      <div className="max-w-xl w-full">
        <h1 className="text-6xl sm:text-7xl font-extrabold text-red-500 mb-4 animate-bounce">401</h1>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Unauthorized Access</h2>
        <p className="text-gray-400 text-sm sm:text-base mb-8">
          You don't have permission to view this page. Please sign in to continue.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition font-medium text-sm sm:text-base"
          >
            Go to Home
          </Link>
          <Link
            to="/"
            onClick={onSignInClick}
            className="px-6 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black transition font-medium text-sm sm:text-base"
          >
            Retry Login
          </Link>
        </div>
      </div>
    </div>
  );
}
