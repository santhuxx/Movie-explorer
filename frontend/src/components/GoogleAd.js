import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';

const ADS_CLIENT = 'ca-pub-7001636087856196';
const ADS_SLOT = '3101422978';
const SCRIPT_ID = 'flickx-adsense-manual';

const loadManualAdScript = () =>
  new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.adsbygoogle) {
      resolve(true);
      return;
    }
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve(true), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    // No ?client= query — that snippet enables Auto ads on every screen.
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const GoogleAd = ({ show = false }) => {
  const insRef = useRef(null);
  const pushed = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!show) return undefined;
    let cancelled = false;
    loadManualAdScript().then((ok) => {
      if (!cancelled && ok) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [show]);

  useEffect(() => {
    if (!show || !ready || pushed.current || !insRef.current) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // Slot may already be filled
    }
  }, [show, ready]);

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
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADS_CLIENT}
        data-ad-slot={ADS_SLOT}
        data-ad-format="rectangle"
        data-full-width-responsive="true"
      />
    </Box>
  );
};

export default GoogleAd;
