import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { AppProviders } from './contexts/AppProviders';

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap-icons/font/bootstrap-icons.css';




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>,
)
