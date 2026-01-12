import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';
import { LeadsProvider } from './context/LeadsContext';
import { ToastProvider } from './context/ToastContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <LeadsProvider>
          <App />
        </LeadsProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
