import { useParams, Link } from 'react-router-dom';
import { useCatalogo } from '../context/CatalogoContext';
import { Container, Card, Button } from 'react-bootstrap';

function DetalleProducto() {
  const { id } = useParams();
  const { productos } = useCatalogo();
  const producto = productos.find(p => p.id === Number(id));

  if (!producto) return <Container><h2>Producto no encontrado</h2></Container>;

  return (
    <Container className="py-5">
      <Link to="/catalogo" className="btn btn-outline-secondary mb-3">← Volver</Link>
      <Card className="shadow-sm">
        <Card.Img variant="top" src={producto.imagen} style={{ height: '400px', objectFit: 'contain' }} />
        <Card.Body>
          <Card.Title>{producto.nombre}</Card.Title>
          <Card.Text><strong>Marca:</strong> {producto.marca} | <strong>Modelo:</strong> {producto.modelo}</Card.Text>
          <Card.Text>{producto.descripcion}</Card.Text>
          <h3 className="text-primary">${producto.precio.toLocaleString('es-CL')}</h3>
          <Button variant="success" size="lg">Agregar al Carrito</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default DetalleProducto;