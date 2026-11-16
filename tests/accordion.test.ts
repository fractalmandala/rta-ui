import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import Harness from './harness/AccordionBasic.svelte';

const items = () => Array.from(document.querySelectorAll('[data-scope="accordion"][data-part="item"]'));
const content = (index: number) =>
  document.querySelectorAll('[data-scope="accordion"][data-part="item-content"]')[index] as HTMLElement;

describe('accordion', () => {
  test('renders the ark contract', () => {
    render(Harness, { props: { defaultValue: ['one'] } });

    const root = document.querySelector('[data-scope="accordion"][data-part="root"]')!;
    expect(root.getAttribute('data-orientation')).toBe('vertical');
    expect(root.getAttribute('data-slot')).toBe('accordion-root');

    const [first, second, third] = items();
    expect(first.getAttribute('data-state')).toBe('open');
    expect(second.getAttribute('data-state')).toBe('closed');
    expect(third.hasAttribute('data-disabled')).toBe(true);

    const trigger = screen.getByRole('button', { name: /First/ });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('data-ownedby')).toBe(root.id);
    expect(trigger.getAttribute('data-controls')).toBe(content(0).id);

    const region = screen.getByRole('region');
    expect(region.getAttribute('aria-labelledby')).toBe(trigger.id);
    expect(region.getAttribute('data-state')).toBe('open');
    expect(content(1).hasAttribute('hidden')).toBe(true);
  });

  test('opening a second item closes the first unless multiple', async () => {
    const onValueChange = vi.fn();
    render(Harness, { props: { defaultValue: ['one'], onValueChange } });

    await fireEvent.click(screen.getByRole('button', { name: /Second/ }));
    flushSync();

    expect(onValueChange).toHaveBeenLastCalledWith({ value: ['two'] });
    expect(items()[0].getAttribute('data-state')).toBe('closed');
    expect(items()[1].getAttribute('data-state')).toBe('open');
  });

  test('keeps both open when multiple', async () => {
    render(Harness, { props: { multiple: true } });

    await fireEvent.click(screen.getByRole('button', { name: /First/ }));
    await fireEvent.click(screen.getByRole('button', { name: /Second/ }));
    flushSync();

    expect(items()[0].getAttribute('data-state')).toBe('open');
    expect(items()[1].getAttribute('data-state')).toBe('open');
  });

  test('stays open when collapsible is false', async () => {
    render(Harness, { props: { defaultValue: ['one'], collapsible: false } });

    await fireEvent.click(screen.getByRole('button', { name: /First/ }));
    flushSync();

    expect(items()[0].getAttribute('data-state')).toBe('open');
  });

  test('collapses the open item by default', async () => {
    render(Harness, { props: { defaultValue: ['one'] } });

    await fireEvent.click(screen.getByRole('button', { name: /First/ }));
    flushSync();

    expect(items()[0].getAttribute('data-state')).toBe('closed');
  });

  test('ignores clicks on disabled items', async () => {
    render(Harness, {});
    const trigger = screen.getByRole('button', { name: /Third/ });
    expect(trigger).toHaveProperty('disabled', true);

    await fireEvent.click(trigger);
    flushSync();
    expect(items()[2].getAttribute('data-state')).toBe('closed');
  });

  test('moves focus with arrow keys', async () => {
    render(Harness, {});
    const first = screen.getByRole('button', { name: /First/ });
    const second = screen.getByRole('button', { name: /Second/ });

    first.focus();
    await fireEvent.focus(first);
    await fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(second);

    await fireEvent.keyDown(second, { key: 'Home' });
    expect(document.activeElement).toBe(first);
  });

  test('marks the focused item', async () => {
    render(Harness, {});
    const first = screen.getByRole('button', { name: /First/ });

    await fireEvent.focus(first);
    flushSync();
    expect(items()[0].hasAttribute('data-focus')).toBe(true);

    await fireEvent.blur(first);
    flushSync();
    expect(items()[0].hasAttribute('data-focus')).toBe(false);
  });
});
