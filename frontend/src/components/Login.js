import React, { useState, useContext } from 'react';
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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { MovieContext } from '../context/MovieContext';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 10,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const CinematicBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `
    linear-gradient(rgba(0, 0, 0, ${theme.palette.mode === 'dark' ? '0.7' : '0.5'}),
    rgba(0, 0, 0, ${theme.palette.mode === 'dark' ? '0.7' : '0.5'})),
    url('https://images.unsplash.com/photo-1489599849927-2ee91cede3f5?q=80&w=2070&auto=format&fit=crop')
  `,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  padding: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  // Fallback gradient
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2e2e2e 100%)'
    : 'linear-gradient(135deg, #f0f0f0 0%, #d9d9d9 100%)',
  // Particle effect
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 2px, transparent 2px)
    `,
    backgroundSize: '1000px 1000px',
    animation: 'particles 20s linear infinite',
    opacity: theme.palette.mode === 'dark' ? 0.3 : 0.2,
  },
  '@keyframes particles': {
    '0%': {
      backgroundPosition: '0 0',
    },
    '100%': {
      backgroundPosition: '1000px 1000px',
    },
  },
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
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    try {
      const endpoint = isRegister ? 'register' : 'login';
      const res = await axios.post(`http://localhost:5001/api/auth/${endpoint}`, {
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

  return (
    <CinematicBox>
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