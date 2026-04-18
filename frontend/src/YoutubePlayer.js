import { useEffect, useRef, useState } from "react";

function YouTubePlayer({ videoId, onNext }) {
    const containerRef = useRef(null);
    const playerRef = useRef(null);

    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);

    useEffect(() => {
        let mounted = true;

        function createPlayer() {
            if (!mounted || !containerRef.current || !window.YT || !window.YT.Player) {
                return;
            }

            // destroy old player first
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }

            playerRef.current = new window.YT.Player(containerRef.current, {
                height: "250",
                width: "100%",
                videoId: videoId,
                playerVars: {
                    autoplay: 0,
                    playsinline: 1
                },
                events: {
                    onReady: (event) => {
                        if (!mounted) return;
                        setIsReady(true);
                        event.target.setVolume(volume);
                    },
                    onStateChange: (event) => {
                        if (!mounted) return;

                        if (event.data === window.YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                        } else if (event.data === window.YT.PlayerState.PAUSED) {
                            setIsPlaying(false);
                        } else if (event.data === window.YT.PlayerState.ENDED) {
                            setIsPlaying(false);
                            if (onNext) onNext();
                        }
                    }
                }
            });
        }

        // reset ready state when video changes
        setIsReady(false);
        setIsPlaying(false);

        if (window.YT && window.YT.Player) {
            createPlayer();
        } else {
            const existingScript = document.querySelector(
                'script[src="https://www.youtube.com/iframe_api"]'
            );

            if (!existingScript) {
                const script = document.createElement("script");
                script.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(script);
            }

            const previous = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (typeof previous === "function") {
                    previous();
                }
                createPlayer();
            };
        }

        return () => {
            mounted = false;
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [videoId, onNext]);

    useEffect(() => {
        if (playerRef.current && isReady) {
            playerRef.current.setVolume(volume);
        }
    }, [volume, isReady]);

    function togglePlayPause() {
        if (!playerRef.current || !isReady) return;

        const state = playerRef.current.getPlayerState();

        if (state === window.YT.PlayerState.PLAYING) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    }

    function handleVolumeChange(e) {
        setVolume(Number(e.target.value));
    }

    return (
        <div className="platform-player">
            <div ref={containerRef}></div>

            <div className="player-controls">
                <button onClick={togglePlayPause} disabled={!isReady}>
                    {isPlaying ? "⏸ Pause" : "▶ Play"}
                </button>
            </div>

            <div className="volume-control">
                <label>Volume</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    disabled={!isReady}
                />
            </div>
        </div>
    );
}

export default YouTubePlayer;