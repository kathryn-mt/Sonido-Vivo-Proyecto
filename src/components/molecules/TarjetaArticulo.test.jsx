
// @vitest-environment jsdom

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import TarjetaArticulo from './TarjetaArticulo.jsx';

const articulo = {
  id: 1,
  titulo: 'Cómo cuidar tu guitarra',
  categoria: 'Consejos',
  fecha: '20 de octubre de 2026',
  imagen: '/assets/guitarra.jpg',
  resumen: 'Consejos básicos para cuidar tu guitarra.',
  contenido: 'Limpia las cuerdas después de cada uso.'
};

describe('Pruebas del Blog - Katy', () => {

  afterEach(() => {
    cleanup();
  });

  it('muestra el título y resumen del artículo', () => {
    render(<TarjetaArticulo articulo={articulo} />);

    expect(
      screen.getByText('Cómo cuidar tu guitarra')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Consejos básicos para cuidar tu guitarra.')
    ).toBeInTheDocument();
  });

  it('muestra el contenido al presionar Seguir leyendo', () => {
    render(<TarjetaArticulo articulo={articulo} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Seguir leyendo' })
    );

    expect(
      screen.getByText('Limpia las cuerdas después de cada uso.')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Leer menos' })
    ).toBeInTheDocument();
  });

});
