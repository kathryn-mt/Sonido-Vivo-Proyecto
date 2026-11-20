import { afterEach, describe, expect, it, vi } from 'vitest';

const apiMock = vi.hoisted(function() {
    return {
        get: vi.fn(),
        put: vi.fn(),
        post: vi.fn()
    };
});

vi.mock('./api.js', function() {
    return {
        default: apiMock
    };
});

import {
    actualizarPerfilUsuario,
    obtenerPerfilUsuario,
    registrarVendedor
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
