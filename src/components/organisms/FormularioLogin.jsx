import { useState } from 'react';
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import CampoConLabel from "../molecules/CampoConLabel.jsx";
import Boton from "../atoms/Boton.jsx";
import {
  validarLogin,
  validarLoginPersonal
} from '../../utils/validaciones.js';
import { Link } from 'react-router-dom';

const MODO_CLIENTE = 'CLIENTE';
const MODO_PERSONAL = 'PERSONAL';

function FormularioLogin(props) {

  const estadoModo = useState(MODO_CLIENTE);
  const modoActual = estadoModo[0];
  const setModoActual = estadoModo[1];

  const estadoDatos = useState({
    email: '',
    run: '',
    password: ''
  });
  const datos = estadoDatos[0];
  const setDatos = estadoDatos[1];

  const estadoErrores = useState({});
  const errores = estadoErrores[0];
  const setErrores = estadoErrores[1];

  const estadoCargando = useState(false);
  const cargando = estadoCargando[0];
  const setCargando = estadoCargando[1];

  function manejarCambio(evento) {
    const nombreCampo = evento.target.name;
    const valorCampo = evento.target.value;

    setDatos(function(datosActuales) {
      return {
        ...datosActuales,
        [nombreCampo]: valorCampo
      };
    });

    setErrores(function(erroresActuales) {
      return {
        ...erroresActuales,
        [nombreCampo]: ''
      };
    });

    if (props.limpiarError) {
      props.limpiarError();
    }
  }

  function cambiarModo(nuevoModo) {
    if (cargando) {
      return;
    }

    setModoActual(nuevoModo);
    setErrores({});
    setDatos({
      email: '',
      run: '',
      password: ''
    });

    if (props.limpiarError) {
      props.limpiarError();
    }
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    if (cargando) {
      return;
    }

    let erroresValidacion = {};

    if (modoActual === MODO_PERSONAL) {
      erroresValidacion = validarLoginPersonal(datos);
    } else {
      erroresValidacion = validarLogin(datos);
    }

    setErrores(erroresValidacion);

    if (Object.keys(erroresValidacion).length === 0) {
      setCargando(true);

      try {
        await props.onLogin(modoActual, datos);
      } finally {
        setCargando(false);
      }
    }
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="p-4 shadow">

            <h2 className="text-center mb-4">
              Sonido Vivo
            </h2>

            <p className="text-center mb-4">
              {modoActual === MODO_PERSONAL
                ? 'Acceso para vendedores y administradores'
                : 'Inicia sesión para continuar'}
            </p>

            <Form noValidate onSubmit={manejarEnvio}>

              {modoActual === MODO_CLIENTE && (
                <CampoConLabel
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  placeholder="tu_@correo.com"
                  value={datos.email}
                  onChange={manejarCambio}
                  error={errores.email}
                  deshabilitado={cargando}
                />
              )}

              {modoActual === MODO_PERSONAL && (
                <CampoConLabel
                  label="RUN"
                  name="run"
                  type="text"
                  placeholder="Ingresa tu RUN"
                  value={datos.run}
                  onChange={manejarCambio}
                  error={errores.run}
                  deshabilitado={cargando}
                />
              )}

              <CampoConLabel
                label="Contraseña"
                name="password"
                type="password"
                placeholder="********"
                value={datos.password}
                onChange={manejarCambio}
                error={errores.password}
                deshabilitado={cargando}
              />

              {props.error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {props.error}
                </div>
              )}

              <div className="mt-3">
                <Boton
                  texto={cargando ? 'Ingresando...' : 'Ingresar'}
                  variante="primary"
                  tipo="submit"
                  deshabilitado={cargando}
                />
              </div>

            </Form>
          </Card>

          {modoActual === MODO_CLIENTE && (
            <>
              <p className="text-center mt-3 mb-2">
                ¿No tienes una cuenta?{' '}
                <Link to="/registro">
                  Regístrate aquí
                </Link>
              </p>

              <p className="text-center mb-0">
                <button
                  type="button"
                  className="btn btn-link p-0"
                  disabled={cargando}
                  onClick={function() {
                    cambiarModo(MODO_PERSONAL);
                  }}
                >
                  Soy vendedor o administrador
                </button>
              </p>
            </>
          )}

          {modoActual === MODO_PERSONAL && (
            <p className="text-center mt-3 mb-0">
              <button
                type="button"
                className="btn btn-link p-0"
                disabled={cargando}
                onClick={function() {
                  cambiarModo(MODO_CLIENTE);
                }}
              >
                Volver al ingreso de clientes
              </button>
            </p>
          )}

        </Col>
      </Row>
    </Container>
  );
}

export default FormularioLogin;
