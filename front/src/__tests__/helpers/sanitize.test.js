import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '#helpers/sanitize.js';

describe('GIVEN sanitizeHtml helper', () => {
  it('WHEN passing non-string values THEN returns input as-is', () => {
    expect(sanitizeHtml(null)).toBe(null);
    expect(sanitizeHtml(undefined)).toBe(undefined);
    expect(sanitizeHtml(123)).toBe(123);
  });

  it('WHEN passing clean text or standard markdown THEN preserves it', () => {
    const text = 'Esta es una **charla genial** sobre _testing_ y [links](https://10pines.com)';
    expect(sanitizeHtml(text)).toBe(text);
  });

  it('WHEN passing script tags THEN removes script tags and their content', () => {
    const maliciousInput = 'Mi charla <script>alert("XSS")</script> sobre React';
    expect(sanitizeHtml(maliciousInput)).toBe('Mi charla  sobre React');
  });

  it('WHEN passing nested or malformed script tags THEN cleans them', () => {
    const maliciousInput = 'Charla <<SCRIPT>alert("XSS");//<</SCRIPT>segura';
    expect(sanitizeHtml(maliciousInput)).not.toContain('<script');
    expect(sanitizeHtml(maliciousInput)).not.toContain('alert(');
  });

  it('WHEN passing iframe tags THEN removes iframe tags', () => {
    const maliciousInput = 'Presentación: <iframe src="https://evil.com"></iframe> fin';
    expect(sanitizeHtml(maliciousInput)).toBe('Presentación:  fin');
  });

  it('WHEN passing elements with inline event handlers THEN strips event handlers', () => {
    const maliciousInput = 'Imagen: <img src="invalid.jpg" onerror="alert(\'XSS\')" /> con texto';
    expect(sanitizeHtml(maliciousInput)).toBe('Imagen: <img src="invalid.jpg"> con texto');
  });

  it('WHEN passing javascript: links THEN strips javascript: protocol', () => {
    const maliciousInput = 'Hacé click <a href="javascript:alert(1)">acá</a>';
    expect(sanitizeHtml(maliciousInput)).toBe('Hacé click <a>acá</a>');
  });

  it('WHEN passing safe HTML tags THEN allows safe HTML formatting', () => {
    const safeHtml = '<p>Texto con <strong>negrita</strong> y <em>cursiva</em></p>';
    expect(sanitizeHtml(safeHtml)).toBe(safeHtml);
  });
});
