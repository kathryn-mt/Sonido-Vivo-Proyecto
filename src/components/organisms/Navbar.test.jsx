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

function crearTokenPrueba() {
  function codificar(valor) {
    return btoa(JSON.stringify(valor))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  return [
    codificar({ alg: 'HS256', typ: 'JWT' }),
    codificar({ exp: Math.floor(Date.now() / 1000) + 3600 }),
    'firma-de-prueba'
  ].join('.');
}

function RutasNavbar() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<p>Inicio</p>} />
        <Route
          path="/mi-cuenta"
          element={<p>Datos de mi cuenta</p>}
        />
        <Route
          path="/cambiar-password"
          element={<p>Cambio de contraseña</p>}
        />
        <Route
          path="/admin"
          element={<p>Panel de administración</p>}
        />
        <Route
          path="/vendedor"
          element={<p>Panel de vendedor</p>}
        />
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
    window.matchMedia = undefined;
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
    expect(screen.queryByRole('button', { name: /Mi cuenta/ })).not.toBeInTheDocument();
  });

  it('muestra las opciones de cuenta de cliente y cierra la sesión', function() {
    sessionStorage.setItem('sonido_vivo_token', crearTokenPrueba());
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

    const menuCuenta = screen.getByRole('button', { name: /Mi cuenta/ });
    expect(screen.queryByRole('link', { name: 'Ingresar' })).not.toBeInTheDocument();
    expect(screen.queryByText('Ana Pérez')).not.toBeInTheDocument();
    fireEvent.click(menuCuenta);

    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('CLIENTE')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver y editar mis datos' }))
      .toHaveAttribute('href', '/mi-cuenta');
    expect(screen.getByRole('link', { name: 'Cambiar contraseña' }))
      .toHaveAttribute('href', '/cambiar-password');
    expect(screen.queryByRole('link', { name: 'Mi panel' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

    expect(sessionStorage.getItem('sonido_vivo_token')).toBeNull();
    expect(sessionStorage.getItem('sonido_vivo_usuario')).toBeNull();
    expect(screen.getByText('Pantalla de ingreso')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ingresar' })).toBeInTheDocument();
    expect(screen.queryByText('Ana Pérez')).not.toBeInTheDocument();
  });

  it.each([
    ['VENDEDOR', '/vendedor'],
    ['ADMINISTRADOR', '/admin']
  ])('muestra el panel correcto para %s', function(rol, ruta) {
    sessionStorage.setItem('sonido_vivo_token', crearTokenPrueba());
    sessionStorage.setItem(
      'sonido_vivo_usuario',
      JSON.stringify({ nombre: 'Alex', apellido: 'Prueba', rol })
    );
    contextoMocks.useCarrito.mockReturnValue({ cantidadTotal: 0 });
    contextoMocks.useCatalogo.mockReturnValue({ productos: [] });

    renderizarNavbar();
    fireEvent.click(screen.getByRole('button', { name: /Mi cuenta/ }));

    expect(screen.getByRole('link', { name: 'Mi panel' })).toHaveAttribute('href', ruta);
  });

  it('abre con mouse y teclado', function() {
    sessionStorage.setItem('sonido_vivo_token', crearTokenPrueba());
    sessionStorage.setItem(
      'sonido_vivo_usuario',
      JSON.stringify({ nombre: 'Ana', apellido: 'Pérez', rol: 'CLIENTE' })
    );
    contextoMocks.useCarrito.mockReturnValue({ cantidadTotal: 0 });
    contextoMocks.useCatalogo.mockReturnValue({ productos: [] });

    renderizarNavbar();

    const menuCuenta = screen.getByRole('button', { name: /Mi cuenta/ });
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    fireEvent.mouseEnter(menuCuenta.parentElement);
    const opcionCuenta = screen.getByRole('link', { name: 'Ver y editar mis datos' });
    const menuOpciones = opcionCuenta.closest('.dropdown-menu');
    expect(menuOpciones).toHaveClass('show');

    fireEvent.mouseLeave(menuCuenta.parentElement);
    expect(menuOpciones).not.toHaveClass('show');

    fireEvent.keyDown(menuCuenta, { key: 'ArrowDown' });
    expect(menuOpciones).toHaveClass('show');
  });

  it('abre al tocarlo en un dispositivo sin hover', function() {
    sessionStorage.setItem('sonido_vivo_token', crearTokenPrueba());
    sessionStorage.setItem(
      'sonido_vivo_usuario',
      JSON.stringify({ nombre: 'Ana', apellido: 'Pérez', rol: 'CLIENTE' })
    );
    contextoMocks.useCarrito.mockReturnValue({ cantidadTotal: 0 });
    contextoMocks.useCatalogo.mockReturnValue({ productos: [] });
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });

    renderizarNavbar();

    const menuCuenta = screen.getByRole('button', { name: /Mi cuenta/ });
    fireEvent.mouseEnter(menuCuenta.parentElement);
    fireEvent.click(menuCuenta);

    expect(
      screen.getByRole('link', { name: 'Ver y editar mis datos' }).closest('.dropdown-menu')
    ).toHaveClass('show');
  });
});
