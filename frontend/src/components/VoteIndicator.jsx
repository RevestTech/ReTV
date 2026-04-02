const ThumbUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);

const ThumbDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 15V19a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" /><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
  </svg>
);

const XCircle = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

export default function VoteIndicator({ summary }) {
  if (!summary) return null;
  const likes = summary.like || 0;
  const dislikes = summary.dislike || 0;
  const broken = summary.broken || 0;
  if (likes === 0 && dislikes === 0 && broken === 0) return null;

  return (
    <span className="vote-indicator" title={`${likes} likes, ${dislikes} dislikes${broken ? `, ${broken} reported broken` : ""}`}>
      {likes > 0 && <span className="vi-like"><ThumbUp /> {likes}</span>}
      {dislikes > 0 && <span className="vi-dislike"><ThumbDown /> {dislikes}</span>}
      {broken > 0 && <span className="vi-broken"><XCircle /> {broken}</span>}
    </span>
  );
}
