import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

const GoogleAd = ({ show = false }) => {
  const pushed = useRef(false);

  useEffect(() => {
    if (!show || pushed.current) return;
    if (typeof window === 'undefined' || !window.adsbygoogle) return;

    try {
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // AdSense may throw if the slot is already filled
    }
  }, [show]);

  if (!show) return null;

  return (
    <Box
      component="aside"
      aria-label="Advertisement"
      sx={{ my: { xs: 3, sm: 4 }, minHeight: 90 }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', textAlign: 'center', mb: 1, letterSpacing: 0.6 }}
      >
        Advertisement
      </Typography>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-7001636087856196"
        data-ad-slot="3101422978"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </Box>
  );
};

export default GoogleAd;
