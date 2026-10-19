
import { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Table
} from 'react-bootstrap';

import { useTituloPagina } from '../hooks/useTituloPagina';
import { listarPedidos } from '../services/pedidoService';

function MisPedidos() {

  useTituloPagina('Mis pedidos');

  const [numeroPedido, setNumeroPedido] = useState('');
  const [correo, setCorreo] = useState('');
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState('');

  function formatearPrecio(valor) {
    return '$' + Number(valor).toLocaleString('es-CL');
  }

  function buscarPedido(e) {
    e.preventDefault();

    setError('');
    setPedido(null);

    const numeroBuscado = numeroPedido.trim().toUpperCase();
    const correoBuscado = correo.trim().toLowerCase();

    if (!numeroBuscado || !correoBuscado) {
      setError('Completa el número de pedido y tu correo.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoBuscado)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    try {
      const pedidos = listarPedidos();

      const encontrado = pedidos.find((item) => {
        const numeroGuardado = String(item.id)
          .trim()
          .toUpperCase();

        const correoGuardado = String(
          item.cliente?.correo || ''
        ).trim().toLowerCase();

        return (
          numeroGuardado === numeroBuscado &&
          correoGuardado === correoBuscado
        );
      });

      if (!encontrado) {
        setError(
          'No encontramos un pedido con esos datos en este navegador.'
        );
        return;
      }

      setPedido(encontrado);

    } catch {
      setError('No se pudieron consultar los pedidos.');
    }
  }

  return (
    <section className="py-5">

      <h1 className="fw-bold mb-3">
        Consultar mis pedidos
      </h1>

      <p className="text-muted mb-4">
        Ingresa el número de tu pedido y el correo
        que utilizaste al confirmar la compra.
      </p>

      <Row className="justify-content-center">

        <Col lg={9}>

          <Card className="shadow-sm mb-4">
            <Card.Body className="p-4">

              <Form onSubmit={buscarPedido} noValidate>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Número de pedido
                  </Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Ejemplo: SV-123456789"
                    value={numeroPedido}
                    onChange={(e) => {
                      setNumeroPedido(e.target.value);
                      setError('');
                      setPedido(null);
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Correo electrónico
                  </Form.Label>

                  <Form.Control
                    type="email"
                    placeholder="ejemplo@gmail.com"
                    value={correo}
                    onChange={(e) => {
                      setCorreo(e.target.value);
                      setError('');
                      setPedido(null);
                    }}
                  />
                </Form.Group>

                <Button type="submit">
                  Buscar pedido
                </Button>

              </Form>

            </Card.Body>
          </Card>

          {error && (
            <Alert variant="warning" role="alert">
              {error}
            </Alert>
          )}

          {pedido && (

            <Card className="shadow-sm">
              <Card.Body className="p-4">

                <h2 className="h4 mb-3">
                  Detalles del pedido
                </h2>

                <p>
                  <strong>Número:</strong> {pedido.id}
                </p>

                <p>
                  <strong>Fecha:</strong>{' '}
                  {new Date(pedido.fecha).toLocaleString('es-CL')}
                </p>

                <p>
                  <strong>Estado:</strong> {pedido.estado}
                </p>

                <p>
                  <strong>Tipo de entrega:</strong>{' '}
                  {pedido.entrega?.tipo === 'retiro'
                    ? 'Retiro en tienda'
                    : 'Despacho a domicilio'}
                </p>

                <h3 className="h5 mt-4">
                  Productos comprados
                </h3>

                <div className="table-responsive">

                  <Table striped bordered hover>

                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>

                    <tbody>

                      {(pedido.productos || []).map((producto) => (

                        <tr key={producto.id}>

                          <td>
                            {producto.nombre}
                          </td>

                          <td>
                            {producto.cantidad}
                          </td>

                          <td>
                            {formatearPrecio(
                              producto.precio * producto.cantidad
                            )}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </Table>

                </div>

                <h3 className="h5 text-end mt-3">
                  Total: {formatearPrecio(
                    pedido.totalProductos
                  )}
                </h3>

              </Card.Body>
            </Card>

          )}

          <Alert variant="info" className="mt-4">
            Esta consulta es una demostración del proyecto.
            Los pedidos solo están disponibles en el navegador
            donde fueron registrados.
          </Alert>

        </Col>

      </Row>

    </section>
  );
}

export default MisPedidos;
