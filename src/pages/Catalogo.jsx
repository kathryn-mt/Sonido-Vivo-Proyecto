import TarjetaProducto from '../components/molecules/TarjetaProducto'; 
import { useCatalogo } from '../context/CatalogoContext';

function Catalogo() {
  
  const { productos } = useCatalogo();
  if (!productos || productos.length === 0) {
    return <p className="text-center mt-5">Cargando productos...</p>;
  }

  return (
    <section>
      <h2 className="mb-4">Nuestro Catálogo</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {productos.map((prod) => (
          <div key={prod.id} className="col">
            <TarjetaProducto producto={prod} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Catalogo;