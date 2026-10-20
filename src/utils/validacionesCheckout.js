
export function validarCheckout(datos, entrega) {
  const errores = {};

  // Validar nombre: solo letras y espacios
  const nombre = datos.nombre.trim();

  if (
    nombre.length < 3 ||
    !/^[\p{L}\s]+$/u.test(nombre)
  ) {
    errores.nombre =
      'Ingresa un nombre válido, solo con letras.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
    errores.correo = 'Ingresa un correo válido.';
  }
  
  // Aceptar números, espacios y un + inicial
  const telefonoTexto = datos.telefono.trim();
  const digitos = telefonoTexto.replace(/\D/g, '');

  if (
    !/^\+?[\d\s]+$/.test(telefonoTexto) ||
    digitos.length < 8 ||
    digitos.length > 11
  ) {
    errores.telefono =
      'Ingresa un teléfono válido, sin letras, de 8 a 11 dígitos.';
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
