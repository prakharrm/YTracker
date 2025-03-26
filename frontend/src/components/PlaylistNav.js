import { ChevronLeft, ChevronRight } from "lucide-react"; // Import icons
import { useEffect } from "react";
function VideoNav(id, thumbnail, title, onSelectVideo, setFinishedVideo, finishedVideos) {
  const isChecked = finishedVideos.includes(id);

  return (
    <div key={id} className="flex hover:bg-gray-700 rounded-md cursor-pointer">
      <div className="flex items-center pl-2">
        <input
          type="checkbox"
          className="w-4 h-4 text-gray-600 bg-gray-700 border-gray-300 rounded-sm"
          checked={isChecked}
          onChange={() => {
            setFinishedVideo((prev) =>
              isChecked
                ? prev.filter((elm) => elm !== id) 
                : [...prev, id] 
            );
          }}
        />
      </div>
      <div onClick={() => onSelectVideo(id)}>
        <div className="flex p-2 items-center justify-center">
          <div
            style={{
              width: "130px",
              height: "86px",
            }}
            className="flex overflow-hidden rounded-md"
          >
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
    </div>
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
  setFinishedVideo
}) {
  const videoList = paginatedPlaylistData;
  console.log("dataaa", videoList);
  console.log("next", nextPage);
  console.log("prev", prevPage);

  return (
    <div
      style={{ height: "720px" }}
      className="parent flex flex-col h-[720px] w-full max-w-2xl ml-6 border border-gray-500 rounded-2xl bg-[#121212]"
    >
      {/* Header */}
      <div className="h-24 bg-[#212121] rounded-t-2xl shrink-0"></div>

      {/* Scrollable Video List */}
      <div className="scroller flex-1 overflow-y-auto py-5 p-4">
        {videoList?.map((video) =>
          VideoNav(video.id, video.thumbnail?.url, video.title, onSelectVideo, setFinishedVideo, finishedVideos)
        )}

        {(nextPage || prevPage) && (
          <div className="flex justify-center gap-4 p-4 shrink-0">
            <button
              className={`w-12 h-12 flex items-center justify-center rounded-full ${
                prevPage != null
                  ? "bg-[#212121] hover:bg-[#333333]"
                  : "bg-[#272727]"
              }`}
              onClick={() => {
                setToken(prevPage);
                handlePageChange();
              }}

              disabled={prevPage == null}
            >
              <ChevronLeft className="text-gray-400" size={24} />
            </button>
            <button
              className={`w-12 h-12 flex items-center justify-center rounded-full ${
                nextPage != null
                  ? "bg-[#212121] hover:bg-[#333333]"
                  : "bg-[#1D1D1D]"
              }`}
              onClick={() => {
                setToken(nextPage);
                handlePageChange();
              }}
              disabled={nextPage == null}
              
            >
              <ChevronRight className="text-gray-400" size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistNav;
