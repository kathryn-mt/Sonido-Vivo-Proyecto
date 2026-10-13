
import { useState } from 'react';
import FormularioLogin from '../components/organisms/FormularioLogin.jsx';
import LayoutPrincipal from '../components/templates/LayoutPrincipal.jsx';
import {useTituloPagina} from '../hooks/useTituloPagina';
function Login() {
  useTituloPagina('Iniciar sesión');

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
