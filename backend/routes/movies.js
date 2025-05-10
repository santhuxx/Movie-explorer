const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config({ path: './.env' });


const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Get trending movies
router.get('/trending', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`);
    const results = response.data.results.filter(movie => movie.poster_path && movie.backdrop_path);
    console.log('Trending Movies:', results.length);
    res.json(results);
  } catch (error) {
    console.error('TMDb API error (trending):', error.message);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
});

// Search or discover movies
router.get('/search', async (req, res) => {
  const { query, page = 1, with_genres, primary_release_year, sort_by } = req.query;
  let url;
  let finalResults = [];

  try {
    if (query && query.trim()) {
      // Step 1: Use /search/movie for text searches
      url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
      
      const response = await axios.get(url);
      let searchResults = response.data.results;
      
      // Step 2: Apply additional filtering in our code since TMDb search endpoint doesn't support all filters
      if (with_genres) {
        const genreId = parseInt(with_genres);
        searchResults = searchResults.filter(movie => 
          movie.genre_ids && movie.genre_ids.includes(genreId)
        );
      }
      
      if (primary_release_year) {
        const year = primary_release_year;
        searchResults = searchResults.filter(movie => 
          movie.release_date && movie.release_date.startsWith(year)
        );
      }
      
      // Step 3: Apply sorting
      if (sort_by) {
        const [sortField, sortOrder] = sort_by.split('.');
        const multiplier = sortOrder === 'desc' ? -1 : 1;
        
        searchResults.sort((a, b) => {
          let valueA, valueB;
          
          if (sortField === 'popularity') {
            valueA = a.popularity || 0;
            valueB = b.popularity || 0;
          } else if (sortField === 'vote_average') {
            valueA = a.vote_average || 0;
            valueB = b.vote_average || 0;
          } else if (sortField === 'release_date') {
            valueA = a.release_date ? new Date(a.release_date).getTime() : 0;
            valueB = b.release_date ? new Date(b.release_date).getTime() : 0;
          }
          
          return (valueA - valueB) * multiplier;
        });
      }
      
      // Filter out movies without backdrop_path and poster_path
      finalResults = searchResults.filter(movie => movie.backdrop_path && movie.poster_path);
      
      console.log('Filtered Search Results:', finalResults.length);
      
      res.json({
        results: finalResults,
        total_pages: 1, // We can't accurately provide this with manual filtering
        total_results: finalResults.length,
      });
    } else {
      // Use /discover/movie for filter-based searches
      url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&include_adult=false`;
      
      if (with_genres) url += `&with_genres=${encodeURIComponent(with_genres)}`;
      if (primary_release_year) url += `&primary_release_year=${encodeURIComponent(primary_release_year)}`;
      if (sort_by) url += `&sort_by=${encodeURIComponent(sort_by)}`;
      else url += '&sort_by=popularity.desc'; // Default sorting
      
      console.log('TMDb Discover API URL:', url);
      const response = await axios.get(url);
      
      // Filter out movies without backdrop_path and poster_path
      finalResults = response.data.results.filter(movie => movie.backdrop_path && movie.poster_path);
      
      console.log('Filtered Discover Results:', finalResults.length);
      
      res.json({
        results: finalResults,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results,
      });
    }
  } catch (error) {
    console.error('TMDb API error (search):', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch movies from TMDb' });
  }
});

// Get movie details
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${req.params.id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`);
    res.json(response.data);
  } catch (error) {
    console.error('TMDb API error (details):', error.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

module.exports = router;