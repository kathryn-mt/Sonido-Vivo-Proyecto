// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import api from './api.js';
import { SESSION_EXPIRED_EVENT } from './authSession.js';

const adaptadorOriginal = api.defaults.adapter;
const listenersSesionExpirada = new Set();

function observarSesionExpirada(manejador) {
  listenersSesionExpirada.add(manejador);
  window.addEventListener(SESSION_EXPIRED_EVENT, manejador);
}

function rechazarCon401(config) {
  const error = new Error('Solicitud no autorizada');
  error.config = config;
  error.response = {
    status: 401,
    data: { mensaje: 'Token expirado' },
    config
  };

  return Promise.reject(error);
}

describe('Manejo de sesión en respuestas HTTP', function() {
  afterEach(function() {
    api.defaults.adapter = adaptadorOriginal;
    sessionStorage.clear();
    listenersSesionExpirada.forEach(manejador => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, manejador);
    });
    listenersSesionExpirada.clear();
    vi.restoreAllMocks();
  });

  it('limpia una sesión y notifica al recibir 401 en un recurso protegido', async function() {
    sessionStorage.setItem('sonido_vivo_token', 'jwt-de-prueba');
    sessionStorage.setItem(
      'sonido_vivo_usuario',
      JSON.stringify({ rol: 'CLIENTE' })
    );
    api.defaults.adapter = rechazarCon401;

    const manejarSesionExpirada = vi.fn();
    observarSesionExpirada(manejarSesionExpirada);

    await expect(api.get('/v1/recurso-protegido')).rejects.toThrow(
      'Solicitud no autorizada'
    );

    expect(sessionStorage.getItem('sonido_vivo_token')).toBeNull();
    expect(sessionStorage.getItem('sonido_vivo_usuario')).toBeNull();
    expect(manejarSesionExpirada).toHaveBeenCalledTimes(1);

  });

  it('no invalida la sesión por credenciales de login incorrectas', async function() {
    sessionStorage.setItem('sonido_vivo_token', 'jwt-de-prueba');
    sessionStorage.setItem(
      'sonido_vivo_usuario',
      JSON.stringify({ rol: 'CLIENTE' })
    );
    api.defaults.adapter = config => {
      const error = new Error('Credenciales incorrectas');
      error.config = config;
      error.response = {
        status: 401,
        data: { mensaje: 'Credenciales incorrectas' },
        config
      };

      return Promise.reject(error);
    };

    const manejarSesionExpirada = vi.fn();
    observarSesionExpirada(manejarSesionExpirada);

    await expect(api.post('/v1/auth/login', {})).rejects.toThrow(
      'Credenciales incorrectas'
    );

    expect(sessionStorage.getItem('sonido_vivo_token')).toBe('jwt-de-prueba');
    expect(sessionStorage.getItem('sonido_vivo_usuario')).not.toBeNull();
    expect(manejarSesionExpirada).not.toHaveBeenCalled();

  });

  it('no invalida la sesión por error de contraseña actual', async function() {
    sessionStorage.setItem('sonido_vivo_token', 'jwt-de-prueba');
    api.defaults.adapter = config => {
      const error = new Error('La contraseña actual no es correcta');
      error.config = config;
      error.response = {
        status: 401,
        data: { mensaje: 'La contraseña actual no es correcta' },
        config
      };

      return Promise.reject(error);
    };

    const manejarSesionExpirada = vi.fn();
    observarSesionExpirada(manejarSesionExpirada);

    await expect(api.patch('/v1/auth/cambiar-password', {})).rejects.toThrow(
      'La contraseña actual no es correcta'
    );

    expect(sessionStorage.getItem('sonido_vivo_token')).toBe('jwt-de-prueba');
    expect(manejarSesionExpirada).not.toHaveBeenCalled();

  });
});
