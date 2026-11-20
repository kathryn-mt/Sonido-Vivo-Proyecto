import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from 'vitest';

import api from './api';

import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from './productoService';

// SIMULAR AXIOS


vi.mock('./api', function () {

  return {

    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    }

  };
});


// PRUEBAS DEL SERVICIO DE PRODUCTOS


describe('Servicio de productos - Katy', function () {

  beforeEach(function () {
    vi.clearAllMocks();
  });

  
  // LISTAR PRODUCTOS


  it('debe listar productos desde la API', async function () {

    api.get.mockResolvedValue({
      data: [
        {
          id: 1,
          codigo: 'AUD-001',
          nombre: 'Parlante Bluetooth',
          marca: 'JBL',
          modelo: 'Flip 6',
          categoria: 'Audio',
          precio: 89990,
          stock: 10
        }
      ]
    });

    const productos = await listarProductos();

    expect(api.get).toHaveBeenCalledWith('/v1/productos');

    expect(productos.length).toBe(1);

    expect(productos[0].nombre).toBe('Parlante Bluetooth');
  });


  // CONSULTAR PRODUCTO POR ID


  it('debe consultar un producto por ID', async function () {

    api.get.mockResolvedValue({
      data: {
        id: 1,
        codigo: 'AUD-001',
        nombre: 'Parlante Bluetooth',
        precio: 89990,
        stock: 10
      }
    });

    const producto = await obtenerProducto(1);

    expect(api.get).toHaveBeenCalledWith('/v1/productos/1');

    expect(producto.id).toBe(1);
  });


  // CREAR PRODUCTO


  it('debe registrar un producto mediante POST', async function () {

    const datos = {
      codigo: 'TEST-001',
      nombre: 'Guitarra de prueba',
      precio: 150000,
      stock: 5
    };

    api.post.mockResolvedValue({
      data: {
        id: 2,
        codigo: 'TEST-001',
        nombre: 'Guitarra de prueba',
        precio: 150000,
        stock: 5
      }
    });

    const producto = await crearProducto(datos);

    expect(api.post).toHaveBeenCalledWith(
      '/v1/productos',
      datos
    );

    expect(producto.id).toBe(2);
  });

  
  // ACTUALIZAR PRODUCTO
 

  it('debe actualizar un producto mediante PUT', async function () {

    const cambios = {
      codigo: 'TEST-001',
      nombre: 'Guitarra actualizada',
      precio: 170000,
      stock: 3
    };

    api.put.mockResolvedValue({
      data: {
        id: 2,
        codigo: 'TEST-001',
        nombre: 'Guitarra actualizada',
        precio: 170000,
        stock: 3
      }
    });

    const producto = await actualizarProducto(2, cambios);

    expect(api.put).toHaveBeenCalledWith(
      '/v1/productos/2',
      cambios
    );

    expect(producto.nombre).toBe('Guitarra actualizada');
  });

  // ELIMINAR PRODUCTO


  it('debe eliminar un producto mediante DELETE', async function () {

    api.delete.mockResolvedValue({
      data: {
        mensaje: 'Producto eliminado'
      }
    });

    const eliminado = await eliminarProducto(2);

    expect(api.delete).toHaveBeenCalledWith('/v1/productos/2');

    expect(eliminado).toBe(true);
  });


  // ERROR DEL SERVIDOR


  it('debe propagar un error de conexión', async function () {

    api.get.mockRejectedValue(
      new Error('Error de conexión')
    );

    await expect(
      listarProductos()
    ).rejects.toThrow('Error de conexión');
  });

});