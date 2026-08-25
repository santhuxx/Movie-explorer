import React, { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { Delete, ArrowBack } from '@mui/icons-material';
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
  borderRadius: 8,
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  fontWeight: 700,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabled,
    color: theme.palette.action.disabledBackground,
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

const Favorites = () => {
  const { favorites, clearFavorites, isAuthenticated, favoritesLoading } =
    useContext(MovieContext);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
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
                  maxWidth: '500px',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Start adding movies to your favorites by clicking the heart icon on movie cards
                or the Add to Favorites button on movie details.
              </Typography>
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
                  variant="contained"
                  startIcon={<Delete />}
                  onClick={clearFavorites}
                  disabled={favorites.length === 0}
                >
                  Clear Favorites
                </ClearButton>
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </Fade>
  );
};

export default Favorites;