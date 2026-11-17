
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FormularioLogin from '../components/organisms/FormularioLogin.jsx';
import LayoutPrincipal from '../components/templates/LayoutPrincipal.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { iniciarSesion } from '../services/authService';

function Login() {

    useTituloPagina('Iniciar sesión');

    const navigate = useNavigate();

    const [errorLogin, setErrorLogin] = useState('');

    async function manejarLogin(datosCredenciales) {

        setErrorLogin('');

        try {

            const resultado = await iniciarSesion(
                datosCredenciales
            );

            if (resultado.usuario.rol === 'ADMINISTRADOR') {

                navigate('/admin', { replace: true });

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
            />
        </LayoutPrincipal>
    );
}

export default Login;
