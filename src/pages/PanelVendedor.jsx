import { Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useTituloPagina } from '../hooks/useTituloPagina';

function PanelVendedor() {

  useTituloPagina('Panel del Vendedor');

  const opciones = [
    {
      id: 1,
      titulo: 'Gestionar productos',
      descripcion: 'Agregar y editar productos. Consultar precios y stock.',
      ruta: '/vendedor/productos',
      boton: 'Gestionar productos'
    },
    {
      id: 2,
      titulo: 'Gestionar pedidos',
      descripcion: 'Consultar pedidos de la tienda y actualizar sus estados.',
      ruta: '/vendedor/pedidos',
      boton: 'Gestionar pedidos'
    },
    {
      id: 3,
      titulo: 'Consultar catálogo',
      descripcion: 'Revisar los productos disponibles en Sonido Vivo.',
      ruta: '/catalogo',
      boton: 'Ver catálogo'
    }
  ];

  return (

    <section className="py-5">

      <h1 className="fw-bold mb-3">
        Panel del Vendedor
      </h1>

      <p className="text-muted mb-4">
        Bienvenido al panel de vendedores de Sonido Vivo.
        Selecciona la opción que deseas utilizar.
      </p>

      <Row xs={1} md={2} lg={3} className="g-4">

        {opciones.map(function (opcion) {

          return (

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

          );
        })}

      </Row>

      <Alert variant="info" className="mt-4">
        Los vendedores pueden agregar y editar productos,
        consultar inventario y gestionar estados de pedidos.
        No tienen permisos para eliminar productos
        ni administrar usuarios.
      </Alert>

    </section>
  );
}

export default PanelVendedor;