import productosIniciales from '../data/productos.json';

const KEY = 'sonido_vivo_productos';


// LEER PRODUCTOS


function leer() {
  const guardados = localStorage.getItem(KEY);

  // Cargar productos iniciales solo la primera vez
  if (guardados === null) {
    localStorage.setItem(
      KEY,
      JSON.stringify(productosIniciales)
    );

    return productosIniciales.slice();
  }

  return JSON.parse(guardados);
}


// GUARDAR PRODUCTOS


function guardar(productos) {
  localStorage.setItem(
    KEY,
    JSON.stringify(productos)
  );
}


// READ: LISTAR PRODUCTOS


export function listarProductos() {
  return leer();
}


// READ: OBTENER PRODUCTO POR ID


export function obtenerProducto(id) {
  const productos = leer();

  const producto = productos.find(function (productoActual) {
    return productoActual.id === Number(id);
  });

  return producto || null;
}


// CREATE: CREAR PRODUCTO


export function crearProducto(datos) {
  const productos = leer();

  let nuevoId = 1;

  // Buscar el ID más alto
  for (const producto of productos) {
    if (Number(producto.id) >= nuevoId) {
      nuevoId = Number(producto.id) + 1;
    }
  }

  // Crear producto sin utilizar ...
  const nuevoProducto = Object.assign({}, datos);

  nuevoProducto.id = nuevoId;

  productos.push(nuevoProducto);

  guardar(productos);

  return nuevoProducto;
}


// UPDATE: ACTUALIZAR PRODUCTO


export function actualizarProducto(id, cambios) {
  const productos = leer();

  const productoId = Number(id);

  const producto = productos.find(function (productoActual) {
    return productoActual.id === productoId;
  });

  if (!producto) {
    return null;
  }

  // Aplicar cambios sin utilizar ...
  Object.assign(producto, cambios);

  // Mantener el ID original
  producto.id = productoId;

  guardar(productos);

  return producto;
}


// DELETE: ELIMINAR PRODUCTO


export function eliminarProducto(id) {
  const productos = leer();

  const productoId = Number(id);

  const actualizados = productos.filter(function (producto) {
    return producto.id !== productoId;
  });

  if (actualizados.length === productos.length) {
    return false;
  }

  guardar(actualizados);

  return true;
}


// DESCONTAR STOCK


export function descontarStock(productosComprados) {

  // Validar que existan productos para comprar
  if (
    !Array.isArray(productosComprados) ||
    productosComprados.length === 0
  ) {
    throw new Error(
      'No hay productos para descontar.'
    );
  }

  const productos = listarProductos();

  const cantidades = new Map();

 
  // AGRUPAR CANTIDADES
 

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

    const cantidadAnterior = cantidades.get(id) || 0;

    cantidades.set(
      id,
      cantidadAnterior + cantidad
    );
  }

 
  // VERIFICAR STOCK
  

  cantidades.forEach(function (cantidad, id) {

    const producto = productos.find(function (productoActual) {
      return productoActual.id === id;
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

  
  // ACTUALIZAR STOCK
  

  const productosActualizados = productos.map(function (producto) {

    const productoActualizado = Object.assign(
      {},
      producto
    );

    const cantidadDescontar = cantidades.get(producto.id) || 0;

    productoActualizado.stock =
      Number(producto.stock) - cantidadDescontar;

    return productoActualizado;
  });

  // Guardar inventario actualizado
  guardar(productosActualizados);

  return productosActualizados;
}