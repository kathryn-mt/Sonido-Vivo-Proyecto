
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LayoutPrincipal from './components/templates/LayoutPrincipal';

// Páginas principales
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import DetalleProducto from './pages/DetalleProducto';

// Páginas de usuario
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';

// Páginas informativas y de pedidos
import Contacto from './pages/Contacto';
import Nosotros from './pages/Nosotros';
import Blog from './pages/Blog';
import MisPedidos from './pages/MisPedidos';

// Páginas administrativas
import AdminProductos from './pages/AdminProductos';
import AdminPedidos from './pages/AdminPedidos';
import PanelAdministracion from './pages/PanelAdministracion';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Inicio */}
        <Route
          path="/"
          element={
            <LayoutPrincipal>
              <Inicio />
            </LayoutPrincipal>
          }
        />

        {/* Catálogo */}
        <Route
          path="/catalogo"
          element={
            <LayoutPrincipal>
              <Catalogo />
            </LayoutPrincipal>
          }
        />

        {/* Categorías */}
        <Route
          path="/categorias"
          element={
            <LayoutPrincipal>
              <Categorias />
            </LayoutPrincipal>
          }
        />

        {/* Ofertas */}
        <Route
          path="/ofertas"
          element={
            <LayoutPrincipal>
              <Ofertas />
            </LayoutPrincipal>
          }
        />

        {/* Detalle del producto */}
        <Route
          path="/detalle/:id"
          element={
            <LayoutPrincipal>
              <DetalleProducto />
            </LayoutPrincipal>
          }
        />

        {/* Contacto */}
        <Route
          path="/contacto"
          element={
            <LayoutPrincipal>
              <Contacto />
            </LayoutPrincipal>
          }
        />

        {/* Nosotros */}
        <Route
          path="/nosotros"
          element={
            <LayoutPrincipal>
              <Nosotros />
            </LayoutPrincipal>
          }
        />

        {/* Blog */}
        <Route
          path="/blog"
          element={
            <LayoutPrincipal>
              <Blog />
            </LayoutPrincipal>
          }
        />

        {/* Mis pedidos */}
        <Route
          path="/mis-pedidos"
          element={
            <LayoutPrincipal>
              <MisPedidos />
            </LayoutPrincipal>
          }
        />

        {/* Login y registro */}
        <Route path="/login" element={<Login />} />

        <Route path="/registro" element={<Registro />} />

        {/* Carrito */}
        <Route
          path="/carrito"
          element={
            <LayoutPrincipal>
              <Carrito />
            </LayoutPrincipal>
          }
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={
            <LayoutPrincipal>
              <Checkout />
            </LayoutPrincipal>
          }
        />

        {/* Administración de productos */}
        <Route
          path="/admin/productos"
          element={
            <LayoutPrincipal>
              <AdminProductos />
            </LayoutPrincipal>
          }
        />

        {/* Administración de pedidos */}
        <Route
          path="/admin/pedidos"
          element={
            <LayoutPrincipal>
              <AdminPedidos />
            </LayoutPrincipal>
          }
        />
        {/* Panel de administración */}
        <Route
          path="/admin"
          element={
            <LayoutPrincipal>
              <PanelAdministracion />
            </LayoutPrincipal>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
