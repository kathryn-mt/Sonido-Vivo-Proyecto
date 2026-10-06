import { Link } from 'react-router-dom';
import Boton from '../atoms/Boton';

function TarjetaProducto({ producto }) {
  const { id, nombre, precio, imagen, marca } = producto;

  return (
    <div className="card h-100 shadow-sm">
      <img
        src={imagen}
        className="card-img-top"
        alt={nombre}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{nombre}</h5>
        <p className="card-text text-muted">{marca}</p>
        <p className="card-text fw-bold fs-5">${precio.toLocaleString()}</p>
        
        <div className="mt-auto">
          <Link to={`/detalle/${id}`} className="text-decoration-none">
            <Boton texto="Ver detalle" variante="outline-primary" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TarjetaProducto;