// Convert OAuth hash fragment to query params for /auth/callback before anything else
if (window.location.hash && window.location.pathname === '/auth/callback') {
  const queryParams = new URLSearchParams(window.location.hash.slice(1));
  window.location.replace(`${window.location.origin}/auth/callback?${queryParams.toString()}`);
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './src/App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);