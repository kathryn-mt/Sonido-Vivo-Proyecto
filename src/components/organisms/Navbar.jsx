
import {
  Navbar as BsNavbar,
  Nav,
  NavDropdown,
  Container
} from 'react-bootstrap';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useCarrito } from '../../context/CarritoContext';
import { useCatalogo } from '../../context/CatalogoContext';
import {
  cerrarSesion,
  estaAutenticado,
  obtenerUsuario
} from '../../services/authService';
import { SESSION_EXPIRED_EVENT } from '../../services/authSession';

function Navbar() {
  const carrito = useCarrito();
  const catalogo = useCatalogo();
  const navigate = useNavigate();
  const [menuCuentaAbierto, setMenuCuentaAbierto] = useState(false);

  const [sesion, setSesion] = useState(function() {
    return {
      autenticado: estaAutenticado(),
      usuario: obtenerUsuario()
    };
  });

  useEffect(() => {
    function manejarSesionExpirada() {
      setMenuCuentaAbierto(false);
      setSesion({
        autenticado: false,
        usuario: null
      });
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, manejarSesionExpirada);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, manejarSesionExpirada);
    };
  }, []);

  const usuarioActual = sesion.usuario || {};
  const nombreCompleto = [
    usuarioActual.nombre,
    usuarioActual.apellido
  ].filter(Boolean).join(' ');

  function manejarCerrarSesion() {
    cerrarSesion();
    setMenuCuentaAbierto(false);
    setSesion({
      autenticado: false,
      usuario: null
    });
    navigate('/login', { replace: true });
  }

  // Obtener las categorías del catálogo sin repetirlas
  const categorias = [
    ...new Set(catalogo.productos.map(p => p.categoria).filter(Boolean))
  ].sort((a, b) => a.localeCompare(b, 'es'));

  return (
    <BsNavbar
      bg="light"
      expand="lg"
      sticky="top"
      className="shadow-sm"
    >
      <Container>

        {/* Logo */}
        <BsNavbar.Brand as={Link} to="/">
          <img
            src="/assets/logo-sonido-vivo-navbar.png"
            alt="Sonido Vivo - Instrumentos y Audio"
            className="logo-navbar"
          />
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="menu-principal" />

        <BsNavbar.Collapse id="menu-principal">
          <Nav className="ms-auto">

            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>

            <Nav.Link as={Link} to="/contacto">
              Contacto
            </Nav.Link>
            <Nav.Link as={Link} to="/nosotros">
              Nosotros
            </Nav.Link>

            <Nav.Link as={Link} to="/blog">
              Blog
            </Nav.Link>

            <Nav.Link as={Link} to="/mis-pedidos">
              Mis pedidos
            </Nav.Link>

            {/* Menú desplegable de categorías */}
            <NavDropdown
              title="Categorías"
              id="menu-categorias"
            >
              <NavDropdown.Item
                as={Link}
                to="/catalogo"
              >
                Mostrar todos los productos
              </NavDropdown.Item>

              <NavDropdown.Divider />

              {categorias.map(categoria => (
                <NavDropdown.Item
                  as={Link}
                  key={categoria}
                  to={`/catalogo?cat=${encodeURIComponent(categoria)}`}
                >
                  {categoria}
                </NavDropdown.Item>
              ))}

            </NavDropdown>

            <Nav.Link as={Link} to="/ofertas">
              Ofertas
            </Nav.Link>

            <Nav.Link as={Link} to="/carrito">
              Carrito ({carrito.cantidadTotal})
            </Nav.Link>

            {sesion.autenticado ? (
              <NavDropdown
                title={(
                  <>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="me-1"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1c-2.67 0-5 1.34-5 3v1h10v-1c0-1.66-2.33-3-5-3Z" />
                    </svg>
                    Mi cuenta
                  </>
                )}
                id="menu-mi-cuenta"
                show={menuCuentaAbierto}
                onToggle={setMenuCuentaAbierto}
                onMouseEnter={() => {
                  if (window.matchMedia?.('(hover: hover)').matches) {
                    setMenuCuentaAbierto(true);
                  }
                }}
                onMouseLeave={() => setMenuCuentaAbierto(false)}
                onSelect={() => setMenuCuentaAbierto(false)}
              >
                <NavDropdown.Header>
                  <span className="d-block">
                    {nombreCompleto || 'Usuario'}
                  </span>
                  <small>{usuarioActual.rol}</small>
                </NavDropdown.Header>

                <NavDropdown.Item as={Link} to="/mi-cuenta">
                  Ver y editar mis datos
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/cambiar-password">
                  Cambiar contraseña
                </NavDropdown.Item>

                {(usuarioActual.rol === 'ADMINISTRADOR' ||
                  usuarioActual.rol === 'VENDEDOR') && (
                  <NavDropdown.Item
                    as={Link}
                    to={
                      usuarioActual.rol === 'ADMINISTRADOR'
                        ? '/admin'
                        : '/vendedor'
                    }
                  >
                    Mi panel
                  </NavDropdown.Item>
                )}

                <NavDropdown.Divider />
                <NavDropdown.Item
                  as="button"
                  type="button"
                  onClick={manejarCerrarSesion}
                >
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">
                Ingresar
              </Nav.Link>
            )}

          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
