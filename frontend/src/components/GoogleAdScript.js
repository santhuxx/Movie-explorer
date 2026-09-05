import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ADS_CLIENT = 'ca-pub-7001636087856196';
const SCRIPT_ID = 'flickx-adsense-script';

const isContentRoute = (pathname) =>
  pathname === '/' || pathname.startsWith('/movie/');

const GoogleAdScript = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isContentRoute(pathname)) {
      return undefined;
    }

    if (document.getElementById(SCRIPT_ID)) {
      return undefined;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    return undefined;
  }, [pathname]);

  return null;
};

export default GoogleAdScript;
