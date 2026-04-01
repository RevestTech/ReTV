import ViewToggle from "./ViewToggle";

const GUEST_LIMIT = 20;

export default function ChannelGrid({
  channels,
  loading,
  error,
  total,
  page,
  totalPages,
  onPageChange,
  onSelect,
  activeCategory,
  activeCountry,
  search,
  showFavorites,
  liveOnly,
  onClearFilter,
  onRetry,
  isFavorite,
  onToggleFavorite,
  viewMode,
  onViewToggle,
  isGuest,
  onLogin,
}) {
  const hasFilters = activeCategory || activeCountry || search || showFavorites || liveOnly;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <span>Loading channels...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3>Connection Issue</h3>
        <p>{error}</p>
        <button
          onClick={onRetry}
          style={{
            marginTop: 16, padding: "10px 24px",
            background: "var(--accent)", border: "none",
            borderRadius: "var(--radius-sm)", color: "#fff",
            cursor: "pointer", fontSize: 14, fontFamily: "inherit",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const title = showFavorites
    ? "Favorites"
    : search
      ? `Results for "${search}"`
      : activeCategory || activeCountry
        ? "Filtered Channels"
        : "All Channels";

  return (
    <>
      <div className="content-header">
        <div>
          <h2 className="content-title">{title}</h2>
          <span className="content-subtitle">
            {total.toLocaleString()} {showFavorites ? "saved" : ""} channel{total !== 1 ? "s" : ""}{!showFavorites ? " found" : ""}
          </span>
        </div>
        <ViewToggle viewMode={viewMode} onViewToggle={onViewToggle} />
      </div>

      {hasFilters && (
        <div className="active-filters">
          {showFavorites && (
            <span className="filter-tag" onClick={() => onClearFilter("favorites")}>
              Favorites ✕
            </span>
          )}
          {liveOnly && (
            <span className="filter-tag" onClick={() => onClearFilter("liveOnly")}>
              Live only ✕
            </span>
          )}
          {search && (
            <span className="filter-tag" onClick={() => onClearFilter("search")}>
              Search: {search} ✕
            </span>
          )}
          {activeCategory && (
            <span className="filter-tag" onClick={() => onClearFilter("category")}>
              Category: {activeCategory} ✕
            </span>
          )}
          {activeCountry && (
            <span className="filter-tag" onClick={() => onClearFilter("country")}>
              Country: {activeCountry} ✕
            </span>
          )}
        </div>
      )}

      {channels.length === 0 ? (
        <div className="empty-state">
          <h3>{showFavorites ? "No favorites yet" : "No channels found"}</h3>
          <p>
            {showFavorites
              ? "Click the heart icon on any channel to add it to your favorites."
              : "Try adjusting your search or filters, or wait for data sync to complete."}
          </p>
        </div>
      ) : (
        <>
          <div className={viewMode === "list" ? "channel-list" : viewMode === "thumb" ? "thumb-grid" : "channel-grid"}>
            {(isGuest ? channels.slice(0, GUEST_LIMIT) : channels).map((ch) => {
              const props = {
                key: ch.id,
                channel: ch,
                onClick: () => onSelect(ch),
                favorited: !isGuest && isFavorite(ch.id),
                onToggleFavorite: isGuest ? (e) => { e.stopPropagation(); onLogin(); } : (e) => { e.stopPropagation(); onToggleFavorite(ch); },
                isGuest,
              };
              if (viewMode === "list") return <ChannelRow {...props} />;
              if (viewMode === "thumb") return <ChannelThumb {...props} />;
              return <ChannelCard {...props} />;
            })}
          </div>

          {isGuest && channels.length > GUEST_LIMIT && (
            <GuestBanner onLogin={onLogin} total={total} type="channels" />
          )}

          {!isGuest && !showFavorites && totalPages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                ← Prev
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

function GuestBanner({ onLogin, total, type }) {
  return (
    <div className="guest-banner">
      <div className="guest-banner-content">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        <div>
          <strong>Sign in to unlock all {total.toLocaleString()} {type}</strong>
          <span>Plus save favorites and sync across devices</span>
        </div>
        <button onClick={onLogin}>Sign In</button>
      </div>
    </div>
  );
}

function ChannelCard({ channel, onClick, favorited, onToggleFavorite, isGuest }) {
  const cats = channel.categories ? channel.categories.split(";").filter(Boolean) : [];

  return (
    <div className="channel-card" onClick={onClick}>
      {!isGuest && (
        <button
          className={`favorite-btn ${favorited ? "favorited" : ""}`}
          onClick={onToggleFavorite}
          title={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      )}
      {channel.logo ? (
        <img
          className="channel-logo"
          src={channel.logo}
          alt={channel.name}
          loading="lazy"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className="channel-logo-placeholder"
        style={channel.logo ? { display: "none" } : {}}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" />
        </svg>
      </div>
      <div className="channel-name" title={channel.name}>
        {channel.name}
      </div>
      <div className="channel-meta">
        {channel.country_code && (
          <span className="channel-tag">{channel.country_code}</span>
        )}
        {cats.slice(0, 2).map((c) => (
          <span key={c} className="channel-tag">{c}</span>
        ))}
        {channel.stream_url && (
          <span className={`channel-stream-badge ${channel.health_status === "online" ? "status-online" : channel.health_status === "offline" || channel.health_status === "error" ? "status-offline" : channel.health_status === "timeout" ? "status-timeout" : ""}`}>
            <span className={`status-dot ${channel.health_status}`} />
            {channel.health_status === "online" ? "LIVE" : channel.health_status === "offline" || channel.health_status === "error" ? "DOWN" : channel.health_status === "timeout" ? "SLOW" : "LIVE"}
          </span>
        )}
      </div>
    </div>
  );
}

function ChannelRow({ channel, onClick, favorited, onToggleFavorite, isGuest }) {
  const cats = channel.categories ? channel.categories.split(";").filter(Boolean) : [];

  return (
    <div className="list-row" onClick={onClick}>
      <div className="list-row-logo">
        {channel.logo ? (
          <img
            src={channel.logo}
            alt={channel.name}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="list-row-logo-placeholder"
          style={channel.logo ? { display: "none" } : {}}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" />
          </svg>
        </div>
      </div>
      <div className="list-row-info">
        <span className="list-row-name">{channel.name}</span>
        <div className="list-row-tags">
          {channel.country_code && <span className="channel-tag">{channel.country_code}</span>}
          {cats.slice(0, 3).map((c) => (
            <span key={c} className="channel-tag">{c}</span>
          ))}
        </div>
      </div>
      <div className="list-row-actions">
        {channel.stream_url && (
          <span className={`channel-stream-badge ${channel.health_status === "online" ? "status-online" : channel.health_status === "offline" || channel.health_status === "error" ? "status-offline" : channel.health_status === "timeout" ? "status-timeout" : ""}`}>
            <span className={`status-dot ${channel.health_status}`} />
            {channel.health_status === "online" ? "LIVE" : channel.health_status === "offline" || channel.health_status === "error" ? "DOWN" : channel.health_status === "timeout" ? "SLOW" : "LIVE"}
          </span>
        )}
        {!isGuest && (
          <button
            className={`favorite-btn list-fav-btn ${favorited ? "favorited" : ""}`}
            onClick={onToggleFavorite}
            title={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function ChannelThumb({ channel, onClick, favorited, onToggleFavorite, isGuest }) {
  const cats = channel.categories ? channel.categories.split(";").filter(Boolean) : [];

  return (
    <div className="thumb-card" onClick={onClick}>
      <div className="thumb-image">
        {channel.logo ? (
          <img
            src={channel.logo}
            alt={channel.name}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="thumb-placeholder"
          style={channel.logo ? { display: "none" } : {}}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" />
          </svg>
        </div>
        {channel.stream_url && (
          <span className={`thumb-status ${channel.health_status === "offline" || channel.health_status === "error" ? "down" : ""}`}>
            <span className={`status-dot ${channel.health_status || "unknown"}`} />
            {channel.health_status === "online" ? "LIVE" : channel.health_status === "offline" || channel.health_status === "error" ? "DOWN" : "LIVE"}
          </span>
        )}
        {!isGuest && (
          <button
            className={`favorite-btn thumb-fav ${favorited ? "favorited" : ""}`}
            onClick={onToggleFavorite}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
      </div>
      <div className="thumb-info">
        <span className="thumb-name" title={channel.name}>{channel.name}</span>
        <div className="thumb-tags">
          {channel.country_code && <span className="channel-tag">{channel.country_code}</span>}
          {cats.slice(0, 2).map((c) => (
            <span key={c} className="channel-tag">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
