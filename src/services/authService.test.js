// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const apiMock = vi.hoisted(function() {
  return {
    post: vi.fn(),
    patch: vi.fn()
  };
});

vi.mock('./api.js', function() {
  return {
    default: apiMock
  };
});

import {
  cambiarPassword,
  cerrarSesion,
  iniciarSesionPersonal,
  obtenerUsuario
} from './authService.js';

describe('Servicio de autenticación personal', function() {

  beforeEach(function() {
    sessionStorage.clear();
    apiMock.post.mockReset();
    apiMock.patch.mockReset();
  });

  afterEach(function() {
    cerrarSesion();
  });

  it('normaliza el RUN y guarda la sesión autenticada', async function() {
    apiMock.post.mockResolvedValue({
      data: {
        mensaje: 'Inicio de sesión exitoso',
        token: 'token-simulacion',
        usuario: {
          id: 1,
          nombre: 'Usuario',
          apellido: 'Prueba',
          email: '',
          rol: 'VENDEDOR'
        }
      }
    });

    const resultado = await iniciarSesionPersonal({
      run: '12.345.678-k',
      password: '123456'
    });

    expect(apiMock.post).toHaveBeenCalledWith(
      '/v1/auth/login-personal',
      {
        run: '12345678K',
        password: '123456'
      }
    );

    const usuarioGuardado = obtenerUsuario();

    expect(resultado.usuario.rol).toBe('VENDEDOR');
    expect(usuarioGuardado.rol).toBe('VENDEDOR');
  });

  it('cambia la contraseña y retorna el mensaje del backend', async function() {
    apiMock.patch.mockResolvedValue({
      data: {
        mensaje: 'Contraseña cambiada correctamente'
      }
    });

    const mensaje = await cambiarPassword('actual-segura', 'nueva-segura');

    expect(apiMock.patch).toHaveBeenCalledWith(
      '/v1/auth/cambiar-password',
      {
        passwordActual: 'actual-segura',
        passwordNueva: 'nueva-segura'
      }
    );
    expect(mensaje).toBe('Contraseña cambiada correctamente');
  });

  it('propaga el mensaje de error del backend al cambiar la contraseña', async function() {
    apiMock.patch.mockRejectedValue({
      response: {
        data: {
          mensaje: 'La contraseña actual no es correcta'
        }
      }
    });

    await expect(
      cambiarPassword('incorrecta', 'nueva-segura')
    ).rejects.toThrow('La contraseña actual no es correcta');
  });
});
