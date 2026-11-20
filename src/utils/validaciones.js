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
  
  return errores; 
};

export const validarRUN = (run) => {
  if (!run || String(run).trim() === '') {
    return 'El RUN es obligatorio';
  }

  const runNormalizado = String(run)
    .replace(/\./g, '')
    .replace(/\s/g, '')
    .replace(/-/g, '')
    .toUpperCase();

  const regexRUN = /^[0-9]{7,8}[0-9K]$/;

  if (!regexRUN.test(runNormalizado)) {
    return 'Formato de RUN inválido';
  }

  return '';
};

export const validarLoginPersonal = (datos) => {
  const errores = {};

  const errorRUN = validarRUN(datos.run);
  if (errorRUN) errores.run = errorRUN;

  const errorPassword = validarPassword(datos.password);
  if (errorPassword) errores.password = errorPassword;

  return errores;
};
