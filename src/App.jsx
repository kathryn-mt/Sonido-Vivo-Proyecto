import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import LayoutPrincipal from './components/templates/LayoutPrincipal';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import DetalleProducto from './pages/DetalleProducto'; 
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import AdminProductos from './pages/AdminProductos';

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
        {/* Nueva ruta */}
        <Route path="/categorias" element={
          <LayoutPrincipal><Categorias /></LayoutPrincipal>
        } />
        <Route path="/ofertas" element={
          <LayoutPrincipal><Ofertas /></LayoutPrincipal>
        } />
       
        <Route path="/admin/productos" element={
          <LayoutPrincipal><AdminProductos /></LayoutPrincipal>
        } />        
        
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