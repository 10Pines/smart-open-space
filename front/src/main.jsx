import React from 'react';
import { createRoot } from 'react-dom/client';
import HttpsRedirect from 'react-https-redirect';

import 'react-toastify/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ToastContainer } from 'react-toastify';
import LogRocket from 'logrocket';

import App from './App';

const logRocketKey = import.meta.env.VITE_LOGROCKET_KEY;
logRocketKey && LogRocket.init(logRocketKey);

const skipHttpsIpsEnv = import.meta.env.VITE_SKIP_HTTPS_IPS

const skipHttpsIps = skipHttpsIpsEnv
  ? skipHttpsIpsEnv.split(',').map(ip => ip.trim())
  : [];

const renderWithHttpsIfApply = (component) =>
  skipHttpsIps.includes(window.location.hostname)
    ? component
    : (<HttpsRedirect>{component}</HttpsRedirect>);

createRoot(document.getElementById('root')).render(
  renderWithHttpsIfApply(
    <>
      <App />
      <ToastContainer />
    </>
  )
);
