import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Link,
  Button,
  Chip,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import { ArrowBack, Home as HomeIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Seo from '../components/Seo';

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
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5, 2),
    borderRadius: 12,
  },
}));

const sections = [
  {
    id: 'what-is-flickx',
    title: 'What Flickx is',
    body: 'Flickx is a personal movie discovery site. Browse popular films, search by title, and open a details page with the plot, cast, runtime, rating, and trailer — without creating an account first. Sign in if you want to save favorites to your profile.',
    bullets: null,
  },
  {
    id: 'how-to-use',
    title: 'How to use Flickx',
    body: 'Start on Home and type a movie name, or leave search empty and apply filters to browse.',
    bullets: [
      'Filter by genre, year, or sort (popularity, rating, newest, oldest).',
      'Newest sort hides unreleased dates so you see films that are already out.',
      'Open any poster or hero banner for the full title page.',
      'Watch the trailer, add favorites, or share the link from the details page.',
      'Dark mode and your last search stay in the browser until you change them.',
    ],
  },
  {
    id: 'what-we-show',
    title: 'What we show',
    body: 'Movie posters, backdrops, titles, overviews, cast, and videos come from public movie databases so listings stay current.',
    bullets: [
      'Flickx does not host or stream full films.',
      'Ratings reflect community scores from the source catalog.',
      'We do not invent scores or rewrite official synopses.',
    ],
  },
  {
    id: 'advertising',
    title: 'Advertising',
    body: 'Flickx may show ads on pages that already have movie listings or full title details. Ads help keep the site free.',
    bullets: [
      'We do not place ads on sign-in, empty lists, or policy pages.',
      'Cookies and advertising are described in our Privacy Policy.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    body: null,
    bullets: null,
    isContact: true,
  },
];

const About = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Fade in timeout={600}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Seo
          title="About Flickx"
          description="Learn how Flickx helps you discover movies, search new releases, watch trailers, and save favorites — a free movie explorer built for film fans."
          path="/about"
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
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2.5rem' },
            }}
          >
            About Flickx
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 520,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              mb: 2,
            }}
          >
            A free movie explorer for search, trailers, and favorites.
          </Typography>
          <Chip
            label="Last updated: September 5, 2026"
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
          <GlassPanel sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary' }}>
              On this page
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {sections.map((s) => (
                <Chip
                  key={s.id}
                  label={s.title}
                  size="small"
                  clickable
                  variant="outlined"
                  onClick={() => scrollTo(s.id)}
                  sx={{
                    fontWeight: 500,
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                />
              ))}
            </Box>
          </GlassPanel>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {sections.map((section) => (
              <GlassPanel key={section.id} id={section.id} component="section">
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    pl: 2,
                    borderLeft: '4px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'text.primary',
                  }}
                >
                  {section.title}
                </Typography>

                {section.isContact ? (
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                    Questions about Flickx? Contact us on{' '}
                    <Link
                      href="https://github.com/santhuxx"
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      GitHub (@santhuxx)
                    </Link>
                    .
                  </Typography>
                ) : (
                  section.body && (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.75, mb: section.bullets ? 1.5 : 0 }}
                    >
                      {section.body}
                    </Typography>
                  )
                )}

                {section.bullets && (
                  <List dense disablePadding sx={{ pl: 0.5 }}>
                    {section.bullets.map((item) => (
                      <ListItem key={item} disableGutters sx={{ py: 0.35, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 28, mt: 0.6 }}>
                          <Box
                            sx={{
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              bgcolor: 'text.secondary',
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: 'text.secondary',
                            sx: { lineHeight: 1.65 },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </GlassPanel>
            ))}
          </Box>

          <Box
            sx={{
              mt: 4,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
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
            <Typography variant="body2" color="text.secondary">
              Also see our{' '}
              <Link component={RouterLink} to="/privacy" underline="hover">
                Privacy Policy
              </Link>
              {' '}and{' '}
              <Link component={RouterLink} to="/terms" underline="hover">
                Terms
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
};

export default About;
