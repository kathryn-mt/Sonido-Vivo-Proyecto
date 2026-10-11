
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { useCatalogo } from '../context/CatalogoContext';

// Imágenes representativas de cada categoría
const imagenesCategorias = {
  'Guitarras Acústicas': '/assets/yamaha-f310.jpg',
  'Guitarras Eléctricas': '/assets/squier-strat.jpg',
  'Bajos Eléctricos': '/assets/bajo-squier.jpg',
  'Baterías': '/assets/bateria-pearl-roadshow.jpg',
  'Teclados y Pianos': '/assets/teclado-yamaha.jpg',
  'Micrófonos': '/assets/shure-sm58.jpg',
  'Amplificadores': '/assets/marshall-mg40.jpg',
  'Pedales de Efectos': '/assets/boss-ds1.jpg',
  'Accesorios': '/assets/cuerdas-ernieball.jpg',
  'Estudio y Grabación': '/assets/focusrite-solo.jpg'
};

function Categorias() {
  const { productos } = useCatalogo();

  // Obtener categorías sin repetir
  const categorias = [
    ...new Set(productos.map(p => p.categoria))
  ];

  return (
    <section className="categorias-pagina py-5">

      <div className="text-center mb-5">
        <h1 className="fw-bold">
          Explora por Categorías
        </h1>

        <p className="text-muted">
          Encuentra los mejores instrumentos y
          equipos musicales en Sonido Vivo.
        </p>
      </div>

      <Row xs={1} sm={2} lg={3} xl={5} className="g-4">

        {categorias.map(categoria => {

          const cantidad = productos.filter(
            p => p.categoria === categoria
          ).length;

          return (
            <Col key={categoria}>

              <Link
                to={`/catalogo?cat=${encodeURIComponent(categoria)}`}
                className="categoria-tarjeta"
              >

                <div className="categoria-imagen-contenedor">
                  <img
                    src={
                      imagenesCategorias[categoria] ||
                      '/assets/logo.jpg'
                    }
                    alt=""
                    className="categoria-imagen"
                    loading="lazy"
                  />
                </div>

                <h2 className="h5 categoria-nombre">
                  {categoria}
                </h2>

                <p className="categoria-cantidad">
                  {cantidad} {cantidad === 1
                    ? 'producto disponible'
                    : 'productos disponibles'}
                </p>

                <span className="categoria-boton">
                  Ver productos
                </span>

              </Link>

            </Col>
          );
        })}

      </Row>
    </section>
  );
}

export default Categorias;
