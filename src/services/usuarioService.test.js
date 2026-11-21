import { afterEach, describe, expect, it, vi } from 'vitest';

const apiMock = vi.hoisted(function() {
    return {
        get: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        post: vi.fn(),
        delete: vi.fn()
    };
});

vi.mock('./api.js', function() {
    return {
        default: apiMock
    };
});

import {
    actualizarPerfilUsuario,
    actualizarUsuario,
    desactivarUsuario,
    listarUsuarios,
    obtenerPerfilUsuario,
    registrarVendedor,
    reactivarUsuario
} from './usuarioService.js';

describe('Servicio de usuario', function() {

    afterEach(function() {
        vi.clearAllMocks();
    });

    it('consulta el perfil por el identificador de sesión', async function() {
        const usuario = {
            id: 42,
            nombre: 'Ana',
            apellido: 'Pérez',
            email: 'ana@example.cl',
            run: '12345678K'
        };
        apiMock.get.mockResolvedValue({
            data: {
                mensaje: 'Perfil obtenido',
                usuario: usuario
            }
        });

        const perfil = await obtenerPerfilUsuario(42);

        expect(apiMock.get).toHaveBeenCalledWith('/v1/usuarios/42');
        expect(perfil).toEqual(usuario);
    });

    it('lista usuarios desde el endpoint de administración', async function() {
        const usuarios = [{ id: 8, nombre: 'Luis', password_hash: 'no-exponer' }];
        apiMock.get.mockResolvedValue({
            data: { mensaje: 'Usuarios obtenidos', total: 1, usuarios }
        });

        await expect(listarUsuarios()).resolves.toEqual({
            mensaje: 'Usuarios obtenidos',
            total: 1,
            usuarios
        });
        expect(apiMock.get).toHaveBeenCalledWith('/v1/usuarios');
    });

    it('rechaza respuestas de listado con estructura inválida', async function() {
        apiMock.get.mockResolvedValue({ data: { usuarios: null } });

        await expect(listarUsuarios()).rejects.toThrow(
            'La respuesta del servidor no contiene una lista de usuarios.'
        );
    });

    it('actualiza los campos administrativos y permite omitir el rol propio', async function() {
        apiMock.put.mockResolvedValue({ data: { mensaje: 'Usuario actualizado' } });
        const datos = {
            nombre: 'Luis',
            apellido: 'Pérez',
            email: 'luis@example.cl',
            run: '123456785',
            region: 'valparaiso',
            comuna: 'Viña del Mar',
            direccion: 'Calle Nueva 456',
            password: 'no-enviar',
            rol: undefined
        };

        await actualizarUsuario(8, datos);

        expect(apiMock.put).toHaveBeenCalledWith('/v1/usuarios/8', {
            nombre: 'Luis',
            apellido: 'Pérez',
            correo: 'luis@example.cl',
            run: '123456785',
            region: 'valparaiso',
            comuna: 'Viña del Mar',
            direccion: 'Calle Nueva 456'
        });
    });

    it('envía el cambio de rol cuando está permitido', async function() {
        apiMock.put.mockResolvedValue({ data: { mensaje: 'Rol actualizado' } });

        await actualizarUsuario(8, {
            nombre: 'Luis',
            apellido: 'Pérez',
            email: 'luis@example.cl',
            run: '123456785',
            region: 'valparaiso',
            comuna: 'Viña del Mar',
            direccion: 'Calle Nueva 456',
            rol: 'ADMINISTRADOR'
        });

        expect(apiMock.put.mock.calls[0][1].rol).toBe('ADMINISTRADOR');
    });

    it('desactiva usuarios mediante DELETE y conserva el mensaje del servidor', async function() {
        apiMock.delete.mockResolvedValue({ data: { mensaje: 'Usuario desactivado' } });

        await expect(desactivarUsuario(8)).resolves.toEqual({
            mensaje: 'Usuario desactivado'
        });
        expect(apiMock.delete).toHaveBeenCalledWith('/v1/usuarios/8');
    });

    it('propaga errores del servidor al desactivar un usuario', async function() {
        apiMock.delete.mockRejectedValue({
            response: { data: { mensaje: 'No tienes permiso para desactivar' } }
        });

        await expect(desactivarUsuario(8)).rejects.toThrow(
            'No tienes permiso para desactivar'
        );
    });

    it('reactiva usuarios mediante PATCH y devuelve el mensaje del servidor', async function() {
        apiMock.patch.mockResolvedValue({
            status: 200,
            data: { mensaje: 'Usuario reactivado correctamente' }
        });

        await expect(reactivarUsuario(8)).resolves.toEqual({
            mensaje: 'Usuario reactivado correctamente'
        });
        expect(apiMock.patch).toHaveBeenCalledWith('/v1/usuarios/8/reactivar');
    });

    it.each([
        [403, 'No tienes permisos para reactivar usuarios.'],
        [404, 'No se encontró el usuario que intentas reactivar.'],
        [409, 'El usuario ya está activo.']
    ])('explica el error HTTP %s al reactivar', async function(estado, mensaje) {
        apiMock.patch.mockRejectedValue({
            response: { status: estado, data: {} }
        });

        await expect(reactivarUsuario(8)).rejects.toThrow(mensaje);
    });

    it('envía solo los cinco campos personales permitidos al actualizar', async function() {
        apiMock.put.mockResolvedValue({
            data: {
                mensaje: 'Perfil actualizado'
            }
        });
        const datosPersonales = {
            nombre: 'Camila',
            apellido: 'González',
            region: 'valparaiso',
            comuna: 'Viña del Mar',
            direccion: 'Calle Nueva 456',
            run: 'no-debe-enviarse',
            email: 'no-debe-enviarse@example.cl',
            rol: 'ADMINISTRADOR',
            id_rol: 1,
            activo: true,
            password: 'no-debe-enviarse',
            password_hash: 'no-debe-enviarse',
            id_usuario: 999
        };

        const respuesta = await actualizarPerfilUsuario(42, datosPersonales);

        expect(apiMock.put).toHaveBeenCalledWith(
            '/v1/usuarios/42',
            {
                nombre: 'Camila',
                apellido: 'González',
                region: 'valparaiso',
                comuna: 'Viña del Mar',
                direccion: 'Calle Nueva 456'
            }
        );
        expect(respuesta.mensaje).toBe('Perfil actualizado');
    });

    it('muestra el mensaje de error devuelto por el backend', async function() {
        apiMock.put.mockRejectedValue({
            response: {
                data: {
                    mensaje: 'La actualización no está permitida'
                }
            }
        });

        await expect(
            actualizarPerfilUsuario(42, {
                nombre: 'Camila',
                apellido: 'González',
                region: 'valparaiso',
                comuna: 'Viña del Mar',
                direccion: 'Calle Nueva 456'
            })
        ).rejects.toThrow('La actualización no está permitida');
    });

    it('crea un vendedor enviando solo los campos aceptados por el endpoint', async function() {
        apiMock.post.mockResolvedValue({
            data: {
                mensaje: 'Vendedor creado'
            }
        });
        const datosVendedor = {
            nombre: 'Camila',
            apellido: 'González',
            run: '123456785',
            email: 'camila@example.cl',
            password: 'clave-de-prueba',
            region: 'valparaiso',
            comuna: 'Viña del Mar',
            direccion: 'Calle Nueva 456',
            passwordConfirm: 'no-debe-enviarse',
            rol: 'ADMINISTRADOR'
        };

        const respuesta = await registrarVendedor(datosVendedor);

        expect(apiMock.post).toHaveBeenCalledWith(
            '/v1/usuarios',
            {
                nombre: 'Camila',
                apellido: 'González',
                run: '123456785',
                correo: 'camila@example.cl',
                password: 'clave-de-prueba',
                region: 'valparaiso',
                comuna: 'Viña del Mar',
                direccion: 'Calle Nueva 456'
            }
        );
        expect(respuesta.mensaje).toBe('Vendedor creado');
    });

    it('propaga errores de duplicidad del backend al registrar vendedor', async function() {
        apiMock.post.mockRejectedValue({
            response: {
                data: {
                    mensaje: 'El RUN ya está registrado'
                }
            }
        });

        await expect(
            registrarVendedor({
                nombre: 'Camila',
                apellido: 'González',
                run: '123456785',
                email: 'camila@example.cl',
                password: 'clave-de-prueba',
                region: 'valparaiso',
                comuna: 'Viña del Mar',
                direccion: 'Calle Nueva 456'
            })
        ).rejects.toThrow('El RUN ya está registrado');
    });

    it('muestra un mensaje de conexión cuando no hay respuesta del servidor', async function() {
        apiMock.post.mockRejectedValue(new Error('Network Error'));

        await expect(
            registrarVendedor({
                nombre: 'Camila',
                apellido: 'González',
                run: '123456785',
                email: 'camila@example.cl',
                password: 'clave-de-prueba',
                region: 'valparaiso',
                comuna: 'Viña del Mar',
                direccion: 'Calle Nueva 456'
            })
        ).rejects.toThrow('No fue posible conectar con el servidor.');
    });
});
