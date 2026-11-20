import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FormularioLogin from '../components/organisms/FormularioLogin.jsx';
import LayoutPrincipal from '../components/templates/LayoutPrincipal.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina';
import {
    iniciarSesion,
    iniciarSesionPersonal
} from '../services/authService';

const MODO_PERSONAL = 'PERSONAL';

function Login() {

    useTituloPagina('Iniciar sesión');

    const navigate = useNavigate();

    const estadoErrorLogin = useState('');
    const errorLogin = estadoErrorLogin[0];
    const setErrorLogin = estadoErrorLogin[1];

    async function manejarLogin(modoAcceso, datosCredenciales) {

        setErrorLogin('');

        try {

            let resultado = null;

            if (modoAcceso === MODO_PERSONAL) {
                resultado = await iniciarSesionPersonal(
                    datosCredenciales
                );
            } else {
                resultado = await iniciarSesion(
                    datosCredenciales
                );
            }

            const usuarioAutenticado = resultado.usuario;
            const rolUsuario = usuarioAutenticado.rol;

            if (rolUsuario === 'ADMINISTRADOR') {
                navigate('/admin', { replace: true });

            } else if (rolUsuario === 'VENDEDOR') {
                navigate('/vendedor', { replace: true });

            } else {
                navigate('/catalogo', { replace: true });
            }

        } catch (error) {

            setErrorLogin(
                error.message || 'No fue posible iniciar sesión'
            );

        }
    }

    return (
        <LayoutPrincipal>
            <FormularioLogin
                onLogin={manejarLogin}
                error={errorLogin}
                limpiarError={function() {
                    setErrorLogin('');
                }}
            />
        </LayoutPrincipal>
    );
}

export default Login;
