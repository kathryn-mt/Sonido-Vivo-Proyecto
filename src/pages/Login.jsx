
import { useNavigate } from 'react-router-dom';
import FormularioLogin from '../components/organisms/FormularioLogin.jsx';
import LayoutPrincipal from '../components/templates/LayoutPrincipal.jsx';
import {useTituloPagina} from '../hooks/useTituloPagina';

function Login() {
  
  useTituloPagina('Iniciar sesión');

  const navigate = useNavigate();

  function manejarLogin() {
    navigate('/catalogo');
  }

  return (
    <LayoutPrincipal>
      <FormularioLogin onLogin={manejarLogin} />
    </LayoutPrincipal>
  );
}

export default Login;
