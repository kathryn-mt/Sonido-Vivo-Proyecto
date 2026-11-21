import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';

function FormularioEdicionUsuario(props) {
    return (
        <Modal
            show={props.mostrar}
            onHide={props.onCancelar}
            size="lg"
            centered
        >
            <Form noValidate onSubmit={props.onGuardar}>
                <Modal.Header closeButton={!props.guardando}>
                    <Modal.Title>Editar usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.cargandoDetalle && (
                        <div className="d-flex align-items-center gap-2" role="status">
                            <Spinner animation="border" size="sm" />
                            <span>Cargando datos del usuario...</span>
                        </div>
                    )}
                    {props.error && <Alert variant="danger" role="alert">{props.error}</Alert>}
                    {props.datos && (
                        <>
                            <Form.Group className="mb-3" controlId="adminUsuarioNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    name="nombre"
                                    value={props.datos.nombre}
                                    onChange={props.onCambio}
                                    isInvalid={Boolean(props.errores.nombre)}
                                    maxLength={50}
                                    disabled={props.guardando}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {props.errores.nombre}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="adminUsuarioApellido">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control
                                    name="apellido"
                                    value={props.datos.apellido}
                                    onChange={props.onCambio}
                                    isInvalid={Boolean(props.errores.apellido)}
                                    maxLength={100}
                                    disabled={props.guardando}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {props.errores.apellido}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="adminUsuarioEmail">
                                <Form.Label>Correo electrónico</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={props.datos.email}
                                    onChange={props.onCambio}
                                    isInvalid={Boolean(props.errores.email)}
                                    maxLength={100}
                                    disabled={props.guardando}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {props.errores.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="adminUsuarioRun">
                                <Form.Label>RUN</Form.Label>
                                <Form.Control
                                    name="run"
                                    value={props.datos.run}
                                    onChange={props.onCambio}
                                    isInvalid={Boolean(props.errores.run)}
                                    maxLength={12}
                                    disabled={props.guardando}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {props.errores.run}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="adminUsuarioRegion">
                                <Form.Label>Región</Form.Label>
                                <Form.Select
                                    name="region"
                                    value={props.datos.region}
                                    onChange={props.onCambio}
                                    isInvalid={Boolean(props.errores.region)}
                                    disabled={props.guardando}
                                >
                                    <option value="">Selecciona una región</option>
                                    {props.opcionesRegiones.map(function(region) {
                                        return (
                                            <option key={region.valor} value={region.valor}>
                                                {region.nombre}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {props.errores.region}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="adminUsuarioComuna">
                                <Form.Label>Comuna</Form.Label>
                                <Form.Select
                                    name="comuna"
                                    value={props.datos.comuna}
                                    onChange={props.onCambio}
                                    isInvalid={Boolean(props.errores.comuna)}
                                    disabled={props.guardando || !props.datos.region}
                                >
                                    <option value="">Selecciona una comuna</option>
                                    {props.comunas.map(function(comuna) {
                                        return <option key={comuna} value={comuna}>{comuna}</option>;
                                    })}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {props.errores.comuna}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="adminUsuarioDireccion">
                                <Form.Label>Dirección</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="direccion"
                                    value={props.datos.direccion}
                                    onChange={props.onCambio}
                                    isInvalid={Boolean(props.errores.direccion)}
                                    maxLength={300}
                                    disabled={props.guardando}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {props.errores.direccion}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="adminUsuarioRol">
                                <Form.Label>Rol</Form.Label>
                                <Form.Select
                                    name="rol"
                                    value={props.datos.rol}
                                    onChange={props.onCambio}
                                    isInvalid={Boolean(props.errores.rol)}
                                    disabled={props.guardando || props.esPropiaCuenta}
                                >
                                    {props.roles.map(function(rol) {
                                        return <option key={rol} value={rol}>{rol}</option>;
                                    })}
                                </Form.Select>
                                {props.esPropiaCuenta && (
                                    <Form.Text>No puedes cambiar el rol de tu propia cuenta.</Form.Text>
                                )}
                                <Form.Control.Feedback type="invalid">
                                    {props.errores.rol}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={props.onCancelar}
                        disabled={props.guardando}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={props.guardando || props.cargandoDetalle || !props.datos}
                    >
                        {props.guardando ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default FormularioEdicionUsuario;
