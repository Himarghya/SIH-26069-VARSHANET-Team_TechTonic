import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { NetworkProvider } from './context/NetworkContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NetworkProvider>
      <App />
    </NetworkProvider>
  </React.StrictMode>,
);