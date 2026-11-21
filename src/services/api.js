import axios from 'axios';
import {
    limpiarSesion,
    SESSION_EXPIRED_EVENT,
    TOKEN_KEY
} from './authSession';

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Agregar JWT automáticamente a las solicitudes
api.interceptors.request.use(
    function (config) {
        const token = sessionStorage.getItem(TOKEN_KEY);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

function esRutaDeAutenticacion(url = '') {
    const ruta = url.split('?')[0].replace(/\/+$/, '');

    return ruta.endsWith('/v1/auth/login') ||
        ruta.endsWith('/v1/auth/login-personal') ||
        ruta.endsWith('/v1/auth/cambiar-password');
}

api.interceptors.response.use(
    function (respuesta) {
        return respuesta;
    },
    function (error) {
        const config = error.config || error.response?.config;
        const autorizacion =
            config?.headers?.Authorization ||
            config?.headers?.authorization;
        const estado = error.response?.status;

        if (
            estado === 401 &&
            autorizacion?.startsWith('Bearer ') &&
            sessionStorage.getItem(TOKEN_KEY) &&
            !esRutaDeAutenticacion(config?.url)
        ) {
            limpiarSesion();
            window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
        }

        return Promise.reject(error);
    }
);

export default api;