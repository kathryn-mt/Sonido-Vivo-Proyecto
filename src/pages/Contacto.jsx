
import { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert
} from 'react-bootstrap';

import { useTituloPagina } from '../hooks/useTituloPagina';

// Datos iniciales del formulario
const datosIniciales = {
  nombre: '',
  correo: '',
  telefono: '',
  motivo: '',
  mensaje: ''
};

function Contacto() {
  useTituloPagina('Contacto');

  // Estados del formulario
  const [datos, setDatos] = useState(datosIniciales);
  const [errores, setErrores] = useState({});
  const [confirmacion, setConfirmacion] = useState('');

  // Actualizar los campos cuando el usuario escribe
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

    setConfirmacion('');
  }

  // Validar los datos ingresados
  function validarFormulario() {
    const nuevosErrores = {};

    const nombre = datos.nombre.trim();
    const correo = datos.correo.trim();
    const telefono = datos.telefono.trim();
    const mensaje = datos.mensaje.trim();

    // Validar nombre
    if (
      nombre.length < 3 ||
      !/^[\p{L}\s]+$/u.test(nombre)
    ) {
      nuevosErrores.nombre =
        'Ingresa un nombre válido de al menos 3 letras.';
    }

    // Validar correo electrónico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      nuevosErrores.correo =
        'Ingresa un correo electrónico válido.';
    }

    // Validar teléfono: solo números
    if (!/^\d{8,11}$/.test(telefono)) {
      nuevosErrores.telefono =
        'Ingresa un teléfono de 8 a 11 dígitos, sin espacios.';
    }

    // Validar motivo
    if (!datos.motivo) {
      nuevosErrores.motivo =
        'Selecciona un motivo de consulta.';
    }

    // Validar mensaje
    if (mensaje.length < 10) {
      nuevosErrores.mensaje =
        'El mensaje debe tener al menos 10 caracteres.';
    }

    return nuevosErrores;
  }

  // Procesar el formulario
  function manejarEnvio(e) {
    e.preventDefault();

    const nuevosErrores = validarFormulario();

    setErrores(nuevosErrores);
    setConfirmacion('');

    // Detener el envío si existen errores
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    // Mensaje de confirmación de prueba
    setConfirmacion(
      '¡Formulario validado correctamente! ' +
      'Esta es una demostración y aún no se envían correos.'
    );

    // Limpiar formulario
    setDatos({ ...datosIniciales });
  }

  return (
    <section className="py-5">

      <h1 className="fw-bold text-center mb-3">
        Contáctanos
      </h1>

      <p className="text-center text-muted mb-5">
        ¿Tienes alguna consulta?
        Completa el formulario y te ayudaremos
        con información sobre nuestros productos.
      </p>

      <Row className="g-4">

        {/* FORMULARIO DE CONTACTO */}
        <Col lg={7}>

          <Card className="shadow-sm">
            <Card.Body className="p-4">

              <h2 className="h4 mb-4">
                Formulario de contacto
              </h2>

              <Form noValidate onSubmit={manejarEnvio}>

                {/* Nombre */}
                <Form.Group
                  className="mb-3"
                  controlId="contacto-nombre"
                >
                  <Form.Label>
                    Nombre completo
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="nombre"
                    placeholder="Ingresa tu nombre"
                    value={datos.nombre}
                    onChange={manejarCambio}
                    isInvalid={!!errores.nombre}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errores.nombre}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Correo */}
                <Form.Group
                  className="mb-3"
                  controlId="contacto-correo"
                >
                  <Form.Label>
                    Correo electrónico
                  </Form.Label>

                  <Form.Control
                    type="email"
                    name="correo"
                    placeholder="ejemplo@gmail.com"
                    value={datos.correo}
                    onChange={manejarCambio}
                    isInvalid={!!errores.correo}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errores.correo}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Teléfono */}
                <Form.Group
                  className="mb-3"
                  controlId="contacto-telefono"
                >
                  <Form.Label>
                    Teléfono
                  </Form.Label>

                  <Form.Control
                    type="tel"
                    name="telefono"
                    placeholder="912345678"
                    value={datos.telefono}
                    onChange={manejarCambio}
                    isInvalid={!!errores.telefono}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errores.telefono}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Motivo */}
                <Form.Group
                  className="mb-3"
                  controlId="contacto-motivo"
                >
                  <Form.Label>
                    Motivo de consulta
                  </Form.Label>

                  <Form.Select
                    name="motivo"
                    value={datos.motivo}
                    onChange={manejarCambio}
                    isInvalid={!!errores.motivo}
                  >
                    <option value="">
                      Selecciona una opción
                    </option>

                    <option value="productos">
                      Consulta sobre productos
                    </option>

                    <option value="pedidos">
                      Consulta sobre pedidos
                    </option>

                    <option value="otros">
                      Otros
                    </option>
                  </Form.Select>

                  <Form.Control.Feedback type="invalid">
                    {errores.motivo}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Mensaje */}
                <Form.Group
                  className="mb-3"
                  controlId="contacto-mensaje"
                >
                  <Form.Label>
                    Mensaje
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="mensaje"
                    placeholder="Escribe tu consulta..."
                    value={datos.mensaje}
                    onChange={manejarCambio}
                    isInvalid={!!errores.mensaje}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errores.mensaje}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Botón */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                >
                  Validar consulta
                </Button>

              </Form>

              {/* Confirmación */}
              {confirmacion && (
                <Alert
                  variant="success"
                  role="status"
                  className="mt-3"
                >
                  {confirmacion}
                </Alert>
              )}

            </Card.Body>
          </Card>

        </Col>

        {/* INFORMACIÓN DE LA TIENDA */}
        <Col lg={5}>

          <Card className="shadow-sm h-100">
            <Card.Body className="p-4">

              <h2 className="h4 mb-4">
                Nuestra tienda
              </h2>

              <p>
                <strong>Nombre:</strong> Sonido Vivo
              </p>

              <p>
                <strong>Ubicación:</strong>
                {' '}Viña del Mar, Chile
              </p>

              <p>
                Somos una tienda dedicada a
                instrumentos musicales, equipos
                de audio y accesorios.
              </p>

              <p className="text-muted">
                La dirección exacta y los horarios
                de atención se incorporarán cuando
                estén confirmados.
              </p>

            </Card.Body>
          </Card>

        </Col>

      </Row>

    </section>
  );
}

export default Contacto;
