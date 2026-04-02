import { useState, useCallback, useMemo } from "react";

const STORAGE_KEY = "adajoon_recent";
const MAX_ITEMS = 20;

function normalizeEntry(raw) {
  if (!raw || typeof raw !== "object") return null;
  const type = raw.type === "tv" || raw.type === "radio" ? raw.type : null;
  const id = raw.id;
  if (type == null || id == null) return null;
  return {
    type,
    id,
    name: String(raw.name ?? ""),
    logo: raw.logo ?? null,
    timestamp: typeof raw.timestamp === "number" ? raw.timestamp : 0,
  };
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeEntry).filter(Boolean);
  } catch {
    return [];
  }
}

function buildEntry(type, item) {
  return {
    type,
    id: item.id,
    name: item.name ?? "",
    logo: type === "radio" ? (item.favicon || item.logo || null) : (item.logo ?? null),
    timestamp: Date.now(),
  };
}

export default function useRecentlyPlayed() {
  const [items, setItems] = useState(readStored);

  const addRecent = useCallback((type, item) => {
    if (!item?.id) return;
    const entry = buildEntry(type, item);
    setItems((prev) => {
      const filtered = prev.filter((e) => !(e.type === entry.type && e.id === entry.id));
      const next = [entry, ...filtered].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch { /* ignore quota */ }
      return next;
    });
  }, []);

  const recentItems = useMemo(
    () => [...items].sort((a, b) => b.timestamp - a.timestamp),
    [items]
  );

  return { addRecent, recentItems };
}
