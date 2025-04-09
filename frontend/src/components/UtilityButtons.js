import React, { useState } from "react";
import { searchGemini } from "../utils/playlist";

function UtilityButtons() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
    setResult(null);
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await searchGemini(searchQuery);
      setResult(response);
    } catch (err) {
      setResult({ title: "Error", content: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full py-5 justify-end">
      <button
        onClick={handleOpen}
        className="group flex items-center text-lg rounded-xl bg-[#272727] hover:bg-[#3F3F3F] py-2 px-4 border border-transparent text-white shadow-lg hover:shadow-2xl transition duration-300 ease-in-out"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5 mr-2"
        >
          <path d="M12 2a7 7 0 0 0-4.73 12.14c.52.45.73 1.12.55 1.77l-.4 1.37a1 1 0 0 0 .96 1.27h7.14a1 1 0 0 0 .96-1.27l-.4-1.37a2.002 2.002 0 0 1 .55-1.77A7 7 0 0 0 12 2Zm0 18a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1Z" />
        </svg>
        <span className="text-white transition-colors duration-200">Search</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-[#181818] w-[50%] rounded-2xl shadow-2xl p-6 border border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-white text-lg font-semibold">
                Have a doubt? Search it here
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white p-2 transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center mt-6 gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to know?"
                className="flex-1 bg-[#222222] border-[0.2px] border-gray-600 text-white placeholder-gray-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  loading
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-[#3d3d3d] hover:bg-[#505050] text-white"
                }`}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            <div className="mt-6 text-white">
              {loading && (
                <div className="flex flex-col items-center justify-center text-sm text-gray-400">
                  <svg
                    className="animate-spin h-6 w-6 mb-2 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Thinking...
                </div>
              )}

              {!loading && result && (
                <div className="flex flex-col mt-4">
                  <h2 className="font-semibold text-2xl mb-2">{result.title}</h2>
                  <p className="text-gray-300 leading-relaxed">{result.content}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UtilityButtons;
