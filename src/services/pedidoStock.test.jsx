// @vitest-environment jsdom

import {
  describe,
  it,
  expect,
  beforeEach
} from 'vitest';

import {
  descontarStock,
  listarProductos
} from './productoService';

import {
  actualizarEstadoPedido,
  listarPedidos
} from './pedidoService';

describe('Inventario y pedidos', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it('descuenta el stock después de una compra', () => {
    localStorage.setItem(
      'sonido_vivo_productos',
      JSON.stringify([
        { id: 1, nombre: 'Guitarra', stock: 5 }
      ])
    );

    descontarStock([
      { id: 1, cantidad: 2 }
    ]);

    const productos = listarProductos();

    expect(productos[0].stock).toBe(3);
  });

  it('rechaza compras con stock insuficiente', () => {
    localStorage.setItem(
      'sonido_vivo_productos',
      JSON.stringify([
        { id: 1, nombre: 'Guitarra', stock: 1 }
      ])
    );

    expect(() => {
      descontarStock([
        { id: 1, cantidad: 3 }
      ]);
    }).toThrow('Stock insuficiente');

    expect(listarProductos()[0].stock).toBe(1);
  });

  it('actualiza correctamente el estado de un pedido', () => {
    localStorage.setItem(
      'sonido_vivo_pedidos',
      JSON.stringify([
        {
          id: 'SV-001',
          estado: 'Pendiente'
        }
      ])
    );

    actualizarEstadoPedido(
      'SV-001',
      'En preparación'
    );

    const pedidos = listarPedidos();

    expect(pedidos[0].estado).toBe('En preparación');
  });

});