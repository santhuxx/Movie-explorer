import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Fade,
  Avatar,
  Grid,
  IconButton,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow,
  AccessTime,
  Star,
  CalendarToday,
  Language,
  People,
  ArrowBack,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { API_BASE_URL } from '../config';
import { MovieContext } from '../context/MovieContext';

const MovieDetailsSkeleton = ({ onBack }) => (
  <Box sx={{ position: 'relative', minHeight: '100vh' }}>
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: '80vh', sm: '70vh' },
        bgcolor: 'grey.900',
        overflow: 'hidden',
      }}
    >
      <IconButton
        onClick={onBack}
        aria-label="Go back"
        sx={{
          position: 'absolute',
          top: { xs: 72, sm: 80 },
          left: { xs: 12, sm: 24 },
          zIndex: 2,
          color: 'white',
          bgcolor: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <ArrowBack />
      </IconButton>
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          pt: { xs: 10, sm: 12 },
          pb: { xs: 4, sm: 8 },
          gap: { xs: 3, md: 4 },
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: { xs: '50%', sm: 220, md: 260 },
            maxWidth: 300,
            aspectRatio: '2/3',
            borderRadius: 2,
            bgcolor: 'grey.800',
          }}
        />
        <Box sx={{ width: { xs: '100%', md: '60%' }, px: { xs: 1, sm: 0 } }}>
          <Skeleton
            variant="text"
            animation="wave"
            sx={{ fontSize: '2.5rem', width: '80%', bgcolor: 'grey.800', mb: 1 }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{ fontSize: '1.2rem', width: '55%', bgcolor: 'grey.800', mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {[1, 2, 3].map((n) => (
              <Skeleton
                key={n}
                variant="rounded"
                animation="wave"
                width={72}
                height={28}
                sx={{ borderRadius: 4, bgcolor: 'grey.800' }}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
            <Skeleton
              variant="rounded"
              animation="wave"
              width={140}
              height={42}
              sx={{ borderRadius: 8, bgcolor: 'grey.800' }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              width={160}
              height={42}
              sx={{ borderRadius: 8, bgcolor: 'grey.800' }}
            />
          </Box>
          <Skeleton
            variant="text"
            animation="wave"
            sx={{ fontSize: '1rem', bgcolor: 'grey.800' }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{ fontSize: '1rem', bgcolor: 'grey.800' }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{ fontSize: '1rem', width: '70%', bgcolor: 'grey.800' }}
          />
        </Box>
      </Container>
    </Box>
    <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
      <Skeleton
        variant="text"
        animation="wave"
        sx={{ fontSize: '1.5rem', width: 140, mb: 2 }}
      />
      <Grid container spacing={2}>
        {[...Array(6)].map((_, i) => (
          <Grid item xs={4} sm={3} md={2} key={i}>
            <Box sx={{ textAlign: 'center' }}>
              <Skeleton
                variant="circular"
                animation="wave"
                sx={{
                  width: { xs: 60, sm: 80 },
                  height: { xs: 60, sm: 80 },
                  mx: 'auto',
                  mb: 1,
                }}
              />
              <Skeleton variant="text" animation="wave" width="80%" sx={{ mx: 'auto' }} />
              <Skeleton variant="text" animation="wave" width="60%" sx={{ mx: 'auto' }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const backdropSize = isMobile ? 'w780' : 'original';
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isAuthenticated,
    setShowLoginDialog,
  } = useContext(MovieContext);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    axios
      .get(`${API_BASE_URL}/api/movies/${id}`)
      .then(res => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch movie details');
        setLoading(false);
      });
  }, [id]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (loading) return <MovieDetailsSkeleton onBack={handleBack} />;

  if (error)
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          gap: 2,
        }}
      >
        <Typography color="error" variant="h5">
          {error}
        </Typography>
        <Button startIcon={<ArrowBack />} onClick={handleBack} variant="outlined">
          Go Back
        </Button>
      </Box>
    );

  if (!movie) return null;

  const movieId = String(movie.id);
  const isFavorite = favorites.some(fav => String(fav.id) === movieId);

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    if (isFavorite) {
      removeFavorite(movieId);
    } else {
      addFavorite({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      });
    }
  };

  const trailer = movie.videos.results.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );
  const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

  // Format runtime to hours and minutes
  const formatRuntime = minutes => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ position: 'relative' }}>
        {/* Hero Section with Backdrop */}
        <Box
          sx={{
            position: 'relative',
            height: 'auto', // Changed to auto to fit content
            minHeight: { xs: '80vh', sm: '70vh', md: '70vh' }, // Minimum height, but can expand
            width: '100%',
            overflow: 'visible', // Ensure no hidden overflow
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(https://image.tmdb.org/t/p/${backdropSize}${movie.backdrop_path})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.3)',
              zIndex: -1,
            },
          }}
        >
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

          <Container
            maxWidth="lg"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              pt: { xs: 4, sm: 8 },
              pb: { xs: 4, sm: 8 }, // Increased bottom padding to prevent cropping
              minHeight: { xs: '80vh', sm: '70vh' },
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Poster */}
            <Box
              sx={{
                width: { xs: '50%', sm: '35%', md: '25%' },
                maxWidth: '300px',
                mb: { xs: 2, md: 0 },
                mr: { md: 4 },
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                transform: { xs: 'translateY(10px)', md: 'translateY(20px)' },
                aspectRatio: '2/3',
                '& img': {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                },
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                loading="lazy"
              />
            </Box>

            {/* Movie Info */}
            <Box
              sx={{
                color: 'white',
                width: { xs: '100%', md: '60%' },
                textAlign: { xs: 'center', md: 'left' },
                overflow: 'visible', // Ensure no hidden overflow
                padding: { xs: 0, sm: 2, md: 0 },
                maxHeight: 'none', // Remove height constraint
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                  wordBreak: 'break-word',
                }}
              >
                {movie.title}
              </Typography>

              {movie.tagline && (
                <Typography
                  variant="h6"
                  sx={{
                    fontStyle: 'italic',
                    opacity: 0.8,
                    mb: 2,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    wordBreak: 'break-word',
                  }}
                >
                  {movie.tagline}
                </Typography>
              )}

              {/* Rating and Year */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mb: 2,
                  flexWrap: 'wrap',
                  gap: { xs: 1, sm: 2 },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 1, sm: 3 } }}>
                  <Star sx={{ color: '#FFD700', mr: 0.5, fontSize: { xs: '1rem', sm: '1.2rem' } }} />
                  <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                    {movie.vote_average.toFixed(1)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 1, sm: 3 } }}>
                  <CalendarToday sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.2rem' } }} />
                  <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    {new Date(movie.release_date).getFullYear()}
                  </Typography>
                </Box>

                {movie.runtime && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.2rem' } }} />
                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      {formatRuntime(movie.runtime)}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Genres */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  mb: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                {movie.genres.map(genre => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                    }}
                  />
                ))}
              </Box>

              {/* Actions */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  mb: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  alignItems: 'center',
                }}
              >
                {trailerUrl && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<PlayArrow />}
                    size="large"
                    onClick={() =>
                      document.getElementById('trailer-section').scrollIntoView({ behavior: 'smooth' })
                    }
                    sx={{
                      borderRadius: 8,
                      px: { xs: 2, sm: 3 },
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                    aria-label="Scroll to trailer section"
                  >
                    Watch Trailer
                  </Button>
                )}
                <Button
                  variant={isFavorite ? 'contained' : 'outlined'}
                  startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                  size="large"
                  onClick={handleFavoriteToggle}
                  sx={{
                    borderRadius: 8,
                    px: { xs: 2, sm: 3 },
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    color: isFavorite ? 'white' : 'white',
                    bgcolor: isFavorite ? '#ff5252' : 'transparent',
                    borderColor: isFavorite ? '#ff5252' : 'rgba(255,255,255,0.6)',
                    '&:hover': {
                      bgcolor: isFavorite ? '#e04848' : 'rgba(255,255,255,0.12)',
                      borderColor: isFavorite ? '#e04848' : 'white',
                    },
                  }}
                  aria-label={
                    isFavorite
                      ? `Remove ${movie.title} from favorites`
                      : `Add ${movie.title} to favorites`
                  }
                >
                  {isFavorite ? 'Favorited' : 'Add to Favorites'}
                </Button>
              </Box>

              {/* Overview */}
              <Typography
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1.1rem' },
                  mb: 3,
                  lineHeight: 1.6,
                  maxWidth: '100%', // Removed 90% maxWidth to allow full width
                  mx: { xs: 'auto', md: 0 },
                  wordBreak: 'break-word',
                  overflow: 'visible', // Ensure no hidden overflow
                }}
              >
                {movie.overview}
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Additional Details Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
          {/* Cast Section */}
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 2,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            Top Cast
          </Typography>

          <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: { xs: 4, sm: 6 } }}>
            {movie.credits.cast.slice(0, 6).map(person => (
              <Grid item xs={4} sm={3} md={2} key={person.id}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                        : '/broken-image.jpg'
                    }
                    alt={person.name}
                    sx={{
                      width: { xs: '60px', sm: '80px' },
                      height: { xs: '60px', sm: '80px' },
                      mx: 'auto',
                      mb: 1,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }}
                    loading="lazy"
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    }}
                  >
                    {person.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                  >
                    {person.character}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Trailer Section */}
          {trailer && (
            <Box id="trailer-section" sx={{ mb: { xs: 4, sm: 6 } }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  borderLeft: '4px solid',
                  borderColor: 'error.main',
                  pl: 2,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                Official Trailer
              </Typography>

              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '56.25%', /* 16:9 Aspect Ratio */
                  bgcolor: '#000',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                }}
              >
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={`${movie.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            </Box>
          )}

          {/* Details Grid */}
          <Grid container spacing={{ xs: 2, sm: 4 }}>
            {/* Left Column - Details */}
            <Grid item xs={12} md={8}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  pl: 2,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                Details
              </Typography>

              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {movie.budget > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      }}
                    >
                      Budget
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                    >
                      ${movie.budget.toLocaleString()}
                    </Typography>
                  </Grid>
                )}

                {movie.revenue > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      }}
                    >
                      Revenue
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                    >
                      ${movie.revenue.toLocaleString()}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    Original Language
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                  >
                    {new Intl.DisplayNames(['en'], { type: 'language' }).of(
                      movie.original_language
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    Status
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                  >
                    {movie.status}
                  </Typography>
                </Grid>

                {movie.production_companies.length > 0 && (
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      }}
                    >
                      Production Companies
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                    >
                      {movie.production_companies.map(company => company.name).join(', ')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Right Column - Stats */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  pl: 2,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                Stats
              </Typography>

              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  p: { xs: 2, sm: 3 },
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star
                    sx={{ color: '#FFD700', mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    Rating
                  </Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mr: 1,
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                    }}
                  >
                    {movie.vote_average.toFixed(1)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                  >
                    /10 ({movie.vote_count.toLocaleString()} votes)
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <People
                    sx={{ mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    Popularity
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                    }}
                  >
                    {Math.round(movie.popularity)}
                  </Typography>
                </Box>

                {movie.homepage && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Button
                      variant="outlined"
                      startIcon={<Language />}
                      href={movie.homepage}
                      target="_blank"
                      fullWidth
                      sx={{
                        textTransform: 'none',
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        py: { xs: 0.5, sm: 1 },
                      }}
                      aria-label="Visit official website"
                    >
                      Official Website
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
};

export default MovieDetails;