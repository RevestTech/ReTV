import { useState } from "react";

export default function Sidebar({
  mode,
  categories,
  countries,
  activeCategory,
  activeCountry,
  onSelectCategory,
  onSelectCountry,
  favoritesCount,
  showFavorites,
  onToggleFavorites,
  radioTags,
  radioCountries,
  activeTag,
  onSelectTag,
}) {
  const [tab, setTab] = useState("categories");
  const [radioTab, setRadioTab] = useState("genres");

  if (mode === "radio") {
    return (
      <aside className="sidebar">
        <div style={{ display: "flex", gap: "4px", padding: "0 12px", marginBottom: "16px" }}>
          <TabButton active={radioTab === "genres"} onClick={() => setRadioTab("genres")}>
            Genres
          </TabButton>
          <TabButton active={radioTab === "countries"} onClick={() => setRadioTab("countries")}>
            Countries
          </TabButton>
        </div>

        {radioTab === "genres" && (
          <div className="sidebar-section">
            <div className="sidebar-title">Genres</div>
            <div
              className={`sidebar-item ${!activeTag ? "active" : ""}`}
              onClick={() => onSelectTag(null)}
            >
              <span>All Genres</span>
            </div>
            {radioTags.map((t) => (
              <div
                key={t.name}
                className={`sidebar-item ${activeTag === t.name ? "active" : ""}`}
                onClick={() => onSelectTag(t.name)}
              >
                <span>{t.name}</span>
                <span className="sidebar-count">{t.station_count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {radioTab === "countries" && (
          <div className="sidebar-section">
            <div className="sidebar-title">Countries</div>
            <div
              className={`sidebar-item ${!activeCountry ? "active" : ""}`}
              onClick={() => onSelectCountry(null)}
            >
              <span>All Countries</span>
            </div>
            {radioCountries.slice(0, 80).map((c) => (
              <div
                key={c.country_code}
                className={`sidebar-item ${activeCountry === c.country_code ? "active" : ""}`}
                onClick={() => onSelectCountry(c.country_code)}
              >
                <span>{c.country}</span>
                <span className="sidebar-count">{c.station_count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div
          className={`sidebar-item favorites-item ${showFavorites ? "active" : ""}`}
          onClick={onToggleFavorites}
        >
          <span className="favorites-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={showFavorites ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Favorites
          </span>
          {favoritesCount > 0 && (
            <span className="sidebar-count favorites-count">{favoritesCount}</span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "4px", padding: "0 12px", marginBottom: "16px" }}>
        <TabButton active={tab === "categories"} onClick={() => setTab("categories")}>
          Categories
        </TabButton>
        <TabButton active={tab === "countries"} onClick={() => setTab("countries")}>
          Countries
        </TabButton>
      </div>

      {tab === "categories" && (
        <div className="sidebar-section">
          <div className="sidebar-title">Categories</div>
          <div
            className={`sidebar-item ${!activeCategory && !showFavorites ? "active" : ""}`}
            onClick={() => onSelectCategory(null)}
          >
            <span>All Categories</span>
          </div>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`sidebar-item ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span>{cat.name}</span>
              <span className="sidebar-count">{cat.channel_count}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "countries" && (
        <div className="sidebar-section">
          <div className="sidebar-title">Countries</div>
          <div
            className={`sidebar-item ${!activeCountry && !showFavorites ? "active" : ""}`}
            onClick={() => onSelectCountry(null)}
          >
            <span>All Countries</span>
          </div>
          {countries.slice(0, 80).map((c) => (
            <div
              key={c.code}
              className={`sidebar-item ${activeCountry === c.code ? "active" : ""}`}
              onClick={() => onSelectCountry(c.code)}
            >
              <span>
                {c.flag && <span className="country-flag">{c.flag}</span>}
                {c.name}
              </span>
              <span className="sidebar-count">{c.channel_count}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "8px 12px",
        background: active ? "rgba(233,69,96,0.15)" : "transparent",
        border: "1px solid " + (active ? "var(--accent)" : "var(--border)"),
        borderRadius: "var(--radius-sm)",
        color: active ? "var(--accent)" : "var(--text-secondary)",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: 600,
        fontFamily: "inherit",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}
