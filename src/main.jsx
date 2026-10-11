
import 'bootstrap/dist/css/bootstrap.min.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import App from './App.jsx';

import { CatalogoProvider } from './context/CatalogoContext.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CatalogoProvider>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </CatalogoProvider>
  </StrictMode>
);
