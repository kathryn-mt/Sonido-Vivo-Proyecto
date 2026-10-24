
 // @vitest-environment jsdom

import { describe, it, expect, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  cleanup
} from '@testing-library/react';

import '@testing-library/jest-dom/vitest';
import Contacto from './Contacto.jsx';

describe('Prueba del formulario Contacto - Matías', () => {

  afterEach(() => {
    cleanup();
  });

  it('debería aceptar un teléfono internacional con +56', () => {

    // Mostrar el formulario
    render(<Contacto />);

    // Completar los datos válidos
    fireEvent.change(
      screen.getByLabelText('Nombre completo'),
      { target: { value: 'Matias Pardo' } }
    );

    fireEvent.change(
      screen.getByLabelText('Correo electrónico'),
      { target: { value: 'matias@correo.cl' } }
    );

    // Teléfono internacional que queremos probar
    fireEvent.change(
      screen.getByLabelText('Teléfono'),
      { target: { value: '+56912345678' } }
    );

    fireEvent.change(
      screen.getByLabelText('Motivo de consulta'),
      { target: { value: 'productos' } }
    );

    fireEvent.change(
      screen.getByLabelText('Mensaje'),
      {
        target: {
          value: 'Quisiera consultar por una guitarra.'
        }
      }
    );

    // Presionar el botón del formulario
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Validar consulta'
      })
    );

    // Esperamos que acepte el teléfono
    expect(
      screen.queryByText(
        /Formulario validado correctamente/i
      )
    ).toBeInTheDocument();

  });

});
