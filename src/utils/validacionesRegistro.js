import { regionesComunas } from '../data/regionesComunas';

export function validarRegistro(datos) {
  const errores = {};

  // Valida el formato del RUN (sin puntos ni guion)
  if (!/^\d{7,8}[0-9Kk]$/.test(datos.run.trim())) {
    errores.run = 'Ingresa un RUN válido, sin puntos ni guion.';
  }
  if (datos.nombre.trim().length < 2) {
    errores.nombre = 'Ingresa tu nombre.';
  }
  if (datos.apellidos.trim().length < 2) {
    errores.apellidos = 'Ingresa tus apellidos.';
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
  if (datos.direccion.trim().length < 5) {
    errores.direccion = 'Ingresa una dirección válida.';
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
