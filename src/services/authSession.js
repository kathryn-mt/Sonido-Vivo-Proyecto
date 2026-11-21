export const TOKEN_KEY = 'sonido_vivo_token';
export const USER_KEY = 'sonido_vivo_usuario';
export const SESSION_EXPIRED_EVENT = 'sonido-vivo:session-expired';

export function limpiarSesion() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}


export const SESSION_UPDATED_EVENT = 'sonido-vivo:session-updated';

export function actualizarUsuarioSesion(usuarioActualizado) {
  const datosGuardados = sessionStorage.getItem(USER_KEY);

  if (!datosGuardados || !usuarioActualizado) {
    return;
  }

  let usuarioActual;

  try {
    usuarioActual = JSON.parse(datosGuardados);
  } catch {
    return;
  }

  if (String(usuarioActual.id) !== String(usuarioActualizado.id)) {
    return;
  }

  const nuevosDatos = Object.assign({}, usuarioActual, usuarioActualizado);

  sessionStorage.setItem(USER_KEY, JSON.stringify(nuevosDatos));

  window.dispatchEvent(new Event(SESSION_UPDATED_EVENT));
}
