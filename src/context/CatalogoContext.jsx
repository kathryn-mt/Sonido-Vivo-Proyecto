
import { createContext, useContext, useState } from 'react';
import productosIniciales from '../data/productos.json';

import {
  listarProductos,
  crearProducto as crearProductoService,
  actualizarProducto as actualizarProductoService,
  eliminarProducto as eliminarProductoService
} from '../services/productoService';

// Crear el contexto
const CatalogoContext = createContext(null);

const CLAVE = 'sonido_vivo_productos';

// Proveedor del catálogo
export function CatalogoProvider({ children }) {

  const [productos, setProductos] = useState(() => {

    // Cargar productos iniciales solo la primera vez
    if (localStorage.getItem(CLAVE) === null) {
      localStorage.setItem(
        CLAVE,
        JSON.stringify(productosIniciales)
      );
    }

    return listarProductos();
  });
  // Actualizar el catalogo despues de una compra
  function refrescarProductos() {
    setProductos(listarProductos());
  }
  // CREATE: Agregar producto
  function crearProducto(datos) {
    const nuevo = crearProductoService(datos);

    setProductos(listarProductos());

    return nuevo;
  }

  // UPDATE: Editar producto
  function actualizarProducto(id, cambios) {
    const actualizado = actualizarProductoService(
      id,
      cambios
    );

    setProductos(listarProductos());

    return actualizado;
  }

  // DELETE: Eliminar producto
  function eliminarProducto(id) {
    const existe = listarProductos().some(
      p => p.id === Number(id)
    );

    if (!existe) {
      return false;
    }

    eliminarProductoService(Number(id));

    setProductos(listarProductos());

    return true;
  }

  return (
    <CatalogoContext.Provider
      value={{
        productos,
        crearProducto,
        actualizarProducto,
        eliminarProducto,
        refrescarProductos
      }}
    >
      {children}
    </CatalogoContext.Provider>
  );
}

// Hook para utilizar el catálogo
export function useCatalogo() {
  const contexto = useContext(CatalogoContext);

  if (!contexto) {
    throw new Error(
      'useCatalogo debe utilizarse dentro de CatalogoProvider'
    );
  }

  return contexto;
}
