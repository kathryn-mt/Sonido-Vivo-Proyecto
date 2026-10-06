import { Link } from 'react-router-dom';
import { useCatalogo } from '../context/CatalogoContext';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

function Categorias() {
  // Obtenemos los productos del contexto global
  const { productos } = useCatalogo();
  
  // Extraemos categorías únicas usando Set para evitar duplicados
  const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Explora por Categorías</h2>
      <p className="text-center text-muted mb-5">Encuentra exactamente lo que buscas para tu música</p>
      
      <Row xs={1} md={2} lg={3} className="g-4">
        {categoriasUnicas.map((cat) => (
          <Col key={cat}>
            <Card className="h-100 text-center shadow-sm border-0 bg-light">
              <Card.Body className="d-flex flex-column justify-content-center align-items-center p-4">
                // Icono o Emoji representativo (opcional) 
                <div className="fs-1 mb-3">🎵</div>
                
                <Card.Title className="fw-bold">{cat}</Card.Title>
                <Card.Text className="text-muted">
                  {productos.filter(p => p.categoria === cat).length} productos disponibles
                </Card.Text>
                
                // Botón que lleva al catálogo filtrado por esta categoría 
                <Link to={`/catalogo?cat=${encodeURIComponent(cat)}`} style={{ textDecoration: 'none' }}>
                  <Button variant="primary" className="mt-2">Ver Productos</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Categorias;