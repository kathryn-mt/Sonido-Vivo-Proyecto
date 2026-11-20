// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const contextoMocks = vi.hoisted(function() {
  return {
    useCarrito: vi.fn(),
    useCatalogo: vi.fn()
  };
});

vi.mock('../../context/CarritoContext', function() {
  return {
    useCarrito: contextoMocks.useCarrito
  };
});

vi.mock('../../context/CatalogoContext', function() {
  return {
    useCatalogo: contextoMocks.useCatalogo
  };
});

import Navbar from './Navbar.jsx';

function RutasNavbar() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={<p>Pantalla de ingreso</p>}
        />
      </Routes>
    </>
  );
}

function renderizarNavbar() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <RutasNavbar />
    </MemoryRouter>
  );
}

describe('Navbar y autenticación', function() {
  afterEach(function() {
    cleanup();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('muestra Ingresar y conserva los enlaces públicos sin sesión', function() {
    contextoMocks.useCarrito.mockReturnValue({ cantidadTotal: 2 });
    contextoMocks.useCatalogo.mockReturnValue({ productos: [] });

    renderizarNavbar();

    expect(screen.getByRole('link', { name: 'Ingresar' })).toHaveAttribute(
      'href',
      '/login'
    );
    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: 'Contacto' })).toHaveAttribute(
      'href',
      '/contacto'
    );
    expect(screen.getByRole('link', { name: 'Nosotros' })).toHaveAttribute(
      'href',
      '/nosotros'
    );
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute(
      'href',
      '/blog'
    );
    expect(screen.getByRole('link', { name: 'Mis pedidos' })).toHaveAttribute(
      'href',
      '/mis-pedidos'
    );
    expect(screen.getByRole('button', { name: 'Categorías' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ofertas' })).toHaveAttribute(
      'href',
      '/ofertas'
    );
    expect(screen.getByRole('link', { name: 'Carrito (2)' })).toHaveAttribute(
      'href',
      '/carrito'
    );
    expect(
      screen.queryByRole('button', { name: 'Cerrar sesión' })
    ).not.toBeInTheDocument();
  });

  it('muestra el nombre y cierra la sesión inmediatamente', function() {
    sessionStorage.setItem('sonido_vivo_token', 'token-de-prueba');
    sessionStorage.setItem(
      'sonido_vivo_usuario',
      JSON.stringify({
        nombre: 'Ana',
        apellido: 'Pérez',
        rol: 'CLIENTE'
      })
    );
    contextoMocks.useCarrito.mockReturnValue({ cantidadTotal: 0 });
    contextoMocks.useCatalogo.mockReturnValue({ productos: [] });

    renderizarNavbar();

    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Ingresar' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

    expect(sessionStorage.getItem('sonido_vivo_token')).toBeNull();
    expect(sessionStorage.getItem('sonido_vivo_usuario')).toBeNull();
    expect(screen.getByText('Pantalla de ingreso')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ingresar' })).toBeInTheDocument();
    expect(screen.queryByText('Ana Pérez')).not.toBeInTheDocument();
  });
});
