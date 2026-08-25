import React, { useContext, useState } from 'react';
import { Navigate, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Fade,
  Skeleton,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete, ArrowBack, Home as HomeIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import MovieCard from './MovieCard';
import { MovieContext } from '../context/MovieContext';
import { styled } from '@mui/material/styles';

const HeroBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '40vh',
  width: '100%',
  overflow: 'hidden',
  backgroundColor: 'black !important',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: theme.palette.common.white,
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    height: '30vh',
    padding: theme.spacing(2),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    filter: 'brightness(0.6)',
    zIndex: -1,
  },
}));

const ClearButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(1.25, 3),
  textTransform: 'none',
  fontWeight: 700,
  color: '#fff',
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.45), rgba(198, 40, 40, 0.3))'
      : 'linear-gradient(135deg, rgba(244, 67, 54, 0.75), rgba(229, 57, 53, 0.55))',
  backdropFilter: 'blur(14px) saturate(160%)',
  WebkitBackdropFilter: 'blur(14px) saturate(160%)',
  border: '1px solid rgba(255, 120, 110, 0.45)',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 8px 24px rgba(244, 67, 54, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
      : '0 8px 24px rgba(244, 67, 54, 0.2), inset 0 1px 0 rgba(255,255,255,0.35)',
  transition: 'transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.6), rgba(198, 40, 40, 0.42))'
        : 'linear-gradient(135deg, rgba(244, 67, 54, 0.9), rgba(229, 57, 53, 0.7))',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 10px 28px rgba(244, 67, 54, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)'
        : '0 10px 28px rgba(244, 67, 54, 0.28), inset 0 1px 0 rgba(255,255,255,0.45)',
    transform: 'translateY(-1px)',
  },
  '&:disabled': {
    color: 'rgba(255,255,255,0.5)',
    background: 'rgba(244, 67, 54, 0.2)',
    border: '1px solid rgba(244, 67, 54, 0.2)',
    boxShadow: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 2),
    fontSize: '0.875rem',
  },
}));

const EmptyStateBox = styled(Box)(({ theme }) => ({
  minHeight: '40vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 4px 15px rgba(0, 0, 0, 0.3)'
      : '0 4px 15px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    minHeight: '30vh',
    padding: theme.spacing(2),
  },
}));

const GlassDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(30,30,30,0.85), rgba(18,18,18,0.75))'
        : 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.65))',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
    maxWidth: 400,
    width: '90%',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)'}`,
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(2px)',
  },
}));

const Favorites = () => {
  const { favorites, clearFavorites, isAuthenticated, favoritesLoading } =
    useContext(MovieContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleConfirmClear = async () => {
    setClearing(true);
    try {
      await clearFavorites();
      setConfirmClearOpen(false);
    } finally {
      setClearing(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: '/favorites' }} />;
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <HeroBox>
          <IconButton
            onClick={handleBack}
            aria-label="Go back"
            sx={{
              position: 'absolute',
              top: { xs: 72, sm: 80 },
              left: { xs: 12, sm: 24 },
              zIndex: 2,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(6px)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.55)' },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: 'common.white',
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            Your Favorite Movies
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.8,
              maxWidth: '600px',
              color: 'common.white',
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            Explore your handpicked collection of favorite films, curated just for you.
          </Typography>
        </HeroBox>
        <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
          {favoritesLoading ? (
            <Grid container spacing={{ xs: 1, sm: 2 }} justifyContent="center">
              {[...Array(8)].map((_, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{
                      width: '100%',
                      aspectRatio: '2/3',
                      borderRadius: 3,
                      bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.200',
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : favorites.length === 0 ? (
            <EmptyStateBox>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: 'text.primary',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                No Favorite Movies Yet
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 3,
                  maxWidth: '500px',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Start adding movies to your favorites by clicking the heart icon on movie cards
                or the Add to Favorites button on movie details.
              </Typography>
              <Button
                component={RouterLink}
                to="/"
                variant="contained"
                startIcon={<HomeIcon />}
                sx={{
                  borderRadius: 8,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 3,
                  py: 1.25,
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.12)'
                      : 'primary.main',
                  backdropFilter: 'blur(8px)',
                  border:
                    theme.palette.mode === 'dark'
                      ? '1px solid rgba(255,255,255,0.2)'
                      : 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.2)'
                        : 'primary.dark',
                    boxShadow: 'none',
                  },
                }}
              >
                Browse Movies
              </Button>
            </EmptyStateBox>
          ) : (
            <Box>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  pl: 2,
                  color: 'text.primary',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                Your Collection
              </Typography>
              <Grid container spacing={{ xs: 1, sm: 2 }}>
                {favorites.map(movie => (
                  <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.id}>
                    <Box
                      sx={{
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: { xs: 'none', sm: 'scale(1.05)' },
                          boxShadow:
                            theme.palette.mode === 'dark'
                              ? '0 10px 20px rgba(0,0,0,0.4)'
                              : '0 10px 20px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <MovieCard movie={movie} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ my: { xs: 3, sm: 4 }, bgcolor: 'divider' }} />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ClearButton
                  startIcon={<Delete />}
                  onClick={() => setConfirmClearOpen(true)}
                  disabled={favorites.length === 0}
                >
                  Clear Favorites
                </ClearButton>
              </Box>
            </Box>
          )}
        </Container>

        <GlassDialog
          open={confirmClearOpen}
          onClose={() => !clearing && setConfirmClearOpen(false)}
          aria-labelledby="clear-favorites-title"
        >
          <DialogTitle id="clear-favorites-title" sx={{ fontWeight: 700, pb: 1 }}>
            Clear all favorites?
          </DialogTitle>
          <DialogContent>
            <Typography color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              This will remove all {favorites.length} movie
              {favorites.length === 1 ? '' : 's'} from your favorites. This can’t be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button
              onClick={() => setConfirmClearOpen(false)}
              disabled={clearing}
              sx={{ textTransform: 'none', borderRadius: 8 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmClear}
              disabled={clearing}
              startIcon={<Delete />}
              sx={{
                textTransform: 'none',
                borderRadius: 8,
                fontWeight: 700,
                color: '#fff',
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.5), rgba(198, 40, 40, 0.35))'
                    : 'linear-gradient(135deg, rgba(244, 67, 54, 0.8), rgba(229, 57, 53, 0.6))',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 120, 110, 0.45)',
                boxShadow: '0 6px 18px rgba(244, 67, 54, 0.25)',
                '&:hover': {
                  background:
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.65), rgba(198, 40, 40, 0.45))'
                      : 'linear-gradient(135deg, rgba(244, 67, 54, 0.95), rgba(229, 57, 53, 0.75))',
                  boxShadow: '0 8px 22px rgba(244, 67, 54, 0.35)',
                },
              }}
            >
              {clearing ? 'Clearing...' : 'Clear All'}
            </Button>
          </DialogActions>
        </GlassDialog>
      </Box>
    </Fade>
  );
};

export default Favorites;
