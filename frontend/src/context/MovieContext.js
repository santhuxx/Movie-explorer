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
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  // Toggle dark mode and save to local storage
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  // Save last search to local storage
  useEffect(() => {
    localStorage.setItem('lastSearch', lastSearch);
  }, [lastSearch]);

  // Validate token and fetch user data on mount
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping validation');
        setFavorites([]);
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

  // Fetch favorites when user is authenticated
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token || !isAuthenticated) {
        setFavorites([]);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(res.data.favorites || []);
      } catch (err) {
        console.error('Error fetching favorites:', err.response?.data || err.message);
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, [isAuthenticated]);

  // Login function
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
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      setFavorites([]);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setFavorites([]);
    setUser(null);
  };

  // Add a movie to favorites
  const addFavorite = async (movie) => {
    if (!isAuthenticated) {
      console.error('User not logged in');
      return false;
    }
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/favorites`,
        { movie },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setFavorites(res.data.favorites || []);
      return true;
    } catch (err) {
      console.error('Error adding favorite:', err.response?.data || err.message);
      return false;
    }
  };

  // Remove a movie from favorites
  const removeFavorite = async (movieId) => {
    if (!isAuthenticated) {
      console.error('User not logged in');
      return false;
    }
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/favorites/${movieId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFavorites(res.data.favorites || []);
      return true;
    } catch (err) {
      console.error('Error removing favorite:', err.response?.data || err.message);
      return false;
    }
  };

  // Clear all favorites
  const clearFavorites = async () => {
    if (!isAuthenticated) {
      console.error('User not logged in');
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFavorites([]);
    } catch (err) {
      console.error('Error clearing favorites:', err.response?.data || err.message);
    }
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