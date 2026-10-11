
import productosIniciales from '../data/productos.json';

const KEY = 'sonido_vivo_productos';

// Leer productos desde localStorage
function leer() {
  const guardados = localStorage.getItem(KEY);

  // Solo cargar productos iniciales la primera vez
  if (guardados === null) {
    localStorage.setItem(
      KEY,
      JSON.stringify(productosIniciales)
    );

    return [...productosIniciales];
  }

  return JSON.parse(guardados);
}

// Guardar productos
function guardar(productos) {
  localStorage.setItem(KEY, JSON.stringify(productos));
}

// READ: listar todos los productos
export function listarProductos() {
  return leer();
}

// READ: buscar un producto por ID
export function obtenerProducto(id) {
  return leer().find(
    producto => producto.id === Number(id)
  ) ?? null;
}

// CREATE: agregar producto
export function crearProducto(datos) {
  const productos = leer();

  const nuevoId = Math.max(
    0,
    ...productos.map(p => p.id)
  ) + 1;

  const nuevoProducto = {
    ...datos,
    id: nuevoId
  };

  guardar([...productos, nuevoProducto]);

  return nuevoProducto;
}

// UPDATE: actualizar producto
export function actualizarProducto(id, cambios) {
  const productos = leer();
  const productoId = Number(id);

  const existe = productos.some(
    p => p.id === productoId
  );

  if (!existe) return null;

  const actualizados = productos.map(p =>
    p.id === productoId
      ? { ...p, ...cambios, id: productoId }
      : p
  );

  guardar(actualizados);

  return actualizados.find(p => p.id === productoId);
}

// DELETE: eliminar producto
export function eliminarProducto(id) {
  const productos = leer();

  const actualizados = productos.filter(
    p => p.id !== Number(id)
  );

  if (actualizados.length === productos.length) {
    return false;
  }

  guardar(actualizados);

  return true;
}
