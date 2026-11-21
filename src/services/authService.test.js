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
  estaAutenticado,
  iniciarSesionPersonal,
  obtenerToken,
  obtenerUsuario
} from './authService.js';

function crearTokenPrueba(expiracion) {
  function codificar(valor) {
    return btoa(JSON.stringify(valor))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  return [
    codificar({ alg: 'HS256', typ: 'JWT' }),
    codificar({ exp: expiracion }),
    'firma-de-prueba'
  ].join('.');
}

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

  it('considera autenticado un JWT con expiración futura', function() {
    const token = crearTokenPrueba(Math.floor(Date.now() / 1000) + 3600);
    sessionStorage.setItem('sonido_vivo_token', token);

    expect(estaAutenticado()).toBe(true);
    expect(obtenerToken()).toBe(token);
  });

  it('limpia la sesión cuando el JWT está vencido', function() {
    sessionStorage.setItem(
      'sonido_vivo_token',
      crearTokenPrueba(Math.floor(Date.now() / 1000) - 1)
    );
    sessionStorage.setItem('sonido_vivo_usuario', JSON.stringify({ rol: 'CLIENTE' }));

    expect(estaAutenticado()).toBe(false);
    expect(obtenerToken()).toBeNull();
    expect(obtenerUsuario()).toBeNull();
  });

  it('limpia la sesión cuando el JWT está malformado', function() {
    sessionStorage.setItem('sonido_vivo_token', 'token-malformado');
    sessionStorage.setItem('sonido_vivo_usuario', JSON.stringify({ rol: 'CLIENTE' }));

    expect(estaAutenticado()).toBe(false);
    expect(obtenerToken()).toBeNull();
    expect(obtenerUsuario()).toBeNull();
  });

  it('el cierre de sesión elimina token y usuario', function() {
    sessionStorage.setItem('sonido_vivo_token', 'token-de-prueba');
    sessionStorage.setItem('sonido_vivo_usuario', JSON.stringify({ rol: 'CLIENTE' }));

    cerrarSesion();

    expect(obtenerToken()).toBeNull();
    expect(obtenerUsuario()).toBeNull();
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
