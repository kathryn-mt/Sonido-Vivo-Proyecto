import api from './api';
import { crearUsuarioDTO } from '../dto/usuario.dto';
import {
    limpiarSesion,
    TOKEN_KEY,
    USER_KEY
} from './authSession';

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

export async function cambiarPassword(passwordActual, passwordNueva) {

    try {

        const respuesta = await api.patch(
            '/v1/auth/cambiar-password',
            {
                passwordActual: passwordActual,
                passwordNueva: passwordNueva
            }
        );

        return respuesta.data.mensaje;

    } catch (error) {

        const mensaje =
            error.response?.data?.mensaje ||
            error.message ||
            'No fue posible cambiar la contraseña';

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

    const token = obtenerToken();

    if (!token || !tokenTieneExpiracionValida(token)) {
        if (token) {
            cerrarSesion();
        }

        return false;
    }

    return true;
}

function decodificarSegmentoJWT(segmento) {
    if (!/^[A-Za-z0-9_-]+$/.test(segmento)) {
        return null;
    }

    const base64 = segmento
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(Math.ceil(segmento.length / 4) * 4, '=');

    try {
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

function tokenTieneExpiracionValida(token) {
    const segmentos = token.split('.');

    if (
        segmentos.length !== 3 ||
        segmentos.some(segmento => !segmento || segmento.length % 4 === 1)
    ) {
        return false;
    }

    const encabezado = decodificarSegmentoJWT(segmentos[0]);
    const declaraciones = decodificarSegmentoJWT(segmentos[1]);

    if (
        !encabezado ||
        typeof encabezado !== 'object' ||
        Array.isArray(encabezado) ||
        !declaraciones ||
        typeof declaraciones !== 'object' ||
        Array.isArray(declaraciones) ||
        typeof declaraciones.exp !== 'number' ||
        !Number.isFinite(declaraciones.exp)
    ) {
        return false;
    }

    return declaraciones.exp > Date.now() / 1000;
}

// ==========================================
// CERRAR SESIÓN
// ==========================================

export function cerrarSesion() {

    limpiarSesion();
}