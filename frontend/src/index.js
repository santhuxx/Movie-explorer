import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { MovieProvider } from './context/MovieContext';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"


ReactDOM.render(
  <BrowserRouter>
    <MovieProvider>
      <App />
      <Analytics />
      <SpeedInsights />
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7001636087856196"
     crossorigin="anonymous"></script>
    </MovieProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
