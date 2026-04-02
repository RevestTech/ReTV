export default function RecentlyPlayed({ recentItems, onSelect }) {
  if (!recentItems.length) return null;

  return (
    <section className="recent-section" aria-label="Recently played">
      <h2 className="recent-section-heading">
        <svg
          className="recent-section-icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        Recently Played
      </h2>
      <div className="recent-row">
        {recentItems.map((item) => (
          <button
            key={`${item.type}-${item.id}`}
            type="button"
            className="recent-item"
            onClick={() => onSelect(item)}
          >
            <span className={`recent-type-badge ${item.type === "radio" ? "recent-type-radio" : ""}`}>
              {item.type === "radio" ? "Radio" : "TV"}
            </span>
            <span className="recent-item-logo-wrap">
              {item.logo ? (
                <img src={item.logo} alt="" className="recent-item-logo" />
              ) : (
                <span className={`recent-item-placeholder ${item.type === "radio" ? "radio-placeholder" : ""}`}>
                  {item.name?.charAt(0)?.toUpperCase() || "?"}
                </span>
              )}
            </span>
            <span className="recent-item-name" title={item.name}>
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
