<Route path="/detalle/:id" element={<DetalleProducto />} />
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutPrincipal from './components/templates/LayoutPrincipal';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import { Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <LayoutPrincipal>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </LayoutPrincipal>
    </BrowserRouter>
  );
}
export default App;