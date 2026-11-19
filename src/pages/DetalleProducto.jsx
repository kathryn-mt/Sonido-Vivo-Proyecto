import { useTituloPagina } from '../hooks/useTituloPagina';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button, Alert } from 'react-bootstrap';

import { useCatalogo } from '../context/CatalogoContext';
import { useCarrito } from '../context/CarritoContext';


// PÁGINA DETALLE DEL PRODUCTO


function DetalleProducto() {


  // OBTENER ID SIN DESESTRUCTURACIÓN


  const parametros = useParams();

  const id = parametros.id;


  // OBTENER PRODUCTOS DEL CATÁLOGO


  const catalogo = useCatalogo();

  const productos = catalogo.productos;

  
  // OBTENER FUNCIÓN DEL CARRITO


  const carrito = useCarrito();

  const agregarAlCarrito = carrito.agregarAlCarrito;


  // ESTADO DEL MENSAJE


  const estadoMensaje = useState('');

  const mensaje = estadoMensaje[0];
  const setMensaje = estadoMensaje[1];

  // BUSCAR PRODUCTO SELECCIONADO


  const producto = productos.find(function (productoActual) {
    return productoActual.id === Number(id);
  });


  // TÍTULO DE LA PÁGINA
  

  useTituloPagina(
    producto?.nombre ?? 'Producto no encontrado'
  );

  
  // PRODUCTO NO ENCONTRADO
 

  if (!producto) {

    return (

      <Container className="py-5">

        <h2>
          Producto no encontrado
        </h2>

        <Link
          to="/catalogo"
          className="btn btn-primary mt-3"
        >
          Volver al catálogo
        </Link>

      </Container>
    );
  }


  // AGREGAR PRODUCTO AL CARRITO
  

  function manejarAgregarCarrito() {

    // Comprobar que exista stock
    if (Number(producto.stock) <= 0) {
      return;
    }

    // Agregar producto al carrito
    agregarAlCarrito(producto);

    // Mostrar mensaje de confirmación
    setMensaje(
      `${producto.nombre} agregado al carrito correctamente.`
    );
  }

 
  // MOSTRAR DETALLE DEL PRODUCTO
 

  return (

    <Container className="py-5">

      {/* VOLVER AL CATÁLOGO */}

      <Link
        to="/catalogo"
        className="btn btn-outline-secondary mb-3"
      >
        ← Volver al catálogo
      </Link>

      <Card className="shadow-sm">

        {/* IMAGEN DEL PRODUCTO */}

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
            ${producto.precio.toLocaleString('es-CL')}
          </h3>

          {/* BOTÓN AGREGAR AL CARRITO */}

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