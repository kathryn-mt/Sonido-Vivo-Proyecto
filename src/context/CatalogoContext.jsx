import { createContext, useContext, useState, useEffect } from 'react';
import { listarProductos } from '../services/productoService';
import productosIniciales from '../data/productos.json';

const CatalogoContext = createContext();

export const CatalogoProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const guardados = listarProductos();
    if (guardados.length === 0) {
      localStorage.setItem('sonido_vivo_productos', JSON.stringify(productosIniciales));
      setProductos(productosIniciales);
    } else {
      setProductos(guardados);
    }
  }, []);

  return (
    <CatalogoContext.Provider value={{ productos, setProductos }}>
      {children}
    </CatalogoContext.Provider>
  );
};

export const useCatalogo = () => useContext(CatalogoContext);