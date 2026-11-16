import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Spinner from '../src/lib/components/spinner/Spinner.svelte';

test('announces itself as a status with a default label', () => {
  render(Spinner, {});

  const spinner = screen.getByRole('status');
  expect(spinner.getAttribute('aria-label')).toBe('Loading');
  expect(spinner.getAttribute('data-size')).toBe('md');
});

test('renders an indicator and a ring that are hidden from assistive tech', () => {
  render(Spinner, {});

  expect(document.querySelector('[data-part="indicator"]')!.getAttribute('aria-hidden')).toBe('true');
  expect(document.querySelector('[data-part="ring"]')).not.toBeNull();
});

test('a decorative spinner leaves no role and no label', () => {
  render(Spinner, { props: { decorative: true } });

  const spinner = document.querySelector('[data-slot="spinner-root"]')!;
  expect(spinner.hasAttribute('role')).toBe(false);
  expect(spinner.getAttribute('aria-hidden')).toBe('true');
  expect(spinner.hasAttribute('aria-label')).toBe(false);
});

test('a labelled spinner keeps the caller label', () => {
  render(Spinner, { props: { 'aria-label': 'Saving' } });
  expect(document.querySelector('[data-slot="spinner-root"]')!.getAttribute('aria-label')).toBe(
    'Saving',
  );
});
