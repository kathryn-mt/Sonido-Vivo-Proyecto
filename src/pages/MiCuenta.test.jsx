// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor
} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const usuarioServiceMocks = vi.hoisted(function() {
    return {
        obtenerPerfilUsuario: vi.fn(),
        actualizarPerfilUsuario: vi.fn()
    };
});

vi.mock('../services/usuarioService.js', function() {
    return {
        obtenerPerfilUsuario: usuarioServiceMocks.obtenerPerfilUsuario,
        actualizarPerfilUsuario: usuarioServiceMocks.actualizarPerfilUsuario
    };
});

import MiCuenta from './MiCuenta.jsx';

function crearPerfil() {
    return {
        id: 42,
        nombre: 'Ana',
        apellido: 'Pérez',
        email: 'ana@example.cl',
        rol: 'CLIENTE',
        run: '12345678K',
        region: 'metropolitana',
        comuna: 'Santiago',
        direccion: 'Avenida Central 123'
    };
}

function renderizarMiCuenta(rutas) {
    return render(
        <MemoryRouter initialEntries={['/mi-cuenta']}>
            <Routes>
                <Route path="/mi-cuenta" element={<MiCuenta />} />
                {rutas}
            </Routes>
        </MemoryRouter>
    );
}

function completarDatosValidos() {
    fireEvent.change(screen.getByLabelText('Nombre'), {
        target: { value: 'Camila' }
    });
    fireEvent.change(screen.getByLabelText('Apellido'), {
        target: { value: 'González' }
    });
    fireEvent.change(screen.getByLabelText('Región'), {
        target: { value: 'valparaiso' }
    });
    fireEvent.change(screen.getByLabelText('Comuna'), {
        target: { value: 'Viña del Mar' }
    });
    fireEvent.change(screen.getByLabelText('Dirección'), {
        target: { value: 'Calle Nueva 456' }
    });
}

function enviarFormulario() {
    fireEvent.submit(screen.getByLabelText('Nombre').closest('form'));
}

describe('Mi cuenta', function() {

    beforeEach(function() {
        sessionStorage.setItem(
            'sonido_vivo_usuario',
            JSON.stringify({ id: 42, rol: 'CLIENTE' })
        );
        usuarioServiceMocks.obtenerPerfilUsuario.mockResolvedValue(crearPerfil());
        usuarioServiceMocks.actualizarPerfilUsuario.mockResolvedValue({
            mensaje: 'Datos personales actualizados correctamente'
        });
    });

    afterEach(function() {
        cleanup();
        sessionStorage.clear();
        vi.clearAllMocks();
        window.history.replaceState({}, '', '/');
    });

    it('consulta el perfil del usuario autenticado y muestra sus datos', async function() {
        renderizarMiCuenta();

        expect(await screen.findByLabelText('Nombre')).toHaveValue('Ana');
        expect(usuarioServiceMocks.obtenerPerfilUsuario).toHaveBeenCalledWith(42);
        expect(screen.getByText('Mi cuenta')).toBeInTheDocument();
    });

    it('muestra RUN y correo como campos de solo lectura', async function() {
        renderizarMiCuenta();

        expect(await screen.findByLabelText('RUN')).toHaveValue('12345678K');
        expect(screen.getByLabelText('RUN')).toHaveAttribute('readonly');
        expect(screen.getByLabelText('Correo electrónico')).toHaveValue('ana@example.cl');
        expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute('readonly');
    });

    it('permite editar nombre, apellido, región, comuna y dirección', async function() {
        renderizarMiCuenta();
        await screen.findByLabelText('Nombre');

        completarDatosValidos();

        expect(screen.getByLabelText('Nombre')).toHaveValue('Camila');
        expect(screen.getByLabelText('Apellido')).toHaveValue('González');
        expect(screen.getByLabelText('Región')).toHaveValue('valparaiso');
        expect(screen.getByLabelText('Comuna')).toHaveValue('Viña del Mar');
        expect(screen.getByLabelText('Dirección')).toHaveValue('Calle Nueva 456');
    });

    it('limpia una comuna que no pertenece a la región nueva', async function() {
        renderizarMiCuenta();
        await screen.findByLabelText('Nombre');

        fireEvent.change(screen.getByLabelText('Región'), {
            target: { value: 'valparaiso' }
        });

        expect(screen.getByLabelText('Comuna')).toHaveValue('');
        expect(screen.getByRole('option', { name: 'Viña del Mar' })).toBeInTheDocument();
    });

    it('envía únicamente los cinco campos permitidos y muestra el éxito confirmado', async function() {
        renderizarMiCuenta();
        await screen.findByLabelText('Nombre');
        completarDatosValidos();

        fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

        await waitFor(function() {
            expect(usuarioServiceMocks.actualizarPerfilUsuario).toHaveBeenCalledWith(
                42,
                {
                    nombre: 'Camila',
                    apellido: 'González',
                    region: 'valparaiso',
                    comuna: 'Viña del Mar',
                    direccion: 'Calle Nueva 456'
                }
            );
        });
        expect(
            await screen.findByText('Datos personales actualizados correctamente')
        ).toBeInTheDocument();
    });

    it('muestra los errores devueltos por el backend', async function() {
        usuarioServiceMocks.actualizarPerfilUsuario.mockRejectedValue(
            new Error('No fue posible actualizar el perfil')
        );
        renderizarMiCuenta();
        await screen.findByLabelText('Nombre');
        completarDatosValidos();

        fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

        expect(
            await screen.findByRole('alert')
        ).toHaveTextContent('No fue posible actualizar el perfil');
    });

    it('valida campos requeridos y el formato de nombre antes de enviar', async function() {
        renderizarMiCuenta();
        await screen.findByLabelText('Nombre');

        fireEvent.change(screen.getByLabelText('Nombre'), {
            target: { value: 'A1' }
        });
        fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

        expect(
            screen.getByText('El nombre solo debe contener letras.')
        ).toBeInTheDocument();
        expect(usuarioServiceMocks.actualizarPerfilUsuario).not.toHaveBeenCalled();
    });

    it('evita solicitudes simultáneas y deshabilita controles durante el envío', async function() {
        const completarSolicitud = {};
        usuarioServiceMocks.actualizarPerfilUsuario.mockReturnValue(
            new Promise(function(resolve) {
                completarSolicitud.resolve = resolve;
            })
        );
        renderizarMiCuenta();
        await screen.findByLabelText('Nombre');
        completarDatosValidos();

        enviarFormulario();
        enviarFormulario();

        expect(usuarioServiceMocks.actualizarPerfilUsuario).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('button', { name: 'Guardando...' })).toBeDisabled();
        expect(screen.getByLabelText('Nombre')).toBeDisabled();
        expect(screen.getByLabelText('Región')).toBeDisabled();
        expect(screen.getByLabelText('Dirección')).toBeDisabled();

        completarSolicitud.resolve({
            mensaje: 'Datos personales actualizados correctamente'
        });
        await waitFor(function() {
            expect(
                screen.getByRole('button', { name: 'Guardar cambios' })
            ).toBeEnabled();
        });
    });

    it('navega a cambiar contraseña desde la sección de seguridad', async function() {
        renderizarMiCuenta(
            <Route
                path="/cambiar-password"
                element={<h1>Pantalla de cambio de contraseña</h1>}
            />
        );
        await screen.findByLabelText('Nombre');

        fireEvent.click(
            screen.getByRole('button', { name: 'Cambiar contraseña' })
        );

        expect(
            await screen.findByRole('heading', {
                name: 'Pantalla de cambio de contraseña'
            })
        ).toBeInTheDocument();
    });
});
