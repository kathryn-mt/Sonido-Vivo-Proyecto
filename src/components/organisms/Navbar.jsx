
import {
  Navbar as BsNavbar,
  Nav,
  NavDropdown,
  Container
} from 'react-bootstrap';

import { Link } from 'react-router-dom';

import { useCarrito } from '../../context/CarritoContext';
import { useCatalogo } from '../../context/CatalogoContext';

function Navbar() {
  const { cantidadTotal } = useCarrito();
  const { productos } = useCatalogo();

  // Obtener las categorías del catálogo sin repetirlas
  const categorias = [
    ...new Set(productos.map(p => p.categoria).filter(Boolean))
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
              Carrito ({cantidadTotal})
            </Nav.Link>

            <Nav.Link as={Link} to="/login">
              Ingresar
            </Nav.Link>

          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
