import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { ReviewForm } from '../../../App/Talk/ReviewForm';

const completarFeedback = ({ grade, comment }) => {
  fireEvent.click(screen.getByRole('button', { name: 'Open Drop' }));
  fireEvent.click(screen.getByRole('option', { name: grade }));
  fireEvent.change(screen.getByPlaceholderText('Deja un comentarío'), {
    target: { value: comment },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Dar feedback' }));
};

describe('ReviewForm', () => {
  // El Drop del Select de grommet llama a window.scrollTo, que jsdom no implementa.
  beforeAll(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  it('envía el feedback y limpia el formulario', async () => {
    const onSubmit = vi.fn().mockResolvedValue();
    render(<ReviewForm onSubmit={onSubmit} />);

    completarFeedback({ grade: '4', comment: 'Muy buena charla' });

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ grade: '4', comment: 'Muy buena charla' })
    );
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Deja un comentarío').value).toBe('')
    );
  });
});
