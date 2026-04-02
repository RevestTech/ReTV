export default function GuestNoticeToast({ message, onDismiss, onSignIn }) {
  if (!message) return null;
  return (
    <div className="guest-notice-toast" role="alert" aria-live="polite">
      <span className="guest-notice-msg">{message}</span>
      <div className="guest-notice-actions">
        <button type="button" className="guest-notice-signin" onClick={onSignIn}>
          Sign in
        </button>
        <button type="button" className="guest-notice-dismiss" onClick={onDismiss} aria-label="Dismiss">
          ×
        </button>
      </div>
    </div>
  );
}
