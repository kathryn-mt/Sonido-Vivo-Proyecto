
export function validarCheckout(datos, entrega) {
  const errores = {};

  if (!datos.nombre.trim()) {
    errores.nombre = 'Ingresa tu nombre completo.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
    errores.correo = 'Ingresa un correo válido.';
  }

  const telefono = datos.telefono.replace(/\D/g, '');

  if (telefono.length < 8 || telefono.length > 11) {
    errores.telefono = 'Ingresa un teléfono válido.';
  }

  if (entrega === 'despacho') {
    if (!datos.direccion.trim()) {
      errores.direccion = 'Ingresa tu dirección.';
    }

    if (!datos.comuna.trim()) {
      errores.comuna = 'Ingresa tu comuna.';
    }
  }

  return errores;
}
