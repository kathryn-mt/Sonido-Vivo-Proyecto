import { regionesComunas } from '../data/regionesComunas';

export function validarRegistro(datos) {
  const errores = {};

  // Valida el formato del RUN (sin puntos ni guion)
  if (!/^\d{7,8}[0-9Kk]$/.test(datos.run.trim())) {
    errores.run = 'Ingresa un RUN válido, sin puntos ni guion.';
  }
    // Solo permite letras, tildes, ñ y espacios
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

    // Validar nombre
    if (datos.nombre.trim().length < 2) {
        errores.nombre = 'Ingresa tu nombre.';
    } else if (!soloLetras.test(datos.nombre.trim())) {
        errores.nombre = 'El nombre solo debe contener letras.';
    }

    // Validar apellidos
    if (datos.apellidos.trim().length < 2) {
        errores.apellidos = 'Ingresa tus apellidos.';
    } else if (!soloLetras.test(datos.apellidos.trim())) {
        errores.apellidos = 'Los apellidos solo deben contener letras.';
    }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim())) {
    errores.email = 'Ingresa un correo válido.';
  }
  if (!Object.hasOwn(regionesComunas, datos.region)) {
    errores.region = 'Selecciona una región.';
  }
  if (!regionesComunas[datos.region]?.includes(datos.comuna)) {
    errores.comuna = 'Selecciona una comuna.';
  }
  // Validar dirección
const direccion = datos.direccion.trim();

    if (direccion.length < 8) {
        errores.direccion = 'Ingresa una dirección más completa.';
    } else if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(direccion)) {
        errores.direccion = 'La dirección debe incluir el nombre de una calle.';
    } else if (!/\d/.test(direccion) && !/\bs\s*\/\s*n\b/i.test(direccion)) {
        errores.direccion = 'Ingresa el número de la dirección o s/n.';
    }
  if (datos.password.length < 8) {
    errores.password = 'La contraseña debe tener al menos 8 caracteres.';
  }
  if (!datos.passwordConfirm) {
    errores.passwordConfirm = 'Confirma tu contraseña.';
  } else if (datos.passwordConfirm !== datos.password) {
    errores.passwordConfirm = 'Las contraseñas no coinciden.';
  }
  return errores;
}
