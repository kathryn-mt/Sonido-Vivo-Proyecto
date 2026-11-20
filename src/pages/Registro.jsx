import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Form,
    Row
} from 'react-bootstrap';

import api from '../services/api';

import LayoutPrincipal from '../components/templates/LayoutPrincipal';
import { useTituloPagina } from '../hooks/useTituloPagina';

import {
    opcionesRegiones,
    regionesComunas
} from '../data/regionesComunas';

import { validarRegistro } from '../utils/validacionesRegistro';

import '../styles/registro.css';


// ==========================================
// DATOS INICIALES
// ==========================================

const datosIniciales = {
    run: '',
    nombre: '',
    apellidos: '',
    email: '',
    region: '',
    comuna: '',
    direccion: '',
    password: '',
    passwordConfirm: ''
};


// ==========================================
// CAMPOS PERSONALES
// ==========================================

const camposPersonales = [
    {
        nombre: 'run',
        etiqueta: 'RUN * (sin puntos ni guion)',
        tipo: 'text',
        ejemplo: '19011022K',
        max: 9
    },
    {
        nombre: 'nombre',
        etiqueta: 'Nombre *',
        tipo: 'text',
        max: 50
    },
    {
        nombre: 'apellidos',
        etiqueta: 'Apellidos *',
        tipo: 'text',
        max: 100
    },
    {
        nombre: 'email',
        etiqueta: 'Correo electrónico *',
        tipo: 'email',
        ejemplo: 'ejemplo@correo.cl',
        max: 100
    }
];


// ==========================================
// CAMPOS FINALES
// ==========================================

const camposFinales = [
    {
        nombre: 'direccion',
        etiqueta: 'Dirección *',
        tipo: 'text',
        ejemplo: 'Avenida Libertad 1234',
        max: 300
    },
    {
        nombre: 'password',
        etiqueta: 'Contraseña *',
        tipo: 'password'
    },
    {
        nombre: 'passwordConfirm',
        etiqueta: 'Confirmar contraseña *',
        tipo: 'password'
    }
];


// ==========================================
// COMPONENTE REGISTRO
// ==========================================

