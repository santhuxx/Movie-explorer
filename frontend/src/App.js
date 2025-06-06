import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MovieProvider, MovieContext } from './context/MovieContext';
import Home from './pages/Home';
import MovieDetails from './components/MovieDetails';
import Favorites from './components/Favorites';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { Analytics } from "@vercel/analytics/react"

const AppContent = () => {
  const { isDarkMode, isAuthenticated } = useContext(MovieContext);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      background: {
        default: isDarkMode ? '#000000' : '#f5f5f5',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#000000',
      },
      primary: {
        main: '#1976d2', // Blue for button and focused outlines
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/movie/:id" element={isAuthenticated ? <MovieDetails /> : <Navigate to="/login" />} />
        <Route path="/favorites" element={isAuthenticated ? <Favorites /> : <Navigate to="/login" />} />
      </Routes>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <MovieProvider>
      <AppContent />
      <Analytics />
    </MovieProvider>
  );
};

export default App;