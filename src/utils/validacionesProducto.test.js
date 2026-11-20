import {
  describe,
  it,
  expect
} from 'vitest';

import { validarProducto } from './validacionesProducto';


// PRUEBAS DE VALIDACIÓN DE PRODUCTOS - KATY


describe('Validaciones de productos - Katy', function () {

  // Producto válido utilizado en las pruebas
  function crearDatosValidos() {

    return {
      codigo: 'AUD-001',
      nombre: 'Parlante Bluetooth',
      marca: 'JBL',
      modelo: 'Flip 6',
      categoria: 'Audio',
      precio: 89990,
      stock: 10,
      descripcion: 'Parlante portátil Bluetooth'
    };
  }

 
  // PRODUCTO VÁLIDO


  it('acepta un producto con datos válidos', function () {

    const datos = crearDatosValidos();

    const errores = validarProducto(datos);

    expect(Object.keys(errores).length).toBe(0);
  });


  // CÓDIGO OBLIGATORIO


  it('rechaza un producto sin código', function () {

    const datos = crearDatosValidos();

    datos.codigo = '';

    const errores = validarProducto(datos);

    expect(errores.codigo).toBe('El código es obligatorio.');
  });

 
  // CÓDIGO DUPLICADO


  it('rechaza un código duplicado', function () {

    const datos = crearDatosValidos();

    const productosExistentes = [
      {
        id: 1,
        codigo: 'AUD-001'
      }
    ];

    const errores = validarProducto(
      datos,
      productosExistentes
    );

    expect(errores.codigo).toBe(
      'Este código ya está registrado.'
    );
  });

 
  // NOMBRE OBLIGATORIO


  it('rechaza un producto sin nombre', function () {

    const datos = crearDatosValidos();

    datos.nombre = '';

    const errores = validarProducto(datos);

    expect(errores.nombre).toBe('El nombre es obligatorio.');
  });

  // PRECIO NEGATIVO
 

  it('rechaza un precio negativo', function () {

    const datos = crearDatosValidos();

    datos.precio = -1000;

    const errores = validarProducto(datos);

    expect(errores.precio).toBe(
      'El precio debe ser un entero mayor que cero.'
    );
  });


  // PRECIO DECIMAL
 

  it('rechaza un precio decimal', function () {

    const datos = crearDatosValidos();

    datos.precio = 1500.50;

    const errores = validarProducto(datos);

    expect(errores.precio).toBeDefined();
  });


  // STOCK NEGATIVO


  it('rechaza un stock negativo', function () {

    const datos = crearDatosValidos();

    datos.stock = -5;

    const errores = validarProducto(datos);

    expect(errores.stock).toBe(
      'El stock debe ser un entero igual o mayor que cero.'
    );
  });


  // STOCK CERO
  

  it('permite registrar un producto con stock cero', function () {

    const datos = crearDatosValidos();

    datos.stock = 0;

    const errores = validarProducto(datos);

    expect(errores.stock).toBeUndefined();
  });

 
  // CATEGORÍA OBLIGATORIA
 

  it('rechaza un producto sin categoría', function () {

    const datos = crearDatosValidos();

    datos.categoria = '';

    const errores = validarProducto(datos);

    expect(errores.categoria).toBe(
      'Selecciona una categoría.'
    );
  });

 
  // DESCRIPCIÓN OBLIGATORIA
 

  it('rechaza un producto sin descripción', function () {

    const datos = crearDatosValidos();

    datos.descripcion = '';

    const errores = validarProducto(datos);

    expect(errores.descripcion).toBe(
      'La descripción es obligatoria.'
    );
  });


  // EDITAR SIN DUPLICAR SU PROPIO CÓDIGO


  it('permite editar un producto conservando su código', function () {

    const datos = crearDatosValidos();

    const productosExistentes = [
      {
        id: 1,
        codigo: 'AUD-001'
      }
    ];

    const errores = validarProducto(
      datos,
      productosExistentes,
      1
    );

    expect(errores.codigo).toBeUndefined();
  });

});