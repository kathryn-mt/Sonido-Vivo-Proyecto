
import { useState } from 'react';
import {
  Table,
  Button,
  Form,
  Alert
} from 'react-bootstrap';

import { useTituloPagina } from '../hooks/useTituloPagina';

import {
  listarPedidos,
  actualizarEstadoPedido
} from '../services/pedidoService';

// Estados que puede tener cada pedido
const estados = [
  'Pendiente',
  'En preparación',
  'Despachado',
  'Entregado'
];

function AdminPedidos() {
  useTituloPagina('Administración de pedidos');

  // Guardar los pedidos en el estado de React
  const [pedidos, setPedidos] = useState(() => {
    try {
      return listarPedidos();
    } catch {
      return [];
    }
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Mostrar precios en pesos chilenos
  function formatearPrecio(precio) {
    return '$' + Number(precio).toLocaleString('es-CL');
  }

  // Volver a consultar los pedidos guardados
  function cargarPedidos() {
    try {
      const pedidosGuardados = listarPedidos();

      setPedidos(pedidosGuardados);
      setMensaje('');
      setError('');
    } catch {
      setError('No se pudieron cargar los pedidos.');
    }
  }

  // Modificar el estado de un pedido
  function cambiarEstado(id, nuevoEstado) {
    setMensaje('');
    setError('');

    try {
      const actualizado = actualizarEstadoPedido(
        id,
        nuevoEstado
      );

      if (!actualizado) {
        setError('No se encontró el pedido.');
        return;
      }

      // Mostrar los pedidos con sus estados actualizados
      setPedidos(listarPedidos());

      setMensaje(
        `El pedido ${id} se actualizó correctamente.`
      );

    } catch {
      setError('No se pudo actualizar el estado.');
    }
  }

  return (
    <section className="py-5">

      <h1 className="fw-bold mb-3">
        Administración de pedidos
      </h1>

      <p className="text-muted mb-4">
        Consulta los pedidos registrados
        y administra su estado.
      </p>

      <Button
        variant="outline-primary"
        onClick={cargarPedidos}
        className="mb-4"
      >
        Actualizar pedidos
      </Button>

      {/* Mostrar mensajes de confirmación */}
      {mensaje && (
        <Alert variant="success" role="status">
          {mensaje}
        </Alert>
      )}

      {/* Mostrar mensajes de error */}
      {error && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}

      {/* Comprobar si existen pedidos */}
      {pedidos.length === 0 ? (

        <Alert variant="info">
          No hay pedidos registrados en este navegador.
        </Alert>

      ) : (

        <Table
          striped
          bordered
          hover
          responsive
          className="align-middle"
        >

          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>

            {pedidos.map(pedido => (

              <tr key={pedido.id}>

                <td>
                  {pedido.id}
                </td>

                <td>
                  {pedido.cliente?.nombre || 'Sin nombre'}
                </td>

                <td>
                  {new Date(
                    pedido.fecha
                  ).toLocaleDateString('es-CL')}
                </td>

                <td>
                  {(pedido.productos || []).map(
                    producto => (

                      <div key={producto.id}>
                        {producto.nombre}
                        {' '}x{producto.cantidad}
                      </div>

                    )
                  )}
                </td>

                <td>
                  {formatearPrecio(
                    pedido.totalProductos
                  )}
                </td>

                <td>
                  <Form.Select
                    size="sm"
                    aria-label={`Estado del pedido ${pedido.id}`}
                    value={pedido.estado}
                    onChange={(e) =>
                      cambiarEstado(
                        pedido.id,
                        e.target.value
                      )
                    }
                  >

                    {estados.map(estado => (

                      <option
                        key={estado}
                        value={estado}
                      >
                        {estado}
                      </option>

                    ))}

                  </Form.Select>
                </td>

              </tr>

            ))}

          </tbody>

        </Table>

      )}

      <Alert variant="info" className="mt-4">
        Panel de demostración: los pedidos se guardan
        solamente en este navegador.
        Todavía no existe autenticación de administrador.
      </Alert>

    </section>
  );
}

export default AdminPedidos;
