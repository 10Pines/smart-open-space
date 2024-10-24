import React from 'react';
import { render } from 'react-dom';
import HttpsRedirect from 'react-https-redirect';

import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { toast } from 'react-toastify';
import LogRocket from 'logrocket';

import App from './App';

const logRocketKey = import.meta.env.VITE_LOGROCKET_KEY;
logRocketKey && LogRocket.init(logRocketKey);
toast.configure();

render(
  <HttpsRedirect>
    <App />
  </HttpsRedirect>,
  document.getElementById('root')
);