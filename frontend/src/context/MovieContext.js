import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [lastSearch, setLastSearch] = useState(localStorage.getItem('lastSearch') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [user, setUser] = useState(null); // Store user data (e.g., username)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Persist dark mode and last search
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('lastSearch', lastSearch);
  }, [lastSearch]);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Example: Validate token with backend
          const res = await axios.get('https://movie-explorer-topaz.vercel.app/api/auth/validate', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user); // e.g., { username: 'test' }
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Token validation failed:', err);
          logout(); // Clear invalid token
        }
      }
    };
    validateToken();
  }, []);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const login = async (token) => {
    try {
      localStorage.setItem('token', token);
      const res = await axios.get('https://movie-explorer-topaz.vercel.app/api/auth/validate', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Login failed:', err);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('favorites');
    setIsAuthenticated(false);
    setFavorites([]);
    setUser(null);
  };

  const addFavorite = (movie) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites.some((fav) => fav.id === movie.id)) {
        const newFavorites = [...prevFavorites, movie];
        return newFavorites;
      }
      return prevFavorites;
    });
  };

  const removeFavorite = (movieId) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.filter((fav) => fav.id !== movieId);
      return newFavorites;
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <MovieContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        lastSearch,
        setLastSearch,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        favorites,
        addFavorite,
        removeFavorite,
        clearFavorites,
        setFavorites,
        user,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};