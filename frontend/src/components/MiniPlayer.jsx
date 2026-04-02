import { useEffect, useState } from "react";

export default function MiniPlayer({ station, audioRef, onExpand, onStop }) {
  const [playing, setPlaying] = useState(false);
  const [artFailed, setArtFailed] = useState(false);

  useEffect(() => {
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
  }, [audioRef, station]);

  useEffect(() => {
    setArtFailed(false);
  }, [station]);

  const togglePlay = () => {
    const audio = audioRef?.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <div className="mini-player" role="region" aria-label="Now playing radio">
      <button type="button" className="mini-player-expand-hit" onClick={onExpand} aria-label={`Expand ${station.name}`}>
        <span className="mini-player-art-wrap" aria-hidden>
          {station.favicon && !artFailed ? (
            <img
              className="mini-player-art"
              src={station.favicon}
              alt=""
              onError={() => setArtFailed(true)}
            />
          ) : null}
          {(!station.favicon || artFailed) && (
            <div className="mini-player-art-placeholder">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2" />
                <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </div>
          )}
        </span>
        <span className="mini-player-info">
          <span className="mini-player-label">Radio</span>
          <span className="mini-player-name">{station.name}</span>
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
