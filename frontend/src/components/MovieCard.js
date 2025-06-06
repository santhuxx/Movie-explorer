import React, { useContext } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, IconButton, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { MovieContext } from '../context/MovieContext';

const MovieCard = ({ movie }) => {
  const { favorites, addFavorite, removeFavorite } = useContext(MovieContext);
  const isFavorite = favorites.some(fav => fav.id === movie.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        width: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: { xs: 'none', sm: 'scale(1.03)' },
          boxShadow: { xs: '0 8px 24px rgba(0,0,0,0.2)', sm: '0 12px 32px rgba(0,0,0,0.3)' },
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height={{ xs: 150, sm: 200 }}
          image={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://via.placeholder.com/500x750?text=No+Image'
          }
          alt={movie.title}
          sx={{
            objectFit: 'cover',
            aspectRatio: '2/3',
            width: '100%',
            transition: 'filter 0.3s ease',
            '&:hover': {
              filter: 'brightness(1.1)',
            },
          }}
          loading="lazy"
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%)',
          }}
        />
      </Box>
      <CardContent
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 0.75, sm: 1 },
          backdropFilter: 'blur(3px)',
          background: 'rgba(0, 0, 0, 0.35)',
          color: 'white',
          borderTop: '1px solid rgba(255, 255, 255, 0.19)',
        }}
      >
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontSize: { xs: '0.9rem', sm: '1.1rem' },
            fontWeight: 600,
            color: 'inherit', // Inherit white color from parent
            textDecoration: 'none', // Remove underline
            '&:hover': {
              textDecoration: 'bold', // Add underline on hover for visual feedback
            },
          }}
          component={Link}
          to={`/movie/${movie.id}`}
          aria-label={`View details for ${movie.title}`}
        >
          {movie.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, opacity: 0.9, mt: 0.25 }}
        >
          {movie.release_date?.slice(0, 4) || 'N/A'} • {movie.vote_average?.toFixed(1) || 'N/A'}/10
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: { xs: 0.25, sm: 0.5 },
          }}
        >
          <Button
            component={Link}
            to={`/movie/${movie.id}`}
            variant="contained"
            size="small"
            sx={{
              borderRadius: 20,
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              px: { xs: 1, sm: 1.5 },
              py: 0.25,
              bgcolor: 'rgba(255, 255, 255, 0.17)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
            }}
            aria-label={`View details for ${movie.title}`}
          >
            Details
          </Button>
          <IconButton
            onClick={handleFavoriteToggle}
            sx={{
              color: isFavorite ? '#ff5252' : 'rgba(255,255,255,0.7)',
              p: 0.5,
            }}
            aria-label={isFavorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
          >
            <FavoriteIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard;