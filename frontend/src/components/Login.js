import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Card,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Fade,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { MovieContext } from '../context/MovieContext';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { API_BASE_URL } from '../config';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
  backgroundColor: theme.palette.background.paper,
  backdropFilter: 'blur(10px)',
  background: 'rgba(255, 255, 255, 0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const CinematicBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2e2e2e 100%)'
    : 'linear-gradient(135deg, #f0f0f0 0%, #d9d9d9 100%)',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5),
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease',
  },
}));

const ToggleButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textTransform: 'none',
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
    textDecoration: 'underline',
  },
}));

const Login = () => {
  const { login } = useContext(MovieContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [bannerTrending, setBannerTrending] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  // Fetch trending movies for background
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/movies/trending`);
        const allTrending = res.data;
        const filteredTrending = allTrending
          .filter(movie => movie.backdrop_path)
          .slice(0, 10);
        setBannerTrending(
          filteredTrending.length
            ? filteredTrending
            : [{ id: 'fallback', title: 'No Trending Movies', backdrop_path: '/8cdWjvZNUXbCnvG8IwV6W316pwH.jpg' }]
        );
      } catch (err) {
        console.error('Trending Error:', err);
        setBannerTrending([{ id: 'fallback', title: 'No Trending Movies', backdrop_path: '/8cdWjvZNUXbCnvG8IwV6W316pwH.jpg' }]);
      } finally {
        setBannerLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    try {
      const endpoint = isRegister ? 'register' : 'login';
      const res = await axios.post(`${API_BASE_URL}/api/auth/${endpoint}`, {
        username,
        password,
      });
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Slider settings for background
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
  };

  return (
    <CinematicBox>
      {/* Background Slider */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      >
        {bannerLoading ? (
          <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        ) : (
          <Slider {...sliderSettings}>
            {bannerTrending.map(movie => (
              <Box
                key={movie.id}
                sx={{
                  height: '100vh',
                  backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(10px) brightness(0.6)',
                  transform: 'scale(1.1)', // Slight zoom to avoid edges
                }}
              />
            ))}
          </Slider>
        )}
      </Box>

      {/* Login/Register Form */}
      <Fade in timeout={800}>
        <StyledCard>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 700, mb: 3, color: theme.palette.text.primary }}
          >
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              variant="outlined"
              autoComplete="username"
              error={!!error && !username}
              helperText={!username && error ? 'Username is required' : ''}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              error={!!error && !password}
              helperText={!password && error ? 'Password is required' : ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <SubmitButton type="submit" variant="contained" fullWidth>
              {isRegister ? 'Register' : 'Login'}
            </SubmitButton>
            <ToggleButton
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setUsername('');
                setPassword('');
              }}
              fullWidth
              sx={{ mt: 2 }}
            >
              {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
            </ToggleButton>
          </Box>
        </StyledCard>
      </Fade>
    </CinematicBox>
  );
};

export default Login;