import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Fade,
  IconButton,
  useTheme,
} from '@mui/material';
import { ArrowBack, Home as HomeIcon, ChevronRight } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Seo, { SITE_URL } from '../components/Seo';
import { guides, GUIDES_UPDATED } from './guidesData';

const HeroBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '32vh',
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: theme.spacing(10, 3, 5),
  ...(theme.palette.mode === 'dark'
    ? {
        color: theme.palette.common.white,
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)',
      }
    : {
        color: theme.palette.text.primary,
        background: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
  [theme.breakpoints.down('sm')]: {
    minHeight: '28vh',
    padding: theme.spacing(9, 2, 4),
  },
}));

const GlassPanel = styled(Box)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(3, 3.5),
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 12px 40px rgba(0,0,0,0.4)'
      : '0 4px 20px rgba(0,0,0,0.06)',
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5, 2),
    borderRadius: 12,
  },
}));

const Guides = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  return (
    <Fade in timeout={600}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Seo
          title="Flickx Guides"
          description="Original Flickx guides: how the movie explorer works, how to search and filter, trending vs newest, and how favorites accounts work."
          path="/guides"
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Flickx Guides',
            url: `${SITE_URL}/guides`,
          }}
        />

        <HeroBox>
          <IconButton
            onClick={handleBack}
            aria-label="Go back"
            sx={{
              position: 'absolute',
              top: { xs: 72, sm: 80 },
              left: { xs: 12, sm: 24 },
              zIndex: 2,
              color: isDark ? 'white' : 'text.primary',
              bgcolor: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.06)',
              backdropFilter: 'blur(6px)',
              '&:hover': {
                bgcolor: isDark ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.1)',
              },
            }}
          >
            <ArrowBack />
          </IconButton>

          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.75rem', sm: '2.5rem' } }}
          >
            Guides
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 520, fontSize: { xs: '0.9rem', sm: '1rem' }, mb: 2 }}
          >
            How to use Flickx — written by us, not copied from a movie catalog.
          </Typography>
          <Chip
            label={`Last updated: ${GUIDES_UPDATED}`}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 500,
              borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'divider',
              color: isDark ? 'white' : 'text.secondary',
              bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'background.paper',
            }}
          />
        </HeroBox>

        <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {guides.map((guide) => (
              <GlassPanel
                key={guide.slug}
                component={RouterLink}
                to={`/guides/${guide.slug}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      mb: 0.75,
                      pl: 2,
                      borderLeft: '4px solid',
                      borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'text.primary',
                    }}
                  >
                    {guide.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65, pl: 2 }}>
                    {guide.description}
                  </Typography>
                </Box>
                <ChevronRight sx={{ color: 'text.secondary', flexShrink: 0 }} />
              </GlassPanel>
            ))}
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              component={RouterLink}
              to="/"
              variant="outlined"
              startIcon={<HomeIcon />}
              sx={{
                borderRadius: 8,
                px: 3,
                textTransform: 'none',
                fontWeight: 700,
                color: 'text.primary',
                borderColor: 'divider',
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
};

export default Guides;
