import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Card from '../../../App/components/molecule/Card';

// Mock grommet components
vi.mock('grommet', async () => {
  const actual = await vi.importActual('grommet');
  return {
    ...actual,
    Card: vi.fn((props) => <div {...props}>{props.children}</div>),
    CardHeader: vi.fn((props) => <div {...props}>{props.children}</div>),
    CardBody: vi.fn((props) => <div {...props}>{props.children}</div>),
    CardFooter: vi.fn((props) => <div {...props}>{props.children}</div>),
    Text: vi.fn((props) => <div {...props}>{props.children}</div>),
    Box: vi.fn((props) => <div {...props}>{props.children}</div>),
    Avatar: vi.fn((props) => <div {...props} />),
  };
});

describe('Card Component', () => {
  it('should render card with normal title', () => {
    render(<Card title="Normal Title" />);
    const titleElement = screen.getByText('Normal Title');
    expect(titleElement).toBeDefined();
  });

  it('should render card with very long title without spaces and handle overflow', () => {
    const longTitle = 'Thisisaveryverylongtitlewithoutspacesthatwouldspeakabletobreakwordproperly';
    render(<Card title={longTitle} />);
    
    const titleElement = screen.getByText(longTitle);
    expect(titleElement).toBeDefined();
    
    // Check that the title has the CSS properties we added for word breaking
    const computedStyle = window.getComputedStyle(titleElement);
    expect(computedStyle.wordBreak).toBe('break-word');
    expect(computedStyle.overflow).toBe('hidden');
  });

  it('should render card with long title with spaces (should work normally)', () => {
    const longTitle = 'This is a very very long title with spaces that should wrap properly';
    render(<Card title={longTitle} />);
    const titleElement = screen.getByText(longTitle);
    expect(titleElement).toBeDefined();
  });
});