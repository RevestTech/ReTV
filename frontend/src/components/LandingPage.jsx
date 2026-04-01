import { useEffect, useRef } from "react";

export default function LandingPage({ onGoogleLogin, googleClientId, onSkip }) {
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (!googleClientId || !window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response) => {
        onGoogleLogin(response.credential);
      },
    });

    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "filled_black",
      size: "large",
      width: 320,
      text: "signin_with",
      shape: "pill",
    });
  }, [googleClientId, onGoogleLogin]);

  return (
    <div className="landing-page">
      <div className="landing-bg">
        <div className="landing-orb landing-orb-1" />
        <div className="landing-orb landing-orb-2" />
        <div className="landing-orb landing-orb-3" />
      </div>

      <div className="landing-content">
        <div className="landing-logo">
          Ada<span>joon</span>
        </div>
        <h1 className="landing-title">TV & Radio from Around the World</h1>
        <p className="landing-subtitle">
          Stream 39,000+ TV channels and 50,000+ radio stations.
          <br />
          Save your favorites and sync across all your devices.
        </p>

        <div className="landing-card">
          <div className="landing-features">
            <div className="landing-feature">
              <div className="landing-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" />
                </svg>
              </div>
              <div>
                <strong>Live TV</strong>
                <span>Channels from 250 countries</span>
              </div>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="2" />
                  <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
                  <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
                </svg>
              </div>
              <div>
                <strong>World Radio</strong>
                <span>Every genre, every country</span>
              </div>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div>
                <strong>Sync Favorites</strong>
                <span>Sign in and never lose them</span>
              </div>
            </div>
          </div>

          <div className="landing-signin">
            <div ref={googleBtnRef} className="landing-google-btn" />
            {!googleClientId && (
              <div className="login-note">Google Sign-In is not configured yet.</div>
            )}
          </div>
        </div>

        <button className="landing-skip" onClick={onSkip}>
          Continue as guest
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
