
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { useCarrito } from '../context/CarritoContext';

import '../styles/carrito.css';

function Carrito() {
  useTituloPagina('Carrito');

  const {
    carrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    total,
    cantidadTotal
  } = useCarrito();


  // Formatear precios en pesos chilenos
  function formatearPrecio(precio) {
    return '$' + Number(precio).toLocaleString('es-CL');
  }

  return (
    <section className="carrito-pagina py-5">

      {/* Título de la página */}
      <h1 className="fw-bold mb-2">
        Mi carrito de compras
      </h1>

      <p className="text-muted mb-4">
        Revisa los instrumentos que seleccionaste.
      </p>

      {/* Mostrar mensaje cuando el carrito está vacío */}
      {carrito.length === 0 ? (

        <div className="carrito-vacio text-center">
          <h2 className="h4">
            Tu carrito está vacío
          </h2>

          <p className="text-muted">
            Todavía no has agregado instrumentos.
          </p>

          <Button
            as={Link}
            to="/catalogo"
            variant="primary"
          >
            Explorar catálogo
          </Button>
        </div>

      ) : (

        <Row className="g-4">

          {/* Lista de productos */}
          <Col lg={8}>

            {carrito.map(producto => (

              <Card
                key={producto.id}
                className="carrito-producto mb-3"
              >
                <Card.Body>

                  <Row className="align-items-center g-3">

                    {/* Imagen del producto */}
                    <Col xs={12} sm={3}>
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="carrito-imagen"
                      />
                    </Col>

                    {/* Información del producto */}
                    <Col xs={12} sm={9}>

                      <h2 className="h5">
                        {producto.nombre}
                      </h2>

                      <p className="text-muted mb-2">
                        Marca: {producto.marca}
                      </p>

                      <p className="fw-bold mb-3">
                        {formatearPrecio(producto.precio)}
                      </p>

                      {/* Controles de cantidad */}
                      <div className="d-flex align-items-center gap-2 flex-wrap">

                        <Button
                          variant="outline-secondary"
                          size="sm"
                          aria-label={`Disminuir cantidad de ${producto.nombre}`}
                          onClick={() =>
                            actualizarCantidad(
                              producto.id,
                              producto.cantidad - 1
                            )
                          }
                        >
                          −
                        </Button>

                        <span className="fw-bold">
                          {producto.cantidad}
                        </span>

                        <Button
                          variant="outline-secondary"
                          size="sm"
                          aria-label={`Aumentar cantidad de ${producto.nombre}`}
                          disabled={
                            producto.cantidad >= producto.stock
                          }
                          onClick={() =>
                            actualizarCantidad(
                              producto.id,
                              producto.cantidad + 1
                            )
                          }
                        >
                          +
                        </Button>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() =>
                            eliminarDelCarrito(producto.id)
                          }
                        >
                          Eliminar
                        </Button>

                      </div>

                      {/* Subtotal del producto */}
                      <p className="mt-3 mb-0">
                        <strong>Subtotal:</strong>{' '}
                        {formatearPrecio(
                          producto.precio * producto.cantidad
                        )}
                      </p>

                    </Col>

                  </Row>

                </Card.Body>
              </Card>

            ))}

            {/* Vaciar todos los productos */}
            <Button
              variant="outline-danger"
              onClick={vaciarCarrito}
            >
              Vaciar carrito
            </Button>

          </Col>

          {/* Resumen de compra */}
          <Col lg={4}>

            <Card className="carrito-resumen">
              <Card.Body>

                <h2 className="h4 mb-4">
                  Resumen de compra
                </h2>

                <p>
                  Productos: {cantidadTotal}
                </p>

                <hr />

                <h3 className="h5">
                  Total: {formatearPrecio(total)}
                </h3>

                {/* Botones separados */}
                <div className="d-grid gap-2 mt-4">

                  <Button
                    as={Link}
                    to="/checkout"
                    variant="primary"
                  >
                    Continuar con el pedido
                  </Button>

                  <Button
                    as={Link}
                    to="/catalogo"
                    variant="outline-secondary"
                  >
                    Seguir comprando
                  </Button>

                </div>

              </Card.Body>
            </Card>

          </Col>

        </Row>

      )}

    </section>
  );
}

export default Carrito;
