export const TOKEN_KEY = 'sonido_vivo_token';
export const USER_KEY = 'sonido_vivo_usuario';
export const SESSION_EXPIRED_EVENT = 'sonido-vivo:session-expired';

export function limpiarSesion() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}
