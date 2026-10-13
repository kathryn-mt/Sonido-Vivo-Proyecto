
import { useEffect } from 'react';

// Hook personalizado para cambiar el título de la pestaña
export function useTituloPagina(titulo) {
  useEffect(() => {
    document.title = `${titulo} | Sonido Vivo`;
  }, [titulo]);
}
