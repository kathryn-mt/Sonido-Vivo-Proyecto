import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Boton';

const TarjetaProducto = ({ nombre, precio, imagen, descripcion }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={imagen || 'https://via.placeholder.com/300x200'} 
        alt={nombre}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{nombre}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">
          {descripcion}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fw-bold fs-5 text-primary">${precio.toLocaleString('es-CL')}</span>
          <Boton variant="outline-primary" size="sm">Ver detalle</Boton>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TarjetaProducto;