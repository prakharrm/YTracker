import { useRef, useEffect } from "react";
function VideoPlayer({ id, setPlayer }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        document.body.appendChild(tag);

        tag.onload = () => {
          window.onYouTubeIframeAPIReady = () => {
            const player = new window.YT.Player(iframeRef.current, {
              events: {
                onReady: (event) => setPlayer(event.target),
              },
            });
          };
        };
      } else {
        const player = new window.YT.Player(iframeRef.current, {
          events: {
            onReady: (event) => setPlayer(event.target),
          },
        });
      }
    };

    loadYouTubeAPI();
  }, [id, setPlayer]);

  return (
    <div className="flex justify-center">
      <iframe
        ref={iframeRef}
        width="1280"
        height="720"
        src={`https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1&rel=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-2xl overflow-hidden"
      ></iframe>
    </div>
  );
}

export default VideoPlayer;