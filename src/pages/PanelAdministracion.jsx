
import { Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useTituloPagina } from '../hooks/useTituloPagina';

function PanelAdministracion() {
  useTituloPagina('Panel de Administración');

  const opciones = [
    {
      id: 1,
      titulo: 'Administrar productos',
      descripcion:
        'Permite agregar, editar y eliminar productos del catálogo, además de gestionar precios y stock.',
      ruta: '/admin/productos',
      boton: 'Gestionar productos'
    },
    {
      id: 2,
      titulo: 'Administrar pedidos',
      descripcion:
        'Permite consultar los pedidos realizados por los clientes y actualizar su estado.',
      ruta: '/admin/pedidos',
      boton: 'Gestionar pedidos'
    }
  ];

  return (
    <section className="py-5">

      <h1 className="fw-bold mb-3">
        Panel de Administración
      </h1>

      <p className="text-muted mb-4">
        Bienvenido al panel de gestión de Sonido Vivo.
        Selecciona la opción que deseas administrar.
      </p>

      <Row xs={1} md={2} className="g-4">

        {opciones.map((opcion) => (

          <Col key={opcion.id}>

            <Card className="h-100 shadow-sm">

              <Card.Body className="d-flex flex-column p-4">

                <Card.Title className="h4 mb-3">
                  {opcion.titulo}
                </Card.Title>

                <Card.Text className="text-muted">
                  {opcion.descripcion}
                </Card.Text>

                <Button
                  as={Link}
                  to={opcion.ruta}
                  variant="primary"
                  className="mt-auto"
                >
                  {opcion.boton}
                </Button>

              </Card.Body>

            </Card>

          </Col>

        ))}

      </Row>

      <Alert variant="info" className="mt-4">
        Este panel es una demostración del proyecto.
        El control de acceso para administradores
        se implementará en una etapa posterior.
      </Alert>

    </section>
  );
}

export default PanelAdministracion;
