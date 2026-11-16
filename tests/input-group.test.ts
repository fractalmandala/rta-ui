import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import InputGroupDemo from './harness/InputGroupDemo.svelte';
import InputGroupInput from '../src/lib/components/input-group/InputGroupInput.svelte';

test('the group size reaches the addon, the input and the clear trigger', () => {
  render(InputGroupDemo, { props: { size: 'lg' } });

  const slot = (name: string) => document.querySelector(`[data-slot="${name}"]`)!;
  expect(slot('input-group-root').getAttribute('data-size')).toBe('lg');
  expect(slot('input-root').getAttribute('data-size')).toBe('lg');
  expect(slot('input-group-clear-trigger').getAttribute('data-size')).toBe('lg');
});

test('an input inside a group keeps md without a group', () => {
  render(InputGroupInput, { props: {} });
  expect(document.querySelector('[data-slot="input-root"]')!.getAttribute('data-size')).toBe('md');
});

test('addons expose their alignment and text parts', () => {
  render(InputGroupDemo, { props: { showTrigger: false } });

  expect(document.querySelector('[data-slot="input-group-addon"]')!.getAttribute('data-align')).toBe(
    'inline',
  );
  expect(document.querySelector('[data-slot="input-group-text"]')!.textContent).toBe('$');
  expect(document.querySelector('[data-slot="input-group-clear-trigger"]')).toBeNull();
});

test('the clear trigger is a labelled button that shares the group size', () => {
  render(InputGroupDemo, { props: { size: 'sm' } });

  const trigger = screen.getByRole('button');
  expect(trigger.getAttribute('type')).toBe('button');
  expect(trigger.getAttribute('aria-label')).toBe('Clear input');
  expect(trigger.getAttribute('data-slot')).toBe('input-group-clear-trigger');
});
