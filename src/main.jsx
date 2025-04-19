import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@app';
import AppProvider from '@provider';
import '@styles/index.css';

createRoot(document.getElementById('root')).render(
  <AppProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AppProvider>
);
