
const texto = (valor) => String(valor ?? '').trim();

export function validarProducto(datos, productos = [], idActual = null) {
  const errores = {};

  const codigo = texto(datos.codigo);
  const nombre = texto(datos.nombre);

  // Código obligatorio y único
  if (!codigo) {
    errores.codigo = 'El código es obligatorio.';
  } else {
    const duplicado = productos.some(p =>
      texto(p.codigo).toLowerCase() === codigo.toLowerCase() &&
      (idActual === null || Number(p.id) !== Number(idActual))
    );

    if (duplicado) {
      errores.codigo = 'Este código ya está registrado.';
    }
  }

  if (!nombre) {
    errores.nombre = 'El nombre es obligatorio.';
  }

  if (!texto(datos.marca)) {
    errores.marca = 'La marca es obligatoria.';
  }

  if (!texto(datos.modelo)) {
    errores.modelo = 'El modelo es obligatorio.';
  }

  if (!texto(datos.categoria)) {
    errores.categoria = 'Selecciona una categoría.';
  }

  // Validar precio
  const precio = Number(datos.precio);

  if (
    texto(datos.precio) === '' ||
    !Number.isInteger(precio) ||
    precio <= 0
  ) {
    errores.precio = 'El precio debe ser un entero mayor que cero.';
  }

  // Validar stock
  const stock = Number(datos.stock);

  if (
    texto(datos.stock) === '' ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    errores.stock = 'El stock debe ser un entero igual o mayor que cero.';
  }

  if (!texto(datos.descripcion)) {
    errores.descripcion = 'La descripción es obligatoria.';
  }

  return errores;
}
