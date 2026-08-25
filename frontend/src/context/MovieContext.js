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
  const [favoritesLoading, setFavoritesLoading] = useState(
    () => !!localStorage.getItem('token')
  );
  const [user, setUser] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showToast = (message, severity = 'info') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    localStorage.setItem('lastSearch', lastSearch);
  }, [lastSearch]);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setFavorites([]);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/validate`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        const message =
          err.response?.data?.error === 'Token expired'
            ? 'Session expired. Please log in again.'
            : 'Session invalid. Please log in again.';
        showToast(message, 'warning');
        logout();
      }
    };
    validateToken();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token || !isAuthenticated) {
        setFavorites([]);
        setFavoritesLoading(false);
        return;
      }
      setFavoritesLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(res.data.favorites || []);
      } catch (err) {
        setFavorites([]);
        showToast('Failed to load favorites.', 'error');
      } finally {
        setFavoritesLoading(false);
      }
    };
    fetchFavorites();
  }, [isAuthenticated]);

  const login = async (token) => {
    try {
      localStorage.setItem('token', token);
      const res = await axios.get(`${API_BASE_URL}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      setFavorites([]);
      showToast(
        err.response?.data?.error || 'Login failed. Please try again.',
        'error'
      );
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setFavorites([]);
    setUser(null);
  };

  const addFavorite = async (movie) => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return false;
    }
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/favorites`,
        { movie },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setFavorites(res.data.favorites || []);
      showToast('Added to favorites', 'success');
      return true;
    } catch (err) {
      showToast(
        err.response?.data?.error || 'Failed to add favorite.',
        'error'
      );
      return false;
    }
  };

  const removeFavorite = async (movieId) => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return false;
    }
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/favorites/${movieId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFavorites(res.data.favorites || []);
      showToast('Removed from favorites', 'success');
      return true;
    } catch (err) {
      setFavorites((prev) => prev.filter((fav) => String(fav.id) !== String(movieId)));
      showToast(
        err.response?.data?.error || 'Failed to remove favorite.',
        'error'
      );
      return false;
    }
  };

  const clearFavorites = async () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFavorites([]);
    } catch (err) {
      showToast(
        err.response?.data?.error || 'Failed to clear favorites.',
        'error'
      );
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
        favoritesLoading,
        addFavorite,
        removeFavorite,
        clearFavorites,
        setFavorites,
        user,
        showLoginDialog,
        setShowLoginDialog,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export default MovieProvider;
