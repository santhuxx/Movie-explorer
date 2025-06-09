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
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Logout,
  Menu as MenuIcon,
  Home as HomeIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { MovieContext } from '../context/MovieContext';

const Navbar = () => {
  const { isDarkMode, toggleDarkMode, setIsAuthenticated, logout, isAuthenticated } = useContext(MovieContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation to detect the current route

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle sign out
  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  // Toggle mobile drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Drawer content
  const drawerContent = (
    <Box sx={{ width: 250, height: '100%', bgcolor: isDarkMode ? '#121212' : 'background.paper' }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{ color: isDarkMode ? 'white' : 'black', fontWeight: 'bold' }}
        >
          Flickx
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
          <ListItemIcon>
            <HomeIcon sx={{ color: isDarkMode ? 'white' : 'black' }} />
          </ListItemIcon>
          <ListItemText
            primary="Home"
            primaryTypographyProps={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
          />
        </ListItem>
        <ListItem button component={Link} to="/favorites" onClick={handleDrawerToggle}>
          <ListItemIcon>
            <FavoriteIcon sx={{ color: isDarkMode ? 'white' : 'black' }} />
          </ListItemIcon>
          <ListItemText
            primary="Favorites"
            primaryTypographyProps={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
          />
        </ListItem>
        <ListItem button onClick={() => { toggleDarkMode(); handleDrawerToggle(); }}>
          <ListItemIcon>
            {isDarkMode ? (
              <Brightness7 sx={{ color: 'white' }} />
            ) : (
              <Brightness4 sx={{ color: 'black' }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            primaryTypographyProps={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
          />
        </ListItem>
        {isAuthenticated && (
          <ListItem button onClick={() => { handleSignOut(); handleDrawerToggle(); }}>
            <ListItemIcon>
              <Logout sx={{ color: isDarkMode ? 'white' : 'black' }} />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );

  // Determine text/icon color based on route and mode
  const getColor = () => {
    if (location.pathname === '/login' && !isDarkMode) {
      return 'black'; // Black text/icons on login page in light mode
    }
    return scrolled
      ? isDarkMode
        ? 'white'
        : 'black'
      : 'white'; // Default behavior for other routes
  };

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
        {/* Desktop Navigation */}
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
          {isAuthenticated && (
            <IconButton
              onClick={handleSignOut}
              sx={{ color: getColor() }}
              aria-label="Sign out"
            >
              <Logout />
            </IconButton>
          )}
        </Box>
        {/* Mobile Menu Button */}
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
      {/* Mobile Drawer */}
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