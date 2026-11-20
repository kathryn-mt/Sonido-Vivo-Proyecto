import api from './api';
import { crearUsuarioDTO } from '../dto/usuario.dto';

const TOKEN_KEY = 'sonido_vivo_token';
const USER_KEY = 'sonido_vivo_usuario';

function normalizarRUN(run) {

    const runSinFormato = String(run || '')
        .replace(/\./g, '')
        .replace(/\s/g, '')
        .replace(/-/g, '')
        .toUpperCase();

    return runSinFormato;
}

function guardarSesion(datos) {

    if (!datos.token || !datos.usuario) {
        throw new Error(
            'La respuesta del servidor no contiene los datos de autenticación'
        );
    }

    const usuario = crearUsuarioDTO(datos.usuario);

    sessionStorage.setItem(
        TOKEN_KEY,
        datos.token
    );

    sessionStorage.setItem(
        USER_KEY,
        JSON.stringify(usuario)
    );

    return {
        mensaje: datos.mensaje,
        usuario: usuario
    };
}

// ==========================================
// INICIAR SESIÓN
// ==========================================

export async function iniciarSesion(datosCredenciales) {

    try {

        const respuesta = await api.post(
            '/v1/auth/login',
            {
                email: datosCredenciales.email.trim(),
                password: datosCredenciales.password
            }
        );

        const datos = respuesta.data;

        return guardarSesion(datos);

    } catch (error) {

        const mensaje =
            error.response?.data?.mensaje ||
            error.message ||
            'No fue posible iniciar sesión';

        throw new Error(mensaje);
    }
}

export async function iniciarSesionPersonal(datosCredenciales) {

    try {

        const respuesta = await api.post(
            '/v1/auth/login-personal',
            {
                run: normalizarRUN(datosCredenciales.run),
                password: datosCredenciales.password
            }
        );

        const datos = respuesta.data;

        return guardarSesion(datos);

    } catch (error) {

        const mensaje =
            error.response?.data?.mensaje ||
            error.message ||
            'No fue posible iniciar sesión';

        throw new Error(mensaje);
    }
}

// ==========================================
// OBTENER TOKEN
// ==========================================

export function obtenerToken() {

    return sessionStorage.getItem(TOKEN_KEY);
}

// ==========================================
// OBTENER USUARIO AUTENTICADO
// ==========================================

export function obtenerUsuario() {

    const usuario = sessionStorage.getItem(USER_KEY);

    if (!usuario) {
        return null;
    }

    try {
        return JSON.parse(usuario);
    } catch {
        return null;
    }
}

// ==========================================
// COMPROBAR SESIÓN
// ==========================================

export function estaAutenticado() {

    return Boolean(obtenerToken());
}

// ==========================================
// CERRAR SESIÓN
// ==========================================

export function cerrarSesion() {

    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
}