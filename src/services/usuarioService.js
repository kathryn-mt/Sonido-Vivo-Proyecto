import api from './api';

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

        const mensaje =
            error.response?.data?.mensaje ||
            error.message ||
            'No fue posible actualizar la información del usuario.';

        throw new Error(mensaje);
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
