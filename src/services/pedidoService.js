
const CLAVE = 'sonido_vivo_pedidos';

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
