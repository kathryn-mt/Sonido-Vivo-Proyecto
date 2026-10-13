
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';

import { useCatalogo } from '../context/CatalogoContext';

import '../styles/ofertas.css';

import { useTituloPagina } from '../hooks/useTituloPagina';

function Ofertas() {
  useTituloPagina('Ofertas');

  // Solo mostrar productos con descuento y stock
  const ofertasDestacadas = productos.filter(producto =>
    Number(producto.precioAnterior) > Number(producto.precio) &&
    Number(producto.stock) > 0
  );

  function formatearPrecio(precio) {
    return '$' + Number(precio).toLocaleString('es-CL');
  }

  function calcularDescuento(producto) {
    const diferencia =
      producto.precioAnterior - producto.precio;

    return Math.round(
      (diferencia / producto.precioAnterior) * 100
    );
  }

  return (
    <section className="ofertas-pagina py-5">

      <div className="text-center mb-5">
        <h1 className="fw-bold">
          Ofertas destacadas
        </h1>

        <p className="text-muted">
          Encuentra instrumentos y accesorios
          con precios especiales.
        </p>
      </div>

      {ofertasDestacadas.length === 0 ? (
        <div className="text-center py-5">
          <h2 className="h4">
            Por ahora no hay ofertas disponibles
          </h2>

          <p className="text-muted">
            Pronto tendremos nuevos descuentos.
          </p>

          <Button as={Link} to="/catalogo">
            Ver todos los productos
          </Button>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">

          {ofertasDestacadas.map(producto => (
            <Col key={producto.id}>

              <Card className="oferta-tarjeta h-100">

                <div className="oferta-imagen-contenedor">
                  <Badge
                    bg="danger"
                    className="oferta-descuento"
                  >
                    -{calcularDescuento(producto)}%
                  </Badge>

                  <Card.Img
                    variant="top"
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="oferta-imagen"
                    loading="lazy"
                  />
                </div>

                <Card.Body className="d-flex flex-column">

                  <Card.Title className="h5">
                    {producto.nombre}
                  </Card.Title>

                  <Card.Text className="text-muted">
                    {producto.marca}
                  </Card.Text>

                  <p className="oferta-precio-anterior mb-1">
                    Antes: {formatearPrecio(producto.precioAnterior)}
                  </p>

                  <p className="oferta-precio-actual mb-3">
                    {formatearPrecio(producto.precio)}
                  </p>

                  <div className="mt-auto">
                    <Button
                      as={Link}
                      to={`/detalle/${producto.id}`}
                      variant="outline-primary"
                      className="w-100"
                    >
                      Ver detalle
                    </Button>
                  </div>

                </Card.Body>

              </Card>

            </Col>
          ))}

        </Row>
      )}

    </section>
  );
}

export default Ofertas;
