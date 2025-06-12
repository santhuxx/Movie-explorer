import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Logout,
  Menu as MenuIcon,
  Home as HomeIcon,
  Favorite as FavoriteIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { MovieContext } from '../context/MovieContext';
import { styled } from '@mui/material/styles';

const LoginButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})(({ theme, scrolled }) => ({
  borderRadius: 20,
  padding: theme.spacing(1, 2.5),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  backgroundColor: scrolled
    ? theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.15)'
      : 'rgba(0,0,0,0.1)'
    : 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(4px)',
  border: `1px solid ${theme.palette.divider}33`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: scrolled
      ? theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.25)'
        : 'rgba(0,0,0,0.15)'
      : 'rgba(255,255,255,0.25)',
    transform: 'translateY(-1px)',
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.75, 2),
    fontSize: '0.85rem',
  },
}));

const DrawerLoginButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  color: theme.palette.mode === 'dark' ? 'white' : 'black',
  width: '100%',
  justifyContent: 'flex-start',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
    transform: 'none',
  },
}));

const Navbar = () => {
  const { isDarkMode, toggleDarkMode, logout, isAuthenticated, setShowLoginDialog } = useContext(MovieContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const getColor = () => {
    // Black text on /login page in light mode
    if (location.pathname === '/login' && !isDarkMode) {
      return 'black';
    }
    // White text at the top when unscrolled in both modes
    if (!scrolled) {
      return 'white';
    }
    // When scrolled: white in dark mode, black in light mode
    return isDarkMode ? 'white' : 'black';
  };

  const getDrawerColor = () => {
    // Black text/icons in drawer on /login page in light mode
    return location.pathname === '/login' && !isDarkMode ? 'black' : isDarkMode ? 'white' : 'black';
  };

  const drawerContent = (
    <Box sx={{ width: 250, height: '100%', bgcolor: isDarkMode ? '#121212' : 'background.paper' }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{ color: getDrawerColor(), fontWeight: 'bold' }}
        >
          Flickx
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
          <ListItemIcon>
            <HomeIcon sx={{ color: getDrawerColor() }} />
          </ListItemIcon>
          <ListItemText
            primary="Home"
            primaryTypographyProps={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: getDrawerColor() }}
          />
        </ListItem>
        <ListItem button component={Link} to="/favorites" onClick={handleDrawerToggle}>
          <ListItemIcon>
            <FavoriteIcon sx={{ color: getDrawerColor() }} />
          </ListItemIcon>
          <ListItemText
            primary="Favorites"
            primaryTypographyProps={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: getDrawerColor() }}
          />
        </ListItem>
        <ListItem button onClick={() => { toggleDarkMode(); handleDrawerToggle(); }}>
          <ListItemIcon>
            {isDarkMode ? (
              <Brightness7 sx={{ color: getDrawerColor() }} />
            ) : (
              <Brightness4 sx={{ color: getDrawerColor() }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            primaryTypographyProps={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: getDrawerColor() }}
          />
        </ListItem>
        {isAuthenticated ? (
          <ListItem button onClick={() => { handleSignOut(); handleDrawerToggle(); }}>
            <ListItemIcon>
              <Logout sx={{ color: getDrawerColor() }} />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: getDrawerColor() }}
            />
          </ListItem>
        ) : location.pathname !== '/login' ? (
          <ListItem onClick={() => { handleLoginClick(); handleDrawerToggle(); }}>
            <ListItemIcon>
              <LoginIcon sx={{ color: getDrawerColor() }} />
            </ListItemIcon>
            <DrawerLoginButton sx={{ color: getDrawerColor() }}>
              Login
            </DrawerLoginButton>
          </ListItem>
        ) : null}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: scrolled
          ? isDarkMode
            ? 'rgba(30, 30, 30, 0.9)'
            : 'rgba(255, 255, 255, 0.9)'
          : 'transparent',
        boxShadow: scrolled ? 2 : 0,
        transition: 'background-color 0.3s, box-shadow 0.3s',
        backdropFilter: scrolled ? 'blur(5px)' : 'none',
        backgroundImage: 'none',
        border: 'none',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: getColor(),
            fontWeight: 'bold',
            fontSize: { xs: '1.1rem', sm: '1.5rem' },
          }}
        >
          Flickx
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
          <IconButton
            component={Link}
            to="/"
            sx={{ color: getColor() }}
            aria-label="Home"
          >
            <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Home</Typography>
          </IconButton>
          <IconButton
            component={Link}
            to="/favorites"
            sx={{ color: getColor() }}
            aria-label="Favorites"
          >
            <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Favorites</Typography>
          </IconButton>
          <IconButton
            onClick={toggleDarkMode}
            sx={{ color: getColor() }}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          {isAuthenticated ? (
            <IconButton
              onClick={handleSignOut}
              sx={{ color: getColor() }}
              aria-label="Sign out"
            >
              <Logout />
            </IconButton>
          ) : location.pathname !== '/login' ? (
            <LoginButton
              onClick={handleLoginClick}
              sx={{ color: getColor() }}
              aria-label="Login"
              scrolled={scrolled}
            >
              Login
            </LoginButton>
          ) : null}
        </Box>
        <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
          <IconButton
            color="inherit"
            aria-label="Open menu"
            onClick={handleDrawerToggle}
            sx={{ color: getColor() }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            bgcolor: isDarkMode ? '#121212' : 'background.paper',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;