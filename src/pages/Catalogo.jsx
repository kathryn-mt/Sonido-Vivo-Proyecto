
import { Link, useSearchParams } from 'react-router-dom';
import { useCatalogo } from '../context/CatalogoContext';
import TarjetaProducto from '../components/molecules/TarjetaProducto';

function Catalogo() {
  const { productos } = useCatalogo();
  const [parametros] = useSearchParams();

  // Obtener filtros desde la URL
  const categoria = parametros.get('cat') || '';
  const busqueda = (parametros.get('q') || '')
    .trim()
    .toLowerCase();

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {

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

  return (
    <section className="py-5">

      <h1 className="mb-4">Nuestro Catálogo</h1>

      {categoria && (
        <p>
          Categoría: <strong>{categoria}</strong>
        </p>
      )}

      {busqueda && (
        <p>
          Resultados para: <strong>{busqueda}</strong>
        </p>
      )}

      <p className="text-muted">
        {productosFiltrados.length} productos encontrados
      </p>

      {(categoria || busqueda) && (
        <Link
          to="/catalogo"
          className="btn btn-outline-secondary mb-4"
        >
          Ver todos los productos
        </Link>
      )}

      {productosFiltrados.length === 0 ? (
        <p className="text-center mt-5">
          No se encontraron productos.
        </p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">

          {productosFiltrados.map(producto => (
            <div key={producto.id} className="col">
              <TarjetaProducto producto={producto} />
            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default Catalogo;
