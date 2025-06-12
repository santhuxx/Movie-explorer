import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { MovieProvider } from './context/MovieContext';
import { SpeedInsights } from "@vercel/speed-insights/react";




ReactDOM.render(
  <BrowserRouter>
    <MovieProvider>
      <App />
    </MovieProvider>
    <SpeedInsights />
  </BrowserRouter>,
  document.getElementById('root')
);
