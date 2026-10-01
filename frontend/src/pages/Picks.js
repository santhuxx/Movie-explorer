import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Fade,
  IconButton,
  Skeleton,
  useTheme,
} from '@mui/material';
import { ArrowBack, Home as HomeIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Seo, { SITE_URL } from '../components/Seo';
import { API_BASE_URL } from '../config';
import { weeklyPicks, PICKS_UPDATED } from './picksData';
import { moods, times, eras, buildPickerQuery, buildPickerWhy } from './pickerLogic';

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

const chipSx = (isDark, selected) => ({
  fontWeight: 500,
  borderColor: selected ? 'text.primary' : 'divider',
  bgcolor: selected
    ? isDark
      ? 'rgba(255,255,255,0.12)'
      : 'rgba(0,0,0,0.08)'
    : 'transparent',
  '&:hover': {
    bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
  },
});

const Picks = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const [mood, setMood] = useState(moods[0]);
  const [time, setTime] = useState(times[1]);
  const [era, setEra] = useState(eras[0]);
  const [picking, setPicking] = useState(false);
  const [pickError, setPickError] = useState('');
  const [result, setResult] = useState(null);

  const [catalog, setCatalog] = useState({});

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const entries = await Promise.all(
        weeklyPicks.map(async (pick) => {
          try {
            const res = await axios.get(`${API_BASE_URL}/api/movies/${pick.tmdbId}`);
            return [pick.tmdbId, res.data];
          } catch {
            return [pick.tmdbId, null];
          }
        })
      );
      if (!cancelled) setCatalog(Object.fromEntries(entries));
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  const findFilm = async () => {
    setPicking(true);
    setPickError('');
    setResult(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/movies/search?${buildPickerQuery(mood, time, era)}`);
      const list = (res.data.results || []).filter((m) => m.poster_path && m.overview);
      if (!list.length) {
        setPickError('Nothing matched that mix. Try a wider year or a different length.');
        return;
      }
      const pool = [...list].sort(() => Math.random() - 0.5);
      setResult({
        pool,
        index: 0,
        mood,
        time,
        era,
      });
      requestAnimationFrame(() => {
        document.getElementById('picker-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    } catch {
      setPickError('Could not reach the movie catalog. Try again in a moment.');
    } finally {
      setPicking(false);
    }
  };

  const anotherLikeThis = () => {
    setResult((prev) => {
      if (!prev || prev.pool.length < 2) return prev;
      return { ...prev, index: (prev.index + 1) % prev.pool.length };
    });
  };

  return (
    <Fade in timeout={600}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Seo
          title="What to watch"
          description="Flickx picks: a mood-and-time movie finder, plus original notes on films worth putting on tonight — not a dump of catalog synopses."
          path="/picks"
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'What to watch on Flickx',
            url: `${SITE_URL}/picks`,
            dateModified: '2026-10-01',
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
            What to watch
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 520, fontSize: { xs: '0.9rem', sm: '1rem' }, mb: 2 }}
          >
            A Flickx picker for tonight, plus original notes on a few films — not catalog copy.
          </Typography>
          <Chip
            label={`Notes updated: ${PICKS_UPDATED}`}
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
          <GlassPanel component="section" sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 1,
                pl: 2,
                borderLeft: '4px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'text.primary',
              }}
            >
              Find a film
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2.5 }}>
              Answer three things. Flickx searches the catalog with those limits, then writes why
              the lead pick fits — a tool, not a random poster wall.
            </Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary' }}>
              Mood
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {moods.map((item) => (
                <Chip
                  key={item.id}
                  label={item.label}
                  clickable
                  variant="outlined"
                  onClick={() => setMood(item)}
                  sx={chipSx(isDark, mood.id === item.id)}
                />
              ))}
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary' }}>
              Time
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {times.map((item) => (
                <Chip
                  key={item.id}
                  label={item.label}
                  clickable
                  variant="outlined"
                  onClick={() => setTime(item)}
                  sx={chipSx(isDark, time.id === item.id)}
                />
              ))}
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary' }}>
              When it came out
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
              {eras.map((item) => (
                <Chip
                  key={item.id}
                  label={item.label}
                  clickable
                  variant="outlined"
                  onClick={() => setEra(item)}
                  sx={chipSx(isDark, era.id === item.id)}
                />
              ))}
            </Box>

            <Button
              onClick={findFilm}
              disabled={picking}
              variant="outlined"
              sx={{
                borderRadius: 8,
                px: 3,
                textTransform: 'none',
                fontWeight: 700,
                color: 'text.primary',
                borderColor: 'divider',
              }}
            >
              {picking ? 'Looking…' : 'Find a film'}
            </Button>

            {pickError && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {pickError}
              </Typography>
            )}
          </GlassPanel>

          {result && (
            <GlassPanel id="picker-result" component="section" sx={{ mb: 3 }}>
              {(() => {
                const lead = result.pool[result.index];
                const year = lead.release_date ? lead.release_date.slice(0, 4) : '';
                const why = buildPickerWhy(lead, result.mood, result.time, result.era);
                return (
                  <>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, mb: 2, color: 'text.secondary' }}
                    >
                      Your pick
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      {lead.poster_path && (
                        <Box
                          component={RouterLink}
                          to={`/movie/${lead.id}`}
                          sx={{ flexShrink: 0 }}
                        >
                          <Box
                            component="img"
                            src={`https://image.tmdb.org/t/p/w185${lead.poster_path}`}
                            alt=""
                            sx={{ width: { xs: 80, sm: 100 }, borderRadius: 1.5, display: 'block' }}
                          />
                        </Box>
                      )}
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          component={RouterLink}
                          to={`/movie/${lead.id}`}
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            textDecoration: 'none',
                            display: 'block',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {lead.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, mb: 1 }}>
                          {[year, result.mood.label, result.time.label, result.era.label !== 'Any year' ? result.era.label : null]
                            .filter(Boolean)
                            .join(' · ')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                          {why}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2.5 }}>
                      <Button
                        component={RouterLink}
                        to={`/movie/${lead.id}`}
                        variant="outlined"
                        sx={{
                          borderRadius: 8,
                          px: 2.5,
                          textTransform: 'none',
                          fontWeight: 700,
                          color: 'text.primary',
                          borderColor: 'divider',
                        }}
                      >
                        Open title
                      </Button>
                      {result.pool.length > 1 && (
                        <Button
                          onClick={anotherLikeThis}
                          sx={{
                            borderRadius: 8,
                            px: 2.5,
                            textTransform: 'none',
                            fontWeight: 700,
                            color: 'text.primary',
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          Another like this
                        </Button>
                      )}
                    </Box>
                  </>
                );
              })()}
            </GlassPanel>
          )}

          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: 700, mb: 2, px: 0.5 }}
          >
            This week’s notes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.7 }}>
            Written on Flickx. These are not studio synopses. Open a title if you want plot, cast,
            and trailer.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {weeklyPicks.map((pick) => {
              const movie = catalog[pick.tmdbId];
              return (
                <GlassPanel key={pick.tmdbId} component="article">
                  <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, alignItems: 'flex-start' }}>
                    {movie?.poster_path ? (
                      <Box
                        component={RouterLink}
                        to={`/movie/${pick.tmdbId}`}
                        sx={{ flexShrink: 0 }}
                      >
                        <Box
                          component="img"
                          src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                          alt=""
                          sx={{ width: { xs: 72, sm: 96 }, borderRadius: 1.5, display: 'block' }}
                        />
                      </Box>
                    ) : (
                      <Skeleton
                        variant="rectangular"
                        sx={{ width: { xs: 72, sm: 96 }, height: { xs: 108, sm: 144 }, borderRadius: 1.5, flexShrink: 0 }}
                      />
                    )}
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.6 }}>
                        {pick.kicker}
                      </Typography>
                      <Typography
                        variant="h6"
                        component={RouterLink}
                        to={`/movie/${pick.tmdbId}`}
                        sx={{
                          fontWeight: 700,
                          display: 'block',
                          mb: 1,
                          color: 'text.primary',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {pick.title}
                      </Typography>
                      {pick.body.map((paragraph) => (
                        <Typography
                          key={paragraph.slice(0, 32)}
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.75, mb: 1.25 }}
                        >
                          {paragraph}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </GlassPanel>
              );
            })}
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

export default Picks;
