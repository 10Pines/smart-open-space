import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MainHeader from '#shared/MainHeader.jsx';

describe('MainHeader.Description Component', () => {
  it('renders markdown content safely', () => {
    const { container } = render(
      <MainHeader.Description description={'**Descripción en negrita** y _cursiva_'} />
    );

    expect(container.querySelector('strong')?.textContent).toBe('Descripción en negrita');
    expect(container.querySelector('em')?.textContent).toBe('cursiva');
  });

  it('sanitizes script tags from talk description', () => {
    const { container } = render(
      <MainHeader.Description description={'Charla interesante <script>alert("xss")</script>'} />
    );

    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).not.toContain('alert("xss")');
    expect(container.textContent).toContain('Charla interesante');
  });

  it('sanitizes iframe tags from talk description', () => {
    const { container } = render(
      <MainHeader.Description description={'Ver demo: <iframe src="https://evil.com"></iframe>'} />
    );

    expect(container.querySelector('iframe')).toBeNull();
    expect(container.textContent).toContain('Ver demo:');
  });

  it('sanitizes inline event handlers from talk description', () => {
    const { container } = render(
      <MainHeader.Description description={'<img src="x" onerror="alert(1)" />'} />
    );

    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('onerror')).toBeNull();
  });
});
