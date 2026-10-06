import { Container, Row, Col } from 'react-bootstrap';
import { useCatalogo } from '../context/CatalogoContext';
import TarjetaProducto from '../components/molecules/TarjetaProducto';

function Ofertas() {
  const { productos } = useCatalogo();
  
  // Lógica: Ordenar por precio (menor a mayor) y tomar los primeros 3
  const ofertasDestacadas = [...productos]
    .sort((a, b) => a.precio - b.precio)
    .slice(0, 3);

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center"> Ofertas Destacadas</h2>
      <p className="text-center text-muted mb-5">Los mejores precios para iniciar tu viaje musical</p>
      
      <Row xs={1} md={2} lg={3} className="g-4 justify-content-center">
        {ofertasDestacadas.map((prod) => (
          <Col key={prod.id}>
            // Pasamos todas las props del producto a la tarjeta 
            <TarjetaProducto {...prod} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Ofertas;