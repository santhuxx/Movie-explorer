import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Link, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();
  const location = useLocation();
  const year = new Date().getFullYear();
  const path = location.pathname;

  const links = [
    { to: '/about', label: 'About' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms' },
  ].filter((link) => link.to !== path);

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {year} Flickx.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {links.map((link) => (
            <Link
              key={link.to}
              component={RouterLink}
              to={link.to}
              variant="body2"
              underline="hover"
            >
              {link.label}
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
