import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Button from '../src/lib/components/button/Button.svelte';
import ButtonAsChild from './harness/ButtonAsChild.svelte';

const label = createRawSnippet(() => ({ render: () => '<span>Save</span>' }));

test('defaults to a plain button element with type=button', () => {
  render(Button, { props: { children: label } });

  const button = screen.getByRole('button', { name: 'Save' });
  expect(button.tagName).toBe('BUTTON');
  expect(button.getAttribute('type')).toBe('button');
  expect(button.getAttribute('data-variant')).toBe('default');
  expect(button.getAttribute('data-size')).toBe('md');
});

test('marks a loading button busy and disabled, and swallows its click', () => {
  const onclick = vi.fn();
  render(Button, { props: { children: label, loading: true, onclick } });

  const button = screen.getByRole('button');
  expect(button.getAttribute('aria-busy')).toBe('true');
  expect(button.getAttribute('aria-disabled')).toBe('true');
  expect(button.hasAttribute('data-loading')).toBe(true);
  expect(button.hasAttribute('disabled')).toBe(true);

  button.click();
  expect(onclick).not.toHaveBeenCalled();
});

test('a disabled button does not fire its click handler', () => {
  const onclick = vi.fn();
  render(Button, { props: { children: label, disabled: true, onclick } });

  screen.getByRole('button').click();
  expect(onclick).not.toHaveBeenCalled();
});

test('passes clicks through when enabled', () => {
  const onclick = vi.fn();
  render(Button, { props: { children: label, onclick } });

  screen.getByRole('button').click();
  expect(onclick).toHaveBeenCalledTimes(1);
});

test('leaves type and disabled to the composed element in asChild', () => {
  render(ButtonAsChild, { props: { disabled: true } });

  const anchorEl = screen.getByRole('link');
  expect(anchorEl.tagName).toBe('A');
  expect(anchorEl.hasAttribute('type')).toBe(false);
  expect(anchorEl.hasAttribute('disabled')).toBe(false);
  expect(anchorEl.getAttribute('aria-disabled')).toBe('true');
  expect(anchorEl.getAttribute('data-slot')).toBe('button-root');
  expect(anchorEl.getAttribute('data-own')).toBe('yes');
});

test('a loading asChild button still announces itself busy', () => {
  render(ButtonAsChild, { props: { loading: true } });
  expect(screen.getByRole('link').getAttribute('aria-busy')).toBe('true');
});
