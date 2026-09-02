import React, { useState, useContext } from 'react';
import {
  Card,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Fade,
  Divider,
  Link,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { MovieContext } from '../context/MovieContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { API_BASE_URL } from '../config';
import GoogleSignInButton from './GoogleSignInButton';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  maxHeight: '95vh',
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
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2e2e2e 100%)'
    : 'linear-gradient(135deg, #f0f0f0 0%, #d9d9d9 100%)',
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
    '0%': { backgroundPosition: '0 0' },
    '100%': { backgroundPosition: '1000px 1000px' },
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

const Login = ({ onSuccess }) => {
  const { login } = useContext(MovieContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const redirectAfterLogin = () => {
    const from = location.state?.from;
    const target =
      typeof from === 'string' && from && from !== '/login' ? from : '/';
    navigate(target, { replace: true });
  };

  const handleGoogleResponse = async (response) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/google`, {
        credential: response.credential,
      });
      const ok = await login(res.data.token);
      if (!ok) return;
      if (onSuccess) {
        onSuccess();
      } else {
        redirectAfterLogin();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Google Sign-In failed');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    if (isRegister) {
      if (!email) {
        setError('Please enter an email');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    setSubmitting(true);
    try {
      const endpoint = isRegister ? 'register' : 'login';
      const payload = isRegister
        ? { username, email, password }
        : { username, password };
      const res = await axios.post(`${API_BASE_URL}/api/auth/${endpoint}`, payload);
      const ok = await login(res.data.token);
      if (!ok) return;
      if (onSuccess) {
        onSuccess();
      } else {
        redirectAfterLogin();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSwitchMode = (toRegister) => {
    setIsRegister(toRegister);
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
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
            {isRegister ? 'Create Account' : 'Welcome'}
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
            {isRegister && (
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                variant="outlined"
                autoComplete="email"
                error={!!error && !email}
                helperText={!email && error ? 'Email is required' : ''}
                sx={{ mb: 2 }}
              />
            )}
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
              sx={{ mb: 2 }}
            />
            {isRegister && (
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                autoComplete="new-password"
                error={!!error && (!confirmPassword || password !== confirmPassword)}
                helperText={
                  !confirmPassword && error
                    ? 'Please confirm your password'
                    : error && password !== confirmPassword
                    ? 'Passwords do not match'
                    : ''
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleToggleConfirmPassword} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
            )}
            <Divider sx={{ my: 2.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                or
              </Typography>
            </Divider>
            <Box sx={{ mb: 2 }}>
              <GoogleSignInButton
                label={isRegister ? 'Sign up with Google' : 'Continue with Google'}
                disabled={submitting}
                onSuccess={handleGoogleResponse}
                onError={() => {}}
              />
            </Box>
            <SubmitButton type="submit" variant="contained" fullWidth disabled={submitting}>
              {submitting ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
            </SubmitButton>
            <Typography
              align="center"
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              {isRegister ? (
                <>
                  Already have an account?{' '}
                  <Link
                    component="button"
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSwitchMode(false)}
                    underline="hover"
                    sx={{
                      fontWeight: 600,
                      verticalAlign: 'baseline',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  Need an account?{' '}
                  <Link
                    component="button"
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSwitchMode(true)}
                    underline="hover"
                    sx={{
                      fontWeight: 600,
                      verticalAlign: 'baseline',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Register
                  </Link>
                </>
              )}
            </Typography>
          </Box>
        </StyledCard>
      </Fade>
    </CinematicBox>
  );
};

export default Login;