function Registro() {

    useTituloPagina('Crear cuenta');


    // ESTADO DE LOS DATOS

    const estadoDatos = useState(
        Object.assign({}, datosIniciales)
    );

    const datos = estadoDatos[0];
    const setDatos = estadoDatos[1];


    // ESTADO DE LOS ERRORES

    const estadoErrores = useState({});

    const errores = estadoErrores[0];
    const setErrores = estadoErrores[1];


    // ESTADO DEL MENSAJE

    const estadoMensaje = useState('');

    const mensaje = estadoMensaje[0];
    const setMensaje = estadoMensaje[1];


    // ESTADO DEL ERROR DEL SERVIDOR

    const estadoErrorServidor = useState('');

    const errorServidor = estadoErrorServidor[0];
    const setErrorServidor = estadoErrorServidor[1];


    // ESTADO DE CARGA

    const estadoCargando = useState(false);

    const cargando = estadoCargando[0];
    const setCargando = estadoCargando[1];


    // COMUNAS SEGÚN REGIÓN

    const comunas = regionesComunas[datos.region] || [];


    // ==========================================
    // MANEJAR CAMBIOS DEL FORMULARIO
    // ==========================================

    function manejarCambio(evento) {

        const nombre = evento.target.name;
        const valor = evento.target.value;

        setDatos(function (datosActuales) {

            const nuevosDatos = Object.assign(
                {},
                datosActuales
            );

            nuevosDatos[nombre] = valor;

            if (nombre === 'region') {
                nuevosDatos.comuna = '';
            }

            return nuevosDatos;
        });

        setErrores(function (erroresActuales) {

            const nuevosErrores = Object.assign(
                {},
                erroresActuales
            );

            nuevosErrores[nombre] = '';

            if (nombre === 'region') {
                nuevosErrores.comuna = '';
            }

            return nuevosErrores;
        });

        setMensaje('');
        setErrorServidor('');
    }


    // ==========================================
    // REGISTRAR USUARIO EN POSTGRESQL
    // ==========================================

    async function manejarEnvio(evento) {

        evento.preventDefault();

        if (cargando) {
            return;
        }

        setMensaje('');
        setErrorServidor('');

        // VALIDAR FORMULARIO

        const nuevosErrores = validarRegistro(datos);

        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) {
            return;
        }

        // PREPARAR DATOS PARA EL BACKEND

        const datosRegistro = {
            run: datos.run.trim(),
            nombre: datos.nombre.trim(),
            apellido: datos.apellidos.trim(),
            email: datos.email.trim(),
            region: datos.region,
            comuna: datos.comuna,
            direccion: datos.direccion.trim(),
            password: datos.password
        };

        setCargando(true);

        try {

            // ENVIAR REGISTRO AL BACKEND

            const respuesta = await api.post(
                '/v1/auth/registro',
                datosRegistro
            );

            // CONFIRMAR REGISTRO REAL

            setMensaje(
                respuesta.data.mensaje ||
                'Usuario registrado correctamente.'
            );

            // LIMPIAR FORMULARIO DESPUÉS DEL ÉXITO

            setDatos(
                Object.assign({}, datosIniciales)
            );

            setErrores({});

        } catch (error) {

            // MOSTRAR MENSAJE DEL BACKEND

            const mensajeError =
                error.response?.data?.mensaje ||
                error.message ||
                'No fue posible registrar el usuario.';

            setErrorServidor(mensajeError);

        } finally {

            setCargando(false);
        }
    }


    // ==========================================
    // MOSTRAR CAMPOS DEL FORMULARIO
    // ==========================================

    function mostrarCampo(campo) {

        return (

            <Form.Group
                className="mb-3"
                controlId={`registro-${campo.nombre}`}
                key={campo.nombre}
            >

                <Form.Label>
                    {campo.etiqueta}
                </Form.Label>

                <Form.Control
                    name={campo.nombre}
                    type={campo.tipo}
                    placeholder={campo.ejemplo}
                    maxLength={campo.max}
                    value={datos[campo.nombre]}
                    onChange={manejarCambio}
                    isInvalid={Boolean(
                        errores[campo.nombre]
                    )}
                    disabled={cargando}
                    autoComplete={
                        campo.tipo === 'password'
                            ? 'new-password'
                            : 'off'
                    }
                />

                <Form.Control.Feedback type="invalid">
                    {errores[campo.nombre]}
                </Form.Control.Feedback>

            </Form.Group>
        );
    }


    // ==========================================
    // MOSTRAR PÁGINA
    // ==========================================

    return (

        <LayoutPrincipal>

            <Container className="py-5">

                <Row className="justify-content-center">

                    <Col xs={12} md={10} lg={7}>

                        <Card className="formulario-registro p-3 p-md-4 shadow-sm">

                            <Card.Body>

                                <h1 className="h2 text-center mb-3">
                                    Crear cuenta
                                </h1>

                                <Form
                                    noValidate
                                    onSubmit={manejarEnvio}
                                >

                                    {/* DATOS PERSONALES */}

                                    {camposPersonales.map(
                                        mostrarCampo
                                    )}


                                    {/* REGIÓN */}

                                    <Form.Group
                                        className="mb-3"
                                        controlId="registro-region"
                                    >

                                        <Form.Label>
                                            Región *
                                        </Form.Label>

                                        <Form.Select
                                            name="region"
                                            value={datos.region}
                                            onChange={manejarCambio}
                                            isInvalid={Boolean(
                                                errores.region
                                            )}
                                            disabled={cargando}
                                        >

                                            <option value="">
                                                Selecciona una región
                                            </option>

                                            {opcionesRegiones.map(
                                                function (region) {

                                                    return (
                                                        <option
                                                            key={region.valor}
                                                            value={region.valor}
                                                        >
                                                            {region.nombre}
                                                        </option>
                                                    );
                                                }
                                            )}

                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errores.region}
                                        </Form.Control.Feedback>

                                    </Form.Group>


                                    {/* COMUNA */}

                                    <Form.Group
                                        className="mb-3"
                                        controlId="registro-comuna"
                                    >

                                        <Form.Label>
                                            Comuna *
                                        </Form.Label>

                                        <Form.Select
                                            name="comuna"
                                            value={datos.comuna}
                                            onChange={manejarCambio}
                                            disabled={
                                                !datos.region ||
                                                cargando
                                            }
                                            isInvalid={Boolean(
                                                errores.comuna
                                            )}
                                        >

                                            <option value="">

                                                {datos.region
                                                    ? 'Selecciona una comuna'
                                                    : 'Primero selecciona una región'}

                                            </option>

                                            {comunas.map(
                                                function (comuna) {

                                                    return (
                                                        <option
                                                            key={comuna}
                                                            value={comuna}
                                                        >
                                                            {comuna}
                                                        </option>
                                                    );
                                                }
                                            )}

                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errores.comuna}
                                        </Form.Control.Feedback>

                                    </Form.Group>


                                    {/* CAMPOS FINALES */}

                                    {camposFinales.map(
                                        mostrarCampo
                                    )}


                                    {/* MENSAJE DE ÉXITO */}

                                    {mensaje && (

                                        <Alert
                                            variant="success"
                                            role="status"
                                            className="mt-3"
                                        >

                                            {mensaje}

                                            <div className="mt-2">

                                                <Link to="/login">
                                                    Iniciar sesión
                                                </Link>

                                            </div>

                                        </Alert>
                                    )}


                                    {/* ERROR DEL BACKEND */}

                                    {errorServidor && (

                                        <Alert
                                            variant="danger"
                                            role="alert"
                                            className="mt-3"
                                        >

                                            {errorServidor}

                                        </Alert>
                                    )}


                                    {/* BOTÓN REGISTRARSE */}

                                    <Button
                                        type="submit"
                                        className="w-100"
                                        disabled={cargando}
                                    >

                                        {cargando
                                            ? 'Registrando...'
                                            : 'Registrarse'}

                                    </Button>


                                    {/* ENLACE A LOGIN */}

                                    <p className="text-center mt-3 mb-0">

                                        ¿Ya tienes cuenta?{' '}

                                        <Link to="/login">
                                            Inicia sesión
                                        </Link>

                                    </p>

                                </Form>

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>

            </Container>

        </LayoutPrincipal>
    );
}

export default Registro;