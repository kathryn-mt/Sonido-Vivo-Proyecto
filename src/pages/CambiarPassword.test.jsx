// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

const cambiarPasswordMock = vi.hoisted(function() {
  return vi.fn();
});

vi.mock('../services/authService.js', function() {
  return {
    cambiarPassword: cambiarPasswordMock
  };
});

import CambiarPassword from './CambiarPassword.jsx';

function completarFormulario(passwordActual, passwordNueva, confirmacion) {
  fireEvent.change(screen.getByLabelText('Contraseña actual'), {
    target: { value: passwordActual }
  });
  fireEvent.change(screen.getByLabelText('Contraseña nueva'), {
    target: { value: passwordNueva }
  });
  fireEvent.change(screen.getByLabelText('Confirmar contraseña nueva'), {
    target: { value: confirmacion }
  });
}

function enviarFormulario() {
  fireEvent.submit(
    screen.getByLabelText('Contraseña actual').closest('form')
  );
}

describe('Cambiar contraseña', function() {

  afterEach(function() {
    cleanup();
    vi.clearAllMocks();
  });

  it('valida que los tres campos sean obligatorios', function() {
    render(<CambiarPassword />);

    enviarFormulario();

    expect(screen.getByText('Ingresa tu contraseña actual.')).toBeInTheDocument();
    expect(screen.getByText('Ingresa una contraseña nueva.')).toBeInTheDocument();
    expect(screen.getByText('Confirma tu contraseña nueva.')).toBeInTheDocument();
    expect(cambiarPasswordMock).not.toHaveBeenCalled();
  });

  it('valida la longitud mínima y que la contraseña nueva sea distinta', function() {
    render(<CambiarPassword />);
    completarFormulario('clave-actual', 'corta', 'corta');

    enviarFormulario();

    expect(
      screen.getByText('La contraseña nueva debe tener al menos 8 caracteres.')
    ).toBeInTheDocument();
    expect(cambiarPasswordMock).not.toHaveBeenCalled();

    completarFormulario('clave-actual', 'clave-actual', 'clave-actual');
    enviarFormulario();

    expect(
      screen.getByText('La contraseña nueva debe ser distinta de la actual.')
    ).toBeInTheDocument();
    expect(cambiarPasswordMock).not.toHaveBeenCalled();
  });

  it('rechaza una confirmación que no coincide', function() {
    render(<CambiarPassword />);
    completarFormulario('clave-actual', 'clave-nueva-segura', 'otra-clave-segura');

    enviarFormulario();

    expect(
      screen.getByText('La confirmación no coincide con la contraseña nueva.')
    ).toBeInTheDocument();
    expect(cambiarPasswordMock).not.toHaveBeenCalled();
  });

  it('envía solo las contraseñas necesarias y limpia los campos al tener éxito', async function() {
    cambiarPasswordMock.mockResolvedValue('Contraseña cambiada correctamente');
    render(<CambiarPassword />);
    completarFormulario('clave-actual', 'clave-nueva-segura', 'clave-nueva-segura');

    enviarFormulario();

    expect(cambiarPasswordMock).toHaveBeenCalledWith(
      'clave-actual',
      'clave-nueva-segura'
    );
    expect(cambiarPasswordMock).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByRole('status')
    ).toHaveTextContent('Contraseña cambiada correctamente');
    expect(screen.getByLabelText('Contraseña actual')).toHaveValue('');
    expect(screen.getByLabelText('Contraseña nueva')).toHaveValue('');
    expect(screen.getByLabelText('Confirmar contraseña nueva')).toHaveValue('');
  });

  it('muestra el mensaje de error del backend', async function() {
    cambiarPasswordMock.mockRejectedValue(new Error('La contraseña actual no es correcta'));
    render(<CambiarPassword />);
    completarFormulario('incorrecta', 'clave-nueva-segura', 'clave-nueva-segura');

    enviarFormulario();

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent('La contraseña actual no es correcta');
  });

  it('evita solicitudes duplicadas mientras se procesa el cambio', async function() {
    const completarSolicitud = {};
    cambiarPasswordMock.mockReturnValue(new Promise(function(resolve) {
      completarSolicitud.resolve = resolve;
    }));
    render(<CambiarPassword />);
    completarFormulario('clave-actual', 'clave-nueva-segura', 'clave-nueva-segura');

    enviarFormulario();
    enviarFormulario();

    expect(cambiarPasswordMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Procesando...' })).toBeDisabled();

    completarSolicitud.resolve('Contraseña cambiada correctamente');
    await waitFor(function() {
      expect(screen.getByRole('button', { name: 'Cambiar contraseña' })).toBeEnabled();
    });
  });
});
