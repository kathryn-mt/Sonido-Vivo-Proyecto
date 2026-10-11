
import { useState } from 'react';
import FormularioLogin from '../components/organisms/FormularioLogin.jsx';
import LayoutPrincipal from '../components/templates/LayoutPrincipal.jsx';

function Login() {
  const [mensaje, setMensaje] = useState('');

  function manejarLogin() {
    setMensaje(
      'Formulario validado correctamente. La autenticación aún no está implementada.'
    );
  }

  return (
    <LayoutPrincipal>
      <FormularioLogin onLogin={manejarLogin} />

      {mensaje && (
        <p
          role="status"
          className="text-success text-center mt-3"
        >
          {mensaje}
        </p>
      )}
    </LayoutPrincipal>
  );
}

export default Login;
