import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

import LayoutPrincipal from '../components/templates/LayoutPrincipal';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { opcionesRegiones, regionesComunas } from '../data/regionesComunas';
import { validarRegistro } from '../utils/validacionesRegistro';
import '../styles/registro.css';

// Por ahora solo valida los datos: no guarda usuarios ni contraseñas.
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

// Campos de texto del formulario.
const camposPersonales = [
    { nombre: 'run', etiqueta: 'RUN * (sin puntos ni guion)', tipo: 'text', ejemplo: '19011022K', max: 9 },
    { nombre: 'nombre', etiqueta: 'Nombre *', tipo: 'text', max: 50 },
    { nombre: 'apellidos', etiqueta: 'Apellidos *', tipo: 'text', max: 100 },
    { nombre: 'email', etiqueta: 'Correo electrónico *', tipo: 'email', ejemplo: 'ejemplo@correo.cl', max: 100 }
];

const camposFinales = [
    { nombre: 'direccion', etiqueta: 'Dirección *', tipo: 'text', ejemplo: 'Avenida Libertad 1234', max: 300 },
    { nombre: 'password', etiqueta: 'Contraseña *', tipo: 'password' },
    { nombre: 'passwordConfirm', etiqueta: 'Confirmar contraseña *', tipo: 'password' }
];

function Registro() {
    useTituloPagina('Crear cuenta');

    const [datos, setDatos] = useState({ ...datosIniciales });
    const [errores, setErrores] = useState({});
    const [mensaje, setMensaje] = useState('');

    const comunas = regionesComunas[datos.region] ?? [];

    function manejarCambio(e) {
        const { name, value } = e.target;

        setDatos(actual => name === 'region'
            ? { ...actual, region: value, comuna: '' }
            : { ...actual, [name]: value }
        );

        setErrores(actual => name === 'region'
            ? { ...actual, region: '', comuna: '' }
            : { ...actual, [name]: '' }
        );
        setMensaje('');
    }

    function manejarEnvio(e) {
        e.preventDefault();

        const nuevosErrores = validarRegistro(datos);
        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) return;

        setMensaje('¡Formulario validado correctamente!');
        setDatos({ ...datosIniciales });
    }

    function mostrarCampo(campo) {
        return (
            <Form.Group className="mb-3" controlId={`registro-${campo.nombre}`} key={campo.nombre}>
                <Form.Label>{campo.etiqueta}</Form.Label>
                <Form.Control
                    name={campo.nombre}
                    type={campo.tipo}
                    placeholder={campo.ejemplo}
                    maxLength={campo.max}
                    value={datos[campo.nombre]}
                    onChange={manejarCambio}
                    isInvalid={Boolean(errores[campo.nombre])}
                    autoComplete={campo.tipo === 'password' ? 'new-password' : 'off'}
                />
                <Form.Control.Feedback type="invalid">
                    {errores[campo.nombre]}
                </Form.Control.Feedback>
            </Form.Group>
        );
    }

    return (
        <LayoutPrincipal>
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={10} lg={7}>
                        <Card className="formulario-registro p-3 p-md-4 shadow-sm">
                            <Card.Body>
                                <h1 className="h2 text-center mb-3">Crear cuenta</h1>

                                <Form noValidate onSubmit={manejarEnvio}>
                                    {camposPersonales.map(mostrarCampo)}

                                    <Form.Group className="mb-3" controlId="registro-region">
                                        <Form.Label>Región *</Form.Label>
                                        <Form.Select
                                            name="region"
                                            value={datos.region}
                                            onChange={manejarCambio}
                                            isInvalid={Boolean(errores.region)}
                                        >
                                            <option value="">Selecciona una región</option>
                                            {opcionesRegiones.map(region => (
                                                <option key={region.valor} value={region.valor}>
                                                    {region.nombre}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="registro-comuna">
                                        <Form.Label>Comuna *</Form.Label>
                                        <Form.Select
                                            name="comuna"
                                            value={datos.comuna}
                                            onChange={manejarCambio}
                                            disabled={!datos.region}
                                            isInvalid={Boolean(errores.comuna)}
                                        >
                                            <option value="">
                                                {datos.region ? 'Selecciona una comuna' : 'Primero selecciona una región'}
                                            </option>
                                            {comunas.map(comuna => (
                                                <option key={comuna} value={comuna}>{comuna}</option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
                                    </Form.Group>

                                    {camposFinales.map(mostrarCampo)}

                                    {mensaje && (
                                        <Alert variant="success" role="status" className="mt-3">
                                            {mensaje}
                                        </Alert>
                                    )}

                                    <Button type="submit" className="w-100">
                                        Registrarse
                                    </Button>

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
