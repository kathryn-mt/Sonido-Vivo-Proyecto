// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

const contextoMocks = vi.hoisted(function() {
  return {
    useCarrito: vi.fn(),
    useCatalogo: vi.fn()
  };
});

const usuarioServiceMocks = vi.hoisted(function() {
  return {
    obtenerPerfilUsuario: vi.fn(),
    actualizarPerfilUsuario: vi.fn(),
    registrarVendedor: vi.fn(),
    listarUsuarios: vi.fn(),
    actualizarUsuario: vi.fn(),
    desactivarUsuario: vi.fn()
  };
});

vi.mock('./context/CarritoContext', function() {
  return {
    useCarrito: contextoMocks.useCarrito
  };
});

vi.mock('./context/CatalogoContext', function() {
  return {
    useCatalogo: contextoMocks.useCatalogo
  };
});

vi.mock('./services/usuarioService', function() {
  return {
    obtenerPerfilUsuario: usuarioServiceMocks.obtenerPerfilUsuario,
    actualizarPerfilUsuario: usuarioServiceMocks.actualizarPerfilUsuario,
    registrarVendedor: usuarioServiceMocks.registrarVendedor,
    listarUsuarios: usuarioServiceMocks.listarUsuarios,
    actualizarUsuario: usuarioServiceMocks.actualizarUsuario,
    desactivarUsuario: usuarioServiceMocks.desactivarUsuario
  };
});

import App from './App.jsx';
import api from './services/api.js';

const adaptadorApiOriginal = api.defaults.adapter;

