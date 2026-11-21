import { Badge, Button, Table } from 'react-bootstrap';

function TablaUsuarios(props) {
    return (
        <Table striped bordered hover responsive className="align-middle">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Correo electrónico</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {props.usuarios.map(function(usuario) {
                    const esPropio = props.esUsuarioActual(usuario);

                    return (
                        <tr key={usuario.id}>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.apellido}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.rol}</td>
                            <td>
                                <Badge bg={usuario.activo ? 'success' : 'secondary'}>
                                    {usuario.activo === null
                                        ? 'Estado desconocido'
                                        : usuario.activo ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </td>
                            <td className="text-nowrap">
                                {usuario.activo === true ? (
                                    <>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => props.onEditar(usuario)}
                                        >
                                            Editar
                                        </Button>
                                        {!esPropio && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => props.onDesactivar(usuario)}
                                            >
                                                Desactivar
                                            </Button>
                                        )}
                                    </>
                                ) : usuario.activo === false ? (
                                    <Button
                                        variant="outline-success"
                                        size="sm"
                                        onClick={() => props.onReactivar(usuario)}
                                    >
                                        Reactivar
                                    </Button>
                                ) : (
                                    <span aria-label="Sin acciones">—</span>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

export default TablaUsuarios;
