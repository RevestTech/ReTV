import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "retv_favorites";

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveFavorites(favs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

export default function useFavorites() {
  const [favorites, setFavorites] = useState(loadFavorites);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const toggleFavorite = useCallback((channel) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[channel.id]) {
        delete next[channel.id];
      } else {
        next[channel.id] = {
          id: channel.id,
          name: channel.name,
          logo: channel.logo,
          country_code: channel.country_code,
          categories: channel.categories,
          stream_url: channel.stream_url,
        };
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (channelId) => !!favorites[channelId],
    [favorites]
  );

  const favoritesList = Object.values(favorites);
  const favoritesCount = favoritesList.length;

  return { favorites, favoritesList, favoritesCount, toggleFavorite, isFavorite };
}
