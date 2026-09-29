// Valida formato de correo
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'El correo es obligatorio';
  if (!regex.test(email)) return 'Formato de correo inválido';
  return '';
};

// Valida contraseña
export const validarPassword = (password) => {
  if (!password) return 'La contraseña es obligatoria';
  if (password.length < 6) return 'Mínimo 6 caracteres';
  return '';
};

// Valida todo el form de login
export const validarLogin = (datos) => {
  const errores = {};
  
  const errorEmail = validarEmail(datos.email);
  if (errorEmail) errores.email = errorEmail;
  
  const errorPass = validarPassword(datos.password);
  if (errorPass) errores.password = errorPass;
  
  return errores; // Si está vacío {}, el form es válido
};