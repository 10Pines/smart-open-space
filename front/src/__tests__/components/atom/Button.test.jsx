import { describe, test, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../../App/components/atom/Button';
import React from 'react';
import { Button as GrommetButton } from 'grommet';
import customTheme from '../../../App/theme';

// Mockeamos el módulo 'grommet' y específicamente el componente 'Button'
vi.mock('grommet', async () => {
  const actual = await vi.importActual('grommet');
  return {
    ...actual,
    Button: vi.fn((props) => (
      <button {...props}>
        {props.icon}
        {props.label}
      </button>
    )),
  };
});

describe('Button Component', () => {
  const consoleError = vi.spyOn(global.console, 'error').mockImplementation(() => {});

  afterAll(() => {
    consoleError.mockRestore();
  });

  // Limpiamos los mocks antes de cada test
  beforeEach(() => {
    GrommetButton.mockClear();
  });

  test('renders default button with text', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByTestId('so-button');
    expect(buttonElement).toBeDefined();
  });

  test('throws error when children is not a string', () => {
    expect(() => render(<Button>{123}</Button>)).toThrowError();
  });

  test('renders loading spinner when loading is true', () => {
    render(<Button loading>Click Me</Button>);
    const spinnerElement = screen.getByTestId('so-button-spinner');
    expect(spinnerElement).toBeDefined();
  });

  test('applies secondary style when secondary is true', () => {
    render(<Button secondary>Secondary Button</Button>);
    expect(GrommetButton).toHaveBeenCalledTimes(1);
    const calledWithProps = GrommetButton.mock.calls[0][0];

    // Verificamos que las props primary y secondary son correctas
    expect(calledWithProps.primary).toBe(false);
    expect(calledWithProps.secondary).toBe(true);
  });

  test('applies blackAndWhite style when blackAndWhite is true', () => {
    render(<Button blackAndWhite>Black and White Button</Button>);
    expect(GrommetButton).toHaveBeenCalledTimes(1);
    const calledWithProps = GrommetButton.mock.calls[0][0];

    // Verificamos que la prop color es '#35270D'
    expect(calledWithProps.color).toBe(customTheme.global.colors.typography.light);
  });

  test('renders circular button correctly', () => {
    render(
      <Button variant="circular" icon={<div>Icon</div>}>
        Circular Button
      </Button>
    );
    expect(GrommetButton).toHaveBeenCalledTimes(1);
    const calledWithProps = GrommetButton.mock.calls[0][0];

    expect(calledWithProps.style.borderRadius).toBe('50%');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const buttonElement = screen.getByTestId('so-button');
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders icon correctly when provided', () => {
    render(<Button icon={<div>Test Icon</div>}>Button with Icon</Button>);
    const iconElement = screen.getByTestId('so-button-icon');
    expect(iconElement).toBeDefined();
  });

  test('renders button with autoWidth correctly', () => {
    render(<Button autoWidth>Auto Width Button</Button>);
    expect(GrommetButton).toHaveBeenCalledTimes(1);
    const calledWithProps = GrommetButton.mock.calls[0][0];

    expect(calledWithProps.style.width).toBe('fit-content');
  });

  test('renders square button with correct border radius', () => {
    render(<Button variant="square">Square Button</Button>);
    expect(GrommetButton).toHaveBeenCalledTimes(1);
    const calledWithProps = GrommetButton.mock.calls[0][0];

    expect(calledWithProps.style.borderRadius).toBe('0.5rem');
  });
});
