import { useTituloPagina } from '../hooks/useTituloPagina';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button, Alert } from 'react-bootstrap';

import { useCatalogo } from '../context/CatalogoContext';
import { useCarrito } from '../context/CarritoContext';

function DetalleProducto() {
  const { id } = useParams();

  const { productos } = useCatalogo();
  const { agregarAlCarrito } = useCarrito();

  const [mensaje, setMensaje] = useState('');

  // Buscar el producto seleccionado
  const producto = productos.find(
    p => p.id === Number(id)
  );

  useTituloPagina(
    producto?.nombre ?? 'Producto no encontrado'
  );
  if (!producto) {
    return (
      <Container className="py-5">
        <h2>Producto no encontrado</h2>

        <Link to="/catalogo" className="btn btn-primary mt-3">
          Volver al catálogo
        </Link>
      </Container>
    );
  }

  // Agregar el producto al carrito
  function manejarAgregarCarrito() {
    if (Number(producto.stock) <= 0) {
      return;
    }

    agregarAlCarrito(producto);

    setMensaje(
      `${producto.nombre} agregado al carrito correctamente.`
    );
  }

  return (
    <Container className="py-5">

      <Link
        to="/catalogo"
        className="btn btn-outline-secondary mb-3"
      >
        ← Volver al catálogo
      </Link>

      <Card className="shadow-sm">

        <Card.Img
          variant="top"
          src={producto.imagen}
          alt={producto.nombre}
          className="imagen-detalle"
        />

        <Card.Body>

          <Card.Title className="fs-3">
            {producto.nombre}
          </Card.Title>

          <Card.Text>
            <strong>Marca:</strong> {producto.marca}
          </Card.Text>

          <Card.Text>
            <strong>Modelo:</strong> {producto.modelo}
          </Card.Text>

          <Card.Text>
            {producto.descripcion}
          </Card.Text>

          <Card.Text>
            <strong>Stock disponible:</strong> {producto.stock}
          </Card.Text>

          <h3 className="mb-4">
            ${producto.precio.toLocaleString('es-CL')}
          </h3>

          <Button
            variant="primary"
            size="lg"
            onClick={manejarAgregarCarrito}
            disabled={Number(producto.stock) <= 0}
          >
            {Number(producto.stock) > 0
              ? 'Agregar al carrito'
              : 'Sin stock'}
          </Button>

          {mensaje && (
            <Alert
              variant="success"
              role="status"
              className="mt-3 mb-0"
            >
              {mensaje}
            </Alert>
          )}

        </Card.Body>
      </Card>

    </Container>
  );
}

export default DetalleProducto;
