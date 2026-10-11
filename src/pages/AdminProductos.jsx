import { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

import { useCatalogo } from '../context/CatalogoContext';
import FormularioProducto from '../components/organisms/FormularioProducto';
import TablaProductos from '../components/organisms/TablaProductos';

function AdminProductos() {
  const {
    productos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
  } = useCatalogo();

  const [idEdicion, setIdEdicion] = useState(null);
  const [idEliminar, setIdEliminar] = useState(null);
  const [version, setVersion] = useState(0);
  const [mensaje, setMensaje] = useState('');

  const productoEdicion = productos.find(
    p => p.id === idEdicion
  ) ?? null;

  const productoEliminar = productos.find(
    p => p.id === idEliminar
  ) ?? null;

  function limpiarFormulario() {
    setIdEdicion(null);
    setVersion(v => v + 1);
  }

  function guardarProducto(datos) {
    if (idEdicion !== null) {
      const actualizado = actualizarProducto(idEdicion, datos);

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

  function confirmarEliminacion() {
    if (idEliminar === null) return;

    const eliminado = eliminarProducto(idEliminar);

    if (idEdicion === idEliminar) {
      limpiarFormulario();
    }

    setIdEliminar(null);

    setMensaje(
      eliminado
        ? 'Producto eliminado correctamente.'
        : 'No se encontró el producto.'
    );
  }

  return (
    <section className="py-4">
      <h1>Administración de Productos</h1>
      <p className="text-muted">
        Gestión del inventario de Sonido Vivo
      </p>

      {mensaje && (
        <p role="status" className="text-success fw-semibold">
          {mensaje}
        </p>
      )}

      <Row className="g-4">
        <Col lg={5}>
          <FormularioProducto
            key={`${idEdicion ?? 'nuevo'}-${version}`}
            producto={productoEdicion}
            productos={productos}
            onGuardar={guardarProducto}
            onCancelar={limpiarFormulario}
          />
        </Col>

        <Col lg={7}>
          <h2 className="h4 mb-3">
            Inventario ({productos.length} productos)
          </h2>

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
                  onClick={() => setIdEliminar(null)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <TablaProductos
            productos={productos}
            onEditar={(id) => {
              setIdEdicion(id);
              setMensaje('');
            }}
            onEliminar={(id) => {
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
