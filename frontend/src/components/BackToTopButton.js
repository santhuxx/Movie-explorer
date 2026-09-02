import React, { useEffect, useState } from 'react';
import { Fab, Zoom, useTheme } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

const SCROLL_THRESHOLD = 320;

const BackToTopButton = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={visible} role="presentation">
      <Fab
        size="medium"
        onClick={handleClick}
        aria-label="Scroll to top"
        sx={{
          position: 'fixed',
          bottom: { xs: 24, sm: 32 },
          right: { xs: 16, sm: 24 },
          zIndex: theme.zIndex.speedDial,
          color: isDark ? 'white' : 'text.primary',
          bgcolor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.92)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
          backdropFilter: 'blur(12px)',
          boxShadow: isDark
            ? '0 8px 24px rgba(0,0,0,0.45)'
            : '0 8px 24px rgba(0,0,0,0.12)',
          '&:hover': {
            bgcolor: isDark ? 'rgba(45,45,45,0.95)' : 'rgba(255,255,255,1)',
          },
        }}
      >
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
};

export default BackToTopButton;
