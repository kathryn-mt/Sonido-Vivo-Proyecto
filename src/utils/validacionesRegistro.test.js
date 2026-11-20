
import { describe, it, expect } from 'vitest';
import {
  normalizarRUN,
  validarRegistro,
  validarRUNChileno
} from './validacionesRegistro';
import { regionesComunas } from '../data/regionesComunas';

const region = Object.keys(regionesComunas)[0];
const comuna = regionesComunas[region][0];

function datosCorrectos() {
  return {
    run: '19011022K',
    nombre: 'Noemi',
    apellidos: 'Pichiguen',
    email: 'noemi@correo.cl',
    region,
    comuna,
    direccion: 'Avenida Libertad 1234',
    password: 'Clave12345',
    passwordConfirm: 'Clave12345'
  };
}

describe('Validaciones de Registro', () => {

  it('valida el dígito verificador y normaliza RUN con formato', () => {
    expect(validarRUNChileno('12.345.678-5')).toBe(true);
    expect(normalizarRUN('12.345.678-5')).toBe('123456785');
    expect(validarRUNChileno('12.345.678-0')).toBe(false);
  });

  it('rechaza nombres con números', () => {
    const datos = {
      ...datosCorrectos(),
      nombre: 'Noemi123'
    };

    const errores = validarRegistro(datos);

    expect(errores.nombre).toBeDefined();
  });

  it('rechaza apellidos con números', () => {
    const datos = {
      ...datosCorrectos(),
      apellidos: 'Pichiguen123'
    };

    const errores = validarRegistro(datos);

    expect(errores.apellidos).toBeDefined();
  });

  it('rechaza contraseñas que no coinciden', () => {
    const datos = {
      ...datosCorrectos(),
      passwordConfirm: 'OtraClave123'
    };

    const errores = validarRegistro(datos);

    expect(errores.passwordConfirm).toBeDefined();
  });

  it('acepta los datos correctos', () => {
    const errores = validarRegistro(datosCorrectos());

    expect(errores).toEqual({});
  });

});
