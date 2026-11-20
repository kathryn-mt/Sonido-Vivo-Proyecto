import { useRef, useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';

import { useTituloPagina } from '../hooks/useTituloPagina';
import { cambiarPassword } from '../services/authService';

function CambiarPassword() {

    useTituloPagina('Cambiar contraseña');

    const estadoPasswordActual = useState('');
    const passwordActual = estadoPasswordActual[0];
    const setPasswordActual = estadoPasswordActual[1];

    const estadoPasswordNueva = useState('');
    const passwordNueva = estadoPasswordNueva[0];
    const setPasswordNueva = estadoPasswordNueva[1];

    const estadoConfirmacion = useState('');
    const confirmacion = estadoConfirmacion[0];
    const setConfirmacion = estadoConfirmacion[1];

    const estadoErrores = useState({});
    const errores = estadoErrores[0];
    const setErrores = estadoErrores[1];

    const estadoMensaje = useState('');
    const mensaje = estadoMensaje[0];
    const setMensaje = estadoMensaje[1];

    const estadoErrorServidor = useState('');
    const errorServidor = estadoErrorServidor[0];
    const setErrorServidor = estadoErrorServidor[1];

    const estadoCargando = useState(false);
    const cargando = estadoCargando[0];
    const setCargando = estadoCargando[1];

    const solicitudEnCurso = useRef(false);

    function manejarEnvio(evento) {
        evento.preventDefault();

        if (solicitudEnCurso.current) {
            return;
        }

        const nuevosErrores = {};

        if (!passwordActual) {
            nuevosErrores.passwordActual = 'Ingresa tu contraseña actual.';
        }

        if (!passwordNueva) {
            nuevosErrores.passwordNueva = 'Ingresa una contraseña nueva.';
        } else if (passwordNueva.length < 8) {
            nuevosErrores.passwordNueva =
                'La contraseña nueva debe tener al menos 8 caracteres.';
        } else if (passwordNueva === passwordActual) {
            nuevosErrores.passwordNueva =
                'La contraseña nueva debe ser distinta de la actual.';
        }

        if (!confirmacion) {
            nuevosErrores.confirmacion = 'Confirma tu contraseña nueva.';
        } else if (confirmacion !== passwordNueva) {
            nuevosErrores.confirmacion =
                'La confirmación no coincide con la contraseña nueva.';
        }

        setErrores(nuevosErrores);
        setMensaje('');
        setErrorServidor('');

        if (Object.keys(nuevosErrores).length > 0) {
            return;
        }

        solicitudEnCurso.current = true;
        setCargando(true);

        cambiarPassword(passwordActual, passwordNueva)
            .then(function(mensajeRespuesta) {
                setMensaje(mensajeRespuesta);
                setPasswordActual('');
                setPasswordNueva('');
                setConfirmacion('');
            })
            .catch(function(error) {
                setErrorServidor(
                    error.message || 'No fue posible cambiar la contraseña.'
                );
            })
            .finally(function() {
                solicitudEnCurso.current = false;
                setCargando(false);
            });
    }

    function manejarCambio(setter, nombre) {
        return function(evento) {
            setter(evento.target.value);
            setErrores(function(erroresActuales) {
                const nuevosErrores = Object.assign({}, erroresActuales);
                nuevosErrores[nombre] = '';
                return nuevosErrores;
            });
            setMensaje('');
            setErrorServidor('');
        };
    }

    return (
        <section className="py-4">
            <Card className="mx-auto p-3 p-md-4 shadow-sm" style={{ maxWidth: '32rem' }}>
                <Card.Body>
                    <h1 className="h3 mb-4">Cambiar contraseña</h1>

                    {mensaje && (
                        <Alert variant="success" role="status">
                            {mensaje}
                        </Alert>
                    )}

                    {errorServidor && (
                        <Alert variant="danger" role="alert">
                            {errorServidor}
                        </Alert>
                    )}

                    <Form onSubmit={manejarEnvio} noValidate>
                        <Form.Group className="mb-3" controlId="passwordActual">
                            <Form.Label>Contraseña actual</Form.Label>
                            <Form.Control
                                type="password"
                                autoComplete="current-password"
                                value={passwordActual}
                                onChange={manejarCambio(setPasswordActual, 'passwordActual')}
                                isInvalid={Boolean(errores.passwordActual)}
                                aria-required="true"
                                disabled={cargando}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errores.passwordActual}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="passwordNueva">
                            <Form.Label>Contraseña nueva</Form.Label>
                            <Form.Control
                                type="password"
                                autoComplete="new-password"
                                value={passwordNueva}
                                onChange={manejarCambio(setPasswordNueva, 'passwordNueva')}
                                isInvalid={Boolean(errores.passwordNueva)}
                                aria-required="true"
                                disabled={cargando}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errores.passwordNueva}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="confirmacionPassword">
                            <Form.Label>Confirmar contraseña nueva</Form.Label>
                            <Form.Control
                                type="password"
                                autoComplete="new-password"
                                value={confirmacion}
                                onChange={manejarCambio(setConfirmacion, 'confirmacion')}
                                isInvalid={Boolean(errores.confirmacion)}
                                aria-required="true"
                                disabled={cargando}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errores.confirmacion}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button type="submit" disabled={cargando}>
                            {cargando ? 'Procesando...' : 'Cambiar contraseña'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </section>
    );
}

export default CambiarPassword;
