import { useRef, useEffect } from "react";

function VideoPlayer({ id, setPlayer }) {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const resizePlayer = () => {
      if (containerRef.current && iframeRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const height = containerWidth * (9 / 16);
        iframeRef.current.width = containerWidth;
        iframeRef.current.height = height;
      }
    };

    window.addEventListener("resize", resizePlayer);
    resizePlayer(); // Initial resize

    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        document.body.appendChild(tag);

        tag.onload = () => {
          window.onYouTubeIframeAPIReady = () => {
            new window.YT.Player(iframeRef.current, {
              events: {
                onReady: (event) => setPlayer(event.target),
              },
            });
          };
        };
      } else {
        new window.YT.Player(iframeRef.current, {
          events: {
            onReady: (event) => setPlayer(event.target),
          },
        });
      }
    };

    loadYouTubeAPI();

    return () => window.removeEventListener("resize", resizePlayer);
  }, [id, setPlayer]);

  return (
    <div className="w-full max-w-[1280px] mx-auto relative" style={{ aspectRatio: '16/9' }}>
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1&rel=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden"
      ></iframe>
    </div>
  );
  
}

export default VideoPlayer;
