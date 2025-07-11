import { ChevronLeft, ChevronRight } from "lucide-react"; // Import icons
import { motion } from "framer-motion"; // Import framer-motion for animations

function VideoNav(
  id,
  thumbnail,
  title,
  onSelectVideo,
  setFinishedVideo,
  finishedVideos,
  selectedVideo,
  flagVideos,
) {
  const isFlagged = (flagVideos).includes(id);
  const isChecked = finishedVideos.includes(id);

  return (
    <motion.div
      key={id}
      className={`flex rounded-md cursor-pointer transition-all duration-200 ease-in-out
        ${isFlagged ? "bg-yellow-300 bg-opacity-60" : ""}
        ${id === selectedVideo ? "bg-gray-700" : "hover:bg-gray-700"}
      `}
      whileHover={{ scale: 1.03 }} // Add hover scale animation
    >
      <div className="flex items-center pl-2">
        <input
          type="checkbox"
          className="w-4 h-4 text-gray-600 bg-gray-700 border-gray-300 rounded-sm"
          checked={isChecked}
          onChange={() => {
            setFinishedVideo((prev) =>
              isChecked ? prev.filter((elm) => elm !== id) : [...prev, id]
            );
          }}
        />
      </div>
      <div onClick={() => onSelectVideo(id)}>
        <div className="flex p-1 items-center justify-center">
          <div className="w-[100px] sm:w-[130px] h-[64px] sm:h-[86px] overflow-hidden rounded-md sm:rounded-xl">
            <img
              src={thumbnail}
              alt={title}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex-1 ml-2">
            <h3 className="text-sm font-regular px-2 text-white break-words">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PlaylistNav({
  onSelectVideo,
  paginatedPlaylistData,
  setToken,
  nextPage,
  prevPage,
  handlePageChange,
  finishedVideos,
  setFinishedVideo,
  totalVideos,
  selectedVideo,
  flagVideos,
}) {
  const videoList = paginatedPlaylistData;
  const progress = Math.floor((finishedVideos.length / totalVideos) * 100);

  return (
    <div className="flex flex-col w-full h-full max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-250px)] md:max-h-[calc(100vh-200px)] border border-gray-500 rounded-md md:rounded-2xl bg-[#121212]">
      {totalVideos && (
  <div className="flex items-center justify-between px-4 py-4 h-28 sm:h-24 md:h-20 bg-[#212121] rounded-t-md md:rounded-t-2xl">
    <div>
      <p className="text-base sm:text-lg font-semibold text-white">Progress</p>
      <p className="text-sm text-gray-400">You've watched {finishedVideos.length} of {totalVideos} videos</p>
    </div>

    <div className="relative w-12 h-12 sm:w-12 sm:h-12">
      <svg className="transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-gray-700"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <motion.path
          className="text-white"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="100, 100"
          strokeDashoffset={100 - progress}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-xs font-medium">{progress}%</span>
      </div>
    </div>
  </div>
)}


      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {videoList.map((video) =>
          VideoNav(
            video.id,
            video.thumbnail?.url,
            video.title,
            onSelectVideo,
            setFinishedVideo,
            finishedVideos,
            selectedVideo,
            flagVideos
          )
        )}

        {(nextPage || prevPage) && (
          <div className="flex justify-center gap-4 py-4">
            <motion.button
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                prevPage
                  ? "bg-[#212121] hover:bg-[#333333]"
                  : "bg-[#272727]"
              }`}
              onClick={() => handlePageChange(prevPage)}
              disabled={!prevPage}
              whileHover={{ scale: 1.1 }}
            >
              <ChevronLeft className="text-gray-400" size={20} />
            </motion.button>
            <motion.button
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                nextPage
                  ? "bg-[#212121] hover:bg-[#333333]"
                  : "bg-[#1D1D1D]"
              }`}
              onClick={() => handlePageChange(nextPage)}
              disabled={!nextPage}
              whileHover={{ scale: 1.1 }}
            >
              <ChevronRight className="text-gray-400" size={20} />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistNav;
