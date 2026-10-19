
import { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

function TarjetaArticulo({ articulo }) {

  const [expandido, setExpandido] = useState(false);

  function cambiarVista() {
    setExpandido(!expandido);
  }

  return (
    <Card className="h-100 shadow-sm">

      <Card.Img
        variant="top"
        src={articulo.imagen}
        alt={articulo.titulo}
        style={{
          height: '200px',
          objectFit: 'contain',
          padding: '12px'
        }}
      />

      <Card.Body className="d-flex flex-column">

        <div className="mb-2">
          <Badge bg="secondary">
            {articulo.categoria}
          </Badge>
        </div>

        <Card.Title>
          {articulo.titulo}
        </Card.Title>

        <p className="text-muted small">
          {articulo.fecha}
        </p>

        <Card.Text>
          {articulo.resumen}
        </Card.Text>

        {expandido && (
          <p>
            {articulo.contenido}
          </p>
        )}

        <Button
          variant="outline-primary"
          className="mt-auto"
          onClick={cambiarVista}
          aria-expanded={expandido}
        >
          {expandido ? 'Leer menos' : 'Seguir leyendo'}
        </Button>

      </Card.Body>

    </Card>
  );
}

export default TarjetaArticulo;
