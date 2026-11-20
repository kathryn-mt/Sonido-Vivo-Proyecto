
import { Table, Button } from 'react-bootstrap';
import { obtenerUsuario } from '../../services/authService';
function TablaProductos(props) {

  const productos = props.productos;
  const onEditar = props.onEditar;
  const onEliminar = props.onEliminar;
  const usuarioActual = obtenerUsuario();
  const puedeEliminar = usuarioActual?.rol === 'ADMINISTRADOR';
  return (
    <div className="table-responsive">
      <Table striped bordered hover className="align-middle">
        <thead className="table-dark">
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.map(producto => (
            <tr key={producto.id}>
              <td>{producto.codigo}</td>
              <td>{producto.nombre}</td>
              <td>
                ${Number(producto.precio).toLocaleString('es-CL')}
              </td>
              <td>{producto.stock}</td>
              <td>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => onEditar(producto.id)}
                  >
                    Editar
                  </Button>

                  {puedeEliminar && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onEliminar(producto.id)}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {productos.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center">
                No hay productos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default TablaProductos;
