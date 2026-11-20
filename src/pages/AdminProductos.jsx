import { useTituloPagina } from '../hooks/useTituloPagina';
import { useState } from 'react';
import { Row, Col, Button, Alert, Spinner } from 'react-bootstrap';

import { useCatalogo } from '../context/CatalogoContext';
import FormularioProducto from '../components/organisms/FormularioProducto';
import TablaProductos from '../components/organisms/TablaProductos';


// ADMINISTRACIÓN DE PRODUCTOS - KATY

function AdminProductos() {

  useTituloPagina('Administración de Productos');


  // OBTENER DATOS DEL CATÁLOGO


  const catalogo = useCatalogo();

  const productos = catalogo.productos;
  const cargando = catalogo.cargando;
  const errorCatalogo = catalogo.error;

  const crearProducto = catalogo.crearProducto;
  const actualizarProducto = catalogo.actualizarProducto;
  const eliminarProducto = catalogo.eliminarProducto;


  // ESTADOS SIN DESESTRUCTURACIÓN


  const estadoEdicion = useState(null);

  const idEdicion = estadoEdicion[0];
  const setIdEdicion = estadoEdicion[1];

  const estadoEliminar = useState(null);

  const idEliminar = estadoEliminar[0];
  const setIdEliminar = estadoEliminar[1];

  const estadoVersion = useState(0);

  const version = estadoVersion[0];
  const setVersion = estadoVersion[1];

  const estadoMensaje = useState('');

  const mensaje = estadoMensaje[0];
  const setMensaje = estadoMensaje[1];

  const estadoTipoMensaje = useState('success');

  const tipoMensaje = estadoTipoMensaje[0];
  const setTipoMensaje = estadoTipoMensaje[1];

  const estadoProcesando = useState(false);

  const procesando = estadoProcesando[0];
  const setProcesando = estadoProcesando[1];


  // BUSCAR PRODUCTOS

  const productoEdicion = productos.find(function (producto) {
    return producto.id === idEdicion;
  }) || null;

  const productoEliminar = productos.find(function (producto) {
    return producto.id === idEliminar;
  }) || null;


  // MOSTRAR MENSAJES


  function mostrarExito(texto) {

    setTipoMensaje('success');
    setMensaje(texto);
  }

  function mostrarError(texto) {

    setTipoMensaje('danger');
    setMensaje(texto);
  }


  // INTERPRETAR ERRORES HTTP


  function obtenerMensajeError(errorPeticion) {

    const estado = errorPeticion.response?.status;

    const mensajeServidor =
      errorPeticion.response?.data?.mensaje;

    if (estado === 400) {
      return mensajeServidor || 'Los datos del producto no son válidos.';
    }

    if (estado === 401) {
      return 'Debes iniciar sesión para administrar productos.';
    }

    if (estado === 403) {
      return 'No tienes permisos para realizar esta operación.';
    }

    if (estado === 404) {
      return 'No se encontró el producto.';
    }

    if (estado === 409) {
      return mensajeServidor || 'Existe un conflicto con el producto.';
    }

    return mensajeServidor ||
      'No fue posible conectar con el servidor.';
  }


  // LIMPIAR FORMULARIO


  function limpiarFormulario() {

    setIdEdicion(null);

    setVersion(function (valorAnterior) {
      return valorAnterior + 1;
    });
  }


  // CREAR O ACTUALIZAR PRODUCTO


  async function guardarProducto(datos) {

    if (procesando) {
      return;
    }

    setProcesando(true);
    setMensaje('');

    try {

      if (idEdicion !== null) {

        await actualizarProducto(idEdicion, datos);

        mostrarExito(
          'Producto actualizado correctamente.'
        );

      } else {

        await crearProducto(datos);

        mostrarExito(
          'Producto agregado correctamente.'
        );
      }

      limpiarFormulario();

    } catch (errorPeticion) {

      mostrarError(
        obtenerMensajeError(errorPeticion)
      );

    } finally {

      setProcesando(false);
    }
  }


  // ELIMINAR PRODUCTO


  async function confirmarEliminacion() {

    if (idEliminar === null || procesando) {
      return;
    }

    setProcesando(true);
    setMensaje('');

    try {

      await eliminarProducto(idEliminar);

      if (idEdicion === idEliminar) {
        limpiarFormulario();
      }

      setIdEliminar(null);

      mostrarExito(
        'Producto eliminado correctamente.'
      );

    } catch (errorPeticion) {

      mostrarError(
        obtenerMensajeError(errorPeticion)
      );

    } finally {

      setProcesando(false);
    }
  }


  // MOSTRAR PÁGINA


  return (

    <section className="py-4">

      <h1>Administración de Productos</h1>

      <p className="text-muted">
        Gestión del inventario de Sonido Vivo
      </p>

      {/* MENSAJES DE ÉXITO O ERROR */}

      {mensaje && (

        <Alert variant={tipoMensaje} role="status">
          {mensaje}
        </Alert>

      )}

      {/* ERROR AL CARGAR EL CATÁLOGO */}

      {errorCatalogo && !mensaje && (

        <Alert variant="danger" role="alert">
          {errorCatalogo}
        </Alert>

      )}

      {/* INDICADOR DE CARGA */}

      {(cargando || procesando) && (

        <div className="mb-3">

          <Spinner
            animation="border"
            size="sm"
            className="me-2"
          />

          <span>
            {procesando
              ? 'Guardando cambios...'
              : 'Cargando productos...'}
          </span>

        </div>

      )}

      <Row className="g-4">

        {/* FORMULARIO */}

        <Col lg={5}>

          <FormularioProducto
            key={`${idEdicion ?? 'nuevo'}-${version}`}
            producto={productoEdicion}
            productos={productos}
            onGuardar={guardarProducto}
            onCancelar={limpiarFormulario}
          />

        </Col>

        {/* INVENTARIO */}

        <Col lg={7}>

          <h2 className="h4 mb-3">
            Inventario ({productos.length} productos)
          </h2>

          {/* CONFIRMAR ELIMINACIÓN */}

          {productoEliminar && (

            <div className="border rounded p-3 mb-3 bg-light">

              <p className="fw-semibold">
                ¿Deseas eliminar {productoEliminar.nombre}?
              </p>

              <div className="d-flex gap-2">

                <Button
                  variant="danger"
                  disabled={procesando}
                  onClick={confirmarEliminacion}
                >
                  Sí, eliminar
                </Button>

                <Button
                  variant="secondary"
                  disabled={procesando}
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