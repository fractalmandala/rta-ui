import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Separator from '../src/lib/components/separator/Separator.svelte';

test('is a horizontal separator by default', () => {
  render(Separator, {});

  const separator = screen.getByRole('separator');
  expect(separator.getAttribute('aria-orientation')).toBe('horizontal');
  expect(separator.getAttribute('data-orientation')).toBe('horizontal');
});

test('reports a vertical orientation', () => {
  render(Separator, { props: { orientation: 'vertical' } });
  expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('vertical');
});

test('drops role and aria-orientation when the caller takes over the role', () => {
  render(Separator, { props: { role: 'none' } });

  const separator = document.querySelector('[data-slot="separator-root"]')!;
  expect(separator.getAttribute('role')).toBe('none');
  expect(separator.hasAttribute('aria-orientation')).toBe(false);
});
