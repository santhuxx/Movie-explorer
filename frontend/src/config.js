const PRODUCTION_API = 'https://movie-explorer-topaz.vercel.app';
const LOCAL_API = 'http://localhost:5001';

const isBrowser = typeof window !== 'undefined';
const isLocalHost =
  isBrowser &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (isBrowser && !isLocalHost ? PRODUCTION_API : LOCAL_API);

export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
