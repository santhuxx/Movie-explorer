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
    id: 'introduction',
    title: 'Introduction',
    body: `Flickx ("we", "our", or "us") operates movie-explorer-client-iota.vercel.app (the "Service"). This Privacy Policy explains how we collect, use, and protect your information when you use our movie discovery app.`,
    bullets: null,
  },
  {
    id: 'collect',
    title: 'Information we collect',
    body: 'We may collect the following:',
    bullets: [
      'Account information when you register or sign in (username, email, and a hashed password, or Google sign-in details).',
      'Favorites you save to your account.',
      'Usage data such as pages visited, via analytics tools.',
      'Technical data such as browser, device, and IP (via hosting providers).',
      'Preferences stored in your browser (such as theme and search filters) via local storage.',
    ],
  },
  {
    id: 'use',
    title: 'How we use your information',
    body: 'We use your information to:',
    bullets: [
      'Provide and improve the Service (search, details, favorites).',
      'Authenticate your account and keep you signed in.',
      'Understand how the site is used so we can improve it.',
      'Display advertisements through Google AdSense.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies and advertising',
    body: 'We use cookies and similar technologies. Google AdSense may use cookies to serve ads based on your prior visits to this or other websites.',
    bullets: [
      'You can opt out of personalized ads via Google Ads Settings (adssettings.google.com).',
      'Third-party vendors, including Google, may use cookies to serve ads on our site and elsewhere.',
    ],
  },
  {
    id: 'third-party',
    title: 'Third-party services',
    body: 'We use trusted third parties that may process data on our behalf:',
    bullets: [
      'Google — Sign-In and AdSense',
      'Movie data provider — movie information and images',
      'Vercel — hosting and analytics',
      'Cloud database provider — stores account info and favorites securely',
    ],
    footer: 'Each provider has its own privacy policy.',
  },
  {
    id: 'security',
    title: 'Data retention and security',
    body: 'We keep account and favorites data while your account is active. We use reasonable measures to protect your data, but no Internet transmission is 100% secure.',
    bullets: null,
  },
  {
    id: 'choices',
    title: 'Your choices',
    body: null,
    bullets: [
      'Sign out at any time.',
      'Remove saved favorites from your account.',
      'Control cookies through your browser settings.',
      'Request deletion of your account data by contacting us.',
    ],
  },
  {
    id: 'children',
    title: 'Children',
    body: 'Flickx is not directed at children under 13. We do not knowingly collect personal information from children under 13.',
    bullets: null,
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: 'We may update this Privacy Policy from time to time. The "Last updated" date reflects the latest version. Continued use after changes means you accept the updated policy.',
    bullets: null,
  },
  {
    id: 'contact',
    title: 'Contact',
    body: null,
    bullets: null,
    isContact: true,
  },
];

const PrivacyPolicy = () => {
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
          title="Privacy Policy"
          description="Flickx Privacy Policy — how we collect, use, and protect your data, including cookies and Google AdSense."
          path="/privacy"
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
            Privacy Policy
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
            How Flickx handles your data, cookies, and third-party services.
          </Typography>
          <Chip
            label="Last updated: September 2, 2026"
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
                    For privacy questions or data deletion requests, contact us on{' '}
                    <Link
                      href="https://github.com/santhuxx"
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      GitHub (@santhuxx)
                    </Link>
                    . You can reach out via the contact details on the profile or open an issue on the
                    Movie-explorer repository.
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

                {section.footer && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1.5, lineHeight: 1.65, fontStyle: 'italic' }}
                  >
                    {section.footer}
                  </Typography>
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
              Questions?{' '}
              <Link
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                Google Privacy Policy
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
};

export default PrivacyPolicy;
