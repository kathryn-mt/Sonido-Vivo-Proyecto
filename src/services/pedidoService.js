import { listarProductos, descontarStock } from './productoService';
const CLAVE = 'sonido_vivo_pedidos';

// Guardar un pedido nuevo
export function registrarPedido(datos) {
  const guardados = JSON.parse(
    localStorage.getItem(CLAVE) || '[]'
  );

  if (!Array.isArray(guardados)) {
    throw new Error('No se pudieron leer los pedidos.');
  }

  const pedido = {
    ...datos,
    id: `SV-${Date.now()}`,
    fecha: new Date().toISOString(),
    estado: 'Pendiente'
  };

  localStorage.setItem(
    CLAVE,
    JSON.stringify([...guardados, pedido])
  );

  return pedido;
}

// Recuperar los pedidos guardados
export function listarPedidos() {
  const guardados = JSON.parse(
    localStorage.getItem(CLAVE) || '[]'
  );

  if (!Array.isArray(guardados)) {
    throw new Error('No se pudieron leer los pedidos.');
  }

  return guardados;
}

export function actualizarEstadoPedido(id, nuevoEstado) {
  const estadosPermitidos = [
    'Pendiente',
    'En preparación',
    'Despachado',
    'Entregado'
  ];

  // Comprobar que el estado sea válido
  if (!estadosPermitidos.includes(nuevoEstado)) {
    throw new Error('Estado de pedido no válido.');
  }

  // Recuperar todos los pedidos guardados
  const pedidos = listarPedidos();

  let pedidoActualizado = null;

  // Buscar el pedido y cambiar su estado
  const pedidosActualizados = pedidos.map(pedido => {
    if (pedido.id === id) {
      pedidoActualizado = {
        ...pedido,
        estado: nuevoEstado
      };

      return pedidoActualizado;
    }

    return pedido;
  });

  // Si no encontramos el pedido
  if (!pedidoActualizado) {
    return null;
  }

  // Guardar la lista con el nuevo estado
  localStorage.setItem(
    CLAVE,
    JSON.stringify(pedidosActualizados)
  );

  return pedidoActualizado;
}

export function registrarPedidoConStock(datos) {

  // Comprobar que los pedidos guardados se puedan leer
  listarPedidos();

  // Guardar una copia del inventario actual
  const inventarioAnterior = JSON.stringify(
    listarProductos()
  );

  let stockDescontado = false;

  try {

    // Primero comprobar y descontar las existencias
    descontarStock(datos.productos);

    stockDescontado = true;

    // Registrar el pedido una vez actualizado el stock
    const pedido = registrarPedido(datos);

    return pedido;

  } catch (error) {

    // Si el pedido falló después del descuento,
    // intentar recuperar el inventario anterior
    if (stockDescontado) {
      try {
        localStorage.setItem(
          'sonido_vivo_productos',
          inventarioAnterior
        );
      } catch {
        throw new Error(
          'No se pudo registrar el pedido ni restaurar el inventario. Revisa los datos guardados.'
        );
      }
    }

    throw error;
  }
}