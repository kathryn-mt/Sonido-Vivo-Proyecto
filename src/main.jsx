import 'bootstrap/dist/css/bootstrap.min.css'; 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' 
import App from './App.jsx'
import { CatalogoProvider } from './context/CatalogoContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CatalogoProvider>
      <App />
    </CatalogoProvider>
  </StrictMode>,
)