function crearTokenPrueba(
  expiracion = Math.floor(Date.now() / 1000) + 3600
) {
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

function renderizarRutaProtegida(ruta, rol, expiracion) {
  contextoMocks.useCarrito.mockReturnValue({ cantidadTotal: 0 });
  contextoMocks.useCatalogo.mockReturnValue({ productos: [] });

  if (rol) {
    sessionStorage.setItem('sonido_vivo_token', crearTokenPrueba(expiracion));
    sessionStorage.setItem(
      'sonido_vivo_usuario',
      JSON.stringify({ nombre: 'Usuario', apellido: 'Prueba', rol })
    );
  }

  window.history.replaceState({}, '', ruta);
  return render(<App />);
}

describe('Protección del panel de administración', function() {
  afterEach(function() {
    cleanup();
    sessionStorage.clear();
    api.defaults.adapter = adaptadorApiOriginal;
    window.history.replaceState({}, '', '/');
    vi.clearAllMocks();
  });

  it('redirige al login y protege /admin después del cierre de sesión', async function() {
    sessionStorage.setItem('sonido_vivo_token', crearTokenPrueba());
    sessionStorage.setItem(
      'sonido_vivo_usuario',
      JSON.stringify({
        nombre: 'Admin',
        apellido: 'Prueba',
        rol: 'ADMINISTRADOR'
      })
    );
    contextoMocks.useCarrito.mockReturnValue({ cantidadTotal: 0 });
    contextoMocks.useCatalogo.mockReturnValue({ productos: [] });
    window.history.replaceState({}, '', '/admin');

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Panel de Administración' })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Mi cuenta/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

    expect(window.location.pathname).toBe('/login');
    expect(screen.getByText('Inicia sesión para continuar')).toBeInTheDocument();

    cleanup();
    window.history.replaceState({}, '', '/admin');
    render(<App />);

    await waitFor(function() {
      expect(window.location.pathname).toBe('/login');
    });
    expect(
      screen.queryByRole('heading', { name: 'Panel de Administración' })
    ).not.toBeInTheDocument();
    expect(screen.getByText('Inicia sesión para continuar')).toBeInTheDocument();
  });

  it('redirige al login al intentar cambiar contraseña sin sesión', async function() {
    contextoMocks.useCarrito.mockReturnValue({ cantidadTotal: 0 });
    contextoMocks.useCatalogo.mockReturnValue({ productos: [] });
    window.history.replaceState({}, '', '/cambiar-password');

    render(<App />);

    await waitFor(function() {
      expect(window.location.pathname).toBe('/login');
    });
    expect(screen.getByText('Inicia sesión para continuar')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Cambiar contraseña' }))
      .not.toBeInTheDocument();
  });

  it('redirige al login al intentar acceder a Mi cuenta sin sesión', async function() {
    contextoMocks.useCarrito.mockReturnValue({ cantidadTotal: 0 });
    contextoMocks.useCatalogo.mockReturnValue({ productos: [] });
    window.history.replaceState({}, '', '/mi-cuenta');

    render(<App />);

    await waitFor(function() {
      expect(window.location.pathname).toBe('/login');
    });
    expect(screen.getByText('Inicia sesión para continuar')).toBeInTheDocument();
  });

  it('permite que un cliente autenticado consulte su perfil desde Mi cuenta', async function() {
    sessionStorage.setItem('sonido_vivo_token', crearTokenPrueba());
    sessionStorage.setItem(
      'sonido_vivo_usuario',
      JSON.stringify({
        id: 42,
        nombre: 'Ana',
        apellido: 'Pérez',
        email: 'ana@example.cl',
        rol: 'CLIENTE'
      })
    );
    contextoMocks.useCarrito.mockReturnValue({ cantidadTotal: 0 });
    contextoMocks.useCatalogo.mockReturnValue({ productos: [] });
    usuarioServiceMocks.obtenerPerfilUsuario.mockResolvedValue({
      id: 42,
      nombre: 'Ana',
      apellido: 'Pérez',
      email: 'ana@example.cl',
      rol: 'CLIENTE',
      run: '12345678K',
      region: 'metropolitana',
      comuna: 'Santiago',
      direccion: 'Avenida Central 123'
    });
    window.history.replaceState({}, '', '/mi-cuenta');

    render(<App />);

    expect(
      await screen.findByRole('heading', { name: 'Mi cuenta' })
    ).toBeInTheDocument();
    expect(await screen.findByLabelText('RUN')).toHaveValue('12345678K');
    expect(usuarioServiceMocks.obtenerPerfilUsuario).toHaveBeenCalledWith(42);
  });

  it('redirige al login al acceder al registro de vendedor sin sesión', async function() {
    contextoMocks.useCarrito.mockReturnValue({ cantidadTotal: 0 });
    contextoMocks.useCatalogo.mockReturnValue({ productos: [] });
    window.history.replaceState({}, '', '/admin/vendedores/nuevo');

    render(<App />);

    await waitFor(function() {
      expect(window.location.pathname).toBe('/login');
    });
    expect(screen.getByText('Inicia sesión para continuar')).toBeInTheDocument();
  });

  it('permite al administrador abrir el registro desde el panel', async function() {
    sessionStorage.setItem('sonido_vivo_token', crearTokenPrueba());
    sessionStorage.setItem(
      'sonido_vivo_usuario',
      JSON.stringify({
        nombre: 'Admin',
        apellido: 'Prueba',
        rol: 'ADMINISTRADOR'
      })
    );
    contextoMocks.useCarrito.mockReturnValue({ cantidadTotal: 0 });
    contextoMocks.useCatalogo.mockReturnValue({ productos: [] });
    window.history.replaceState({}, '', '/admin');

    render(<App />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Registrar vendedor' })
    );

    expect(
      await screen.findByRole('heading', { name: 'Registrar vendedor' })
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe('/admin/vendedores/nuevo');
  });

  it('limpia una sesión inválida y redirige al login desde el Navbar', async function() {
    sessionStorage.setItem('sonido_vivo_token', crearTokenPrueba());
    sessionStorage.setItem(
      'sonido_vivo_usuario',
      JSON.stringify({
        nombre: 'Admin',
        apellido: 'Prueba',
        rol: 'ADMINISTRADOR'
      })
    );
    contextoMocks.useCarrito.mockReturnValue({ cantidadTotal: 0 });
    contextoMocks.useCatalogo.mockReturnValue({ productos: [] });
    api.defaults.adapter = async function(config) {
      const error = new Error('Sesión inválida');
      error.config = config;
      error.response = {
        status: 401,
        data: { mensaje: 'Token expirado' },
        config
      };

      throw error;
    };
    window.history.replaceState({}, '', '/admin');

    render(<App />);
    expect(screen.getByRole('button', { name: /Mi cuenta/ })).toBeInTheDocument();

    await expect(api.get('/v1/recurso-protegido')).rejects.toThrow('Sesión inválida');

    await waitFor(function() {
      expect(window.location.pathname).toBe('/login');
    });
    expect(sessionStorage.getItem('sonido_vivo_token')).toBeNull();
    expect(sessionStorage.getItem('sonido_vivo_usuario')).toBeNull();
    expect(screen.getByRole('link', { name: 'Ingresar' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Mi cuenta/ })).not.toBeInTheDocument();
  });

  it('mantiene el formulario visible ante credenciales incorrectas', async function() {
    contextoMocks.useCarrito.mockReturnValue({ cantidadTotal: 0 });
    contextoMocks.useCatalogo.mockReturnValue({ productos: [] });
    api.defaults.adapter = async function(config) {
      const error = new Error('Credenciales incorrectas');
      error.config = config;
      error.response = {
        status: 401,
        data: { mensaje: 'Credenciales incorrectas' },
        config
      };

      throw error;
    };
    window.history.replaceState({}, '', '/login');

    render(<App />);

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'prueba@example.cl' }
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'clave-de-prueba' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Credenciales incorrectas'
    );
    expect(window.location.pathname).toBe('/login');
    expect(sessionStorage.getItem('sonido_vivo_token')).toBeNull();
  });

  it.each([
    ['CLIENTE', '/admin'],
    ['CLIENTE', '/admin/usuarios'],
    ['CLIENTE', '/admin/vendedores/nuevo'],
    ['CLIENTE', '/vendedor'],
    ['CLIENTE', '/vendedor/productos'],
    ['VENDEDOR', '/admin'],
    ['VENDEDOR', '/admin/usuarios'],
    ['VENDEDOR', '/admin/productos'],
    ['ADMINISTRADOR', '/vendedor'],
    ['ADMINISTRADOR', '/vendedor/productos']
  ])('redirige a %s desde la ruta no autorizada %s sin cerrar sesión', async function(rol, ruta) {
    renderizarRutaProtegida(ruta, rol);

    await waitFor(function() {
      expect(window.location.pathname).toBe('/');
    });

    expect(sessionStorage.getItem('sonido_vivo_token')).not.toBeNull();
    expect(JSON.parse(sessionStorage.getItem('sonido_vivo_usuario')).rol).toBe(rol);
    expect(
      screen.queryByRole('heading', { name: /Panel de Administración|Panel del Vendedor/ })
    ).not.toBeInTheDocument();
  });

  it.each([
    '/admin',
    '/admin/usuarios',
    '/admin/vendedores/nuevo',
    '/vendedor',
    '/vendedor/productos'
  ])('redirige a login sin sesión al abrir %s', async function(ruta) {
    renderizarRutaProtegida(ruta, null);

    await waitFor(function() {
      expect(window.location.pathname).toBe('/login');
    });

    expect(screen.getByText('Inicia sesión para continuar')).toBeInTheDocument();
  });

  it('limpia un JWT vencido y redirige al login desde una ruta protegida', async function() {
    renderizarRutaProtegida(
      '/admin',
      'ADMINISTRADOR',
      Math.floor(Date.now() / 1000) - 1
    );

    await waitFor(function() {
      expect(window.location.pathname).toBe('/login');
    });

    expect(sessionStorage.getItem('sonido_vivo_token')).toBeNull();
    expect(sessionStorage.getItem('sonido_vivo_usuario')).toBeNull();
  });

  it('limpia un JWT vencido y redirige al login desde Gestión de usuarios', async function() {
    renderizarRutaProtegida(
      '/admin/usuarios',
      'ADMINISTRADOR',
      Math.floor(Date.now() / 1000) - 1
    );

    await waitFor(function() {
      expect(window.location.pathname).toBe('/login');
    });

    expect(sessionStorage.getItem('sonido_vivo_token')).toBeNull();
    expect(sessionStorage.getItem('sonido_vivo_usuario')).toBeNull();
    expect(usuarioServiceMocks.listarUsuarios).not.toHaveBeenCalled();
  });

  it('permite que un vendedor autenticado acceda a su panel', function() {
    renderizarRutaProtegida('/vendedor', 'VENDEDOR');

    expect(
      screen.getByRole('heading', { name: 'Panel del Vendedor' })
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe('/vendedor');
  });

  it.each([
    '/vendedor/hola',
    '/admin/cualquier-cosa',
    '/catalogo/admin',
    '/ruta-inexistente'
  ])('redirige la URL no definida %s al inicio', async function(ruta) {
    renderizarRutaProtegida(ruta, null);

    await waitFor(function() {
      expect(window.location.pathname).toBe('/');
    });

    expect(
      screen.getByRole('heading', { name: 'Tu sueño de músico comienza aquí' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Inicia sesión para continuar')).not.toBeInTheDocument();
  });
});
