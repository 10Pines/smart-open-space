import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import EmptyTalk from '../../App/MyTalks/EmptyTalk';

// Mock grommet components
vi.mock('grommet', async () => {
  const actual = await vi.importActual('grommet');
  return {
    ...actual,
    Box: vi.fn((props) => <div {...props}>{props.children}</div>),
    Button: vi.fn(({ label, onClick, primary: _primary, ...props }) => (
      <button onClick={onClick} {...props}>
        {label}
      </button>
    )),
    Image: vi.fn((props) => <img alt="empty" {...props} />),
    Paragraph: vi.fn(({ textAlign: _textAlign, ...props }) => <p {...props}>{props.children}</p>),
  };
});

describe('EmptyTalk Component', () => {
  it('should render call to action and button when canAddTalk is true', () => {
    const handleClick = vi.fn();
    render(<EmptyTalk canAddTalk={true} onClick={handleClick} />);

    expect(screen.getByText('Cargá tu charla para este Open Space')).toBeDefined();
    const button = screen.getByRole('button', { name: 'Cargar charla' });
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render misleading-free message and no button when canAddTalk is false', () => {
    render(<EmptyTalk canAddTalk={false} />);

    expect(
      screen.getByText('No tienes charlas cargadas para este evento')
    ).toBeDefined();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
