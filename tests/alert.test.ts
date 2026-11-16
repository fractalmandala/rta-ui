import { expect, test } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Alert from '../src/lib/components/alert/Alert.svelte';

const body = createRawSnippet(() => ({ render: () => '<p>Saved</p>' }));

test('reports its status and defaults to info', () => {
  render(Alert, { props: { children: body } });

  const alert = document.querySelector('[data-slot="alert-root"]')!;
  expect(alert.getAttribute('data-status')).toBe('info');
  expect(alert.textContent).toBe('Saved');
});

for (const status of ['info', 'success', 'warning', 'error'] as const) {
  test(`carries the ${status} status`, () => {
    render(Alert, { props: { status, children: body } });
    expect(document.querySelector('[data-slot="alert-root"]')!.getAttribute('data-status')).toBe(
      status,
    );
  });
}
