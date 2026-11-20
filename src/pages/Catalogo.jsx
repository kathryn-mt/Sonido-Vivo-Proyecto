import { useTituloPagina } from '../hooks/useTituloPagina';
import { Link, useSearchParams } from 'react-router-dom';
import { Alert, Spinner } from 'react-bootstrap';

import { useCatalogo } from '../context/CatalogoContext';
import TarjetaProducto from '../components/molecules/TarjetaProducto';


// CATÁLOGO DE PRODUCTOS - KATY


function Catalogo() {


  // OBTENER PRODUCTOS DEL CONTEXTO


  const catalogo = useCatalogo();

  const productos = catalogo.productos;
  const cargando = catalogo.cargando;
  const error = catalogo.error;
  const refrescarProductos = catalogo.refrescarProductos;


  // OBTENER PARÁMETROS DE BÚSQUEDA


  const estadoParametros = useSearchParams();

  const parametros = estadoParametros[0];

  const categoria = parametros.get('cat') || '';

  const busqueda = (parametros.get('q') || '')
    .trim()
    .toLowerCase();


  // TÍTULO DE LA PÁGINA


  const tituloPagina = categoria
    ? `Catálogo - ${categoria}`
    : 'Catálogo';

  useTituloPagina(tituloPagina);

  // FILTRAR PRODUCTOS


  const productosFiltrados = productos.filter(function (producto) {

    const coincideCategoria =
      !categoria || producto.categoria === categoria;

    const textoProducto = [
      producto.nombre,
      producto.marca,
      producto.modelo,
      producto.categoria
    ].join(' ').toLowerCase();

    const coincideBusqueda =
      !busqueda || textoProducto.includes(busqueda);

    return coincideCategoria && coincideBusqueda;
  });


  // REINTENTAR CARGA


  async function reintentarCarga() {

    try {

      await refrescarProductos();

    } catch (errorPeticion) {

      console.error(
        'No fue posible recargar el catálogo:',
        errorPeticion.message
      );
    }
  }


  // MOSTRAR CATÁLOGO


  return (

    <section className="py-5">

      <h1 className="mb-4">
        Nuestro Catálogo
      </h1>

      {/* CATEGORÍA SELECCIONADA */}

      {categoria && (
        <p>
          Categoría: <strong>{categoria}</strong>
        </p>
      )}

      {/* BÚSQUEDA */}

      {busqueda && (
        <p>
          Resultados para: <strong>{busqueda}</strong>
        </p>
      )}

      {/* ESTADO DE CARGA */}

      {cargando && (

        <div className="text-center py-5" role="status">

          <Spinner
            animation="border"
            variant="primary"
          />

          <p className="mt-3">
            Cargando productos...
          </p>

        </div>

      )}

      {/* ERROR DE CONEXIÓN */}

      {!cargando && error && (

        <Alert variant="danger" role="alert">

          <p>{error}</p>

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={reintentarCarga}
          >
            Reintentar
          </button>

        </Alert>

      )}

      {/* PRODUCTOS */}

      {!cargando && !error && (

        <>

          <p className="text-muted">
            {productosFiltrados.length} productos encontrados
          </p>

          {/* QUITAR FILTROS */}

          {(categoria || busqueda) && (

            <Link
              to="/catalogo"
              className="btn btn-outline-secondary mb-4"
            >
              Ver todos los productos
            </Link>

          )}

          {/* RESULTADOS */}

          {productosFiltrados.length === 0 ? (

            <p className="text-center mt-5">
              No se encontraron productos.
            </p>

          ) : (

            <div className="row row-cols-1 row-cols-md-3 g-4">

              {productosFiltrados.map(function (producto) {

                return (

                  <div
                    key={producto.id}
                    className="col"
                  >

                    <TarjetaProducto producto={producto} />

                  </div>

                );
              })}

            </div>

          )}

        </>

      )}

    </section>
  );
}

export default Catalogo;