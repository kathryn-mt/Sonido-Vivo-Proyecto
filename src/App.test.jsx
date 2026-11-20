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
    registrarVendedor: vi.fn()
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
    registrarVendedor: usuarioServiceMocks.registrarVendedor
  };
});

import App from './App.jsx';

describe('Protección del panel de administración', function() {
  afterEach(function() {
    cleanup();
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
    vi.clearAllMocks();
  });

  it('redirige al login y protege /admin después del cierre de sesión', async function() {
    sessionStorage.setItem('sonido_vivo_token', 'token-de-prueba');
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
    sessionStorage.setItem('sonido_vivo_token', 'token-de-prueba');
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
    sessionStorage.setItem('sonido_vivo_token', 'token-de-prueba');
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
});
