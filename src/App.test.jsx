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
});
