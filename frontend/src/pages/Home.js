import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  useTheme,
  IconButton,
} from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { MovieContext } from '../context/MovieContext';
import { API_BASE_URL } from '../config';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import GoogleAd from '../components/GoogleAd';
import { Analytics } from '@vercel/analytics/react';

const Home = () => {
  const { setLastSearch } = useContext(MovieContext);
  const theme = useTheme();
  const [trending, setTrending] = useState([]);
  const [bannerTrending, setBannerTrending] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(localStorage.getItem('lastSearch') || '');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(localStorage.getItem('selectedGenre') || '');
  const [year, setYear] = useState(localStorage.getItem('year') || '');
  const [sortBy, setSortBy] = useState(localStorage.getItem('sortBy') || 'popularity.desc');
  const [loading, setLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('lastSearch', query);
    setLastSearch(query);
  }, [query, setLastSearch]);

  useEffect(() => {
    localStorage.setItem('selectedGenre', selectedGenre);
  }, [selectedGenre]);

  useEffect(() => {
    localStorage.setItem('year', year);
  }, [year]);

  useEffect(() => {
    localStorage.setItem('sortBy', sortBy);
  }, [sortBy]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/movies/trending`);
        const allTrending = res.data;
        setTrending(allTrending);
        const filteredTrending = allTrending
          .filter(movie => movie.backdrop_path)
          .slice(0, 20);
        setBannerTrending(
          filteredTrending.length
            ? filteredTrending
            : [{ id: 'fallback', title: 'No Trending Movies', backdrop_path: '/8cdWjvZNUXbCnvG8IwV6W316pwH.jpg' }]
        );
      } catch (err) {
        console.error('Trending Error:', err);
        setError('Failed to fetch trending movies. Please try again later.');
        setTrending([]);
        setBannerTrending([{ id: 'fallback', title: 'No Trending Movies', backdrop_path: '/8cdWjvZNUXbCnvG8IwV6W316pwH.jpg' }]);
      } finally {
        setBannerLoading(false);
      }
    };

    const fetchGenres = async () => {
      try {
        const res = await axios.get(
          'https://api.themoviedb.org/3/genre/movie/list?api_key=68652c8bbb0c3071dec9e810736c5389'
        );
        setGenres(res.data.genres);
      } catch (err) {
        setError('Failed to fetch genres. Please try again later.');
      }
    };

    fetchTrending();
    fetchGenres();
  }, []);

  useEffect(() => {
    if (query) {
      handleSearch(query, 1);
    } else {
      setSearchResults([]);
      setPage(1);
    }
  }, [query, selectedGenre, year, sortBy]);

  const handleSearch = async (searchQuery = '', pageNum) => {
    if (!searchQuery) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let url = `${API_BASE_URL}/api/movies/search?page=${pageNum}`;
    if (searchQuery) url += `&query=${encodeURIComponent(searchQuery)}`;
    if (selectedGenre) url += `&with_genres=${encodeURIComponent(selectedGenre)}`;
    if (year) url += `&primary_release_year=${year}`;
    if (sortBy) url += `&sort_by=${sortBy}`;

    try {
      const res = await axios.get(url);
      setSearchResults(pageNum === 1 ? res.data.results : [...searchResults, ...res.data.results]);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to search movies. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    handleSearch(query, page + 1);
  };

  const handleFilterReset = () => {
    setSelectedGenre('');
    setYear('');
    setSortBy('popularity.desc');
    setQuery('');
    setSearchResults([]);
    setPage(1);
    localStorage.removeItem('lastSearch');
    localStorage.removeItem('selectedGenre');
    localStorage.removeItem('year');
    localStorage.removeItem('sortBy');
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          dots: true,
          arrows: false,
        },
      },
    ],
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Box
        sx={{
          position: 'relative',
          height: { xs: '50vh', sm: '50vh', md: '60vh' },
          overflow: 'hidden',
        }}
      >
        {bannerLoading && (
          <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        )}
        <Slider {...sliderSettings}>
          {bannerTrending.map(movie => (
            <Box
              key={movie.id}
              sx={{
                height: { xs: '50vh', sm: '50vh', md: '60vh' },
                backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  px: { xs: 1, sm: 2 },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                    display: movie.id === 'fallback' ? 'block' : 'none',
                  }}
                >
                  {movie.title}
                </Typography>
              </Box>
            </Box>
          ))}
        </Slider>
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '45%', sm: '50%' },
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: { xs: '90%', sm: 600 },
            px: { xs: 1, sm: 2 },
            mt: { xs: '56px', sm: 0 },
          }}
        >
          <SearchBar
            initialQuery={query}
            onSearch={searchQuery => {
              setQuery(searchQuery);
              setPage(1);
            }}
            transparent
            sx={{
              '& .MuiInputBase-root': {
                fontSize: { xs: '0.9rem', sm: '1rem' },
              },
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 0.75, sm: 1 },
              mt: { xs: 1, sm: 1.5 },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FormControl
              size="small"
              sx={{
                width: { xs: '100%', sm: 140 },
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 8,
                backdropFilter: 'blur(8px)',
                '& .MuiInputBase-root': {
                  color: 'white',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  borderRadius: 8,
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  transform: 'translate(14px, 8px) scale(1)',
                  '&.Mui-focused, &.MuiFormLabel-filled': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                  },
                },
                '& .MuiSelect-select': {
                  py: 1,
                  pl: 1.5,
                },
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '& .Mui-focused fieldset': {
                  borderColor: 'white',
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
            >
              <InputLabel>Genre</InputLabel>
              <Select
                value={selectedGenre}
                onChange={e => {
                  setSelectedGenre(e.target.value);
                  setPage(1);
                }}
                label="Genre"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: 'rgba(26,26,26,0.9)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      '& .MuiMenuItem-root': {
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.1)',
                        },
                        '&.Mui-selected': {
                          bgcolor: 'rgba(255,255,255,0.2)',
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">All Genres</MenuItem>
                {genres.map(genre => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Year"
              type="number"
              value={year}
              onChange={e => {
                const val = e.target.value;
                if (val.length <= 4) {
                  setYear(val);
                  if (val.length === 4 || val === '') {
                    setPage(1);
                  }
                }
              }}
              placeholder="e.g., 2023"
              error={year && year.length !== 4}
              helperText={year && year.length !== 4 ? 'Enter a 4-digit year' : ''}
              sx={{
                width: { xs: '100%', sm: 100 },
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 8,
                backdropFilter: 'blur(8px)',
                '& .MuiInputLabel-root': {
                  color: 'white',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  transform: 'translate(14px, 8px) scale(1)',
                  '&.Mui-focused, &.MuiFormLabel-filled': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                  },
                },
                '& .MuiInputBase-root': {
                  color: 'white',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  borderRadius: 8,
                },
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '& .Mui-focused fieldset': {
                  borderColor: 'white',
                },
                '& .MuiFormHelperText-root': {
                  color: 'white',
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                },
              }}
            />
            <FormControl
              size="small"
              sx={{
                width: { xs: '100%', sm: 140 },
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 8,
                backdropFilter: 'blur(8px)',
                '& .MuiInputBase-root': {
                  color: 'white',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  borderRadius: 8,
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  transform: 'translate(14px, 8px) scale(1)',
                  '&.Mui-focused, &.MuiFormLabel-filled': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                  },
                },
                '& .MuiSelect-select': {
                  py: 1,
                  pl: 1.5,
                },
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '& .Mui-focused fieldset': {
                  borderColor: 'white',
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
            >
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={e => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                label="Sort By"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: 'rgba(26,26,26,0.9)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      '& .MuiMenuItem-root': {
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.1)',
                        },
                        '&.Mui-selected': {
                          bgcolor: 'rgba(255,255,255,0.2)',
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="popularity.desc">Popularity</MenuItem>
                <MenuItem value="vote_average.desc">Rating</MenuItem>
                <MenuItem value="release_date.desc">Newest</MenuItem>
                <MenuItem value="release_date.asc">Oldest</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              onClick={() => handleSearch(query, 1)}
              disabled={!query}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                p: { xs: 0.75, sm: 1 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                  transform: 'scale(1.1)',
                },
                '&:disabled': {
                  color: 'rgba(255,255,255,0.3)',
                  bgcolor: 'transparent',
                },
              }}
              aria-label="Apply filters"
            >
              <FilterListIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            </IconButton>
            <IconButton
              onClick={handleFilterReset}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                p: { xs: 0.75, sm: 1 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                  transform: 'scale(1.1)',
                },
              }}
              aria-label="Reset filters"
            >
              <RestartAltIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            {error}
          </Alert>
        )}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: { xs: 2, sm: 4 } }}>
            <CircularProgress size={30} />
          </Box>
        )}
        {query && !loading && searchResults.length === 0 && (
          <Box sx={{ mb: { xs: 2, sm: 4 }, textAlign: 'center' }}>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
            >
              No results found for "{query}"
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              Try a different search term or adjust your filters.
            </Typography>
          </Box>
        )}
        {query && searchResults.length > 0 && (
          <Box sx={{ mb: { xs: 2, sm: 4 } }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontSize: { xs: '1.25rem', sm: '1.75rem' } }}
            >
              Search Results
            </Typography>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              {searchResults.map(movie => (
                <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: { xs: 1, sm: 2 }, textAlign: 'center' }}>
              <Button
                variant="contained"
                onClick={loadMore}
                disabled={loading}
                sx={{
                  minWidth: { xs: '120px', sm: '150px' },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </Box>
          </Box>
        )}
        <Box>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontSize: { xs: '1.25rem', sm: '1.75rem' } }}
          >
            Trending Movies
          </Typography>
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            {trending.map(movie => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.id}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;