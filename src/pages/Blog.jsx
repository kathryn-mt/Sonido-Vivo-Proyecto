
import { Row, Col } from 'react-bootstrap';
import { useTituloPagina } from '../hooks/useTituloPagina';

import TarjetaArticulo from '../components/molecules/TarjetaArticulo';
import { articulosBlog } from '../data/articulosBlog';

function Blog() {
  useTituloPagina('Blog');

  return (
    <section className="py-5">

      <h1 className="text-center fw-bold mb-3">
        Blog Sonido Vivo
      </h1>

      <p className="text-center text-muted mb-5">
        Noticias, consejos y recomendaciones
        para amantes de la música.
      </p>

      <Row xs={1} md={2} lg={3} className="g-4">

        {articulosBlog.map((articulo) => (

          <Col key={articulo.id}>

            <TarjetaArticulo
              articulo={articulo}
            />

          </Col>

        ))}

      </Row>

    </section>
  );
}

export default Blog;
