
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
    const direccion = datos.direccion.trim().replace(/\s+/g, ' ');
    const comuna = datos.comuna.trim().replace(/\s+/g, ' ');

    // Dirección: permite letras, números y signos habituales.
    const formatoDireccion = /^[\p{L}\p{N}\s.,#°º'/-]+$/u;

    const tieneNombreCalle = /\p{L}/u.test(direccion);
    const tieneNumero = /\p{N}/u.test(direccion);
    const sinNumero = /\bS\s*\/\s*N\b/i.test(direccion);

    if (!direccion) {
      errores.direccion = 'Ingresa tu dirección.';
    } else if (
      direccion.length < 6 ||
      direccion.length > 120 ||
      !formatoDireccion.test(direccion) ||
      !tieneNombreCalle ||
      (!tieneNumero && !sinNumero)
    ) {
      errores.direccion =
        'Ingresa una dirección válida con calle y número (o S/N).';
    }

    // Comuna: solo letras, espacios, tildes y signos de nombres.
    const formatoComuna = /^[\p{L}\s.'-]{2,60}$/u;

    if (!comuna) {
      errores.comuna = 'Ingresa tu comuna.';
    } else if (!formatoComuna.test(comuna)) {
      errores.comuna =
        'Ingresa una comuna válida, sin números.';
    }
  }
  return errores;
}
