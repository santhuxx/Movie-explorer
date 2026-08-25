import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { MovieProvider, MovieContext } from './context/MovieContext';
import Home from './pages/Home';
import MovieDetails from './components/MovieDetails';
import Favorites from './components/Favorites';
import Login from './components/Login';
import Navbar from './components/Navbar';
import GoogleAdScript from './components/GoogleAdScript';
import LoginDialog from './components/LoginDialog';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const AppContent = () => {
  const { isDarkMode, toast, hideToast } = useContext(MovieContext);

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
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
      <LoginDialog />
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          bottom: { xs: 24, sm: 32 },
          '& .MuiSnackbarContent-root': { padding: 0 },
        }}
      >
        <Alert
          onClose={hideToast}
          severity={toast.severity}
          variant="outlined"
          icon={false}
          sx={(theme) => {
            const accents = {
              success: { glow: 'rgba(76, 175, 80, 0.45)', tint: 'rgba(76, 175, 80, 0.18)', text: '#81c784' },
              error: { glow: 'rgba(244, 67, 54, 0.45)', tint: 'rgba(244, 67, 54, 0.18)', text: '#ef9a9a' },
              warning: { glow: 'rgba(255, 167, 38, 0.45)', tint: 'rgba(255, 167, 38, 0.18)', text: '#ffcc80' },
              info: { glow: 'rgba(33, 150, 243, 0.45)', tint: 'rgba(33, 150, 243, 0.18)', text: '#90caf9' },
            };
            const accent = accents[toast.severity] || accents.info;
            const isDark = theme.palette.mode === 'dark';

            return {
              width: '100%',
              maxWidth: 420,
              alignItems: 'center',
              px: 2,
              py: 1.25,
              borderRadius: 3,
              color: isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.88)',
              background: isDark
                ? `linear-gradient(135deg, rgba(30,30,30,0.55), rgba(18,18,18,0.4)), ${accent.tint}`
                : `linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.35)), ${accent.tint}`,
              backdropFilter: 'blur(16px) saturate(160%)',
              WebkitBackdropFilter: 'blur(16px) saturate(160%)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.55)'}`,
              boxShadow: isDark
                ? `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.12)`
                : `0 8px 28px rgba(0,0,0,0.12), 0 0 0 1px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.7)`,
              fontWeight: 500,
              fontSize: '0.95rem',
              letterSpacing: '0.01em',
              '& .MuiAlert-message': {
                py: 0.5,
                width: '100%',
              },
              '& .MuiAlert-action': {
                pt: 0,
                pr: 0.5,
                alignItems: 'center',
              },
              '& .MuiIconButton-root': {
                color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                },
              },
              '&::before': {
                content: '""',
                display: 'block',
                width: 4,
                alignSelf: 'stretch',
                borderRadius: 4,
                mr: 1.5,
                background: `linear-gradient(180deg, ${accent.text}, ${accent.glow})`,
                boxShadow: `0 0 12px ${accent.glow}`,
                flexShrink: 0,
              },
            };
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <MovieProvider>
      <AppContent />
    </MovieProvider>
  );
};

export default App;