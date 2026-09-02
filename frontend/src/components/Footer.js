import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Link, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();
  const location = useLocation();
  const year = new Date().getFullYear();
  const isPrivacyPage = location.pathname === '/privacy';

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
          justifyContent: isPrivacyPage ? 'center' : 'space-between',
          gap: 1.5,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {year} Flickx.
        </Typography>
        {!isPrivacyPage && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link component={RouterLink} to="/privacy" variant="body2" underline="hover">
              Privacy Policy
            </Link>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Footer;
