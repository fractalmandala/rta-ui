import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import Harness from './harness/CollapsibleBasic.svelte';

describe('collapsible', () => {
  test('renders the ark contract', () => {
    render(Harness, { props: { defaultOpen: true } });

    const root = document.querySelector('[data-scope="collapsible"][data-part="root"]')!;
    expect(root.getAttribute('data-state')).toBe('open');

    const trigger = screen.getByRole('button', { name: /Details/ });
    expect(trigger.getAttribute('data-state')).toBe('open');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('type')).toBe('button');
    expect(trigger.hasAttribute('data-disabled')).toBe(false);

    const content = document.querySelector('[data-scope="collapsible"][data-part="content"]')!;
    expect(content.id).toBe(trigger.getAttribute('aria-controls'));
    expect(content.hasAttribute('data-collapsible')).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
    expect(content.hasAttribute('data-has-collapsed-size')).toBe(false);
    expect(content.getAttribute('data-slot')).toBe('collapsible-content');

    const indicator = document.querySelector('[data-scope="collapsible"][data-part="indicator"]')!;
    expect(indicator.getAttribute('data-state')).toBe('open');
  });

  test('toggles content and reports open changes', async () => {
    const onOpenChange = vi.fn();
    render(Harness, { props: { defaultOpen: false, onOpenChange } });

    const trigger = screen.getByRole('button', { name: /Details/ });
    const content = document.querySelector('[data-scope="collapsible"][data-part="content"]') as HTMLElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(content.hasAttribute('hidden')).toBe(true);

    await fireEvent.click(trigger);
    flushSync();

    expect(onOpenChange).toHaveBeenCalledWith({ open: true });
    expect(trigger.getAttribute('data-state')).toBe('open');
    expect(content.getAttribute('data-state')).toBe('open');
    expect(content.hasAttribute('hidden')).toBe(false);

    await fireEvent.click(trigger);
    flushSync();

    expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
    expect(content.getAttribute('data-state')).toBe('closed');
    expect(content.hasAttribute('hidden')).toBe(true);
  });

  test('honours the collapsed size instead of hiding', async () => {
    render(Harness, { props: { defaultOpen: false, collapsedHeight: 40 } });

    const content = document.querySelector('[data-scope="collapsible"][data-part="content"]') as HTMLElement;
    expect(content.hasAttribute('data-has-collapsed-size')).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
    expect(content.style.maxHeight).toBe('40px');
    expect(content.hasAttribute('inert')).toBe(true);

    await fireEvent.click(screen.getByRole('button', { name: /Details/ }));
    flushSync();

    expect(content.hasAttribute('inert')).toBe(false);
    expect(content.style.maxHeight).toBe('');
  });

  test('does not toggle while disabled', async () => {
    const onOpenChange = vi.fn();
    render(Harness, { props: { defaultOpen: false, disabled: true, onOpenChange } });

    const trigger = screen.getByRole('button', { name: /Details/ });
    expect(trigger.hasAttribute('data-disabled')).toBe(true);
    expect(trigger).toHaveProperty('disabled', true);

    await fireEvent.click(trigger);
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
