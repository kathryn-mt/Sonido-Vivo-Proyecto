import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import {
  listarProductos,
  crearProducto as crearProductoService,
  actualizarProducto as actualizarProductoService,
  eliminarProducto as eliminarProductoService
} from '../services/productoService';


// CONTEXTO DEL CATÁLOGO - KATY


const CatalogoContext = createContext(null);


// PROVEEDOR DEL CATÁLOGO


export function CatalogoProvider(props) {

  // ESTADO DE LOS PRODUCTOS
  const estadoProductos = useState([]);

  const productos = estadoProductos[0];
  const setProductos = estadoProductos[1];

  // ESTADO DE CARGA
  const estadoCargando = useState(true);

  const cargando = estadoCargando[0];
  const setCargando = estadoCargando[1];

  // ESTADO DE ERROR
  const estadoError = useState('');

  const error = estadoError[0];
  const setError = estadoError[1];


  // CARGAR PRODUCTOS DESDE POSTGRESQL


  async function refrescarProductos() {

    setCargando(true);
    setError('');

    try {

      const productosRecibidos = await listarProductos();

      setProductos(productosRecibidos);

      return productosRecibidos;

    } catch (errorPeticion) {

      setError(
        'No fue posible cargar los productos. Intenta nuevamente.'
      );

      throw errorPeticion;

    } finally {

      setCargando(false);
    }
  }


  // CARGAR PRODUCTOS AL ABRIR LA APLICACIÓN


  useEffect(function () {

    async function cargarCatalogo() {

      try {

        await refrescarProductos();

      } catch (errorPeticion) {

        console.error(
          'Error al cargar el catálogo:',
          errorPeticion.message
        );
      }
    }

    cargarCatalogo();

  }, []);


  // CREAR PRODUCTO


  async function crearProducto(datos) {

    setError('');

    try {

      const nuevo = await crearProductoService(datos);

      await refrescarProductos();

      return nuevo;

    } catch (errorPeticion) {

      setError('No fue posible registrar el producto.');

      throw errorPeticion;
    }
  }


  // ACTUALIZAR PRODUCTO


  async function actualizarProducto(id, cambios) {

    setError('');

    try {

      const actualizado = await actualizarProductoService(
        id,
        cambios
      );

      await refrescarProductos();

      return actualizado;

    } catch (errorPeticion) {

      setError('No fue posible actualizar el producto.');

      throw errorPeticion;
    }
  }

  // ELIMINAR PRODUCTO


  async function eliminarProducto(id) {

    setError('');

    try {

      const eliminado = await eliminarProductoService(id);

      await refrescarProductos();

      return eliminado;

    } catch (errorPeticion) {

      setError('No fue posible eliminar el producto.');

      throw errorPeticion;
    }
  }


  // COMPARTIR DATOS Y FUNCIONES


  return (

    <CatalogoContext.Provider
      value={{
        productos: productos,
        cargando: cargando,
        error: error,
        crearProducto: crearProducto,
        actualizarProducto: actualizarProducto,
        eliminarProducto: eliminarProducto,
        refrescarProductos: refrescarProductos
      }}
    >

      {props.children}

    </CatalogoContext.Provider>
  );
}


// HOOK PARA UTILIZAR EL CATÁLOGO


export function useCatalogo() {

  const contexto = useContext(CatalogoContext);

  if (!contexto) {

    throw new Error(
      'useCatalogo debe utilizarse dentro de CatalogoProvider'
    );
  }

  return contexto;
}