
// DTO DE PRODUCTOS - KATY


// Preparar un producto recibido del backend
export function normalizarProducto(producto) {

  return {
    id: Number(producto.id),
    codigo: producto.codigo,
    nombre: producto.nombre,
    marca: producto.marca,
    modelo: producto.modelo,
    categoria: producto.categoria,
    precio: Number(producto.precio),

    precioAnterior:
      producto.precioAnterior === null ||
      producto.precioAnterior === undefined
        ? null
        : Number(producto.precioAnterior),

    stock: Number(producto.stock),
    descripcion: producto.descripcion ?? '',
    imagen: producto.imagen ?? '',
    activo: producto.activo
  };
}