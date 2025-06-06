import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

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
  const [user, setUser] = useState(null);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('lastSearch', lastSearch);
  }, [lastSearch]);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping validation');
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/validate`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Validation success:', res.data.user);
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Token validation failed:', err.response?.data || err.message);
        if (err.response?.data?.error === 'Token expired') {
          alert('Session expired. Please log in again.');
        }
        logout();
      }
    };
    validateToken();
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const login = async (token) => {
    try {
      localStorage.setItem('token', token);
      const res = await axios.get(`${API_BASE_URL}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Login validation success:', res.data.user);
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Login validation failed:', err.response?.data || err.message);
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
        return [...prevFavorites, movie];
      }
      return prevFavorites;
    });
  };

  const removeFavorite = (movieId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((fav) => fav.id !== movieId)
    );
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