// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor
} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';

const usuarioServiceMocks = vi.hoisted(function() {
    return {
        listarUsuarios: vi.fn(),
        obtenerPerfilUsuario: vi.fn(),
        actualizarUsuario: vi.fn(),
        desactivarUsuario: vi.fn(),
        reactivarUsuario: vi.fn()
    };
});

vi.mock('../services/usuarioService.js', function() {
    return {
        listarUsuarios: usuarioServiceMocks.listarUsuarios,
        obtenerPerfilUsuario: usuarioServiceMocks.obtenerPerfilUsuario,
        actualizarUsuario: usuarioServiceMocks.actualizarUsuario,
        desactivarUsuario: usuarioServiceMocks.desactivarUsuario,
        reactivarUsuario: usuarioServiceMocks.reactivarUsuario
    };
});

import AdminUsuarios from './AdminUsuarios.jsx';

function crearUsuario(id, overrides = {}) {
    return {
        id,
        nombre: 'Luis',
        apellido: 'Pérez',
        email: 'luis@example.cl',
        rol: 'CLIENTE',
        run: '123456785',
        region: 'valparaiso',
        comuna: 'Viña del Mar',
        direccion: 'Calle Nueva 456',
        activo: true,
        password: 'no mostrar',
        password_hash: 'hash no mostrar',
        ...overrides
    };
}

function renderizar() {
    return render(
        <MemoryRouter>
            <AdminUsuarios />
        </MemoryRouter>
    );
}

async function abrirEdicion(nombre = 'Luis') {
    await screen.findByText(nombre);
    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0]);
    await screen.findByLabelText('Correo electrónico');
}

