import { useTituloPagina } from '../hooks/useTituloPagina';
import { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

import { useCatalogo } from '../context/CatalogoContext';
import FormularioProducto from '../components/organisms/FormularioProducto';
import TablaProductos from '../components/organisms/TablaProductos';

function AdminProductos() {

  useTituloPagina('Administración de Productos');

 
  // OBTENER FUNCIONES DEL CATÁLOGO
 

  const catalogo = useCatalogo();

  const productos = catalogo.productos;
  const crearProducto = catalogo.crearProducto;
  const actualizarProducto = catalogo.actualizarProducto;
  const eliminarProducto = catalogo.eliminarProducto;


  // ESTADOS SIN DESESTRUCTURACIÓN


  // Estado para editar productos
  const estadoEdicion = useState(null);

  const idEdicion = estadoEdicion[0];
  const setIdEdicion = estadoEdicion[1];

  // Estado para eliminar productos
  const estadoEliminar = useState(null);

  const idEliminar = estadoEliminar[0];
  const setIdEliminar = estadoEliminar[1];

  // Estado para actualizar el formulario
  const estadoVersion = useState(0);

  const version = estadoVersion[0];
  const setVersion = estadoVersion[1];

  // Estado para mostrar mensajes
  const estadoMensaje = useState('');

  const mensaje = estadoMensaje[0];
  const setMensaje = estadoMensaje[1];

 
  // BUSCAR PRODUCTOS
 

  const productoEdicion = productos.find(function (producto) {
    return producto.id === idEdicion;
  }) ?? null;

  const productoEliminar = productos.find(function (producto) {
    return producto.id === idEliminar;
  }) ?? null;

  
  // LIMPIAR FORMULARIO
  

  function limpiarFormulario() {

    setIdEdicion(null);

    setVersion(function (valorAnterior) {
      return valorAnterior + 1;
    });
  }

 
  // CREAR O ACTUALIZAR PRODUCTO


  function guardarProducto(datos) {

    if (idEdicion !== null) {

      const actualizado = actualizarProducto(
        idEdicion,
        datos
      );

      if (!actualizado) {
        setMensaje('No se encontró el producto para editar.');
        return;
      }

      setMensaje('Producto actualizado correctamente.');

    } else {

      crearProducto(datos);

      setMensaje('Producto agregado correctamente.');
    }

    limpiarFormulario();
  }

  // CONFIRMAR ELIMINACIÓN


  function confirmarEliminacion() {

    if (idEliminar === null) {
      return;
    }

    const eliminado = eliminarProducto(idEliminar);

    if (idEdicion === idEliminar) {
      limpiarFormulario();
    }

    setIdEliminar(null);

    if (eliminado) {
      setMensaje('Producto eliminado correctamente.');
    } else {
      setMensaje('No se encontró el producto.');
    }
  }


  // MOSTRAR PÁGINA


  return (

    <section className="py-4">

      <h1>Administración de Productos</h1>

      <p className="text-muted">
        Gestión del inventario de Sonido Vivo
      </p>

      {/* Mensajes de confirmación */}
      {mensaje && (
        <p
          role="status"
          className="text-success fw-semibold"
        >
          {mensaje}
        </p>
      )}

      <Row className="g-4">

        {/* Formulario para crear o editar */}
        <Col lg={5}>

          <FormularioProducto
            key={`${idEdicion ?? 'nuevo'}-${version}`}
            producto={productoEdicion}
            productos={productos}
            onGuardar={guardarProducto}
            onCancelar={limpiarFormulario}
          />

        </Col>

        {/* Tabla de productos */}
        <Col lg={7}>

          <h2 className="h4 mb-3">
            Inventario ({productos.length} productos)
          </h2>

          {/* Confirmación de eliminación */}
          {productoEliminar && (

            <div className="border rounded p-3 mb-3 bg-light">

              <p className="fw-semibold">
                ¿Deseas eliminar {productoEliminar.nombre}?
              </p>

              <div className="d-flex gap-2">

                <Button
                  variant="danger"
                  onClick={confirmarEliminacion}
                >
                  Sí, eliminar
                </Button>

                <Button
                  variant="secondary"
                  onClick={function () {
                    setIdEliminar(null);
                  }}
                >
                  Cancelar
                </Button>

              </div>

            </div>

          )}

          <TablaProductos
            productos={productos}
            onEditar={function (id) {
              setIdEdicion(id);
              setMensaje('');
            }}
            onEliminar={function (id) {
              setIdEliminar(id);
              setMensaje('');
            }}
          />

        </Col>

      </Row>

    </section>
  );
}

export default AdminProductos;