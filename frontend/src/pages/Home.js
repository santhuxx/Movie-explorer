import React, { useState, useEffect, useContext, useRef } from 'react';
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
  useMediaQuery,
  IconButton,
  Skeleton,
  Drawer,
  Badge,
} from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import Seo, { SITE_URL } from '../components/Seo';
import { MovieContext } from '../context/MovieContext';
import { API_BASE_URL } from '../config';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloseIcon from '@mui/icons-material/Close';
import GoogleAd from '../components/GoogleAd';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const backdropSize = isMobile ? 'w780' : 'w1280';
  const [searchParams] = useSearchParams();
  const [trending, setTrending] = useState([]);
  const [bannerTrending, setBannerTrending] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState(
    () => searchParams.get('q') || localStorage.getItem('lastSearch') || ''
  );
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(localStorage.getItem('selectedGenre') || '');
  const [year, setYear] = useState(localStorage.getItem('year') || '');
  const [sortBy, setSortBy] = useState(localStorage.getItem('sortBy') || 'popularity.desc');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [yearTouched, setYearTouched] = useState(false);
  const searchAbortRef = useRef(null);
  const searchRequestIdRef = useRef(0);

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
        const res = await axios.get(`${API_BASE_URL}/api/movies/genres`);
        setGenres(res.data || []);
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
      searchAbortRef.current?.abort();
      searchRequestIdRef.current += 1;
      setSearchResults([]);
      setPage(1);
      setTotalPages(1);
      setTotalResults(0);
      setLoading(false);
      setLoadingMore(false);
    }
  }, [query, selectedGenre, year, sortBy]);

  const isCanceledError = (err) =>
    err?.code === 'ERR_CANCELED' ||
    err?.name === 'CanceledError' ||
    err?.name === 'AbortError';

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
      setTotalResults(0);
      return;
    }

    let signal;
    let requestId = searchRequestIdRef.current;

    if (pageNum === 1) {
      searchAbortRef.current?.abort();
      const controller = new AbortController();
      searchAbortRef.current = controller;
      signal = controller.signal;
      requestId = ++searchRequestIdRef.current;
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
      const res = await axios.get(url, signal ? { signal } : undefined);
      if (pageNum === 1 && requestId !== searchRequestIdRef.current) return;

      const results = res.data.results || [];
      const pages = Math.max(res.data.total_pages || 1, 1);
      const total = res.data.total_results ?? results.length;

      if (pageNum === 1) {
        setSearchResults(results);
        setPage(1);
        setTotalPages(results.length === 0 ? 1 : pages);
        setTotalResults(total);
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
      if (isCanceledError(err)) return;
      if (pageNum === 1 && requestId !== searchRequestIdRef.current) return;
      setError('Failed to search movies. Please check your connection and try again.');
    } finally {
      if (pageNum === 1) {
        if (requestId === searchRequestIdRef.current) {
          setLoading(false);
        }
      } else {
        setLoadingMore(false);
      }
    }
  };

  const loadMore = () => {
    if (page >= totalPages || loadingMore || loading) return;
    handleSearch(query, page + 1);
  };

  const handleFilterReset = () => {
    searchAbortRef.current?.abort();
    searchRequestIdRef.current += 1;
    setSelectedGenre('');
    setYear('');
    setYearTouched(false);
    setSortBy('popularity.desc');
    setQuery('');
    setSearchResults([]);
    setPage(1);
    setTotalPages(1);
    setTotalResults(0);
    setLoading(false);
    setLoadingMore(false);
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

  const currentYear = new Date().getFullYear();

  const applyYearValue = (val) => {
    const next = String(val);
    if (next.length <= 4) {
      setYear(next);
      setYearTouched(false);
      if (next.length === 4 || next === '') {
        setPage(1);
      }
    }
  };

  const stepYear = (direction) => {
    // Empty: up → next year, down → previous year
    // Filled: ±1 from typed year
    const resolved =
      !year || year.length !== 4
        ? direction === 'up'
          ? currentYear + 1
          : currentYear - 1
        : direction === 'up'
          ? Number(year) + 1
          : Number(year) - 1;

    if (Number.isNaN(resolved)) return;
    applyYearValue(Math.max(1888, Math.min(currentYear + 5, resolved)));
  };

  const handleYearKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      stepYear('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      stepYear('down');
    }
  };

  const handleYearChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    applyYearValue(val);
  };

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
        type="text"
        value={year}
        onChange={handleYearChange}
        onKeyDown={handleYearKeyDown}
        onBlur={() => setYearTouched(true)}
        placeholder={String(currentYear)}
        inputProps={{
          inputMode: 'numeric',
          pattern: '[0-9]*',
          maxLength: 4,
          'aria-label': 'Release year',
        }}
        InputProps={{
          endAdornment: (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mr: -0.5,
                '& .MuiIconButton-root': {
                  p: 0,
                  color: 'rgba(255,255,255,0.85)',
                  height: 14,
                  width: 18,
                },
              }}
            >
              <IconButton
                size="small"
                aria-label="Next year"
                onClick={() => stepYear('up')}
                tabIndex={-1}
              >
                <Box component="span" sx={{ fontSize: 10, lineHeight: 1 }}>▲</Box>
              </IconButton>
              <IconButton
                size="small"
                aria-label="Previous year"
                onClick={() => stepYear('down')}
                tabIndex={-1}
              >
                <Box component="span" sx={{ fontSize: 10, lineHeight: 1 }}>▼</Box>
              </IconButton>
            </Box>
          ),
        }}
        error={yearTouched && Boolean(year) && year.length !== 4}
        helperText={
          yearTouched && year && year.length !== 4 ? 'Enter a 4-digit year' : ''
        }
        sx={{ ...glassFieldSx, width: { xs: '100%', sm: 120 } }}
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
      <Seo
        title="Discover Movies 2026 | New Films, Trailers & Favorites"
        description="Discover new movies in 2026, trending films, trailers, and ratings on Flickx. Search the latest releases, explore popular cinema, and save favorites."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Flickx',
          url: SITE_URL,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />
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
                  backgroundImage: `url(https://image.tmdb.org/t/p/${backdropSize}${movie.backdrop_path})`,
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
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="h5"
                sx={{ fontSize: { xs: '1.25rem', sm: '1.75rem' } }}
              >
                {query.trim() ? 'Search Results' : 'Browse Results'}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
              >
                {query.trim()
                  ? `Results for "${query.trim()}" · `
                  : ''}
                Showing {searchResults.length.toLocaleString()}
                {totalResults > searchResults.length
                  ? ` of ${totalResults.toLocaleString()}`
                  : ''}{' '}
                {totalResults === 1 || searchResults.length === 1 ? 'movie' : 'movies'}
              </Typography>
            </Box>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              {searchResults.map(movie => (
                <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
            <GoogleAd show={searchResults.length >= 8} />
            {page < totalPages && (
              <Box sx={{ mt: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  sx={{
                    minWidth: { xs: '140px', sm: '180px' },
                    px: { xs: 3, sm: 4 },
                    py: 1.25,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 8,
                    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.85)',
                    background:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,255,255,0.35))',
                    backdropFilter: 'blur(14px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                    border:
                      theme.palette.mode === 'dark'
                        ? '1px solid rgba(255,255,255,0.22)'
                        : '1px solid rgba(255,255,255,0.7)',
                    boxShadow:
                      theme.palette.mode === 'dark'
                        ? '0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)'
                        : '0 8px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
                    transition: 'transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      background:
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.1))'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.5))',
                      boxShadow:
                        theme.palette.mode === 'dark'
                          ? '0 10px 28px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.16)'
                          : '0 10px 28px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.9)',
                      transform: 'translateY(-1px)',
                    },
                    '&.Mui-disabled': {
                      color:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.45)'
                          : 'rgba(0,0,0,0.4)',
                      background:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.06)'
                          : 'rgba(255,255,255,0.4)',
                      border:
                        theme.palette.mode === 'dark'
                          ? '1px solid rgba(255,255,255,0.12)'
                          : '1px solid rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </Button>
              </Box>
            )}
          </Box>
        )}
        {!isBrowsing && (
          <Box>
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: '1.25rem', sm: '1.75rem' } }}
            >
              Trending Movies
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, mb: 2, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
            >
              What’s popular right now — open a title for plot, cast, and trailer.
            </Typography>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              {trending.map(movie => (
                <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
            <GoogleAd show={!bannerLoading && trending.length >= 8} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;