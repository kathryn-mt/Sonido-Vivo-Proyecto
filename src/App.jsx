import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import LayoutPrincipal from './components/templates/LayoutPrincipal';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import DetalleProducto from './pages/DetalleProducto'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas con Navbar y Footer */}
        <Route path="/" element={
          <LayoutPrincipal><Inicio /></LayoutPrincipal>
        } />
        
        <Route path="/catalogo" element={
          <LayoutPrincipal><Catalogo /></LayoutPrincipal>
        } />

        {/* Detalle también lleva Layout para mantener consistencia visual */}
        <Route path="/detalle/:id" element={
          <LayoutPrincipal><DetalleProducto /></LayoutPrincipal>
        } />

        {/* Login SIN Layout (Pantalla completa limpia) */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;