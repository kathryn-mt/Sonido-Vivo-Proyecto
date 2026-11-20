
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  estaAutenticado,
  obtenerUsuario
} from './services/authService';

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
import PanelVendedor from './pages/PanelVendedor';

function RutaProtegidaAdministrador(props) {

  const autenticado = estaAutenticado();
  const usuario = obtenerUsuario();

  if (!autenticado || !usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== 'ADMINISTRADOR') {
    return <Navigate to="/catalogo" replace />;
  }

  return props.children;

}

// PROTEGER RUTAS DEL VENDEDOR


function RutaProtegidaVendedor(props) {

  const autenticado = estaAutenticado();
  const usuario = obtenerUsuario();

  // Si no inició sesión, enviarlo al login
  if (!autenticado || !usuario) {

    return <Navigate to="/login" replace />;
  }

  // Si no es vendedor, impedir el acceso
  if (usuario.rol !== 'VENDEDOR') {

    return <Navigate to="/catalogo" replace />;
  }

  return props.children;
}

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
            <RutaProtegidaAdministrador>
              <LayoutPrincipal>
                <AdminProductos />
              </LayoutPrincipal>
            </RutaProtegidaAdministrador>
          }
        />

        {/* Administración de pedidos */}
        <Route
          path="/admin/pedidos"
          element={
            <RutaProtegidaAdministrador>
              <LayoutPrincipal>
                <AdminPedidos />
              </LayoutPrincipal>
            </RutaProtegidaAdministrador>
          }
        />
                {/* PANEL DE ADMINISTRACIÓN */}

        <Route
          path="/admin"
          element={
            <RutaProtegidaAdministrador>
              <LayoutPrincipal>
                <PanelAdministracion />
              </LayoutPrincipal>
            </RutaProtegidaAdministrador>
          }
        />

        {/* PANEL DEL VENDEDOR */}

        <Route
          path="/vendedor"
          element={
            <RutaProtegidaVendedor>
              <LayoutPrincipal>
                <PanelVendedor />
              </LayoutPrincipal>
            </RutaProtegidaVendedor>
          }
        />

        {/* PRODUCTOS DEL VENDEDOR */}

        <Route
          path="/vendedor/productos"
          element={
            <RutaProtegidaVendedor>
              <LayoutPrincipal>
                <AdminProductos />
              </LayoutPrincipal>
            </RutaProtegidaVendedor>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
