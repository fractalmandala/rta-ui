import { expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import Docs from '../src/routes/+page.svelte';

test('renders every demo group, one group at a time', async () => {
  render(Docs, {});

  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('rta ui');
  expect(screen.getByRole('heading', { level: 2, name: 'Button' })).toBeTruthy();
  expect(screen.queryByRole('heading', { level: 2, name: 'Table' })).toBeNull();

  await fireEvent.click(screen.getByRole('button', { name: 'Content' }));

  expect(screen.getByRole('heading', { level: 2, name: 'Table' })).toBeTruthy();
  expect(screen.queryByRole('heading', { level: 2, name: 'Button' })).toBeNull();
});

test('every group renders its demos without throwing', async () => {
  render(Docs, {});
  const groups = ['Actions', 'Typography', 'Layout', 'Content', 'Forms', 'Feedback', 'Navigation'];

  for (const group of groups) {
    await fireEvent.click(screen.getByRole('button', { name: group }));
    expect(document.querySelectorAll('section').length).toBeGreaterThan(0);
  }
});
