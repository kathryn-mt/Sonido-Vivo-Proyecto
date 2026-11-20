import api from './api';
import { normalizarProducto } from '../dto/producto.dto';


// CRUD DE PRODUCTOS CON AXIOS - KATY


// LISTAR PRODUCTOS
export async function listarProductos() {

  const respuesta = await api.get('/v1/productos');

  if (!Array.isArray(respuesta.data)) {
    throw new Error('El servidor no devolvió una lista de productos.');
  }

  return respuesta.data.map(function (producto) {
    return normalizarProducto(producto);
  });
}

// OBTENER PRODUCTO POR ID
export async function obtenerProducto(id) {

  const respuesta = await api.get(
    `/v1/productos/${Number(id)}`
  );

  return normalizarProducto(respuesta.data);
}

// CREAR PRODUCTO
export async function crearProducto(datos) {

  const respuesta = await api.post(
    '/v1/productos',
    datos
  );

  return normalizarProducto(respuesta.data);
}

// ACTUALIZAR PRODUCTO
export async function actualizarProducto(id, datos) {

  const respuesta = await api.put(
    `/v1/productos/${Number(id)}`,
    datos
  );

  return normalizarProducto(respuesta.data);
}

// ELIMINAR PRODUCTO
export async function eliminarProducto(id) {

  await api.delete(
    `/v1/productos/${Number(id)}`
  );

  return true;
}


// COMPATIBILIDAD TEMPORAL CON PEDIDOS


export function descontarStock(productosComprados) {

  if (
    !Array.isArray(productosComprados) ||
    productosComprados.length === 0
  ) {
    throw new Error('No hay productos para descontar.');
  }

  const guardados = localStorage.getItem(
    'sonido_vivo_productos'
  );

  const productos = JSON.parse(guardados || '[]');

  const cantidades = new Map();

  // Agrupar cantidades
  for (const item of productosComprados) {

    const id = Number(item.id);
    const cantidad = Number(item.cantidad);

    if (
      !Number.isInteger(id) ||
      !Number.isInteger(cantidad) ||
      cantidad <= 0
    ) {
      throw new Error(
        'La compra contiene productos o cantidades inválidas.'
      );
    }

    const anterior = cantidades.get(id) || 0;

    cantidades.set(id, anterior + cantidad);
  }

  // Verificar existencias
  cantidades.forEach(function (cantidad, id) {

    const producto = productos.find(function (actual) {
      return actual.id === id;
    });

    if (!producto) {
      throw new Error(
        `No se encontró el producto ${id}.`
      );
    }

    if (Number(producto.stock) < cantidad) {
      throw new Error(
        `Stock insuficiente para ${producto.nombre}.`
      );
    }
  });

  // Descontar inventario local
  const actualizados = productos.map(function (producto) {

    const nuevo = Object.assign({}, producto);

    nuevo.stock =
      Number(producto.stock) -
      (cantidades.get(producto.id) || 0);

    return nuevo;
  });

  localStorage.setItem(
    'sonido_vivo_productos',
    JSON.stringify(actualizados)
  );

  return actualizados;
}