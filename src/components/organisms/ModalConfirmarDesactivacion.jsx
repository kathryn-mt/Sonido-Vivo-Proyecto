import { Alert, Button, Modal, Spinner } from 'react-bootstrap';

function ModalConfirmarDesactivacion(props) {
    const reactivando = props.accion === 'reactivar';

    return (
        <Modal
            show={Boolean(props.usuario)}
            onHide={props.procesando ? undefined : props.onCancelar}
            centered
        >
            <Modal.Header closeButton={!props.procesando}>
                <Modal.Title>
                    {reactivando ? 'Confirmar reactivación' : 'Confirmar desactivación'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.error && <Alert variant="danger" role="alert">{props.error}</Alert>}
                {reactivando ? (
                    <p className="mb-0">
                        ¿Reactivar la cuenta de {props.usuario?.nombre} {props.usuario?.apellido}?
                        El usuario recuperará el acceso a Sonido Vivo.
                    </p>
                ) : (
                    <>
                        <p>
                            ¿Desactivar la cuenta de {props.usuario?.nombre} {props.usuario?.apellido}?
                        </p>
                        <p className="mb-0">
                            El usuario perderá el acceso y no podrá iniciar sesión. Sus datos
                            permanecerán guardados en PostgreSQL.
                        </p>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={props.onCancelar}
                    disabled={props.procesando}
                >
                    Cancelar
                </Button>
                <Button
                    variant={reactivando ? 'success' : 'danger'}
                    onClick={props.onConfirmar}
                    disabled={props.procesando}
                >
                    {props.procesando ? (
                        <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            {reactivando ? 'Reactivando...' : 'Desactivando...'}
                        </>
                    ) : reactivando ? 'Confirmar reactivación' : 'Confirmar desactivación'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalConfirmarDesactivacion;
