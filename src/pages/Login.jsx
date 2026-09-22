import FormularioLogin from "../components/organisms/FormularioLogin.jsx";
import LayoutPrincipal from "../components/templates/LayoutPrincipal.jsx";

function Login() {
  function manejarLogin() {
    alert("Intento de inicio de sesión en Sonido Vivo");
  }

  return (
    <LayoutPrincipal>
      <FormularioLogin onLogin={manejarLogin} />
    </LayoutPrincipal>
  );
}

export default Login;
