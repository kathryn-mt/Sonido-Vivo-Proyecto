
// @vitest-environment jsdom

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import MisPedidos from './MisPedidos.jsx';
import { listarPedidos } from '../services/pedidoService';

// Simular el servicio de pedidos
vi.mock('../services/pedidoService', () => ({
  listarPedidos: vi.fn()
}));

describe('Consulta de pedidos - Katy', () => {

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('encuentra un pedido con número y correo correctos', () => {

    listarPedidos.mockReturnValue([
      {
        id: 'SV-123',
        cliente: {
          correo: 'katy@correo.cl'
        },
        estado: 'Pendiente',
        fecha: '2026-10-20T18:00:00.000Z',
        entrega: {
          tipo: 'retiro'
        },
        productos: [
          {
            id: 1,
            nombre: 'Guitarra Yamaha',
            cantidad: 1,
            precio: 10000
          }
        ],
        totalProductos: 10000
      }
    ]);

    render(<MisPedidos />);

    fireEvent.change(
      screen.getByPlaceholderText('Ejemplo: SV-123456789'),
      { target: { value: 'SV-123' } }
    );

    fireEvent.change(
      screen.getByPlaceholderText('ejemplo@gmail.com'),
      { target: { value: 'katy@correo.cl' } }
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Buscar pedido' })
    );

    expect(listarPedidos).toHaveBeenCalledTimes(1);

    expect(
      screen.getByText('Detalles del pedido')
    ).toBeInTheDocument();

    expect(
      screen.getByText('SV-123')
    ).toBeInTheDocument();
  });

});
