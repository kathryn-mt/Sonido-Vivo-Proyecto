import { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

import CampoConLabel from '../molecules/CampoConLabel';
import { validarProducto } from '../../utils/validacionesProducto';

// ==========================================
// CATEGORÍAS DE SONIDO VIVO
// ==========================================

const categorias = [
  'Audio',
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

// ==========================================
// CAMPOS DEL FORMULARIO
// ==========================================

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

// ==========================================
// COMPONENTE FORMULARIO PRODUCTO
// ==========================================

function FormularioProducto(props) {

  // ========================================
  // OBTENER PROPIEDADES SIN DESESTRUCTURACIÓN
  // ========================================

  const producto = props.producto ?? null;
  const productos = props.productos ?? [];
  const onGuardar = props.onGuardar;
  const onCancelar = props.onCancelar;

  // ========================================
  // ESTADO DE LOS DATOS DEL PRODUCTO
  // ========================================

  const estadoDatos = useState({
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

  const datos = estadoDatos[0];
  const setDatos = estadoDatos[1];

  // ========================================
  // ESTADO DE ERRORES
  // ========================================

  const estadoErrores = useState({});

  const errores = estadoErrores[0];
  const setErrores = estadoErrores[1];

  // ========================================
  // ESTADO DE INTENTO DE ENVÍO
  // ========================================

  const estadoIntentoEnvio = useState(false);

  const intentoEnvio = estadoIntentoEnvio[0];
  const setIntentoEnvio = estadoIntentoEnvio[1];

  // ========================================
  // VALIDAR FORMULARIO
  // ========================================

  function validarFormulario(datosAValidar) {

    const nuevosErrores = validarProducto(
      datosAValidar,
      productos,
      producto?.id
    );

    const precioActual = Number(datosAValidar.precio);
    const precioAnterior = datosAValidar.precioAnterior;

    // Validar precio anterior solamente si existe
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

  // ========================================
  // ACTUALIZAR DATOS DEL FORMULARIO
  // ========================================

  function manejarCambio(e) {

    // Obtener los valores sin desestructuración
    const name = e.target.name;
    const value = e.target.value;

    // Crear una copia de los datos
    const nuevosDatos = Object.assign({}, datos);

    // Actualizar el campo correspondiente
    nuevosDatos[name] = value;

    setDatos(nuevosDatos);

    // Actualizar errores si ya intentó guardar
    if (intentoEnvio) {

      setErrores(
        validarFormulario(nuevosDatos)
      );
    }
  }

  // ========================================
  // GUARDAR PRODUCTO
  // ========================================

  function manejarEnvio(e) {

    e.preventDefault();

    setIntentoEnvio(true);

    const nuevosErrores = validarFormulario(datos);

    setErrores(nuevosErrores);

    // No guardar si existen errores
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    // Enviar datos al administrador
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

  // ========================================
  // MOSTRAR FORMULARIO
  // ========================================

  return (

    <Card className="shadow-sm">

      <Card.Body>

        <h2 className="h4 mb-4">
          {producto ? 'Editar producto' : 'Agregar producto'}
        </h2>

        <Form noValidate onSubmit={manejarEnvio}>

          {/* DATOS PRINCIPALES */}

          <Row>

            {campos.map(function (campo) {

              return (

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

              );
            })}

          </Row>

          {/* INFORMACIÓN DE OFERTAS */}

          <p className="text-muted small mb-4">
            Si el producto tiene descuento, ingresa el
            precio original en "Precio anterior" y el
            precio rebajado en "Precio actual".
            Si no tiene oferta, deja vacío el precio anterior.
          </p>

          {/* CATEGORÍA */}

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

              {categorias.map(function (cat) {

                return (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                );

              })}

            </Form.Select>

            <Form.Control.Feedback type="invalid">
              {errores.categoria}
            </Form.Control.Feedback>

          </Form.Group>

          {/* DESCRIPCIÓN */}

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

          {/* IMAGEN DEL PRODUCTO */}

          <CampoConLabel
            label="Ruta de imagen (opcional)"
            name="imagen"
            placeholder="/assets/instrumento.jpg"
            value={datos.imagen}
            onChange={manejarCambio}
          />

          {/* BOTONES */}

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