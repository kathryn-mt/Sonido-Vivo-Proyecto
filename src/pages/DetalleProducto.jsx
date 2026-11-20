import { useTituloPagina } from '../hooks/useTituloPagina';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Card,
  Button,
  Alert,
  Spinner
} from 'react-bootstrap';

import { useCatalogo } from '../context/CatalogoContext';
import { useCarrito } from '../context/CarritoContext';


// DETALLE DEL PRODUCTO - KATY


function DetalleProducto() {

  // OBTENER ID DE LA URL
  const parametros = useParams();

  const id = parametros.id;

  // OBTENER DATOS DEL CATÁLOGO
  const catalogo = useCatalogo();

  const productos = catalogo.productos;
  const cargando = catalogo.cargando;
  const error = catalogo.error;
  const refrescarProductos = catalogo.refrescarProductos;

  // OBTENER FUNCIÓN DEL CARRITO
  const carrito = useCarrito();

  const agregarAlCarrito = carrito.agregarAlCarrito;

  // ESTADO DEL MENSAJE
  const estadoMensaje = useState('');

  const mensaje = estadoMensaje[0];
  const setMensaje = estadoMensaje[1];


  // BUSCAR PRODUCTO


  const producto = productos.find(function (productoActual) {
    return productoActual.id === Number(id);
  });


  // TÍTULO DE LA PÁGINA


  useTituloPagina(
    producto?.nombre ?? 'Detalle del producto'
  );


  // REINTENTAR CARGA


  async function reintentarCarga() {

    try {

      await refrescarProductos();

    } catch (errorPeticion) {

      console.error(
        'Error al consultar productos:',
        errorPeticion.message
      );
    }
  }


  // AGREGAR AL CARRITO


  function manejarAgregarCarrito() {

    if (!producto || Number(producto.stock) <= 0) {
      return;
    }

    agregarAlCarrito(producto);

    setMensaje(
      `${producto.nombre} agregado al carrito correctamente.`
    );
  }


  // MOSTRAR ESTADO DE CARGA


  if (cargando) {

    return (

      <Container className="py-5 text-center">

        <Spinner
          animation="border"
          variant="primary"
        />

        <p className="mt-3">
          Cargando información del producto...
        </p>

      </Container>
    );
  }


  // MOSTRAR ERROR DE CONEXIÓN


  if (error) {

    return (

      <Container className="py-5">

        <Alert variant="danger" role="alert">

          <p>{error}</p>

          <Button
            variant="outline-danger"
            onClick={reintentarCarga}
          >
            Reintentar
          </Button>

        </Alert>

      </Container>
    );
  }


  // PRODUCTO NO ENCONTRADO


  if (!producto) {

    return (

      <Container className="py-5">

        <h2>Producto no encontrado</h2>

        <Link
          to="/catalogo"
          className="btn btn-primary mt-3"
        >
          Volver al catálogo
        </Link>

      </Container>
    );
  }

  // MOSTRAR PRODUCTO


  return (

    <Container className="py-5">

      <Link
        to="/catalogo"
        className="btn btn-outline-secondary mb-3"
      >
        ← Volver al catálogo
      </Link>

      <Card className="shadow-sm">

        {/* IMAGEN */}

        <Card.Img
          variant="top"
          src={producto.imagen}
          alt={producto.nombre}
          className="imagen-detalle"
        />

        <Card.Body>

          {/* NOMBRE */}

          <Card.Title className="fs-3">
            {producto.nombre}
          </Card.Title>

          {/* MARCA */}

          <Card.Text>
            <strong>Marca:</strong> {producto.marca}
          </Card.Text>

          {/* MODELO */}

          <Card.Text>
            <strong>Modelo:</strong> {producto.modelo}
          </Card.Text>

          {/* DESCRIPCIÓN */}

          <Card.Text>
            {producto.descripcion}
          </Card.Text>

          {/* STOCK */}

          <Card.Text>
            <strong>Stock disponible:</strong> {producto.stock}
          </Card.Text>

          {/* PRECIO */}

          <h3 className="mb-4">
            ${Number(producto.precio).toLocaleString('es-CL')}
          </h3>

          {/* AGREGAR AL CARRITO */}

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

          {/* MENSAJE DE CONFIRMACIÓN */}

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