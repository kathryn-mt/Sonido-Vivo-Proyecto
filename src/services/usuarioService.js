import api from './api';

function obtenerMensajeError(error, mensajePredeterminado) {
    return error.response?.data?.mensaje ||
        error.message ||
        mensajePredeterminado;
}

export async function listarUsuarios() {
    try {
        const respuesta = await api.get('/v1/usuarios');
        const usuarios = respuesta.data?.usuarios;

        if (!Array.isArray(usuarios)) {
            throw new Error('La respuesta del servidor no contiene una lista de usuarios.');
        }

        return respuesta.data;
    } catch (error) {
        throw new Error(obtenerMensajeError(
            error,
            'No fue posible obtener la lista de usuarios.'
        ));
    }
}

export async function obtenerPerfilUsuario(idUsuario) {

    try {

        const respuesta = await api.get(
            `/v1/usuarios/${encodeURIComponent(idUsuario)}`
        );

        if (!respuesta.data.usuario || typeof respuesta.data.usuario !== 'object') {
            throw new Error('La respuesta del servidor no contiene el perfil del usuario.');
        }

        return respuesta.data.usuario;

    } catch (error) {

        const mensaje =
            error.response?.data?.mensaje ||
            error.message ||
            'No fue posible obtener la información del usuario.';

        throw new Error(mensaje);
    }
}

export async function actualizarUsuario(idUsuario, datosUsuario) {
    try {
        const respuesta = await api.put(
            `/v1/usuarios/${encodeURIComponent(idUsuario)}`,
            {
                nombre: datosUsuario.nombre,
                apellido: datosUsuario.apellido,
                correo: datosUsuario.email,
                run: datosUsuario.run,
                region: datosUsuario.region,
                comuna: datosUsuario.comuna,
                direccion: datosUsuario.direccion,
                ...(datosUsuario.rol ? { rol: datosUsuario.rol } : {})
            }
        );

        if (!respuesta.data.mensaje) {
            throw new Error('El servidor no confirmó la actualización del usuario.');
        }

        return respuesta.data;
    } catch (error) {
        const mensaje =
            error.response?.data?.mensaje ||
            error.message ||
            'No fue posible actualizar la información del usuario.';

        throw new Error(mensaje);
    }
}

export async function desactivarUsuario(idUsuario) {
    try {
        const respuesta = await api.delete(
            `/v1/usuarios/${encodeURIComponent(idUsuario)}`
        );

        if (!respuesta.data.mensaje) {
            throw new Error('El servidor no confirmó la desactivación del usuario.');
        }

        return respuesta.data;
    } catch (error) {
        throw new Error(obtenerMensajeError(
            error,
            'No fue posible desactivar al usuario.'
        ));
    }
}

export async function reactivarUsuario(idUsuario) {
    try {
        const respuesta = await api.patch(
            `/v1/usuarios/${encodeURIComponent(idUsuario)}/reactivar`
        );

        return respuesta.data || {};
    } catch (error) {
        const estado = error.response?.status;
        const mensajeServidor = error.response?.data?.mensaje;
        const mensajesPorEstado = {
            403: 'No tienes permisos para reactivar usuarios.',
            404: 'No se encontró el usuario que intentas reactivar.',
            409: 'El usuario ya está activo.'
        };
        const mensaje =
            mensajeServidor ||
            mensajesPorEstado[estado] ||
            (!error.response && 'No fue posible conectar con el servidor. Inténtalo nuevamente.') ||
            error.message ||
            'No fue posible reactivar al usuario.';

        throw new Error(mensaje);
    }
}

export async function actualizarPerfilUsuario(idUsuario, datosPersonales) {

    try {

        const respuesta = await api.put(
            `/v1/usuarios/${encodeURIComponent(idUsuario)}`,
            {
                nombre: datosPersonales.nombre,
                apellido: datosPersonales.apellido,
                region: datosPersonales.region,
                comuna: datosPersonales.comuna,
                direccion: datosPersonales.direccion
            }
        );

        if (!respuesta.data.mensaje) {
            throw new Error('El servidor no confirmó la actualización del perfil.');
        }

        return respuesta.data;

    } catch (error) {

        throw new Error(obtenerMensajeError(
            error,
            'No fue posible actualizar la información del usuario.'
        ));
    }
}

export async function registrarVendedor(datosVendedor) {

    try {

        const respuesta = await api.post(
            '/v1/usuarios',
            {
                nombre: datosVendedor.nombre,
                apellido: datosVendedor.apellido,
                run: datosVendedor.run,
                correo: datosVendedor.email,
                password: datosVendedor.password,
                region: datosVendedor.region,
                comuna: datosVendedor.comuna,
                direccion: datosVendedor.direccion
            }
        );

        return respuesta.data;

    } catch (error) {

        const mensaje =
            error.response?.data?.mensaje ||
            (!error.response && 'No fue posible conectar con el servidor. Inténtalo nuevamente.') ||
            error.message ||
            'No fue posible registrar al vendedor.';

        throw new Error(mensaje);
    }
}
