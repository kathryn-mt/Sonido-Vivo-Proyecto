import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Alert,
    Button,
    Card,
    Form,
    Spinner
} from 'react-bootstrap';

import { opcionesRegiones, regionesComunas } from '../data/regionesComunas';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { obtenerUsuario } from '../services/authService';
import { actualizarUsuarioSesion } from '../services/authSession';
import {
    actualizarPerfilUsuario,
    obtenerPerfilUsuario
} from '../services/usuarioService';

const EXPRESION_SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

function crearDatosFormulario(usuario) {
    return {
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        run: usuario.run || '',
        email: usuario.email || '',
        region: usuario.region || '',
        comuna: usuario.comuna || '',
        direccion: usuario.direccion || ''
    };
}

function validarDatosPersonales(datos) {
    const errores = {};
    const nombre = datos.nombre.trim();
    const apellido = datos.apellido.trim();
    const direccion = datos.direccion.trim();

    if (nombre.length < 2) {
        errores.nombre = 'Ingresa tu nombre.';
    } else if (nombre.length > 50) {
        errores.nombre = 'El nombre no puede superar los 50 caracteres.';
    } else if (!EXPRESION_SOLO_LETRAS.test(nombre)) {
        errores.nombre = 'El nombre solo debe contener letras.';
    }

    if (apellido.length < 2) {
        errores.apellido = 'Ingresa tu apellido.';
    } else if (apellido.length > 100) {
        errores.apellido = 'El apellido no puede superar los 100 caracteres.';
    } else if (!EXPRESION_SOLO_LETRAS.test(apellido)) {
        errores.apellido = 'El apellido solo debe contener letras.';
    }

    if (!Object.hasOwn(regionesComunas, datos.region)) {
        errores.region = 'Selecciona una región.';
    }

    if (!regionesComunas[datos.region]?.includes(datos.comuna)) {
        errores.comuna = 'Selecciona una comuna válida para la región.';
    }

    if (direccion.length < 8) {
        errores.direccion = 'Ingresa una dirección más completa.';
    } else if (direccion.length > 300) {
        errores.direccion = 'La dirección no puede superar los 300 caracteres.';
    } else if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(direccion)) {
        errores.direccion = 'La dirección debe incluir el nombre de una calle.';
    } else if (!/\d/.test(direccion) && !/\bs\s*\/\s*n\b/i.test(direccion)) {
        errores.direccion = 'Ingresa el número de la dirección o s/n.';
    }

    return errores;
}

