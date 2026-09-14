import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('ticket_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ticket_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, [favorites]);

  const addFavorite = (concertId) => {
    setFavorites(prev => {
      if (prev.includes(concertId)) return prev;
      return [...prev, concertId];
    });
  };

  const removeFavorite = (concertId) => {
    setFavorites(prev => prev.filter(id => id !== concertId));
  };

  const toggleFavorite = (concertId) => {
    setFavorites(prev => {
      if (prev.includes(concertId)) {
        return prev.filter(id => id !== concertId);
      }
      return [...prev, concertId];
    });
  };

  const isFavorite = (concertId) => favorites.includes(concertId);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