describe('Gestión de usuarios', function() {
    beforeEach(function() {
        sessionStorage.setItem(
            'sonido_vivo_usuario',
            JSON.stringify({ id: 99, email: 'admin@example.cl', rol: 'ADMINISTRADOR' })
        );
        usuarioServiceMocks.listarUsuarios.mockResolvedValue({
            mensaje: 'Usuarios obtenidos',
            total: 1,
            usuarios: [crearUsuario(12)]
        });
        usuarioServiceMocks.obtenerPerfilUsuario.mockResolvedValue(crearUsuario(12));
        usuarioServiceMocks.actualizarUsuario.mockResolvedValue({
            mensaje: 'Usuario actualizado correctamente'
        });
        usuarioServiceMocks.desactivarUsuario.mockResolvedValue({
            mensaje: 'Usuario desactivado correctamente'
        });
        usuarioServiceMocks.reactivarUsuario.mockResolvedValue({
            mensaje: 'Usuario reactivado correctamente'
        });
    });

    afterEach(function() {
        cleanup();
        sessionStorage.clear();
        vi.clearAllMocks();
    });

    it('lista usuarios de la API sin mostrar credenciales', async function() {
        renderizar();

        expect(await screen.findByText('luis@example.cl')).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'CLIENTE' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'Activo' })).toBeInTheDocument();
        expect(screen.queryByText('hash no mostrar')).not.toBeInTheDocument();
        expect(screen.queryByText('no mostrar')).not.toBeInTheDocument();
    });

    it('muestra las dos acciones para un usuario activo', async function() {
        renderizar();

        await screen.findByText('luis@example.cl');
        expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Desactivar' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Reactivar' })).not.toBeInTheDocument();
    });

    it('mantiene inactivos en la tabla, sin acciones ni consulta de detalle', async function() {
        usuarioServiceMocks.listarUsuarios.mockResolvedValue({
            mensaje: 'Usuarios obtenidos',
            total: 1,
            usuarios: [crearUsuario(12, { activo: false })]
        });
        renderizar();

        expect(await screen.findByRole('cell', { name: 'Inactivo' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Desactivar' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reactivar' })).toBeInTheDocument();
        expect(usuarioServiceMocks.obtenerPerfilUsuario).not.toHaveBeenCalled();
    });

    it('confirma antes de reactivar y vuelve a consultar usuarios al tener éxito', async function() {
        usuarioServiceMocks.listarUsuarios
            .mockResolvedValueOnce({
                mensaje: 'Usuarios obtenidos',
                total: 1,
                usuarios: [crearUsuario(12, { activo: false })]
            })
            .mockResolvedValueOnce({
                mensaje: 'Usuarios obtenidos',
                total: 1,
                usuarios: [crearUsuario(12, { activo: true })]
            });
        renderizar();
        await screen.findByRole('button', { name: 'Reactivar' });
        fireEvent.click(screen.getByRole('button', { name: 'Reactivar' }));

        expect(screen.getByText(/Luis Pérez/)).toBeInTheDocument();
        expect(screen.getByText(/recuperará el acceso a Sonido Vivo/i)).toBeInTheDocument();
        expect(usuarioServiceMocks.reactivarUsuario).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: 'Confirmar reactivación' }));

        await waitFor(function() {
            expect(usuarioServiceMocks.reactivarUsuario).toHaveBeenCalledWith(12);
            expect(usuarioServiceMocks.reactivarUsuario).toHaveBeenCalledTimes(1);
        });
        expect(await screen.findByRole('cell', { name: 'Activo' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Desactivar' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Reactivar' })).not.toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent(
            'Usuario reactivado correctamente'
        );
        expect(usuarioServiceMocks.listarUsuarios).toHaveBeenCalledTimes(2);
    });

    it('cancelar la reactivación no envía ninguna solicitud', async function() {
        usuarioServiceMocks.listarUsuarios.mockResolvedValue({
            mensaje: 'Usuarios obtenidos',
            total: 1,
            usuarios: [crearUsuario(12, { activo: false })]
        });
        renderizar();
        await screen.findByRole('button', { name: 'Reactivar' });
        fireEvent.click(screen.getByRole('button', { name: 'Reactivar' }));
        fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

        expect(usuarioServiceMocks.reactivarUsuario).not.toHaveBeenCalled();
    });

    it('muestra errores del servidor al reactivar y conserva el estado inactivo', async function() {
        usuarioServiceMocks.listarUsuarios.mockResolvedValue({
            mensaje: 'Usuarios obtenidos',
            total: 1,
            usuarios: [crearUsuario(12, { activo: false })]
        });
        usuarioServiceMocks.reactivarUsuario.mockRejectedValue(
            new Error('El usuario ya está activo.')
        );
        renderizar();
        await screen.findByRole('button', { name: 'Reactivar' });
        fireEvent.click(screen.getByRole('button', { name: 'Reactivar' }));
        fireEvent.click(screen.getByRole('button', { name: 'Confirmar reactivación' }));

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'El usuario ya está activo.'
        );
        expect(screen.getByRole('cell', { name: 'Inactivo' })).toBeInTheDocument();
        expect(usuarioServiceMocks.listarUsuarios).toHaveBeenCalledTimes(1);
    });

    it('muestra la carga y luego el estado vacío', async function() {
        let resolver;
        usuarioServiceMocks.listarUsuarios.mockReturnValue(new Promise(function(resolve) {
            resolver = resolve;
        }));
        renderizar();

        expect(screen.getByRole('status')).toHaveTextContent('Cargando usuarios...');
        resolver({ mensaje: 'Sin usuarios', total: 0, usuarios: [] });

        expect(await screen.findByText('No hay usuarios registrados.')).toBeInTheDocument();
    });

    it('muestra errores del servidor al listar', async function() {
        usuarioServiceMocks.listarUsuarios.mockRejectedValue(
            new Error('Servicio de usuarios no disponible')
        );
        renderizar();

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Servicio de usuarios no disponible'
        );
    });

    it('valida el correo antes de guardar una edición', async function() {
        renderizar();
        await abrirEdicion();
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'correo-invalido' }
        });
        fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

        expect(await screen.findByText('Ingresa un correo electrónico válido.'))
            .toBeInTheDocument();
        expect(usuarioServiceMocks.actualizarUsuario).not.toHaveBeenCalled();
    });

    it('permite a un administrador cambiar el rol de otro usuario', async function() {
        renderizar();
        await abrirEdicion();
        fireEvent.change(screen.getByLabelText('Rol'), {
            target: { value: 'ADMINISTRADOR' }
        });
        fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

        await waitFor(function() {
            expect(usuarioServiceMocks.actualizarUsuario).toHaveBeenCalledWith(
                12,
                expect.objectContaining({ rol: 'ADMINISTRADOR' })
            );
        });
        expect(await screen.findByRole('status')).toHaveTextContent(
            'Usuario actualizado correctamente'
        );
        expect(screen.getByRole('cell', { name: 'ADMINISTRADOR' })).toBeInTheDocument();
    });

    it('bloquea el cambio de rol propio y omite el rol del PUT', async function() {
        sessionStorage.setItem(
            'sonido_vivo_usuario',
            JSON.stringify({ id: 1, email: 'admin@example.cl', rol: 'ADMINISTRADOR' })
        );
        usuarioServiceMocks.listarUsuarios.mockResolvedValue({
            mensaje: 'Usuarios obtenidos',
            total: 1,
            usuarios: [crearUsuario(1, {
                email: 'admin@example.cl',
                rol: 'ADMINISTRADOR'
            })]
        });
        usuarioServiceMocks.obtenerPerfilUsuario.mockResolvedValue(
            crearUsuario(1, { email: 'admin@example.cl', rol: 'ADMINISTRADOR' })
        );
        renderizar();
        await abrirEdicion();

        expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Desactivar' })).not.toBeInTheDocument();
        expect(screen.getByLabelText('Rol')).toBeDisabled();
        fireEvent.change(screen.getByLabelText('Nombre'), {
            target: { value: 'Luis Alberto' }
        });
        fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

        await waitFor(function() {
            expect(usuarioServiceMocks.actualizarUsuario).toHaveBeenCalledTimes(1);
        });
        expect(usuarioServiceMocks.actualizarUsuario.mock.calls[0][1])
            .not.toHaveProperty('rol');
    });

    it('pide confirmación, desactiva y actualiza la fila de la tabla', async function() {
        renderizar();
        await screen.findByText('luis@example.cl');
        fireEvent.click(screen.getByRole('button', { name: 'Desactivar' }));

        expect(screen.getByText(/Luis Pérez/)).toBeInTheDocument();
        expect(screen.getByText(/permanecerán guardados en PostgreSQL/i)).toBeInTheDocument();
        expect(usuarioServiceMocks.desactivarUsuario).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: 'Confirmar desactivación' }));

        await waitFor(function() {
            expect(usuarioServiceMocks.desactivarUsuario).toHaveBeenCalledWith(12);
        });
        expect(usuarioServiceMocks.desactivarUsuario).toHaveBeenCalledTimes(1);
        expect(await screen.findByRole('cell', { name: 'Inactivo' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Desactivar' })).not.toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent(
            'Usuario desactivado correctamente'
        );
    });

    it('no envía la desactivación si se cancela la confirmación', async function() {
        renderizar();
        await screen.findByText('luis@example.cl');
        fireEvent.click(screen.getByRole('button', { name: 'Desactivar' }));
        fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

        expect(usuarioServiceMocks.desactivarUsuario).not.toHaveBeenCalled();
    });

    it('muestra un error comprensible si el servidor rechaza la desactivación', async function() {
        usuarioServiceMocks.desactivarUsuario.mockRejectedValue(
            new Error('No fue posible desactivar al usuario')
        );
        renderizar();
        await screen.findByText('luis@example.cl');
        fireEvent.click(screen.getByRole('button', { name: 'Desactivar' }));
        fireEvent.click(screen.getByRole('button', { name: 'Confirmar desactivación' }));

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'No fue posible desactivar al usuario'
        );
        expect(screen.getByRole('cell', { name: 'Activo' })).toBeInTheDocument();
    });

    it('declara los organismos nuevos con props explícitas', function() {
        const archivosComponentes = [
            'src/components/organisms/TablaUsuarios.jsx',
            'src/components/organisms/FormularioEdicionUsuario.jsx',
            'src/components/organisms/ModalConfirmarDesactivacion.jsx'
        ];

        archivosComponentes.forEach(function(archivo) {
            const codigo = readFileSync(archivo, 'utf8');

            expect(codigo).toMatch(/function\s+\w+\s*\(\s*props\s*\)/);
            expect(codigo).toMatch(/props\./);
            expect(codigo).not.toMatch(/function\s+\w+\s*\(\s*\{/);
        });
    });
});