function MiCuenta() {

    useTituloPagina('Mi cuenta');

    const usuarioAutenticado = obtenerUsuario();
    const idUsuario = usuarioAutenticado ? usuarioAutenticado.id : null;

    const estadoDatos = useState(null);
    const datos = estadoDatos[0];
    const setDatos = estadoDatos[1];

    const estadoErrores = useState({});
    const errores = estadoErrores[0];
    const setErrores = estadoErrores[1];

    const estadoCargando = useState(true);
    const cargando = estadoCargando[0];
    const setCargando = estadoCargando[1];

    const estadoGuardando = useState(false);
    const guardando = estadoGuardando[0];
    const setGuardando = estadoGuardando[1];

    const estadoMensaje = useState('');
    const mensaje = estadoMensaje[0];
    const setMensaje = estadoMensaje[1];

    const estadoError = useState('');
    const error = estadoError[0];
    const setError = estadoError[1];

    const solicitudEnCurso = useRef(false);

    useEffect(function() {
        let activo = true;

        if (idUsuario === null || idUsuario === undefined || idUsuario === '') {
            setError('No se pudo identificar la cuenta autenticada.');
            setCargando(false);

            return function() {
                activo = false;
            };
        }

        obtenerPerfilUsuario(idUsuario)
            .then(function(usuario) {
                if (activo) {
                    setDatos(crearDatosFormulario(usuario));
                }
            })
            .catch(function(errorPeticion) {
                if (activo) {
                    setError(
                        errorPeticion.message ||
                        'No fue posible obtener la información del usuario.'
                    );
                }
            })
            .finally(function() {
                if (activo) {
                    setCargando(false);
                }
            });

        return function() {
            activo = false;
        };
    }, [idUsuario]);

    function manejarCambio(evento) {
        const nombre = evento.target.name;
        const valor = evento.target.value;

        setDatos(function(datosActuales) {
            const nuevosDatos = Object.assign({}, datosActuales);
            nuevosDatos[nombre] = valor;

            if (
                nombre === 'region' &&
                !((regionesComunas[valor] || []).includes(datosActuales.comuna))
            ) {
                nuevosDatos.comuna = '';
            }

            return nuevosDatos;
        });

        setErrores(function(erroresActuales) {
            const nuevosErrores = Object.assign({}, erroresActuales);
            nuevosErrores[nombre] = '';

            if (nombre === 'region') {
                nuevosErrores.comuna = '';
            }

            return nuevosErrores;
        });
        setMensaje('');
        setError('');
    }

    async function manejarEnvio(evento) {
        evento.preventDefault();

        if (solicitudEnCurso.current || guardando || !datos) {
            return;
        }

        setMensaje('');
        setError('');

        const nuevosErrores = validarDatosPersonales(datos);
        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) {
            return;
        }

        const datosPersonales = {
            nombre: datos.nombre.trim(),
            apellido: datos.apellido.trim(),
            region: datos.region,
            comuna: datos.comuna,
            direccion: datos.direccion.trim()
        };

        solicitudEnCurso.current = true;
        setGuardando(true);

        try {
            const respuesta = await actualizarPerfilUsuario(
                idUsuario,
                datosPersonales
            );

            actualizarUsuarioSesion(respuesta.usuario);
            setDatos(Object.assign({}, datos, datosPersonales));
            setMensaje(respuesta.mensaje);
        } catch (errorPeticion) {
            setError(
                errorPeticion.message ||
                'No fue posible actualizar la información del usuario.'
            );
        } finally {
            solicitudEnCurso.current = false;
            setGuardando(false);
        }
    }

    const comunas = datos ? regionesComunas[datos.region] || [] : [];

    return (
        <section className="py-4">
            <Card className="mx-auto mb-4 p-3 p-md-4 shadow-sm" style={{ maxWidth: '46rem' }}>
                <Card.Body>
                    <h1 className="h2 mb-4">Mi cuenta</h1>
                    <h2 className="h5 mb-3">Información personal</h2>

                    {cargando && (
                        <div className="d-flex align-items-center gap-2 py-3" role="status">
                            <Spinner animation="border" size="sm" />
                            <span>Cargando información personal...</span>
                        </div>
                    )}

                    {error && (
                        <Alert variant="danger" role="alert">
                            {error}
                        </Alert>
                    )}

                    {!cargando && datos && (
                        <Form noValidate onSubmit={manejarEnvio}>
                            <Form.Group className="mb-3" controlId="miCuentaNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    name="nombre"
                                    value={datos.nombre}
                                    onChange={manejarCambio}
                                    maxLength={50}
                                    isInvalid={Boolean(errores.nombre)}
                                    disabled={guardando}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errores.nombre}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="miCuentaApellido">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control
                                    name="apellido"
                                    value={datos.apellido}
                                    onChange={manejarCambio}
                                    maxLength={100}
                                    isInvalid={Boolean(errores.apellido)}
                                    disabled={guardando}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errores.apellido}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="miCuentaRun">
                                <Form.Label>RUN</Form.Label>
                                <Form.Control value={datos.run} readOnly />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="miCuentaEmail">
                                <Form.Label>Correo electrónico</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={datos.email}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="miCuentaRegion">
                                <Form.Label>Región</Form.Label>
                                <Form.Select
                                    name="region"
                                    value={datos.region}
                                    onChange={manejarCambio}
                                    isInvalid={Boolean(errores.region)}
                                    disabled={guardando}
                                >
                                    <option value="">Selecciona una región</option>
                                    {opcionesRegiones.map(function(region) {
                                        return (
                                            <option key={region.valor} value={region.valor}>
                                                {region.nombre}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errores.region}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="miCuentaComuna">
                                <Form.Label>Comuna</Form.Label>
                                <Form.Select
                                    name="comuna"
                                    value={datos.comuna}
                                    onChange={manejarCambio}
                                    isInvalid={Boolean(errores.comuna)}
                                    disabled={guardando || !datos.region}
                                >
                                    <option value="">Selecciona una comuna</option>
                                    {comunas.map(function(comuna) {
                                        return (
                                            <option key={comuna} value={comuna}>
                                                {comuna}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errores.comuna}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="miCuentaDireccion">
                                <Form.Label>Dirección</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="direccion"
                                    value={datos.direccion}
                                    onChange={manejarCambio}
                                    maxLength={300}
                                    isInvalid={Boolean(errores.direccion)}
                                    disabled={guardando}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errores.direccion}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {guardando && (
                                <div className="d-flex align-items-center gap-2 mb-3" role="status">
                                    <Spinner animation="border" size="sm" />
                                    <span>Guardando cambios...</span>
                                </div>
                            )}

                            {mensaje && (
                                <Alert variant="success" role="status">
                                    {mensaje}
                                </Alert>
                            )}

                            <Button type="submit" disabled={guardando}>
                                {guardando ? 'Guardando...' : 'Guardar cambios'}
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>

            <Card className="mx-auto mb-4 p-3 p-md-4 shadow-sm" style={{ maxWidth: '46rem' }}>
                <Card.Body>
                    <h2 className="h5">Seguridad</h2>
                    <p className="mb-3">Administra la contraseña de tu cuenta.</p>
                    <Button as={Link} to="/cambiar-password" variant="outline-primary">
                        Cambiar contraseña
                    </Button>
                </Card.Body>
            </Card>
        </section>
    );
}

export default MiCuenta;
