import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({ onSearch, initialQuery = '', transparent = false }) => {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = e => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 0.5, sm: 1 },
        bgcolor: transparent ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
        p: { xs: 0.5, sm: 1 },
        borderRadius: 10,
        backdropFilter: transparent ? 'blur(8px)' : 'blur(4px)',
        boxShadow: transparent
          ? '0 4px 12px rgba(0,0,0,0.2)'
          : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          bgcolor: transparent ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <TextField
        label="Search Movies"
        value={query}
        onChange={e => setQuery(e.target.value)}
        fullWidth
        size="small"
        variant="outlined"
        sx={{
          bgcolor: 'transparent',
          '& .MuiInputLabel-root': {
            color: transparent ? 'white' : 'text.secondary',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            transform: 'translate(14px, 8px) scale(1)',
            '&.Mui-focused, &.MuiFormLabel-filled': {
              transform: 'translate(14px, -6px) scale(0.75)',
            },
          },
          '& .MuiInputBase-root': {
            color: transparent ? 'white' : 'text.primary',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            borderRadius: 8,
            '& fieldset': {
              borderColor: transparent ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.2)',
            },
            '&:hover fieldset': {
              borderColor: transparent ? 'white' : 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: transparent ? 'white' : 'primary.main',
            },
          },
          '& .MuiInputBase-input': {
            pr: query ? 4 : 1, // Space for clear button
          },
        }}
        InputProps={{
          endAdornment: query && (
            <IconButton
              onClick={handleClear}
              sx={{
                color: transparent ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                p: 0.25,
              }}
              aria-label="Clear search query"
            >
              <ClearIcon sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
            </IconButton>
          ),
        }}
      />
      <IconButton
        type="submit"
        disabled={!query.trim()}
        sx={{
          color: transparent ? 'white' : 'primary.main',
          bgcolor: transparent ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
          borderRadius: '50%',
          p: { xs: 0.75, sm: 1 },
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: transparent ? 'rgba(255,255,255,0.3)' : 'primary.light',
            transform: 'scale(1.1)',
          },
          '&:disabled': {
            color: transparent ? 'rgba(255,255,255,0.3)' : 'action.disabled',
            bgcolor: 'transparent',
          },
        }}
        aria-label="Search movies"
      >
        <SearchIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
      </IconButton>
    </Box>
  );
};

export default SearchBar;