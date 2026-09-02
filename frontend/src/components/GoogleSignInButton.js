import React, { useEffect, useRef, useCallback } from 'react';
import { Button, Box, CircularProgress, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const HiddenGoogleHost = styled(Box)({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

const GoogleSignInButton = ({ onSuccess, onError, disabled, label = 'Continue with Google' }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const hostRef = useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [googleReady, setGoogleReady] = React.useState(false);

  const handleCredential = useCallback(
    async (response) => {
      setLoading(true);
      try {
        await onSuccess(response);
      } catch (err) {
        onError?.(err);
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError]
  );

  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId) return undefined;

    const init = () => {
      if (!window.google?.accounts?.id || !hostRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin',
      });

      hostRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(hostRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'continue_with',
        shape: 'rectangular',
        width: 320,
      });
      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      init();
      return undefined;
    }

    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', init);
      return () => existing.removeEventListener('load', init);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = init;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [handleCredential]);

  const handleClick = () => {
    const host = hostRef.current;
    if (!host) return;
    const clickable =
      host.querySelector('div[role="button"]') ||
      host.querySelector('[tabindex="0"]') ||
      host.firstElementChild;
    clickable?.click();
  };

  return (
    <>
      <HiddenGoogleHost aria-hidden="true">
        <div ref={hostRef} />
      </HiddenGoogleHost>
      <Button
        type="button"
        fullWidth
        disabled={disabled || loading || !googleReady}
        onClick={handleClick}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <GoogleIcon />}
        sx={{
          py: 1.35,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          color: isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.85)',
          bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)'}`,
          boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
          '&:hover': {
            bgcolor: isDark ? 'rgba(255,255,255,0.12)' : '#fafafa',
            borderColor: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.2)',
            boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
          },
          '& .MuiButton-startIcon': {
            mr: 1.25,
          },
        }}
      >
        {loading ? 'Signing in...' : label}
      </Button>
    </>
  );
};

export default GoogleSignInButton;
