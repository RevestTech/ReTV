import { useEffect, useState } from "react";

export default function MiniPlayer({
  variant = "radio",
  station,
  channel,
  audioRef,
  videoRef,
  onExpand,
  onStop,
}) {
  const isTv = variant === "tv";
  const media = isTv ? channel : station;
  const [playing, setPlaying] = useState(false);
  const [artFailed, setArtFailed] = useState(false);

  useEffect(() => {
    if (isTv) {
      const video = videoRef?.current;
      if (!video) return;
      const sync = () => setPlaying(!video.paused);
      sync();
      video.addEventListener("play", sync);
      video.addEventListener("pause", sync);
      return () => {
        video.removeEventListener("play", sync);
        video.removeEventListener("pause", sync);
      };
    }
    const audio = audioRef?.current;
    if (!audio) return;

    const sync = () => setPlaying(!audio.paused);
    sync();
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    audio.addEventListener("ended", sync);
    return () => {
      audio.removeEventListener("play", sync);
      audio.removeEventListener("pause", sync);
      audio.removeEventListener("ended", sync);
    };
  }, [audioRef, videoRef, station, channel, isTv]);

  useEffect(() => {
    setArtFailed(false);
  }, [station, channel, isTv]);

  const togglePlay = () => {
    if (isTv) {
      const video = videoRef?.current;
      if (!video) return;
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
      return;
    }
    const audio = audioRef?.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  const artUrl = isTv ? channel?.logo : station?.favicon;
  const title = media?.name ?? "";

  return (
    <div className="mini-player" role="region" aria-label={isTv ? "Now playing television" : "Now playing radio"}>
      <button type="button" className="mini-player-expand-hit" onClick={onExpand} aria-label={`Expand ${title}`}>
        <span className="mini-player-art-wrap" aria-hidden>
          {artUrl && !artFailed ? (
            <img
              className="mini-player-art"
              src={artUrl}
              alt=""
              onError={() => setArtFailed(true)}
            />
          ) : null}
          {(!artUrl || artFailed) && (
            <div className="mini-player-art-placeholder">
              {isTv ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                  <polyline points="17 2 12 7 7 2" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="2" />
                  <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </div>
          )}
        </span>
        <span className="mini-player-info">
          <span className="mini-player-label">{isTv ? "Television" : "Radio"}</span>
          <span className="mini-player-name">{title}</span>
        </span>
      </button>

      <div className="mini-player-actions">
        <button
          type="button"
          className="mini-player-btn mini-player-play"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="mini-player-btn mini-player-expand"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          aria-label="Expand player"
          title="Expand"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
        <button
          type="button"
          className="mini-player-btn mini-player-close"
          onClick={(e) => {
            e.stopPropagation();
            onStop();
          }}
          aria-label="Stop and close"
          title="Stop"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
