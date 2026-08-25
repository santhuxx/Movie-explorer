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
  borderRadius: 8,
  padding: theme.spacing(0.75, 1.5),
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))'
    : 'linear-gradient(145deg, rgba(0,0,0,0.05), rgba(0,0,0,0.02))',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
  border: `1px solid ${theme.palette.divider}22`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 2px 4px rgba(0,0,0,0.2)'
    : '0 2px 4px rgba(0,0,0,0.1)',
  width: '100%',
  justifyContent: 'flex-start',
  transition: 'background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1))'
      : 'linear-gradient(145deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 8px rgba(0,0,0,0.3)'
      : '0 4px 8px rgba(0,0,0,0.15)',
    transform: 'translateY(-1px)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '0.85rem',
    padding: theme.spacing(0.5, 1.25),
  },
}));

const Navbar = () => {
  const { isDarkMode, toggleDarkMode, logout, isAuthenticated } = useContext(MovieContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHeroRoute =
    location.pathname === '/' ||
    location.pathname === '/favorites' ||
    location.pathname.startsWith('/movie/');

  // White text only over dark heroes at the top; otherwise theme-contrast colors
  const overDarkHero = isHeroRoute && !scrolled;
  const navColor = overDarkHero || isDarkMode ? '#ffffff' : '#111111';
  const solidNav = !overDarkHero;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLoginClick = () => {
    navigate('/login', {
      state: { from: `${location.pathname}${location.search}` },
    });
  };

  const drawerColor = isDarkMode ? '#ffffff' : '#111111';

  const drawerContent = (
    <Box sx={{ width: 250, height: '100%', bgcolor: isDarkMode ? '#121212' : 'background.paper' }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{ color: drawerColor, fontWeight: 'bold' }}
        >
          Flickx
        </Typography>
      </Box>
      <Divider />
      <List sx={{ padding: 1 }}>
        <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <HomeIcon sx={{ fontSize: '1.2rem', color: drawerColor }} />
          </ListItemIcon>
          <ListItemText
            primary="Home"
            primaryTypographyProps={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: drawerColor }}
          />
        </ListItem>
        <ListItem button component={Link} to="/favorites" onClick={handleDrawerToggle}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <FavoriteIcon sx={{ fontSize: '1.2rem', color: drawerColor }} />
          </ListItemIcon>
          <ListItemText
            primary="Favorites"
            primaryTypographyProps={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: drawerColor }}
          />
        </ListItem>
        <ListItem button onClick={() => { toggleDarkMode(); handleDrawerToggle(); }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            {isDarkMode ? (
              <Brightness7 sx={{ fontSize: '1.2rem', color: drawerColor }} />
            ) : (
              <Brightness4 sx={{ fontSize: '1.2rem', color: drawerColor }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            primaryTypographyProps={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: drawerColor }}
          />
        </ListItem>
        {isAuthenticated ? (
          <ListItem button onClick={() => { handleSignOut(); handleDrawerToggle(); }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Logout sx={{ fontSize: '1.2rem', color: drawerColor }} />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: drawerColor }}
            />
          </ListItem>
        ) : location.pathname !== '/login' ? (
          <ListItem
            button
            onClick={() => { handleLoginClick(); handleDrawerToggle(); }}
            sx={{ padding: 1 }}
          >
            <DrawerLoginButton
              startIcon={<LoginIcon sx={{ fontSize: '1.2rem', color: drawerColor }} />}
              sx={{ color: drawerColor }}
            >
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
        backgroundColor: solidNav
          ? isDarkMode
            ? 'rgba(30, 30, 30, 0.92)'
            : 'rgba(255, 255, 255, 0.92)'
          : 'transparent',
        boxShadow: solidNav ? 2 : 0,
        transition: 'background-color 0.3s, box-shadow 0.3s, color 0.3s',
        backdropFilter: solidNav ? 'blur(8px)' : 'none',
        backgroundImage: 'none',
        border: 'none',
        borderBottom: solidNav
          ? isDarkMode
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(0,0,0,0.08)'
          : 'none',
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
            color: navColor,
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
            sx={{ color: navColor }}
            aria-label="Home"
          >
            <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: 'inherit' }}>
              Home
            </Typography>
          </IconButton>
          <IconButton
            component={Link}
            to="/favorites"
            sx={{ color: navColor }}
            aria-label="Favorites"
          >
            <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: 'inherit' }}>
              Favorites
            </Typography>
          </IconButton>
          <IconButton
            onClick={toggleDarkMode}
            sx={{ color: navColor }}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          {isAuthenticated ? (
            <IconButton
              onClick={handleSignOut}
              sx={{ color: navColor }}
              aria-label="Sign out"
            >
              <Logout />
            </IconButton>
          ) : location.pathname !== '/login' ? (
            <LoginButton
              onClick={handleLoginClick}
              sx={{ color: navColor }}
              aria-label="Login"
              scrolled={solidNav}
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
            sx={{ color: navColor }}
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