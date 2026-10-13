
import { useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { useCatalogo } from '../context/CatalogoContext';
import TarjetaProducto from '../components/molecules/TarjetaProducto';

import '../styles/inicio.css';

// Categorías que aparecerán en el Inicio
const categoriasDestacadas = [
  'Guitarras Acústicas',
  'Guitarras Eléctricas',
  'Bajos Eléctricos',
  'Baterías',
  'Teclados y Pianos',
  'Micrófonos'
];

function Inicio() {
  useTituloPagina('Inicio');

  const { productos } = useCatalogo();
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState('');

  // Mostrar cuatro productos disponibles
  const destacados = productos
    .filter(producto => Number(producto.stock) > 0)
    .slice(0, 4);

  // Buscar productos en el catálogo
  function manejarBusqueda(e) {
    e.preventDefault();

    const texto = busqueda.trim();

    if (texto) {
      navigate(
        `/catalogo?q=${encodeURIComponent(texto)}`
      );
    } else {
      navigate('/catalogo');
    }
  }

  return (
    <div className="inicio">

      {/* 1. PORTADA PRINCIPAL */}
      <section className="inicio-hero py-5">

        <Row className="align-items-center g-4">

          {/* Información principal */}
          <Col lg={6}>

            <p className="inicio-etiqueta">
              SONIDO VIVO · VIÑA DEL MAR
            </p>

            <h1 className="display-4 fw-bold mb-4">
              Tu sueño de músico comienza aquí
            </h1>

            <p className="lead text-muted">
              Descubre instrumentos musicales, equipos
              de audio y accesorios para dar vida
              a tu música.
            </p>

            {/* Botones de navegación */}
            <div className="d-flex gap-3 flex-wrap mt-4">

              <Button
                as={Link}
                to="/catalogo"
                size="lg"
                variant="primary"
              >
                Ver catálogo
              </Button>

              <Button
                as="a"
                href="#titulo-categorias"
                variant="outline-secondary"
                size="lg"
              >
                Explorar categorías
              </Button>

            </div>

            {/* Buscador de instrumentos */}
            <Form
              onSubmit={manejarBusqueda}
              className="inicio-buscador d-flex gap-2 mt-4"
            >

              <Form.Control
                type="search"
                placeholder="Buscar guitarra, teclado, micrófono..."
                aria-label="Buscar instrumentos"
                value={busqueda}
                onChange={e =>
                  setBusqueda(e.target.value)
                }
              />

              <Button
                type="submit"
                variant="dark"
              >
                Buscar
              </Button>

            </Form>

          </Col>

          {/* Fotografía del guitarrista */}
          <Col lg={6}>

            <div className="inicio-hero-contenedor">

              <img
                src="/assets/portada-sonido-vivo.png"
                alt="Guitarrista tocando una guitarra eléctrica en un escenario"
                className="inicio-hero-imagen"
              />

            </div>

          </Col>

        </Row>

      </section>

      {/* 2. CATEGORÍAS DESTACADAS */}
      <section
        className="py-5"
        aria-labelledby="titulo-categorias"
      >

        <div className="inicio-encabezado-seccion">

          <div>

            <h2
              id="titulo-categorias"
              className="fw-bold"
            >
              Explora nuestras categorías
            </h2>

            <p className="text-muted">
              Encuentra el instrumento que estás buscando.
            </p>

          </div>

          {/* Mostrar todo el catálogo */}
          <Link to="/catalogo">
            Ver todos los productos
          </Link>

        </div>

        <Row
          xs={1}
          sm={2}
          lg={3}
          className="g-4"
        >

          {categoriasDestacadas.map(categoria => {

            // Filtrar por categoría
            const productosCategoria = productos.filter(
              producto => producto.categoria === categoria
            );

            // Utilizar una imagen representativa
            const imagen = productosCategoria[0]?.imagen;

            return (
              <Col key={categoria}>

                <Link
                  to={`/catalogo?cat=${encodeURIComponent(categoria)}`}
                  className="inicio-categoria"
                >

                  {imagen && (
                    <img
                      src={imagen}
                      alt=""
                      className="inicio-categoria-imagen"
                      loading="lazy"
                    />
                  )}

                  <h3 className="h5 mt-3">
                    {categoria}
                  </h3>

                  <span className="text-muted small">
                    {productosCategoria.length}{' '}
                    {productosCategoria.length === 1
                      ? 'producto'
                      : 'productos'}
                  </span>

                </Link>

              </Col>
            );
          })}

        </Row>

      </section>

      {/* 3. PRODUCTOS DESTACADOS */}
      <section
        className="py-5"
        aria-labelledby="titulo-destacados"
      >

        <div className="inicio-encabezado-seccion">

          <div>

            <h2
              id="titulo-destacados"
              className="fw-bold"
            >
              Productos destacados
            </h2>

            <p className="text-muted">
              Conoce algunos instrumentos de
              nuestro catálogo.
            </p>

          </div>

          <Link to="/catalogo">
            Ver catálogo completo
          </Link>

        </div>

        {destacados.length > 0 ? (

          <Row
            xs={1}
            sm={2}
            lg={4}
            className="g-4"
          >

            {destacados.map(producto => (

              <Col key={producto.id}>

                <TarjetaProducto
                  producto={producto}
                />

              </Col>

            ))}

          </Row>

        ) : (

          <p className="text-muted">
            Actualmente no hay productos disponibles.
          </p>

        )}

      </section>

      {/* 4. SOBRE NOSOTROS */}
      <section className="inicio-sobre py-5">

        <Row className="align-items-center g-4">

          <Col lg={7}>

            <h2 className="fw-bold mb-3">
              Conoce Sonido Vivo
            </h2>

            <p>
              Somos una tienda de instrumentos musicales
              y equipos de audio ubicada en Viña del Mar.
            </p>

            <p>
              Nuestro catálogo reúne instrumentos,
              accesorios y equipos para quienes están
              comenzando en la música y quienes buscan
              seguir desarrollando su talento.
            </p>

            <Button
              as={Link}
              to="/catalogo"
              variant="outline-primary"
            >
              Conocer nuestros productos
            </Button>

          </Col>

          <Col lg={5}>

            <div className="inicio-sobre-imagen">

              <img
                src="/assets/squier-strat.jpg"
                alt="Guitarra eléctrica del catálogo de Sonido Vivo"
                loading="lazy"
              />

            </div>

          </Col>

        </Row>

      </section>

      {/* 5. INFORMACIÓN DE LA TIENDA */}
      <section
        className="py-5"
        aria-labelledby="titulo-servicios"
      >

        <h2
          id="titulo-servicios"
          className="fw-bold text-center mb-4"
        >
          Encuentra lo que necesitas
        </h2>

        <Row
          xs={1}
          md={3}
          className="g-4"
        >

          {/* Variedad musical */}
          <Col>

            <div className="inicio-info">

              <h3 className="h5">
                Variedad musical
              </h3>

              <p>
                Explora guitarras, bajos, baterías,
                teclados y equipos de audio.
              </p>

            </div>

          </Col>

          {/* Precios */}
          <Col>

            <div className="inicio-info">

              <h3 className="h5">
                Precios claros
              </h3>

              <p>
                Consulta los precios de los instrumentos
                directamente desde el catálogo.
              </p>

            </div>

          </Col>

          {/* Stock */}
          <Col>

            <div className="inicio-info">

              <h3 className="h5">
                Disponibilidad
              </h3>

              <p>
                Revisa la información de stock de cada
                producto antes de elegirlo.
              </p>

            </div>

          </Col>

        </Row>

      </section>

      {/* 6. SECCIÓN FINAL */}
      <section className="inicio-cierre text-center">

        <h2 className="fw-bold">
          Encuentra tu próximo instrumento
        </h2>

        <p className="mb-4">
          Explora nuestro catálogo y descubre
          nuevas posibilidades para tu música.
        </p>

        <Button
          as={Link}
          to="/catalogo"
          variant="light"
          size="lg"
        >
          Explorar productos
        </Button>

      </section>

    </div>
  );
}

export default Inicio;
