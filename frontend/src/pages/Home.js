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
  Skeleton,
  Drawer,
  Badge,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { MovieContext } from '../context/MovieContext';
import { API_BASE_URL } from '../config';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloseIcon from '@mui/icons-material/Close';
import GoogleAd from '../components/GoogleAd';
import { Analytics } from '@vercel/analytics/react';

const glassFieldSx = {
  width: '100%',
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
  '& .MuiFormHelperText-root': {
    color: 'white',
    fontSize: { xs: '0.7rem', sm: '0.8rem' },
  },
};

const menuPaperSx = {
  bgcolor: 'rgba(26,26,26,0.95)',
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
};

const Home = () => {
  const { setLastSearch } = useContext(MovieContext);
  const theme = useTheme();
  const [trending, setTrending] = useState([]);
  const [bannerTrending, setBannerTrending] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState(localStorage.getItem('lastSearch') || '');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(localStorage.getItem('selectedGenre') || '');
  const [year, setYear] = useState(localStorage.getItem('year') || '');
  const [sortBy, setSortBy] = useState(localStorage.getItem('sortBy') || 'popularity.desc');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
    // Wait until year is complete (4 digits) or cleared before searching
    if (year && year.length > 0 && year.length < 4) {
      return;
    }

    const hasFilters =
      Boolean(selectedGenre) ||
      year.length === 4 ||
      sortBy !== 'popularity.desc';

    if (query.trim() || hasFilters) {
      handleSearch(query, 1);
    } else {
      setSearchResults([]);
      setPage(1);
      setTotalPages(1);
    }
  }, [query, selectedGenre, year, sortBy]);

  const handleSearch = async (searchQuery = '', pageNum) => {
    const trimmedQuery = (searchQuery || '').trim();
    const yearOk = year && year.length === 4;
    const hasFilters =
      Boolean(selectedGenre) || yearOk || sortBy !== 'popularity.desc';

    if (!trimmedQuery && !hasFilters) {
      setSearchResults([]);
      setLoading(false);
      setLoadingMore(false);
      setTotalPages(1);
      return;
    }

    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    let url = `${API_BASE_URL}/api/movies/search?page=${pageNum}`;
    if (trimmedQuery) url += `&query=${encodeURIComponent(trimmedQuery)}`;
    if (selectedGenre) url += `&with_genres=${encodeURIComponent(selectedGenre)}`;
    if (yearOk) url += `&primary_release_year=${year}`;
    if (sortBy) url += `&sort_by=${sortBy}`;

    try {
      const res = await axios.get(url);
      const results = res.data.results || [];
      const pages = Math.max(res.data.total_pages || 1, 1);

      // Prefer computing outside updater so page/totalPages stay in sync
      if (pageNum === 1) {
        setSearchResults(results);
        setPage(1);
        setTotalPages(results.length === 0 ? 1 : pages);
      } else {
        setSearchResults((prev) => {
          const existingIds = new Set(prev.map((movie) => movie.id));
          const uniqueNew = results.filter((movie) => !existingIds.has(movie.id));

          if (results.length === 0 || uniqueNew.length === 0) {
            setTotalPages(Math.max(pageNum - 1, 1));
            return prev;
          }

          setPage(pageNum);
          setTotalPages(pages);
          return [...prev, ...uniqueNew];
        });
      }
    } catch (err) {
      setError('Failed to search movies. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (page >= totalPages || loadingMore || loading) return;
    handleSearch(query, page + 1);
  };

  const handleFilterReset = () => {
    setSelectedGenre('');
    setYear('');
    setSortBy('popularity.desc');
    setQuery('');
    setSearchResults([]);
    setPage(1);
    setTotalPages(1);
    localStorage.removeItem('lastSearch');
    localStorage.removeItem('selectedGenre');
    localStorage.removeItem('year');
    localStorage.removeItem('sortBy');
  };

  const yearOk = year && year.length === 4;
  const hasActiveFilters =
    Boolean(selectedGenre) || yearOk || sortBy !== 'popularity.desc';
  const isBrowsing = Boolean(query.trim() || hasActiveFilters);
  const activeFilterCount =
    (selectedGenre ? 1 : 0) +
    (yearOk ? 1 : 0) +
    (sortBy !== 'popularity.desc' ? 1 : 0);

  const renderFilterControls = () => (
    <>
      <FormControl size="small" sx={{ ...glassFieldSx, width: { xs: '100%', sm: 140 } }}>
        <InputLabel>Genre</InputLabel>
        <Select
          value={selectedGenre}
          onChange={e => {
            setSelectedGenre(e.target.value);
            setPage(1);
          }}
          label="Genre"
          MenuProps={{ PaperProps: { sx: menuPaperSx } }}
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
        error={Boolean(year && year.length !== 4)}
        helperText={year && year.length !== 4 ? 'Enter a 4-digit year' : ''}
        sx={{ ...glassFieldSx, width: { xs: '100%', sm: 100 } }}
      />
      <FormControl size="small" sx={{ ...glassFieldSx, width: { xs: '100%', sm: 140 } }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          onChange={e => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          label="Sort By"
          MenuProps={{ PaperProps: { sx: menuPaperSx } }}
        >
          <MenuItem value="popularity.desc">Popularity</MenuItem>
          <MenuItem value="vote_average.desc">Rating</MenuItem>
          <MenuItem value="release_date.desc">Newest</MenuItem>
          <MenuItem value="release_date.asc">Oldest</MenuItem>
        </Select>
      </FormControl>
    </>
  );

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
          {bannerTrending.map(movie => {
            const isFallback = movie.id === 'fallback';
            return (
              <Box
                key={movie.id}
                component={isFallback ? 'div' : Link}
                to={isFallback ? undefined : `/movie/${movie.id}`}
                aria-label={isFallback ? undefined : `View details for ${movie.title}`}
                sx={{
                  height: { xs: '50vh', sm: '50vh', md: '60vh' },
                  backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: isFallback ? 'default' : 'pointer',
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
                    pointerEvents: 'none',
                  }}
                />
              </Box>
            );
          })}
        </Slider>
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '50%', sm: '50%' },
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: { xs: '90%', sm: 600 },
            px: { xs: 1, sm: 2 },
            mt: { xs: '40px', sm: 0 },
          }}
        >
          <SearchBar
            initialQuery={query}
            onSearch={searchQuery => {
              setQuery((prev) => (prev === searchQuery ? prev : searchQuery));
            }}
            transparent
            sx={{
              '& .MuiInputBase-root': {
                fontSize: { xs: '0.9rem', sm: '1rem' },
              },
            }}
          />

          {/* Mobile: filter trigger only */}
          <Box
            sx={{
              display: { xs: 'flex', sm: 'none' },
              justifyContent: 'center',
              gap: 1,
              mt: 1.5,
            }}
          >
            <Button
              variant="contained"
              startIcon={
                <Badge
                  color="error"
                  badgeContent={activeFilterCount}
                  invisible={activeFilterCount === 0}
                >
                  <FilterListIcon />
                </Badge>
              }
              onClick={() => setFiltersOpen(true)}
              sx={{
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
                px: 2.5,
                bgcolor: 'rgba(255,255,255,0.18)',
                color: 'white',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.35)',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.28)',
                  boxShadow: 'none',
                },
              }}
            >
              Filters
            </Button>
            {hasActiveFilters && (
              <IconButton
                onClick={handleFilterReset}
                aria-label="Reset filters"
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
                }}
              >
                <RestartAltIcon />
              </IconButton>
            )}
          </Box>

          {/* Desktop / tablet: inline filters */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'row',
              gap: 1,
              mt: 1.5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {renderFilterControls()}
            <IconButton
              onClick={() => handleSearch(query, 1)}
              disabled={!isBrowsing}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                p: 1,
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
              <FilterListIcon sx={{ fontSize: '1.5rem' }} />
            </IconButton>
            <IconButton
              onClick={handleFilterReset}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                p: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                  transform: 'scale(1.1)',
                },
              }}
              aria-label="Reset filters"
            >
              <RestartAltIcon sx={{ fontSize: '1.5rem' }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Drawer
        anchor="bottom"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            bgcolor: 'rgba(18, 18, 18, 0.92)',
            backdropFilter: 'blur(16px)',
            color: 'white',
            px: 2,
            pt: 1.5,
            pb: 3,
            maxHeight: '85vh',
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.3)',
            mx: 'auto',
            mb: 1.5,
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Filters
          </Typography>
          <IconButton
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters"
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {renderFilterControls()}
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={() => {
                handleFilterReset();
                setFiltersOpen(false);
              }}
              sx={{
                borderRadius: 8,
                textTransform: 'none',
                color: 'white',
                borderColor: 'rgba(255,255,255,0.4)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              Reset
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setFiltersOpen(false)}
              sx={{
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                  boxShadow: 'none',
                },
              }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            {error}
          </Alert>
        )}
        {isBrowsing && loading && (
          <Box sx={{ mb: { xs: 2, sm: 4 } }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontSize: { xs: '1.25rem', sm: '1.75rem' } }}
            >
              {query.trim() ? 'Search Results' : 'Browse Results'}
            </Typography>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              {[...Array(10)].map((_, index) => (
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
          </Box>
        )}
        {isBrowsing && !loading && searchResults.length === 0 && (
          <Box sx={{ mb: { xs: 2, sm: 4 }, textAlign: 'center' }}>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
            >
              {query.trim()
                ? `No results found for "${query.trim()}"`
                : 'No movies match these filters'}
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
        {isBrowsing && !loading && searchResults.length > 0 && (
          <Box sx={{ mb: { xs: 2, sm: 4 } }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontSize: { xs: '1.25rem', sm: '1.75rem' } }}
            >
              {query.trim() ? 'Search Results' : 'Browse Results'}
            </Typography>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              {searchResults.map(movie => (
                <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
            {page < totalPages && (
              <Box sx={{ mt: { xs: 1, sm: 2 }, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  onClick={loadMore}
                  disabled={loadingMore}
                  sx={{
                    minWidth: { xs: '120px', sm: '150px' },
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </Button>
              </Box>
            )}
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