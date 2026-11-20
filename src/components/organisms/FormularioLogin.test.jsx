// @vitest-environment jsdom

import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor
} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';

import FormularioLogin from './FormularioLogin.jsx';

describe('Formulario de inicio de sesión', function() {

  afterEach(function() {
    cleanup();
  });

  it('cambia entre cliente y personal sin mostrar correo en personal', function() {
    render(
      <MemoryRouter>
        <FormularioLogin
          onLogin={vi.fn()}
          error=""
          limpiarError={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByLabelText('Correo electrónico')
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Soy vendedor o administrador'
      })
    );

    expect(
      screen.queryByLabelText('Correo electrónico')
    ).not.toBeInTheDocument();

    expect(
      screen.getByLabelText('RUN')
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Volver al ingreso de clientes'
      })
    );

    expect(
      screen.getByLabelText('Correo electrónico')
    ).toBeInTheDocument();
  });

  it('limpia el error del servidor cuando se modifica un campo', function() {
    const limpiarError = vi.fn();

    render(
      <MemoryRouter>
        <FormularioLogin
          onLogin={vi.fn()}
          error="Credenciales incorrectas"
          limpiarError={limpiarError}
        />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText('Correo electrónico'),
      { target: { value: 'cliente@correo.cl' } }
    );

    expect(limpiarError).toHaveBeenCalledTimes(1);
  });

  it('envía RUN normalizado y contraseña solo en modo personal', async function() {
    const onLogin = vi.fn().mockResolvedValue({});

    render(
      <MemoryRouter>
        <FormularioLogin
          onLogin={onLogin}
          error=""
          limpiarError={vi.fn()}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Soy vendedor o administrador'
      })
    );

    fireEvent.change(
      screen.getByLabelText('RUN'),
      { target: { value: '12.345.678-9' } }
    );

    fireEvent.change(
      screen.getByLabelText('Contraseña'),
      { target: { value: '123456' } }
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Ingresar'
      })
    );

    await waitFor(function() {
      expect(onLogin).toHaveBeenCalledTimes(1);
    });

    const llamada = onLogin.mock.calls[0];

    expect(llamada[0]).toBe('PERSONAL');
    expect(llamada[1].run).toBe('12.345.678-9');
  });
});
