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
import { MemoryRouter } from 'react-router-dom';

const registrarVendedorMock = vi.hoisted(function() {
    return vi.fn();
});

vi.mock('../services/usuarioService.js', function() {
    return {
        registrarVendedor: registrarVendedorMock
    };
});

import RegistroVendedor from './RegistroVendedor.jsx';

function renderizarFormulario() {
    return render(
        <MemoryRouter>
            <RegistroVendedor />
        </MemoryRouter>
    );
}

function completarFormulario() {
    fireEvent.change(screen.getByLabelText('Nombre'), {
        target: { value: 'Camila' }
    });
    fireEvent.change(screen.getByLabelText('Apellido'), {
        target: { value: 'González' }
    });
    fireEvent.change(screen.getByLabelText('RUN'), {
        target: { value: '12.345.678-5' }
    });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
        target: { value: 'camila@example.cl' }
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
        target: { value: 'Clave-de-prueba-8' }
    });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
        target: { value: 'Clave-de-prueba-8' }
    });
    fireEvent.change(screen.getByLabelText('Región'), {
        target: { value: 'metropolitana' }
    });
    fireEvent.change(screen.getByLabelText('Comuna'), {
        target: { value: 'Santiago' }
    });
    fireEvent.change(screen.getByLabelText('Dirección'), {
        target: { value: 'Avenida Central 123' }
    });
}

function enviarFormulario() {
    fireEvent.submit(screen.getByLabelText('Nombre').closest('form'));
}

describe('Registro de vendedor', function() {

    beforeEach(function() {
        registrarVendedorMock.mockResolvedValue({
            mensaje: 'Vendedor creado'
        });
        sessionStorage.clear();
    });

    afterEach(function() {
        cleanup();
        sessionStorage.clear();
        vi.clearAllMocks();
        window.history.replaceState({}, '', '/');
    });

    it('valida campos requeridos, formato de RUN y correo antes de enviar', function() {
        renderizarFormulario();

        fireEvent.change(screen.getByLabelText('RUN'), {
            target: { value: '123456780' }
        });
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'correo-invalido' }
        });
        enviarFormulario();

        expect(screen.getByText('Ingresa un nombre de al menos 2 caracteres.'))
            .toBeInTheDocument();
        expect(screen.getByText('Ingresa un RUN chileno válido.'))
            .toBeInTheDocument();
        expect(screen.getByText('Ingresa un correo electrónico válido.'))
            .toBeInTheDocument();
        expect(screen.getByText('Ingresa una contraseña.')).toBeInTheDocument();
        expect(screen.getByText('Selecciona una región.')).toBeInTheDocument();
        expect(registrarVendedorMock).not.toHaveBeenCalled();
    });

    it('limpia comuna si deja de pertenecer a la región seleccionada', function() {
        renderizarFormulario();
        fireEvent.change(screen.getByLabelText('Región'), {
            target: { value: 'metropolitana' }
        });
        fireEvent.change(screen.getByLabelText('Comuna'), {
            target: { value: 'Santiago' }
        });

        fireEvent.change(screen.getByLabelText('Región'), {
            target: { value: 'valparaiso' }
        });

        expect(screen.getByLabelText('Comuna')).toHaveValue('');
        expect(screen.getByRole('option', { name: 'Viña del Mar' })).toBeInTheDocument();
    });

    it('envía solo los datos requeridos sin confirmación ni rol', async function() {
        renderizarFormulario();
        completarFormulario();

        fireEvent.click(screen.getByRole('button', { name: 'Registrar vendedor' }));

        await waitFor(function() {
            expect(registrarVendedorMock).toHaveBeenCalledWith({
                nombre: 'Camila',
                apellido: 'González',
                run: '123456785',
                email: 'camila@example.cl',
                password: 'Clave-de-prueba-8',
                region: 'metropolitana',
                comuna: 'Santiago',
                direccion: 'Avenida Central 123'
            });
        });
        expect(registrarVendedorMock).toHaveBeenCalledTimes(1);
        expect(
            await screen.findByRole('status')
        ).toHaveTextContent('Vendedor registrado correctamente.');
        expect(screen.getByLabelText('Contraseña')).toHaveValue('');
        expect(screen.getByLabelText('Confirmar contraseña')).toHaveValue('');
        expect(sessionStorage.getItem('sonido_vivo_token')).toBeNull();
    });

    it.each([
        { tipo: 'RUN', mensajeError: 'El RUN ya está registrado' },
        { tipo: 'correo', mensajeError: 'El correo ya está registrado' }
    ])('muestra errores de duplicidad para $tipo', async function(datosError) {
        registrarVendedorMock.mockRejectedValue(
            new Error(datosError.mensajeError)
        );
        renderizarFormulario();
        completarFormulario();
        fireEvent.click(screen.getByRole('button', { name: 'Registrar vendedor' }));

        expect(await screen.findByRole('alert')).toHaveTextContent(
            datosError.mensajeError
        );
    });

    it('muestra errores de conexión', async function() {
        registrarVendedorMock.mockRejectedValue(
            new Error('No fue posible conectar con el servidor. Inténtalo nuevamente.')
        );
        renderizarFormulario();
        completarFormulario();
        fireEvent.click(screen.getByRole('button', { name: 'Registrar vendedor' }));

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'No fue posible conectar con el servidor.'
        );
    });

    it('evita envíos duplicados y bloquea los campos mientras espera', async function() {
        const completarSolicitud = {};
        registrarVendedorMock.mockReturnValue(
            new Promise(function(resolve) {
                completarSolicitud.resolve = resolve;
            })
        );
        renderizarFormulario();
        completarFormulario();

        enviarFormulario();
        enviarFormulario();

        expect(registrarVendedorMock).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('button', { name: 'Registrando...' })).toBeDisabled();
        expect(screen.getByLabelText('Nombre')).toBeDisabled();
        expect(screen.getByLabelText('RUN')).toBeDisabled();
        expect(screen.getByLabelText('Región')).toBeDisabled();

        completarSolicitud.resolve({ mensaje: 'Vendedor creado' });
        await waitFor(function() {
            expect(
                screen.getByRole('button', { name: 'Registrar vendedor' })
            ).toBeEnabled();
        });
    });
});
