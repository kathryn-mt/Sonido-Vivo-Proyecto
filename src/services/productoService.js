const KEY = 'sonido_vivo_productos';

export const listarProductos = () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const crearProducto = (producto) => {
  const productos = listarProductos();
  const nuevo = { ...producto, id: Date.now() };
  productos.push(nuevo);
  localStorage.setItem(KEY, JSON.stringify(productos));
  return nuevo;
};

export const actualizarProducto = (id, datos) => {
  let productos = listarProductos();
  const idx = productos.findIndex(p => p.id === id);
  if (idx !== -1) {
    productos[idx] = { ...productos[idx], ...datos };
    localStorage.setItem(KEY, JSON.stringify(productos));
    return productos[idx];
  }
  return null;
};

export const eliminarProducto = (id) => {
  const productos = listarProductos().filter(p => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(productos));
};