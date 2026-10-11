
import { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

import CampoConLabel from '../molecules/CampoConLabel';
import { validarProducto } from '../../utils/validacionesProducto';

// Categorías de Sonido Vivo
const categorias = [
  'Guitarras Acústicas',
  'Guitarras Eléctricas',
  'Bajos Eléctricos',
  'Baterías',
  'Teclados y Pianos',
  'Amplificadores',
  'Micrófonos',
  'Pedales de Efectos',
  'Accesorios',
  'Estudio y Grabación'
];

// Campos del formulario
const campos = [
  { nombre: 'codigo', etiqueta: 'Código' },
  { nombre: 'nombre', etiqueta: 'Nombre' },
  { nombre: 'marca', etiqueta: 'Marca' },
  { nombre: 'modelo', etiqueta: 'Modelo' },
  { nombre: 'precio', etiqueta: 'Precio actual', tipo: 'number' },
  {
    nombre: 'precioAnterior',
    etiqueta: 'Precio anterior (opcional)',
    tipo: 'number'
  },
  { nombre: 'stock', etiqueta: 'Stock', tipo: 'number' }
];

function FormularioProducto({
  producto = null,
  productos = [],
  onGuardar,
  onCancelar
}) {

  // Datos del producto
  const [datos, setDatos] = useState({
    codigo: producto?.codigo ?? '',
    nombre: producto?.nombre ?? '',
    marca: producto?.marca ?? '',
    modelo: producto?.modelo ?? '',
    categoria: producto?.categoria ?? '',
    precio: producto?.precio ?? '',
    precioAnterior: producto?.precioAnterior ?? '',
    stock: producto?.stock ?? 0,
    descripcion: producto?.descripcion ?? '',
    imagen: producto?.imagen ?? ''
  });

  const [errores, setErrores] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  // Validar campos normales y descuentos
  function validarFormulario(datosAValidar) {

    const nuevosErrores = validarProducto(
      datosAValidar,
      productos,
      producto?.id
    );

    const precioActual = Number(datosAValidar.precio);
    const precioAnterior = datosAValidar.precioAnterior;

    // Solo validar el precio anterior si se ingresó
    if (precioAnterior !== '') {

      const precioAnteriorNumero = Number(precioAnterior);

      if (
        !Number.isFinite(precioAnteriorNumero) ||
        precioAnteriorNumero <= 0
      ) {
        nuevosErrores.precioAnterior =
          'Ingresa un precio anterior válido.';

      } else if (
        precioActual > 0 &&
        precioAnteriorNumero <= precioActual
      ) {
        nuevosErrores.precioAnterior =
          'El precio anterior debe ser mayor al precio actual.';
      }
    }

    return nuevosErrores;
  }

  // Actualizar datos mientras el usuario escribe
  function manejarCambio(e) {
    const { name, value } = e.target;

    const nuevosDatos = {
      ...datos,
      [name]: value
    };

    setDatos(nuevosDatos);

    // Actualizar errores si ya intentó guardar
    if (intentoEnvio) {
      setErrores(
        validarFormulario(nuevosDatos)
      );
    }
  }

  // Guardar producto
  function manejarEnvio(e) {
    e.preventDefault();

    setIntentoEnvio(true);

    const nuevosErrores = validarFormulario(datos);

    setErrores(nuevosErrores);

    // No guardar si hay errores
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    // Enviar datos al componente administrador
    onGuardar({
      codigo: datos.codigo.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      marca: datos.marca.trim(),
      modelo: datos.modelo.trim(),
      categoria: datos.categoria,
      precio: Number(datos.precio),

      // Sin precio anterior significa sin oferta
      precioAnterior: datos.precioAnterior === ''
        ? null
        : Number(datos.precioAnterior),

      stock: Number(datos.stock),
      descripcion: datos.descripcion.trim(),
      imagen: datos.imagen.trim() || '/assets/logo.jpg'
    });
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>

        <h2 className="h4 mb-4">
          {producto ? 'Editar producto' : 'Agregar producto'}
        </h2>

        <Form noValidate onSubmit={manejarEnvio}>

          {/* Datos principales */}
          <Row>

            {campos.map(campo => (
              <Col md={6} key={campo.nombre}>

                <CampoConLabel
                  label={campo.etiqueta}
                  name={campo.nombre}
                  type={campo.tipo || 'text'}
                  value={datos[campo.nombre]}
                  onChange={manejarCambio}
                  error={errores[campo.nombre]}
                />

              </Col>
            ))}

          </Row>

          {/* Información sobre las ofertas */}
          <p className="text-muted small mb-4">
            Si el producto tiene descuento, ingresa el
            precio original en "Precio anterior" y el
            precio rebajado en "Precio actual".
            Si no tiene oferta, deja vacío el precio anterior.
          </p>

          {/* Categoría */}
          <Form.Group
            className="mb-3"
            controlId="categoria"
          >
            <Form.Label>
              Categoría
            </Form.Label>

            <Form.Select
              name="categoria"
              value={datos.categoria}
              onChange={manejarCambio}
              isInvalid={Boolean(errores.categoria)}
            >

              <option value="">
                Seleccionar categoría
              </option>

              {categorias.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}

            </Form.Select>

            <Form.Control.Feedback type="invalid">
              {errores.categoria}
            </Form.Control.Feedback>

          </Form.Group>

          {/* Descripción */}
          <Form.Group
            className="mb-3"
            controlId="descripcion"
          >
            <Form.Label>
              Descripción
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={datos.descripcion}
              onChange={manejarCambio}
              isInvalid={Boolean(errores.descripcion)}
            />

            <Form.Control.Feedback type="invalid">
              {errores.descripcion}
            </Form.Control.Feedback>

          </Form.Group>

          {/* Imagen del producto */}
          <CampoConLabel
            label="Ruta de imagen (opcional)"
            name="imagen"
            placeholder="/assets/instrumento.jpg"
            value={datos.imagen}
            onChange={manejarCambio}
          />

          {/* Botones */}
          <div className="d-flex gap-2 flex-wrap mt-3">

            <Button
              variant="primary"
              type="submit"
            >
              {producto
                ? 'Guardar cambios'
                : 'Agregar producto'}
            </Button>

            <Button
              variant="outline-secondary"
              type="button"
              onClick={onCancelar}
            >
              Cancelar
            </Button>

          </div>

        </Form>

      </Card.Body>
    </Card>
  );
}

export default FormularioProducto;
