export function crearUsuarioDTO(datos) {

    if (!datos || typeof datos !== 'object') {
        throw new Error('Los datos del usuario no son válidos');
    }

    return {
        id: datos.id,
        nombre: datos.nombre || '',
        apellido: datos.apellido || '',
        email: datos.email || '',
        rol: datos.rol || 'CLIENTE'
    };
}