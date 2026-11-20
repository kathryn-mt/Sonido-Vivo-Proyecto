import { useRef, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Form,
    Spinner
} from 'react-bootstrap';

import { opcionesRegiones, regionesComunas } from '../data/regionesComunas';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { registrarVendedor } from '../services/usuarioService';
import {
    normalizarRUN,
    validarRUNChileno
} from '../utils/validacionesRegistro';

const EXPRESION_SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
const EXPRESION_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const datosIniciales = {
    nombre: '',
    apellido: '',
    run: '',
    email: '',
    password: '',
    passwordConfirm: '',
    region: '',
    comuna: '',
    direccion: ''
};

function validarDatosVendedor(datos) {
    const errores = {};
    const nombre = datos.nombre.trim();
    const apellido = datos.apellido.trim();
    const email = datos.email.trim();
    const direccion = datos.direccion.trim();

    if (nombre.length < 2) {
        errores.nombre = 'Ingresa un nombre de al menos 2 caracteres.';
    } else if (nombre.length > 50) {
        errores.nombre = 'El nombre no puede superar los 50 caracteres.';
    } else if (!EXPRESION_SOLO_LETRAS.test(nombre)) {
        errores.nombre = 'El nombre solo debe contener letras.';
    }

    if (apellido.length < 2) {
        errores.apellido = 'Ingresa un apellido de al menos 2 caracteres.';
    } else if (apellido.length > 100) {
        errores.apellido = 'El apellido no puede superar los 100 caracteres.';
    } else if (!EXPRESION_SOLO_LETRAS.test(apellido)) {
        errores.apellido = 'El apellido solo debe contener letras.';
    }

    if (!validarRUNChileno(datos.run)) {
        errores.run = 'Ingresa un RUN chileno válido.';
    }

    if (!email) {
        errores.email = 'Ingresa un correo electrónico.';
    } else if (email.length > 100 || !EXPRESION_EMAIL.test(email)) {
        errores.email = 'Ingresa un correo electrónico válido.';
    }

    if (!datos.password) {
        errores.password = 'Ingresa una contraseña.';
    } else if (datos.password.length < 8) {
        errores.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!datos.passwordConfirm) {
        errores.passwordConfirm = 'Confirma la contraseña.';
    } else if (datos.passwordConfirm !== datos.password) {
        errores.passwordConfirm = 'Las contraseñas no coinciden.';
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

function RegistroVendedor() {

    useTituloPagina('Registrar vendedor');

    const estadoDatos = useState(Object.assign({}, datosIniciales));
    const datos = estadoDatos[0];
    const setDatos = estadoDatos[1];

    const estadoErrores = useState({});
    const errores = estadoErrores[0];
    const setErrores = estadoErrores[1];

    const estadoMensaje = useState('');
    const mensaje = estadoMensaje[0];
    const setMensaje = estadoMensaje[1];

    const estadoError = useState('');
    const error = estadoError[0];
    const setError = estadoError[1];

    const estadoCargando = useState(false);
    const cargando = estadoCargando[0];
    const setCargando = estadoCargando[1];

    const solicitudEnCurso = useRef(false);
    const comunas = regionesComunas[datos.region] || [];

    function manejarCambio(evento) {
        const nombre = evento.target.name;
        const valor = evento.target.value;

        setDatos(function(datosActuales) {
            const nuevosDatos = Object.assign({}, datosActuales);
            nuevosDatos[nombre] = valor;

            if (nombre === 'region') {
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

        if (solicitudEnCurso.current) {
            return;
        }

        setMensaje('');
        setError('');

        const nuevosErrores = validarDatosVendedor(datos);
        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) {
            return;
        }

        const datosRegistro = {
            nombre: datos.nombre.trim(),
            apellido: datos.apellido.trim(),
            run: normalizarRUN(datos.run),
            email: datos.email.trim(),
            password: datos.password,
            region: datos.region,
            comuna: datos.comuna,
            direccion: datos.direccion.trim()
        };

        solicitudEnCurso.current = true;
        setCargando(true);

        try {
            await registrarVendedor(datosRegistro);
            setMensaje('Vendedor registrado correctamente.');
            setDatos(function(datosActuales) {
                const nuevosDatos = Object.assign({}, datosActuales);
                nuevosDatos.password = '';
                nuevosDatos.passwordConfirm = '';
                return nuevosDatos;
            });
        } catch (errorPeticion) {
            setError(
                errorPeticion.message ||
                'No fue posible registrar al vendedor.'
            );
        } finally {
            solicitudEnCurso.current = false;
            setCargando(false);
        }
    }

    return (
        <section className="py-4">
            <Card className="mx-auto p-3 p-md-4 shadow-sm" style={{ maxWidth: '46rem' }}>
                <Card.Body>
                    <h1 className="h2 mb-4">Registrar vendedor</h1>

                    {mensaje && (
                        <Alert variant="success" role="status">
                            {mensaje}
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="danger" role="alert">
                            {error}
                        </Alert>
                    )}

                    <Form noValidate onSubmit={manejarEnvio}>
                        <Form.Group className="mb-3" controlId="vendedorNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                name="nombre"
                                value={datos.nombre}
                                onChange={manejarCambio}
                                maxLength={50}
                                isInvalid={Boolean(errores.nombre)}
                                disabled={cargando}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errores.nombre}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="vendedorApellido">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                name="apellido"
                                value={datos.apellido}
                                onChange={manejarCambio}
                                maxLength={100}
                                isInvalid={Boolean(errores.apellido)}
                                disabled={cargando}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errores.apellido}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="vendedorRun">
                            <Form.Label>RUN</Form.Label>
                            <Form.Control
                                name="run"
                                value={datos.run}
                                onChange={manejarCambio}
                                placeholder="Ejemplo: 12345678-5"
                                maxLength={12}
                                isInvalid={Boolean(errores.run)}
                                disabled={cargando}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errores.run}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="vendedorEmail">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={datos.email}
                                onChange={manejarCambio}
                                maxLength={100}
                                isInvalid={Boolean(errores.email)}
                                disabled={cargando}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errores.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="vendedorPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                value={datos.password}
                                onChange={manejarCambio}
                                isInvalid={Boolean(errores.password)}
                                disabled={cargando}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errores.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="vendedorPasswordConfirm">
                            <Form.Label>Confirmar contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="passwordConfirm"
                                autoComplete="new-password"
                                value={datos.passwordConfirm}
                                onChange={manejarCambio}
                                isInvalid={Boolean(errores.passwordConfirm)}
                                disabled={cargando}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errores.passwordConfirm}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="vendedorRegion">
                            <Form.Label>Región</Form.Label>
                            <Form.Select
                                name="region"
                                value={datos.region}
                                onChange={manejarCambio}
                                isInvalid={Boolean(errores.region)}
                                disabled={cargando}
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

                        <Form.Group className="mb-3" controlId="vendedorComuna">
                            <Form.Label>Comuna</Form.Label>
                            <Form.Select
                                name="comuna"
                                value={datos.comuna}
                                onChange={manejarCambio}
                                isInvalid={Boolean(errores.comuna)}
                                disabled={cargando || !datos.region}
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

                        <Form.Group className="mb-4" controlId="vendedorDireccion">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="direccion"
                                value={datos.direccion}
                                onChange={manejarCambio}
                                maxLength={300}
                                isInvalid={Boolean(errores.direccion)}
                                disabled={cargando}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errores.direccion}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {cargando && (
                            <div className="d-flex align-items-center gap-2 mb-3" role="status">
                                <Spinner animation="border" size="sm" />
                                <span>Registrando vendedor...</span>
                            </div>
                        )}

                        <Button type="submit" disabled={cargando}>
                            {cargando ? 'Registrando...' : 'Registrar vendedor'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </section>
    );
}

export default RegistroVendedor;
