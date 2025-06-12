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
import GoogleAdScript from './components/GoogleAdScript';
import LoginDialog from './components/LoginDialog'; // New login dialog component
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/react';

const AppContent = () => {
  const { isDarkMode } = useContext(MovieContext);

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
        main: '#1976d2',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleAdScript />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/favorites" element={<Favorites />}
        />
      </Routes>
      <LoginDialog />
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <MovieProvider>
      <AppContent />
      <Analytics />
      <SpeedInsights />
    </MovieProvider>
  );
};

export default App;