
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert
} from 'react-bootstrap';

import { useCarrito } from '../context/CarritoContext';
import { validarCheckout } from '../utils/validacionesCheckout';
import { registrarPedido } from '../services/pedidoService';

function Checkout() {
  const {
    carrito,
    total,
    cantidadTotal,
    vaciarCarrito
  } = useCarrito();

  const [datos, setDatos] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    comuna: ''
  });

  const [entrega, setEntrega] = useState('retiro');
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState('');
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

  function formatearPrecio(valor) {
    return '$' + Number(valor).toLocaleString('es-CL');
  }

  function manejarCambio(e) {
    const { name, value } = e.target;

    setDatos(actual => ({
      ...actual,
      [name]: value
    }));

    setErrores(actual => ({
      ...actual,
      [name]: ''
    }));
  }

  function confirmarPedido(e) {
    e.preventDefault();

    if (carrito.length === 0) return;

    const erroresFormulario = validarCheckout(datos, entrega);

    setErrores(erroresFormulario);
    setMensajeError('');

    if (Object.keys(erroresFormulario).length > 0) {
      return;
    }

    try {
      const nuevoPedido = registrarPedido({
        cliente: {
          nombre: datos.nombre.trim(),
          correo: datos.correo.trim(),
          telefono: datos.telefono.trim()
        },
        entrega: {
          tipo: entrega,
          direccion: entrega === 'despacho'
            ? datos.direccion.trim()
            : '',
          comuna: entrega === 'despacho'
            ? datos.comuna.trim()
            : ''
        },
        productos: carrito.map(producto => ({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: producto.cantidad
        })),
        cantidadTotal,
        totalProductos: total
      });

      vaciarCarrito();
      setPedidoConfirmado(nuevoPedido);
    } catch {
      setMensajeError(
        'No se pudo guardar el pedido. Intenta nuevamente.'
      );
    }
  }

  // Mensaje después de registrar el pedido
  if (pedidoConfirmado) {
    return (
      <section className="py-5">
        <Alert variant="success" role="status">
          <h1 className="h3">¡Pedido registrado!</h1>

          <p>
            Tu número de pedido es:
            <strong> {pedidoConfirmado.id}</strong>
          </p>

          <p>
            Estado: {pedidoConfirmado.estado}
          </p>

          <p className="mb-0">
            Este pedido es de prueba y está guardado
            solamente en este navegador.
            No se ha realizado ningún cobro.
          </p>
        </Alert>

        <Button as={Link} to="/catalogo" variant="primary">
          Volver al catálogo
        </Button>
      </section>
    );
  }

  // No permitir confirmar un carrito vacío
  if (carrito.length === 0) {
    return (
      <section className="py-5 text-center">
        <h1 className="h3">Tu carrito está vacío</h1>

        <p className="text-muted">
          Agrega productos antes de confirmar un pedido.
        </p>

        <Button as={Link} to="/catalogo">
          Ir al catálogo
        </Button>
      </section>
    );
  }

  return (
    <section className="py-5">
      <h1 className="fw-bold mb-2">
        Confirmar pedido
      </h1>

      <p className="text-muted mb-4">
        Completa tus datos y selecciona cómo deseas
        recibir tus productos.
      </p>

      <Row className="g-4">

        {/* Formulario del cliente */}
        <Col lg={7}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="h4 mb-4">
                Datos del cliente
              </h2>

              <Form noValidate onSubmit={confirmarPedido}>

                <Form.Group className="mb-3" controlId="nombre">
                  <Form.Label>Nombre completo</Form.Label>

                  <Form.Control
                    type="text"
                    name="nombre"
                    value={datos.nombre}
                    onChange={manejarCambio}
                    isInvalid={Boolean(errores.nombre)}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errores.nombre}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="correo">
                  <Form.Label>Correo electrónico</Form.Label>

                  <Form.Control
                    type="email"
                    name="correo"
                    value={datos.correo}
                    onChange={manejarCambio}
                    isInvalid={Boolean(errores.correo)}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errores.correo}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="telefono">
                  <Form.Label>Teléfono</Form.Label>

                  <Form.Control
                    type="tel"
                    name="telefono"
                    placeholder="+56 9 1234 5678"
                    value={datos.telefono}
                    onChange={manejarCambio}
                    isInvalid={Boolean(errores.telefono)}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errores.telefono}
                  </Form.Control.Feedback>
                </Form.Group>

                <h2 className="h4 mb-3">
                  Método de entrega
                </h2>

                <Form.Check
                  type="radio"
                  name="entrega"
                  id="retiro"
                  label="Retiro en tienda (Viña del Mar)"
                  checked={entrega === 'retiro'}
                  onChange={() => setEntrega('retiro')}
                  className="mb-3"
                />

                <Form.Check
                  type="radio"
                  name="entrega"
                  id="despacho"
                  label="Despacho a domicilio"
                  checked={entrega === 'despacho'}
                  onChange={() => setEntrega('despacho')}
                  className="mb-3"
                />

                {entrega === 'despacho' && (
                  <>
                    <Form.Group
                      className="mb-3"
                      controlId="direccion"
                    >
                      <Form.Label>Dirección</Form.Label>

                      <Form.Control
                        type="text"
                        name="direccion"
                        value={datos.direccion}
                        onChange={manejarCambio}
                        isInvalid={Boolean(errores.direccion)}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errores.direccion}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                      className="mb-3"
                      controlId="comuna"
                    >
                      <Form.Label>Comuna</Form.Label>

                      <Form.Control
                        type="text"
                        name="comuna"
                        value={datos.comuna}
                        onChange={manejarCambio}
                        isInvalid={Boolean(errores.comuna)}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errores.comuna}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <p className="text-muted small">
                      El costo de despacho se definirá
                      en una etapa posterior del proyecto.
                    </p>
                  </>
                )}

                {mensajeError && (
                  <Alert variant="danger" role="alert">
                    {mensajeError}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 mt-3"
                >
                  Confirmar pedido de prueba
                </Button>

              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Resumen del carrito */}
        <Col lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">

              <h2 className="h4 mb-4">
                Resumen de compra
              </h2>

              {carrito.map(producto => (
                <div
                  key={producto.id}
                  className="d-flex justify-content-between gap-3 mb-3"
                >
                  <span>
                    {producto.nombre}
                    {' '}x{producto.cantidad}
                  </span>

                  <strong>
                    {formatearPrecio(
                      producto.precio * producto.cantidad
                    )}
                  </strong>
                </div>
              ))}

              <hr />

              <p>Unidades: {cantidadTotal}</p>

              <h3 className="h5">
                Total de productos: {formatearPrecio(total)}
              </h3>

              <p className="text-muted small mt-3">
                No incluye posibles costos de despacho.
                No se realizará un pago real.
              </p>

              <Button
                as={Link}
                to="/carrito"
                variant="outline-secondary"
                className="w-100 mt-2"
              >
                Volver al carrito
              </Button>

            </Card.Body>
          </Card>
        </Col>

      </Row>
    </section>
  );
}

export default Checkout;
