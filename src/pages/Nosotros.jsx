
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTituloPagina } from '../hooks/useTituloPagina';

function Nosotros() {
  useTituloPagina('Nosotros');

  const valores = [
    {
      titulo: 'Pasión por la música',
      descripcion:
        'Creemos que la música es una forma de expresión y creatividad.'
    },
    {
      titulo: 'Compromiso',
      descripcion:
        'Buscamos ofrecer una experiencia clara y cercana a nuestros clientes.'
    },
    {
      titulo: 'Variedad',
      descripcion:
        'Nuestro catálogo incluye instrumentos y accesorios para diferentes necesidades.'
    }
  ];

  return (
    <section className="py-5">

      <h1 className="fw-bold text-center mb-4">
        Sobre Sonido Vivo
      </h1>

      <Row className="align-items-center g-4 mb-5">

        <Col md={6}>
          <h2 className="h3 mb-3">
            Conoce nuestra tienda
          </h2>

          <p>
            Sonido Vivo es una tienda de instrumentos
            musicales y equipos de audio ubicada en
            Viña del Mar, Chile.
          </p>

          <p>
            Nuestro catálogo reúne guitarras, bajos,
            baterías, teclados, micrófonos y accesorios
            para personas que disfrutan de la música.
          </p>

          <p>
            Queremos facilitar la búsqueda de
            instrumentos mediante una plataforma
            accesible y fácil de utilizar.
          </p>

          <Button as={Link} to="/catalogo">
            Explorar catálogo
          </Button>
        </Col>

        <Col md={6}>
          <img
            src="/assets/logo-nuestratienda.jpg"
            alt="Imagen representativa de Sonido Vivo"
            className="img-fluid rounded shadow-sm w-100"
          />
        </Col>

      </Row>

      <h2 className="text-center mb-4">
        Nuestros valores
      </h2>

      <Row xs={1} md={3} className="g-4">

        {valores.map((valor) => (
          <Col key={valor.titulo}>
            <Card className="h-100 shadow-sm">

              <Card.Body>
                <Card.Title>
                  {valor.titulo}
                </Card.Title>

                <Card.Text>
                  {valor.descripcion}
                </Card.Text>
              </Card.Body>

            </Card>
          </Col>
        ))}

      </Row>

    </section>
  );
}

export default Nosotros;
