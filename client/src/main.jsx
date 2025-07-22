import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { AppProviders } from './contexts/AppProviders';

import './index.css'

import 'bootstrap-icons/font/bootstrap-icons.css';

// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>,
)
