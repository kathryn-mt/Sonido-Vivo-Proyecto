import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.png'; // Asegúrate de tener esta imagen en assets

function Inicio() {
  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Row className="align-items-center mb-5">
        <Col md={6}>
          <h1 className="display-4 fw-bold text-dark">
            Tu sueño de músico comienza aquí 
          </h1>
          <p className="lead text-muted my-4">
            Descubre los mejores instrumentos musicales en Viña del Mar. 
            Guitarras, baterías, teclados y más con garantía oficial.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Button as={Link} to="/catalogo" variant="primary" size="lg">
              Ver Catálogo
            </Button>
            <Button as={Link} to="/login" variant="outline-secondary" size="lg">
              Iniciar Sesión
            </Button>
          </div>
        </Col>
        <Col md={6} className="text-center mt-4 mt-md-0">
          <img 
            src={heroImg} 
            alt="Instrumentos musicales Sonido Vivo" 
            className="img-fluid rounded shadow-lg"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </Col>
      </Row>

      {/* Categorías Destacadas (Opcional pero recomendado) */}
      <Row className="mt-5">
        <Col className="text-center mb-4">
          <h2 className="fw-bold">Categorías Populares</h2>
        </Col>
        {['Guitarras', 'Baterías', 'Teclados', 'Audio'].map((cat) => (
          <Col xs={6} md={3} key={cat} className="mb-3">
            <div className="p-4 bg-light rounded text-center shadow-sm h-100">
              <h5 className="mb-0">{cat}</h5>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Inicio;